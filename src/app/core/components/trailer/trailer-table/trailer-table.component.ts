import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getTrailerColumnDefinition } from 'src/assets/utils/settings/trailer-columns';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerQuery } from '../state/trailer.query';
import { TrailerTService } from '../state/trailer.service';
import { TrailerState } from '../state/trailer.store';

@Component({
  selector: 'app-trailer-table',
  templateUrl: './trailer-table.component.html',
  styleUrls: ['./trailer-table.component.scss'],
})
export class TrailerTableComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;

  public trailer: TrailerState[] = [];

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private trailerQuery: TrailerQuery,
    private trailerService: TrailerTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    console.log('Ucitava se Tabela');
    
    this.initTableOptions();
    this.getTrucksData();
    

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendTrailerData();
        }
      });

    // Add Trailer
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res.animation === 'add') {
          this.viewData.push(this.mapTrailerData(res.data));

          this.viewData = this.viewData.map((trailer: any) => {
            if (trailer.id === res.id) {
              trailer.actionAnimation = 'add';
            }

            return trailer;
          });

          this.closeAnimationAction();
        } else if (res.animation === 'update') {
          console.log('Radi se update trailera');
          console.log(res);

          this.viewData = this.viewData.map((trailer: any) => {
            if (trailer.id === res.id) {
              trailer = this.mapTrailerData(res.data);
              trailer.actionAnimation = 'update';
            }

            return trailer;
          });

          this.closeAnimationAction();
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        if (response.length) {
          this.trailerService
            .deleteTrailerList(response)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.viewData = this.viewData.map((trailer: any) => {
                response.map((r: any) => {
                  if (trailer.id === r.id) {
                    trailer.actionAnimation = 'delete';
                  }
                });

                return trailer;
              });

              this.notificationService.success(
                'Trailers successfully deleted',
                'Success:'
              );

              this.closeAnimationAction(true);

              this.tableService.sendRowsSelected([]);
            });
        }
      });
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        hideViewMode: true,
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
          title: 'Edit Trailer',
          name: 'edit-trailer',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Add Registration',
          name: 'add-registration',
          class: 'regular-text',
          contentType: 'add',
        },
        {
          title: 'Add Inspection',
          name: 'add-inspection',
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
          type: 'trailer',
          text: 'Are you sure you want to delete trailer(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getTrucksData() {
    this.sendTrailerData();
  }

  sendTrailerData() {
    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: 15,
        data: this.getTabData(),
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: 25,
        data: this.getTabData(),
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setTrailerData(td);
  }

  private getGridColumns(stateName: string, resetColumns: boolean): any[] {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getTrailerColumnDefinition();
    }
  }

  setTrailerData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      return this.mapTrailerData(data);
    });

    console.log('Trailer viewData');
    console.log(this.viewData);
  }

  mapTrailerData(data: any) {
    return {
      ...data,
      isSelected: false,
      textMake: data?.trailerMake?.name ? data.trailerMake.name : '',
      textModel: data?.model ? data?.model : '',
      ownerName: data?.owner?.name ? data.owner.name : '',
      textColor: data?.color?.code ? data.color.code : '',
      svgIcon: data?.trailerType?.name
        ? data.trailerType.name
        : '' /* Treba da bude svg ne text */,
      textLength: data?.trailerLength?.name ? data.trailerLength.name : '',
      textLicPlate: data?.licensePlate
        ? data.licensePlate
        : data?.registrations[0]?.licensePlate
        ? data.registrations[0].licensePlate
        : '',
      textInspectionData: {
        start: data?.fhwaInspection
          ? data.fhwaInspection
          : data?.inspections[0]?.issueDate
          ? data.inspections[0].issueDate
          : null,
        end: null,
      },
    };
  }
  getTabData() {
    this.trailer = this.trailerQuery.getAll();

    return this.trailer?.length ? this.trailer : [];
    /*  let data: any[] = [
      {
        id: 104,
        companyId: 1,
        companyOwned: 0,
        divisionFlag: null,
        ownerId: 466,
        ownerName: 'ERA TRUCKING LLC',
        trailerNumber: 'R504',
        vin: '1UYVS3605AM932301',
        year: '2010',
        categoryId: 1,
        category: 'Bank of America',
        make: null,
        model: '',
        licensePlate: 'J783209',
        licenseExpDate: null,
        fhwaInspection: null,
        svgIcon: 'reefer.svg',
        length: 0,
        status: 1,
        used: 0,
        canBeUsedByCompany: 1,
        doc: {
          titleData: [],
          licenseData: [
            {
              id: 'b26b5982-9d55-420a-b397-bc56a74d6915',
              startDate: '2020-07-15T05:00:00Z',
              attachments: [],
              licensePlate: 'J783209',
            },
          ],
          additionalData: {
            make: {
              file: 'utility.svg',
              name: 'Utility',
              color: '',
            },
            note: '',
            type: {
              file: 'reefer.svg',
              name: 'Reefer',
              type: 'trailer',
              class: 'reefer-icon',
              color: 'EF6E6E',
              whiteFile: 'white-reefer.svg',
              legendcolor: 'ef6e6e',
            },
            year: '2010',
            color: {
              id: 921,
              key: 'White',
              value: '#F9F9F9',
              domain: 'color',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2021-02-08T21:34:33',
              protected: 1,
              updatedAt: '2021-02-09T05:39:40',
              entityName: null,
            },
            model: '',
            axises: '',
            length: {
              id: 671,
              key: 'length',
              value: '48 ft',
              domain: 'trailer',
              entityId: null,
              parentId: null,
              companyId: null,
              createdAt: '2020-10-23T17:15:33',
              protected: 0,
              updatedAt: '2020-10-23T17:15:33',
              entityName: null,
            },
            tireSize: null,
          },
          inspectionData: [
            {
              id: '2ad2fbef-f024-4ecb-876d-ea38894ed6fe',
              startDate: '2021-06-08T05:00:00Z',
              attachments: [
                {
                  url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/104/inspection/2ad2fbeff0244ecb876dea38894ed6fe1623258561-R504 6.8.21.pdf',
                  fileName: 'R504 6.8.21.pdf',
                  fileItemGuid: '2ad2fbef-f024-4ecb-876d-ea38894ed6fe',
                },
              ],
            },
          ],
          activityHistory: [
            {
              id: '1dcd5580-c4ab-4352-b318-eef3829ac73e',
              header: 'ERA TRUCKING LLC',
              endDate: null,
              ownerId: 466,
              startDate: '2021-06-07T16:51:56.451Z',
              endDateShort: null,
              startDateShort: '6/7/21',
            },
          ],
          trailerLeaseData: [],
        },
        protected: 0,
        createdAt: '2021-06-07T16:51:56',
        updatedAt: '2021-12-29T15:07:37',
        gpsFlag: null,
        guid: '3bbdf681-64d3-4223-9479-4a769603b1e6',
        textYear: '2010',
        textMake: 'Utility',
        textModel: '',
        textColor: '#F9F9F9',
        textType: 'Reefer',
        textLicPlate: 'J783209',
        textInspectionData: {
          start: '2021-06-08T05:00:00Z',
        },
        textLength: '48 ft',
        tableType: {
          file: 'reefer.svg',
          name: 'Reefer',
          type: 'trailer',
          class: 'reefer-icon',
          color: 'EF6E6E',
          whiteFile: 'white-reefer.svg',
          legendcolor: 'ef6e6e',
        },
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[i]);
    }

    return data; */
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(TrailerModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setTrailerData(event.tabData);
    }
  }

  public onTableBodyActions(event: any) {
    console.log(event);
    switch (event.type) {
      case 'edit-trailer': {
        this.modalService.openModal(
          TrailerModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
            disableButton: true,
          }
        );
        break;
      }
      case 'add-registration': {
        this.modalService.openModal(
          TtRegistrationModalComponent,
          { size: 'small' },
          {
            ...event,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'add-inspection': {
        this.modalService.openModal(
          TtFhwaInspectionModalComponent,
          { size: 'small' },
          {
            ...event,
            modal: 'trailer',
          }
        );
        break;
      }
      case 'activate-item': {
        this.trailerService
          .changeTrailerStatus(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Trailer successfully changed status',
                'Success:'
              );

              this.getTrucksData();
            },
            error: () => {
              this.notificationService.error(
                `Trailer with id: ${event.id} status couldn't be changed`,
                'Error:'
              );
            },
          });
        break;
      }
      case 'delete-item': {
        this.trailerService
          .deleteTrailerById(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Trailer successfully deleted',
                'Success:'
              );

              this.viewData = this.viewData.map((trailer: any) => {
                if (trailer.id === event.id) {
                  trailer.actionAnimation = 'delete';
                }

                return trailer;
              });

              this.closeAnimationAction(true);
            },
            error: () => {
              this.notificationService.error(
                `Trailer with id: ${event.id} couldn't be deleted`,
                'Error:'
              );
            },
          });
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}

  closeAnimationAction(isDelete?: boolean) {
    const timeOut = setInterval(() => {
      if (!isDelete) {
        this.viewData = this.viewData.map((driver: any) => {
          if (driver?.actionAnimation) {
            delete driver.actionAnimation;
          }

          return driver;
        });
      } else {
        let newViewData = [];

        this.viewData.map((driver: any) => {
          if (!driver.hasOwnProperty('actionAnimation')) {
            newViewData.push(driver);
          }
        });

        this.viewData = newViewData;
      }

      clearInterval(timeOut);
    }, 1000);
  }
}
