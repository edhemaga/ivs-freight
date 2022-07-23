import { untilDestroyed } from 'ngx-take-until-destroy';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getTruckColumnDefinition } from 'src/assets/utils/settings/truck-columns';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TruckModalComponent } from '../../modals/truck-modal/truck-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckTService } from '../state/truck.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  closeAnimationAction,
  tableSearch,
} from 'src/app/core/utils/methods.globals';
import { TruckListResponse } from 'appcoretruckassist';
import { TruckActiveQuery } from '../state/truck-active-state/truck-active.query';
import { TruckInactiveQuery } from '../state/truck-inactive-state/truck-inactive.query';
import { TruckActiveState } from '../state/truck-active-state/truck-active.store';
import { TruckInactiveState } from '../state/truck-inactive-state/truck-inactive.store';

@Component({
  selector: 'app-truck-table',
  templateUrl: './truck-table.component.html',
  styleUrls: ['./truck-table.component.scss'],
})
export class TruckTableComponent implements OnInit, AfterViewInit, OnDestroy {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  public trucksActive: TruckActiveState[] = [];
  public trucksInactive: TruckInactiveState[] = [];
  resetColumns: boolean;
  loadingPage: boolean = true;
  tableContainerWidth: number = 0;
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
  resizeObserver: ResizeObserver;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private truckActiveQuery: TruckActiveQuery,
    private truckInactiveQuery: TruckInactiveQuery,
    private truckService: TruckTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.sendTruckData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(untilDestroyed(this))
      .subscribe((response: boolean) => {
        if (response && !this.loadingPage) {
          this.resetColumns = response;

          this.sendTruckData();
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

    // Add Truck Or Update
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res.animation === 'add') {
          this.viewData.push(this.mapTruckData(res.data));

          this.viewData = this.viewData.map((truck: any) => {
            if (truck.id === res.id) {
              truck.actionAnimation = 'add';
            }

            return truck;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        } else if (res.animation === 'add' && this.selectedTab === 'inactive') {
          this.updateDataCount();
        } else if (res.animation === 'update') {
          const updatedTruck = this.mapTruckData(res.data);

          this.viewData = this.viewData.map((truck: any) => {
            if (truck.id === res.id) {
              truck = updatedTruck;
              truck.actionAnimation = 'update';
            }

            return truck;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        } else if (res.animation === 'update-status') {
          let truckIndex: number;

          this.viewData = this.viewData.map((truck: any, index: number) => {
            if (truck.id === res.id) {
              truck.actionAnimation = 'update';
              truckIndex = index;
            }

            return truck;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(truckIndex, 1);
            clearInterval(inetval);
          }, 1000);
        }else if (res.animation === 'delete') {
          let truckIndex: number;

          this.viewData = this.viewData.map((truck: any, index: number) => {
            if (truck.id === res.id) {
              truck.actionAnimation = 'delete';
              truckIndex = index;
            }

            return truck;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(truckIndex, 1);
            clearInterval(inetval);
          }, 1000);
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        if (response.length && !this.loadingPage) {
          this.truckService
            .deleteTruckList(response)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.viewData = this.viewData.map((truck: any) => {
                response.map((r: any) => {
                  if (truck.id === r.id) {
                    truck.actionAnimation = 'delete';
                  }
                });

                return truck;
              });

              this.updateDataCount();

              this.notificationService.success(
                `${
                  response.length > 1 ? 'Trucks' : 'Truck'
                } successfully deleted`,
                'Success:'
              );

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 1000);

              this.tableService.sendRowsSelected([]);
              this.tableService.sendResetSelectedColumns(true);
            });
        }
      });

    // Search
    this.tableService.currentSearchTableData
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          const searchEvent = tableSearch(
            res,
            this.backFilterQuery,
            this.selectedTab
          );

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.truckrBackFilter(searchEvent.query);
            } else if (searchEvent.action === 'store') {
              this.sendTruckData();
            }
          }
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

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
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
          title: 'Edit Truck',
          name: 'edit-truck',
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
          title: 'Add Repair',
          name: 'add-repair',
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
          type: 'truck',
          text: 'Are you sure you want to delete truck(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  sendTruckData() {
    this.initTableOptions();

    const truckCount = JSON.parse(localStorage.getItem('truckTableCount'));

    const truckActiveData =
      this.selectedTab === 'active' ? this.getTabData('active') : [];

    const truckInactiveData =
      this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: truckCount.active,
        data: truckActiveData,
        extended: false,
        gridNameTitle: 'Truck',
        stateName: 'trucks',
        gridColumns: this.getGridColumns('trucks', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: truckCount.inactive,
        data: truckInactiveData,
        extended: false,
        gridNameTitle: 'Truck',
        stateName: 'trucks',
        gridColumns: this.getGridColumns('trucks', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setTruckData(td);
  }

  private getGridColumns(stateName: string, resetColumns: boolean): any[] {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getTruckColumnDefinition();
    }
  }

  setTruckData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      return this.mapTruckData(data);
    });
  }

  mapTruckData(data: any) {
    return {
      ...data,
      textYear: data.year ? data.year : '',
      textMake: data?.truckMake?.name ? data.truckMake.name : '',
      textModel: data?.model ? data.model : '',
      color: data?.color?.code ? data.color.code : '',
      svgIcon: 'Treba da se sredi',
      ownerName: data?.owner?.name ? data.owner.name : '',
      truckAxises: data?.axles ? data.axles : '',
      truckEmptyWeight: data?.emptyWeight
        ? data.emptyWeight
        : '' /* Treba formatirati 24444 -> 24,444 lbs. */,
      truckEngine: data?.truckEngineType?.name ? data.truckEngineType.name : '',
      truckTireSize: data?.tireSize?.name ? data.tireSize.name : '',
      truckMileage: data?.mileage ? data.mileage : '',
      truckIpasEzpass: data?.ipasEzpass ? data.ipasEzpass : '',
      truckLicensePlate: data?.licensePlate
        ? data.licensePlate
        : data?.registrations?.length
        ? data.registrations[0].licensePlate
        : '',
      truckInspectionProgres: {
        start: data?.fhwaInspection
          ? data.fhwaInspection
          : data?.inspections?.length
          ? data.inspections[0].issueDate
          : null,
        end: null,
      },
    };
  }

  updateDataCount() {
    const truckCount = JSON.parse(localStorage.getItem('truckTableCount'));

    this.tableData[0].length = truckCount.active;
    this.tableData[1].length = truckCount.inactive;
  }

  getTabData(dataType: string) {
    if (dataType === 'active') {
      this.trucksActive = this.truckActiveQuery.getAll();

      return this.trucksActive?.length ? this.trucksActive : [];
    } else if (dataType === 'inactive') {
      this.trucksInactive = this.truckInactiveQuery.getAll();

      return this.trucksInactive?.length ? this.trucksInactive : [];
    }
  }

  truckrBackFilter(filter: {
    active: number;
    pageIndex: number;
    pageSize: number;
    companyId: number | undefined;
    sort: string | undefined;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
  }) {
    this.truckService
      .getTruckList(
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
      .subscribe((trucks: TruckListResponse) => {
        this.viewData = trucks.pagination.data;

        this.viewData = this.viewData.map((data: any) => {
          return this.mapTruckData(data);
        });
      });
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(TruckModalComponent, { size: 'small' });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.setTruckData(event.tabData);
    } else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        console.log('Poziva se Sort')
        this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.sort = event.direction;

        this.truckrBackFilter(this.backFilterQuery);
      } else {
        this.sendTruckData();
      }
    }
  }

  public onTableBodyActions(event: any) {
    switch (event.type) {
      case 'edit-truck': {
        this.modalService.openModal(
          TruckModalComponent,
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
            modal: 'truck',
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
            modal: 'truck',
          }
        );
        break;
      }
      case 'activate-item': {
        this.truckService
          .changeTruckStatus(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                `Truck successfully Change Status`,
                'Success:'
              );
            },
            error: () => {
              this.notificationService.error(
                `Truck with id: ${event.id}, status couldn't be changed`,
                'Error:'
              );
            },
          });
        break;
      }
      case 'delete-item': {
        this.truckService
          .deleteTruckById(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Truck successfully deleted',
                'Success:'
              );

              this.viewData = this.viewData.map((truck: any) => {
                if (truck.id === event.id) {
                  truck.actionAnimation = 'delete';
                }

                return truck;
              });

              this.updateDataCount();

              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);

                clearInterval(inetval);
              }, 1000);
            },
            error: () => {
              this.notificationService.error(
                `Truck with id: ${event.id} couldn't be deleted`,
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

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
