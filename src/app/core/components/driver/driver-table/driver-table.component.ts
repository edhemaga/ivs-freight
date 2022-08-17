import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getApplicantColumnsDefinition } from 'src/assets/utils/settings/applicant-columns';
import { getDriverColumnsDefinition } from 'src/assets/utils/settings/driver-columns';
import { DriversActiveQuery } from '../state/driver-active-state/driver-active.query';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DriverModalComponent } from '../../modals/driver-modal/driver-modal.component';
import { DatePipe } from '@angular/common';
import { DriverTService } from '../state/driver.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DriversActiveState } from '../state/driver-active-state/driver-active.store';
import { DriverCdlModalComponent } from '../driver-details/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholModalComponent } from '../driver-details/driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { DriverMedicalModalComponent } from '../driver-details/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../driver-details/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import {
  closeAnimationAction,
  tableSearch,
} from 'src/app/core/utils/methods.globals';
import { DriversInactiveState } from '../state/driver-inactive-state/driver-inactive.store';
import { DriversInactiveQuery } from '../state/driver-inactive-state/driver-inactive.query';
import { DriverListResponse } from 'appcoretruckassist';
import { NameInitialsPipe } from 'src/app/core/pipes/nameinitials';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-driver-table',
  templateUrl: './driver-table.component.html',
  styleUrls: ['./driver-table.component.scss'],
  providers: [NameInitialsPipe, TaThousandSeparatorPipe],
})
export class DriverTableComponent implements OnInit, AfterViewInit, OnDestroy {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  public driversActive: DriversActiveState[] = [];
  public driversInactive: DriversInactiveState[] = [];
  resetColumns: boolean;
  loadingPage: boolean = true;
  backFilterQuery = {
    active: 1,
    pageIndex: 1,
    pageSize: 25,
    companyId: undefined,
    sort: undefined,
    searchOne: undefined,
    searchTwo: undefined,
    searchThree: undefined,
  };
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  mapingIndex: number = 0;

  constructor(
    private modalService: ModalService,
    private driversActiveQuery: DriversActiveQuery,
    private driversInactiveQuery: DriversInactiveQuery,
    private tableService: TruckassistTableService,
    public datePipe: DatePipe,
    private driverTService: DriverTService,
    private notificationService: NotificationService,
    private nameInitialsPipe: NameInitialsPipe,
    private thousandSeparator: TaThousandSeparatorPipe,
    private imageBase64Service: ImageBase64Service
  ) {}

  ngOnInit(): void {
    this.sendDriverData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(untilDestroyed(this))
      .subscribe((response: boolean) => {
        if (response && !this.loadingPage) {
          this.resetColumns = response;

          this.sendDriverData();
        }
      });

    // Resize
    this.tableService.currentColumnWidth
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response?.event?.width) {
          this.columns = this.columns.map((c) => {
            if (c.title === response.columns[response.event.index].title) {
              c.width = response.event.width;
            }

            return c;
          });
        }
      });

    // Toaggle Columns
    this.tableService.currentToaggleColumn
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response?.column) {
          this.columns = this.columns.map((c) => {
            if (c.field === response.column.field) {
              c.hidden = response.column.hidden;
            }

            return c;
          });
        }
      });

    // Search
    this.tableService.currentSearchTableData
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          this.mapingIndex = 0;

          this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0
          
          const searchEvent = tableSearch(
            res,
            this.backFilterQuery
          );

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.driverBackFilter(searchEvent.query);
            } else if (searchEvent.action === 'store') {
              this.sendDriverData();
            }
          }
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        if (response.length && !this.loadingPage) {
          this.driverTService
            .deleteDriverList(response)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.viewData = this.viewData.map((driver: any) => {
                response.map((r: any) => {
                  if (driver.id === r.id) {
                    driver.actionAnimation = 'delete';
                  }
                });

                return driver;
              });

              this.updateDataCount();

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 1000);

              this.tableService.sendRowsSelected([]);
              this.tableService.sendResetSelectedColumns(true);
            });
        }
      });

    // Driver Actions
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        // On Add Driver Active
        if (res.animation === 'add' && this.selectedTab === 'active') {
          this.viewData.push(this.mapDriverData(res.data));

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'add';
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
        // On Add Driver Inactive
        else if (res.animation === 'add' && this.selectedTab === 'inactive') {
          this.updateDataCount();
        }
        // On Update Driver
        else if (res.animation === 'update') {
          const updatedDriver = this.mapDriverData(res.data);

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver = updatedDriver;
              driver.actionAnimation = 'update';
            }

            return driver;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
        // On Update Driver Status
        else if (res.animation === 'update-status') {
          let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'update';
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 1000);
        }
        // On Delete Driver
        else if (res.animation === 'delete') {
          let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'delete';
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 1000);
        }
      });

    this.loadingPage = false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observTableContainer();
    }, 10);
  }

  observTableContainer() {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.tableContainerWidth = entry.contentRect.width;
      });
    });

    this.resizeObserver.observe(document.querySelector('.table-container'));
  }

  initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
        viewModeActive: 'List',
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        {
          title: 'Edit Driver',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Add CDL',
          name: 'new-licence',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Medical',
          name: 'new-medical',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add MVR',
          name: 'new-mvr',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Test',
          name: 'new-drug',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: this.selectedTab === 'inactive' ? 'Deactivate' : 'Activate',
          name: 'activate-item',
          class: 'regular-text',
          contentType: 'activate',
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  sendDriverData() {
    this.initTableOptions();

    const driverCount = JSON.parse(localStorage.getItem('driverTableCount'));

    const applicantsData = this.getTabData(null);

    const driverActiveData =
      this.selectedTab === 'active' ? this.getTabData('active') : [];

    const driverInactiveData =
      this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

    this.tableData = [
      {
        title: 'Applicants',
        field: 'applicants',
        length: 0,
        data: applicantsData,
        extended: true,
        gridNameTitle: 'Driver',
        stateName: 'applicants',
        gridColumns: this.getGridColumns('applicants', this.resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        length: driverCount.active,
        data: driverActiveData,
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: driverCount.inactive,
        data: driverInactiveData,
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setDriverData(td);
  }

  getTabData(dataType: string) {
    if (dataType === 'active') {
      this.driversActive = this.driversActiveQuery.getAll();

      return this.driversActive?.length ? this.driversActive : [];
    } else if (dataType === 'inactive') {
      this.driversInactive = this.driversInactiveQuery.getAll();

      return this.driversInactive?.length ? this.driversInactive : [];
    } else {
      return [];
    }
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'applicants') {
        return getApplicantColumnsDefinition();
      } else {
        return getDriverColumnsDefinition();
      }
    }
  }

  setDriverData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any, index: number) => {
        return this.mapDriverData(data);
      });

      console.log('Driver Data');
      console.log(this.viewData);

      // For Testing
      // for (let i = 0; i < 50; i++) {
      //   this.viewData.push(this.viewData[0]);
      // }
    } else {
      this.viewData = [];
    }
  }

  mapDriverData(data: any) {
    if (!data?.avatar) {
      this.mapingIndex++;
    }

    return {
      ...data,
      isSelected: false,
      isOwner: data?.owner ? data.owner : false,
      textAddress: data.address.address ? data.address.address : '',
      textDriverShortName: this.nameInitialsPipe.transform(data.fullName),
      avatarColor: this.getAvatarColors(),
      avatarImg: data?.avatar
        ? this.imageBase64Service.sanitizer(data.avatar)
        : '',
      textDOB: data.dateOfBirth
        ? this.datePipe.transform(data.dateOfBirth, 'MM/dd/yy')
        : '',
      textHired: data.hired
        ? this.datePipe.transform(data.hired, 'MM/dd/yy')
        : '',
      textCDL: data?.cdlNumber
        ? data.cdlNumber
        : data?.cdls?.length
        ? data.cdls[0].cdlNumber
        : '',
      textState: data.address.stateShortName ? data.address.stateShortName : '',
      textBank: data.bank ? data.bank : '',
      textAccount: data.account ? data.account : '',
      textRouting: data.routing ? data.routing : '',
      tableCDLData: {
        expirationDays: data?.cdlExpirationDays
          ? this.thousandSeparator.transform(data.cdlExpirationDays)
          : null,
        percentage: data?.cdlPercentage ? data.cdlPercentage : null,
      },
      tableMedicalData: {
        expirationDays: data?.medicalExpirationDays
          ? this.thousandSeparator.transform(data.medicalExpirationDays)
          : null,
        percentage: data?.medicalPercentage ? data.medicalPercentage : null,
      },
      tableMvrData: {
        expirationDays: data?.mvrExpirationDays
          ? this.thousandSeparator.transform(data.mvrExpirationDays)
          : null,
        percentage: data?.mvrPercentage ? data.mvrPercentage : null,
      },
      tableDrugOrAlcoholTest: null,
      textPayType: data?.payType?.name ? data.payType.name : '',
      textTeam: [
        {
          title: 'Loaded',
          value: data?.team?.loadedMile
            ? '$' + this.thousandSeparator.transform(data.team.loadedMile)
            : null,
        },
        {
          title: 'Empty',
          value: data?.team?.emptyMile
            ? '$' + this.thousandSeparator.transform(data.team.emptyMile)
            : null,
        },
        {
          title: 'Per Stop',
          value: data?.team?.perStop
            ? '$' + this.thousandSeparator.transform(data.team.perStop)
            : null,
        },
      ],
      textSolo: [
        {
          title: 'Loaded',
          value: data?.solo?.loadedMile
            ? '$' + this.thousandSeparator.transform(data.solo.loadedMile)
            : null,
        },
        {
          title: 'Empty',
          value: data?.solo?.emptyMile
            ? '$' + this.thousandSeparator.transform(data.solo.emptyMile)
            : null,
        },
        {
          title: 'Per Stop',
          value: data?.solo?.perStop
            ? '$' + this.thousandSeparator.transform(data.solo.perStop)
            : null,
        },
      ],
      textFuelCard: data?.fuelCard ? data.fuelCard : '',
      textEmergencyContact: [
        {
          title: 'First Name',
          value: data?.emergencyContactName ? data.emergencyContactName : null,
        },
        {
          title: 'Phone',
          value: data?.emergencyContactPhone
            ? data.emergencyContactPhone
            : null,
        },
        {
          title: 'Relationship',
          value: data?.emergencyContactRelationship
            ? data.emergencyContactRelationship
            : null,
        },
      ],
    };
  }

  getAvatarColors() {
    let textColors: string[] = [
      '#6D82C7',
      '#4DB6A2',
      '#E57373',
      '#E3B00F',
      '#BA68C8',
      '#BEAB80',
      '#81C784',
      '#FF8A65',
      '#64B5F6',
      '#F26EC2',
      '#A1887F',
      '#919191',
    ];

    let backgroundColors: string[] = [
      '#DAE0F1',
      '#D2EDE8',
      '#F9DCDC',
      '#F8EBC2',
      '#EED9F1',
      '#EFEADF',
      '#DFF1E0',
      '#FFE2D8',
      '#D8ECFD',
      '#FCDAF0',
      '#E7E1DF',
      '#E3E3E3',
    ];

    this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

    return {
      background: backgroundColors[this.mapingIndex],
      color: textColors[this.mapingIndex],
    };
  }

  updateDataCount() {
    const driverCount = JSON.parse(localStorage.getItem('driverTableCount'));

    this.tableData[1].length = driverCount.active;
    this.tableData[2].length = driverCount.inactive;
  }

  driverBackFilter(filter: {
    active: number;
    pageIndex: number;
    pageSize: number;
    companyId: number | undefined;
    sort: string | undefined;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
  }) {
    this.driverTService
      .getDrivers(
        filter.active,
        filter.pageIndex,
        filter.pageSize,
        filter.companyId,
        filter.sort,
        filter.searchOne,
        filter.searchTwo,
        filter.searchThree
      )
      .pipe(untilDestroyed(this))
      .subscribe((drivers: DriverListResponse) => {
        this.viewData = drivers.pagination.data;

        this.viewData = this.viewData.map((data: any) => {
          return this.mapDriverData(data);
        });
      });
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(DriverModalComponent, {
        size: 'medium',
      });
    } else if (
      event.action === 'tab-selected' &&
      event.tabData.field !== 'applicants'
    ) {
      this.selectedTab = event.tabData.field;
      this.mapingIndex = 0;

      this.sendDriverData();
    } else if (event.action === 'view-mode') {
      this.mapingIndex = 0;
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      this.mapingIndex = 0;

      if (event.direction) {
        this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.sort = event.direction;

        this.driverBackFilter(this.backFilterQuery);
      } else {
        this.sendDriverData();
      }
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      this.modalService.openModal(
        DriverModalComponent,
        { size: 'medium' },
        {
          ...event,
          disableButton: true,
        }
      );
    } else if (event.type === 'new-licence') {
      this.modalService.openModal(
        DriverCdlModalComponent,
        { size: 'small' },
        { ...event }
      );
    } else if (event.type === 'new-medical') {
      this.modalService.openModal(
        DriverMedicalModalComponent,
        {
          size: 'small',
        },
        { ...event }
      );
    } else if (event.type === 'new-mvr') {
      this.modalService.openModal(
        DriverMvrModalComponent,
        { size: 'small' },
        { ...event }
      );
    } else if (event.type === 'new-drug') {
      this.modalService.openModal(
        DriverDrugAlcoholModalComponent,
        {
          size: 'small',
        },
        { ...event }
      );
    } else if (event.type === 'activate-item') {
      this.driverTService
        .changeDriverStatus(event.id, this.selectedTab)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.notificationService.success(
              `Driver successfully Change Status`,
              'Success:'
            );
          },
          error: () => {
            this.notificationService.error(
              `Driver with id: ${event.id}, status couldn't be changed`,
              'Error:'
            );
          },
        });
    } else if (event.type === 'delete-item') {
      this.driverTService
        .deleteDriverById(event.id, this.selectedTab)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Driver successfully deleted',
              'Success:'
            );

            this.viewData = this.viewData.map((driver: any) => {
              if (driver.id === event.id) {
                driver.actionAnimation = 'delete';
              }

              return driver;
            });

            this.updateDataCount();

            const inetval = setInterval(() => {
              this.viewData = closeAnimationAction(true, this.viewData);

              clearInterval(inetval);
            }, 1000);
          },
          error: () => {
            this.notificationService.error(
              `Driver with id: ${event.id} couldn't be deleted`,
              'Error:'
            );
          },
        });
    } else if (event.type === 'show-more') {
      this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
      this.backFilterQuery.pageIndex++;
      this.driverBackFilter(this.backFilterQuery);
    }
  }

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
