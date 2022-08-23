import { ConfirmationService } from './../../modals/confirmation-modal/confirmation.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TrailerListResponse } from 'appcoretruckassist';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, takeUntil } from 'rxjs';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import {
  closeAnimationAction,
  tableSearch,
} from 'src/app/core/utils/methods.globals';
import { getTrailerColumnDefinition } from 'src/assets/utils/settings/trailer-columns';
import { TtFhwaInspectionModalComponent } from '../../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '../../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TrailerModalComponent } from '../../modals/trailer-modal/trailer-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TrailerActiveQuery } from '../state/trailer-active-state/trailer-active.query';
import { TrailerActiveState } from '../state/trailer-active-state/trailer-active.store';
import { TrailerInactiveQuery } from '../state/trailer-inactive-state/trailer-inactive.query';
import { TrailerInactiveState } from '../state/trailer-inactive-state/trailer-inactive.store';
import { TrailerTService } from '../state/trailer.service';
import {
  Confirmation,
  ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-trailer-table',
  templateUrl: './trailer-table.component.html',
  styleUrls: ['./trailer-table.component.scss'],
  providers: [TaThousandSeparatorPipe],
})
export class TrailerTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  public trailerActive: TrailerActiveState[] = [];
  public trailerInactive: TrailerInactiveState[] = [];
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

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private trailerActiveQuery: TrailerActiveQuery,
    private trailerInactiveQuery: TrailerInactiveQuery,
    private trailerService: TrailerTService,
    private notificationService: NotificationService,
    private thousandSeparator: TaThousandSeparatorPipe,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.sendTrailerData();

    // Confirmation Subscribe
    this.confirmationService.confirmationData$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: Confirmation) => {
          switch (res.type) {
            case 'delete': {
              this.deleteTrailerById(res.id);
              break;
            }
            case 'activate': {
              this.changeTrailerStatus(res.id);
              break;
            }
            case 'deactivate': {
              this.changeTrailerStatus(res.id);
              break;
            }
            default: {
              break;
            }
          }
        },
      });

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendTrailerData();
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

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        } else if (res.animation === 'add' && this.selectedTab === 'inactive') {
          this.updateDataCount();
        } else if (res.animation === 'update') {
          this.viewData = this.viewData.map((trailer: any) => {
            if (trailer.id === res.id) {
              trailer = this.mapTrailerData(res.data);
              trailer.actionAnimation = 'update';
            }

            return trailer;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        } else if (res.animation === 'update-status') {
          let trailerIndex: number;

          this.viewData = this.viewData.map((trailer: any, index: number) => {
            if (trailer.id === res.id) {
              trailer.actionAnimation = 'update';
              trailerIndex = index;
            }

            return trailer;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(trailerIndex, 1);
            clearInterval(inetval);
          }, 1000);
        }
      });

    // Delete Selected Rows

    this.tableService.currentDeleteSelectedRows
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        let trailerNumber = '';
        let trailersText = 'Trailer ';

        if (response.length) {
          this.trailerService
            .deleteTrailerList(response)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.viewData = this.viewData.map((trailer: any) => {
                response.map((r: any) => {
                  if (trailer.id === r.id) {
                    trailer.actionAnimation = 'delete';

                    if (trailerNumber == '') {
                      trailerNumber = trailer.trailerNumber;
                    } else {
                      trailerNumber =
                        trailerNumber + ', ' + trailer.trailerNumber;
                      trailersText = 'Trailers ';
                    }
                  }
                });

                return trailer;
              });

              this.updateDataCount();

              this.notificationService.success(
                `${trailersText} "${trailerNumber}" deleted`,
                'Success'
              );

              trailerNumber = '';
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
          this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;

          this.backFilterQuery.pageIndex = 1;

          const searchEvent = tableSearch(res, this.backFilterQuery);

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.trailerBackFilter(searchEvent.query, true);
            } else if (searchEvent.action === 'store') {
              this.sendTrailerData();
            }
          }
        }
      });
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

  sendTrailerData() {
    this.initTableOptions();

    const trailerCount = JSON.parse(localStorage.getItem('trailerTableCount'));

    const truckActiveData =
      this.selectedTab === 'active' ? this.getTabData('active') : [];

    const truckInactiveData =
      this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

    this.tableData = [
      {
        title: 'Active',
        field: 'active',
        length: trailerCount.active,
        data: truckActiveData,
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', this.resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        length: trailerCount.inactive,
        data: truckInactiveData,
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

    console.log('Trailer Data');
    console.log(this.viewData);
  }

  mapTrailerData(data: any) {
    return {
      ...data,
      isSelected: false,
      textMake: data?.trailerMake?.name ? data.trailerMake.name : '',
      textAxies: data?.axles ? data?.axles : '',
      textTireSize: data?.tireSize?.name ? data.tireSize.name : '',
      textReeferUnit: data?.reeferUnit?.name ? data.reeferUnit.name : '',
      textInsPolicy: data?.insurancePolicy ? data.insurancePolicy : '',
      trailerTypeIcon: data.trailerType.logoName,
      trailerTypeClass: data.trailerType.logoName.replace('.svg', ''),
      textEmptyWeight: data?.emptyWeight
        ? this.thousandSeparator.transform(data.emptyWeight) + ' lbs.'
        : '',
      textMileage: data?.mileage
        ? this.thousandSeparator.transform(data.mileage) + ' mi'
        : '',
      textModel: data?.model ? data?.model : '',
      ownerName: data?.owner?.name ? data.owner.name : '',
      textColor: data?.color?.code ? data.color.code : '',
      colorName: data?.color?.name ? data.color.name : '',
      svgIcon: data?.trailerType?.name
        ? data.trailerType.name
        : '' /* Treba da bude svg ne text */,
      textLength: data?.trailerLength?.name ? data.trailerLength.name : '',
      textLicPlate: data?.licensePlate
        ? data.licensePlate
        : data?.registrations?.length
        ? data.registrations[0].licensePlate
        : '',
      textInspectionData: {
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
    const truckCount = JSON.parse(localStorage.getItem('trailerTableCount'));

    this.tableData[0].length = truckCount.active;
    this.tableData[1].length = truckCount.inactive;
  }

  getTabData(dataType: string) {
    if (dataType === 'active') {
      this.trailerActive = this.trailerActiveQuery.getAll();

      return this.trailerActive?.length ? this.trailerActive : [];
    } else if (dataType === 'inactive') {
      this.trailerInactive = this.trailerInactiveQuery.getAll();

      return this.trailerInactive?.length ? this.trailerInactive : [];
    }
  }

  trailerBackFilter(
    filter: {
      active: number;
      pageIndex: number;
      pageSize: number;
      companyId: number | undefined;
      sort: string | undefined;
      searchOne: string | undefined;
      searchTwo: string | undefined;
      searchThree: string | undefined;
    },
    isSearch?: boolean,
    isShowMore?: boolean
  ) {
    this.trailerService
      .getTrailers(
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
      .subscribe((trailer: TrailerListResponse) => {
        if (!isShowMore) {
          this.viewData = trailer.pagination.data;

          this.viewData = this.viewData.map((data: any) => {
            return this.mapTrailerData(data);
          });

          if (isSearch) {
            this.tableData[this.selectedTab === 'active' ? 0 : 1].length =
              trailer.pagination.count;
          }
        } else {
          let newData = [...this.viewData];

          trailer.pagination.data.map((data: any) => {
            newData.push(this.mapTrailerData(data));
          });

          this.viewData = [...newData];
        }
      });
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(TrailerModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.backFilterQuery.pageIndex = 1;

      this.sendTrailerData();
    } else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.sort = event.direction;
        this.backFilterQuery.pageIndex = 1;

        this.trailerBackFilter(this.backFilterQuery);
      } else {
        this.sendTrailerData();
      }
    }
  }

  public onTableBodyActions(event: any) {
    let trailerNum = event.data.trailerNumber;
    const mappedEvent = {
      ...event,
      data: {
        ...event.data,
        number: event.data?.trailerNumber,
        avatar: `assets/svg/common/trailers/${event.data?.trailerType?.logoName}`,
      },
    };
    switch (event.type) {
      case 'show-more': {
        this.backFilterQuery.pageIndex++;
        this.trailerBackFilter(this.backFilterQuery, false, true);
        break;
      }
      case 'edit-trailer': {
        this.modalService.openModal(
          TrailerModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
            disableButton: true,
            tabSelected: this.selectedTab,
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
            tabSelected: this.selectedTab,
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
            tabSelected: this.selectedTab,
          }
        );
        break;
      }
      case 'activate-item': {
        this.trailerService
          .changeTrailerStatus(event.id, this.selectedTab)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                `Trailer "${trailerNum}" Activated`,
                'Success'
              );
              this.sendTrailerData();
            },
            error: () => {
              this.notificationService.error(
                `Trailer with id: ${event.id}, status couldn't be changed`,
                'Error:'
              );
            },
          });
        break;
      }
      case 'delete-item': {
        this.trailerService
          .deleteTrailerById(event.id, this.selectedTab)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                `Trailer "${trailerNum}" deleted`,
                'Success'
              );
              this.viewData = this.viewData.map((trailer: any) => {
                if (trailer.id === event.id) {
                  trailer.actionAnimation = 'delete';
                }
                return trailer;
              });
              const inetval = setInterval(() => {
                this.viewData = closeAnimationAction(true, this.viewData);
                clearInterval(inetval);
              }, 1000);
            },
            error: () => {
              this.notificationService.error(
                `Failed to delete Trailer "${trailerNum}"`,
                'Error'
              );
            },
          });
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'trailer',
            type: event.data.status === 1 ? 'deactivate' : 'activate',
            svg: true,
          }
        );
        break;
      }
      case 'delete-item': {
        this.modalService.openModal(
          ConfirmationModalComponent,
          { size: 'small' },
          {
            ...mappedEvent,
            template: 'trailer',
            type: 'delete',
            svg: true,
          }
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  private changeTrailerStatus(id: number) {
    this.trailerService
      .changeTrailerStatus(id, this.selectedTab)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Trailer successfully changed status',
            'Success:'
          );

          this.sendTrailerData();
        },
        error: () => {
          this.notificationService.error(
            `Trailer with id: ${id}, status couldn't be changed`,
            'Error:'
          );
        },
      });
  }

  private deleteTrailerById(id: number) {
    this.trailerService
      .deleteTrailerById(id, this.selectedTab)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Trailer successfully deleted',
            'Success:'
          );

          this.viewData = this.viewData.map((trailer: any) => {
            if (trailer.id === id) {
              trailer.actionAnimation = 'delete';
            }

            return trailer;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(true, this.viewData);

            clearInterval(inetval);
          }, 1000);
        },
        error: () => {
          this.notificationService.error(
            `Trailer with id: ${id} couldn't be deleted`,
            'Error:'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
