import { untilDestroyed } from 'ngx-take-until-destroy';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

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
import { closeAnimationAction } from 'src/app/core/utils/methods.globals';
import { DriversInactiveState } from '../state/driver-inactive-state/driver-inactive.store';
import { DriversInactiveQuery } from '../state/driver-inactive-state/driver-inactive.query';

@Component({
  selector: 'app-driver-table',
  templateUrl: './driver-table.component.html',
  styleUrls: ['./driver-table.component.scss'],
})
export class DriverTableComponent implements OnInit, OnDestroy {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  public driversActive: DriversActiveState[] = [];
  public driversInactive: DriversInactiveState[] = [];
  resetColumns: boolean;
  loadingPage: boolean = true;

  constructor(
    private modalService: ModalService,
    private driversActiveQuery: DriversActiveQuery,
    private driversInactiveQuery: DriversInactiveQuery,
    private tableService: TruckassistTableService,
    public datePipe: DatePipe,
    private driverTService: DriverTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
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

    // Add Driver
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        // On Add In Active Tab
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
        else if (res.animation === 'add' && this.selectedTab === 'inactive') {
          this.updateDataCount();
        } else if (res.animation === 'update') {
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
        } else if (res.animation === 'update-status') {
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

    this.loadingPage = false;
  }

  public initTableOptions(): void {
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
          title: 'Activate',
          reverseTitle: 'Deactivate',
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
    const driverCount = JSON.parse(localStorage.getItem('driverTableCount'));

    const applicantsData = this.getTabData(null);

    console.log(this.selectedTab);

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

      this.viewData = this.viewData.map((data: any) => {
        return this.mapDriverData(data);
      });
    }
  }

  mapDriverData(data: any) {
    return {
      ...data,
      isSelected: false,
      textAddress: data.address.address ? data.address.address : '',
      textDOB: data.dateOfBirth
        ? this.datePipe.transform(data.dateOfBirth, 'dd/MM/yy')
        : '',
      textHired: data.hired
        ? this.datePipe.transform(data.hired, 'dd/MM/yy')
        : '',
      textCDL: data?.cdlNumber
        ? data.cdlNumber
        : data?.cdls?.length
        ? data.cdls[0].cdlNumber
        : '',
      textState: data.address.state ? data.address.state : '',
      textBank: data.bank ? data.bank : '',
      textAccount: data.account ? data.account : '',
      textRouting: data.routing ? data.routing : '',
      tableCDLData: {
        start: data?.cdlExpiration
          ? data.cdlExpiration
          : data?.cdls?.length
          ? data.cdls[0].expDate
          : null,
        end: null,
      },
      tableMedicalData: {
        start: data?.medicalExpiration
          ? data.medicalExpiration
          : data?.medicals?.length
          ? data.medicals[0].expDate
          : null,
        end: null,
      },
      tableMvrData: {
        start: data?.mvrIssueDate
          ? data.mvrIssueDate
          : data?.mvrs?.length
          ? data.mvrs[0].issueDate
          : null,
        end: null,
      },
      tableDrugOrAlcoholTest: null,
    };
  }

  updateDataCount() {
    const driverCount = JSON.parse(localStorage.getItem('driverTableCount'));

    this.tableData[1].length = driverCount.active;
    this.tableData[2].length = driverCount.inactive;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(DriverModalComponent, {
        size: 'small',
      });
    } else if (
      event.action === 'tab-selected' &&
      event.tabData.field !== 'applicants'
    ) {
      console.log('Tab select se radi');
      this.selectedTab = event.tabData.field;

      this.sendDriverData();
    } else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      this.modalService.openModal(
        DriverModalComponent,
        { size: 'small' },
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
        .changeDriverStatus(event.id)
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
    }
  }

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
  }
}
