import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { BrokerModalComponent } from '../../modals/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '../../modals/shipper-modal/shipper-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { BrokerQuery } from '../state/broker-state/broker.query';
import { BrokerTService } from '../state/broker-state/broker.service';
import { BrokerState } from '../state/broker-state/broker.store';
import { ShipperState } from '../state/shipper-state/shipper.store';
import { ShipperQuery } from '../state/shipper-state/shipper.query';
import { ShipperTService } from '../state/shipper-state/shipper.service';
import { GetBrokerListResponse, ShipperListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import {
  tableSearch,
  closeAnimationAction,
} from '../../../utils/methods.globals';
import {
  getBrokerColumnDefinition,
  getShipperColumnDefinition,
} from '../../../../../assets/utils/settings/customer-columns';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: [
    './customer-table.component.scss',
    '../../../../../assets/scss/maps.scss',
  ],
  providers: [TaThousandSeparatorPipe],
})
export class CustomerTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private destroy$ = new Subject<void>();

  @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;

  tableOptions: any = {};
  tableData: any[] = [];
  viewData: any[] = [];
  columns: any[] = [];
  brokers: BrokerState[] = [];
  shipper: ShipperState[] = [];
  selectedTab = 'active';
  activeViewMode: string = 'List';
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  backFilterQuery = {
    ban: null,
    dnu: null,
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
    private brokerQuery: BrokerQuery,
    private brokerService: BrokerTService,
    private shipperQuery: ShipperQuery,
    private shipperService: ShipperTService,
    private notificationService: NotificationService,
    private thousandSeparator: TaThousandSeparatorPipe,
    private reviewRatingService: ReviewsRatingService,
    private DetailsDataService: DetailsDataService,
  ) {}

  ngOnInit(): void {
    this.sendCustomerData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.sendCustomerData();
        }
      });

    // Resize
    this.tableService.currentColumnWidth
      .pipe(takeUntil(this.destroy$))
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
      .pipe(takeUntil(this.destroy$))
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

    // Add-Update Broker-Shipper
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // <------------------ Broker ------------------->
        // Add Broker
        if (res.animation === 'add' && res.tab === 'broker') {
          this.viewData.push(this.mapBrokerData(res.data));

          this.addData(res.id);
        }
        // Update Broker
        else if (res.animation === 'update' && res.tab === 'broker') {
          const updatedBroker = this.mapBrokerData(res.data);

          this.updateData(res.id, updatedBroker);
        }

        // <------------------ Shipper ------------------->
        // Add Shipper
        else if (res.animation === 'add' && res.tab === 'shipper') {
          this.viewData.push(this.mapShipperData(res.data));

          this.addData(res.id);
        }
        // Update Shipper
        else if (res.animation === 'update' && res.tab === 'shipper') {
          const updatedShipper = this.mapShipperData(res.data);

          this.updateData(res.id, updatedShipper);
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        // Multiple Delete
        if (response.length) {
          // Delete Broker List

          if (this.selectedTab === 'active') {
            this.brokerService
              .deleteBrokerList(response)
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                let brokerName = '';
                let brokerText = 'Broker ';
                this.viewData.map((data: any) => {
                  response.map((r: any) => {
                    if (data.id === r.id) {
                      if (!brokerName) {
                        brokerName = data.businessName;
                      } else {
                        brokerName = brokerName + ', ' + data.businessName;
                        brokerText = 'Brokers ';
                      }
                    }
                  });
                });

                this.notificationService.success(
                  `${brokerText} "${brokerName}" deleted`,
                  'Success'
                );

                this.multipleDeleteData(response);
              });
          }
          // Delete Shipper List
          else {
            let shipperName = '';
            let shipText = 'Shipper ';
            this.viewData.map((data: any) => {
              response.map((r: any) => {
                if (data.id === r.id) {
                  if (!shipperName) {
                    shipperName = data.businessName;
                  } else {
                    shipperName = shipperName + ', ' + data.businessName;
                    shipText = 'Shippers ';
                  }
                }
              });
            });

            this.shipperService
              .deleteShipperList(response)
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                this.notificationService.success(
                  `${shipText} "${shipperName}" deleted `,
                  'Success'
                );

                this.multipleDeleteData(response);
              });
          }
        }
      });

    // Search
    this.tableService.currentSearchTableData
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.backFilterQuery.pageIndex = 1;

          const searchEvent = tableSearch(res, this.backFilterQuery);

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.brokerAndShipperBackFilter(searchEvent.query, true);
            } else if (searchEvent.action === 'store') {
              this.sendCustomerData();
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
      toolbarActions: {
        showMoneyFilter: this.selectedTab === 'active',
        showLocationFilter: this.selectedTab === 'inactive',
        showStateFilter: this.selectedTab === 'inactive',
        viewModeOptions: this.getViewModeOptions(),
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit-cutomer-or-shipper',
          class: 'regular-text',
          contentType: 'edit',
          show: true,
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'customer',
          text:
            this.selectedTab === 'active'
              ? 'Are you sure you want to delete broker(s)?'
              : 'Are you sure you want to delete shipper(s)?',
          class: 'delete-text',
          contentType: 'delete',
          show: true,
          danger: true,
          svg: 'assets/svg/truckassist-table/dropdown/content/delete.svg',
        },
      ],
    };
  }

  getViewModeOptions() {
    return this.selectedTab === 'active'
      ? [
          { name: 'List', active: this.activeViewMode === 'List' },
          { name: 'Card', active: this.activeViewMode === 'Card' },
        ]
      : [
          { name: 'List', active: this.activeViewMode === 'List' },
          { name: 'Card', active: this.activeViewMode === 'Card' },
          { name: 'Map', active: this.activeViewMode === 'Map' },
        ];
  }

  sendCustomerData() {
    this.initTableOptions();

    const brokerShipperCount = JSON.parse(
      localStorage.getItem('brokerShipperTableCount')
    );

    if (this.selectedTab === 'active') {
      this.brokers = this.brokerQuery.getAll().length
        ? this.brokerQuery.getAll()
        : [];
    } else {
      this.shipper = this.shipperQuery.getAll().length
        ? this.shipperQuery.getAll()
        : [];
    }

    this.tableData = [
      {
        title: 'Broker',
        field: 'active',
        length: brokerShipperCount.broker,
        data: this.brokers,
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Customer',
        stateName: 'brokers',
        tableConfiguration: 'BROKER',
        isActive: this.selectedTab === 'active',
        gridColumns: this.getGridColumns('BROKER'),
      },
      {
        title: 'Shipper',
        field: 'inactive',
        length: brokerShipperCount.shipper,
        data: this.shipper,
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Customer',
        stateName: 'shippers',
        tableConfiguration: 'SHIPPER',
        isActive: this.selectedTab === 'inactive',
        gridColumns: this.getGridColumns('SHIPPER'),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setCustomerData(td);
  }

  getGridColumns(configType: string) {
    const tableColumnsConfig = JSON.parse(
      localStorage.getItem(`table-${configType}-Configuration`)
    );

    if (configType === 'BROKER') {
      return tableColumnsConfig
        ? tableColumnsConfig
        : getBrokerColumnDefinition();
    } else {
      return tableColumnsConfig
        ? tableColumnsConfig
        : getShipperColumnDefinition();
    }
  }

  setCustomerData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any) => {
        if (this.selectedTab === 'active') {
          return this.mapBrokerData(data);
        } else {
          return this.mapShipperData(data);
        }
      });

      // For Testing
      // for (let i = 0; i < 100; i++) {
      //   this.viewData.push(this.viewData[0]);
      // }
    } else {
      this.viewData = [];
    }
  }

  // Map Broker Data
  mapBrokerData(data: any) {
    return {
      ...data,
      isSelected: false,
      textInvAgeing: {
        bfb: 0,
        dnu: 0,
        amount: 'Nije Povezano',
      },
      textContact: data?.brokerContacts?.length
        ? data.brokerContacts.length
        : 0,
      textAddress: data?.mainAddress
        ? data.mainAddress.city + ', ' + data.mainAddress.state
        : '',
      loadCount: data?.loadCount
        ? this.thousandSeparator.transform(data.loadCount)
        : '',
      textTotal: data?.total
        ? '$' + this.thousandSeparator.transform(data.total)
        : '',
      textUnpaid: 'Nije Povezano',
      textOnetoTwentyDays: 'Nije Povezano',
      raiting: {
        hasLiked: data.currentCompanyUserRating === 1,
        hasDislike: data.currentCompanyUserRating === -1,
        likeCount: data?.upCount ? data.upCount : '0',
        dislikeCount: data?.downCount ? data.downCount : '0',
      },
    };
  }

  // Map Shipper Data
  mapShipperData(data: any) {
    return {
      ...data,
      isSelected: false,
      textShipWorkHour: 'Nije Povezano',
      textReceWorkHour: 'Nije Povezano',
      textContact: data?.shipperContacts?.length
        ? data.shipperContacts.length
        : 0,
      textDbaName: '',
      textAddress: data?.address
        ? data.address.city + ', ' + data.address.state
        : '',
      mcNumber: '',
      loadCount: '',
      total: '',
      raiting: {
        hasLiked: data.currentCompanyUserRating === 1,
        hasDislike: data.currentCompanyUserRating === -1,
        likeCount: data?.upCount ? data.upCount : '0',
        dislikeCount: data?.downCount ? data.downCount : '0',
      },
    };
  }

  // Update Broker And Shipper Count
  updateDataCount() {
    const brokerShipperCount = JSON.parse(
      localStorage.getItem('brokerShipperTableCount')
    );

    this.tableData[0].length = brokerShipperCount.broker;
    this.tableData[1].length = brokerShipperCount.shipper;
  }

  // Broker And Shipper Back Filter Query
  brokerAndShipperBackFilter(
    filter: {
      ban: number | undefined;
      dnu: number | undefined;
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
    // Broker Api Call
    if (this.selectedTab === 'active') {
      this.brokerService
        .getBrokerList(
          filter.ban,
          filter.dnu,
          filter.pageIndex,
          filter.pageSize,
          filter.companyId,
          filter.sort,
          filter.searchOne,
          filter.searchTwo,
          filter.searchThree
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe((brokers: GetBrokerListResponse) => {
          if (!isShowMore) {
            this.viewData = brokers.pagination.data;

            this.viewData = this.viewData.map((data: any) => {
              return this.mapBrokerData(data);
            });

            if (isSearch) {
              this.tableData[0].length = brokers.pagination.count;
            }
          } else {
            let newData = [...this.viewData];

            brokers.pagination.data.map((data: any) => {
              newData.push(this.mapBrokerData(data));
            });

            this.viewData = [...newData];
          }
        });
    }
    // Shipper Api Call
    else {
      this.shipperService
        .getShippersList(
          filter.ban,
          filter.dnu,
          filter.pageIndex,
          filter.pageSize,
          filter.companyId,
          filter.sort,
          filter.searchOne,
          filter.searchTwo,
          filter.searchThree
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe((shippers: ShipperListResponse) => {
          if (!isShowMore) {
            this.viewData = shippers.pagination.data;

            this.viewData = this.viewData.map((data: any) => {
              return this.mapShipperData(data);
            });

            if (isSearch) {
              this.tableData[1].length = shippers.pagination.count;
            }
          } else {
            let newData = [...this.viewData];

            shippers.pagination.data.map((data: any) => {
              newData.push(this.mapBrokerData(data));
            });

            this.viewData = [...newData];
          }
        });
    }
  }

  // Toolbar Actions
  onToolBarAction(event: any) {
    // Add Call
    if (event.action === 'open-modal') {
      // Add Broker Call Modal
      if (this.selectedTab === 'active') {
        this.modalService.openModal(BrokerModalComponent, { size: 'medium' });
      }
      // Add Shipper Call Modal
      else {
        this.modalService.openModal(ShipperModalComponent, { size: 'medium' });
      }
    }
    // Switch Tab Call
    else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.backFilterQuery.pageIndex = 1;

      this.sendCustomerData();
    } else if (event.action === 'view-mode') {
      this.activeViewMode = event.mode;
    }
  }

  // Head Actions
  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        this.backFilterQuery.sort = event.direction;

        this.backFilterQuery.pageIndex = 1;

        this.brokerAndShipperBackFilter(this.backFilterQuery);
      } else {
        this.sendCustomerData();
      }
    }
  }

  // Table Body Actions
  onTableBodyActions(event: any) {
    let businessName = '';

    console.log('onTableBodyActions');
    console.log(event);
    this.DetailsDataService.setNewData(event.data);
    // Edit Call
    if (event.type === 'show-more') {
      this.backFilterQuery.pageIndex++;

      this.brokerAndShipperBackFilter(this.backFilterQuery, false, true);
    } else if (event.type === 'edit-cutomer-or-shipper') {
      // Edit Broker Call Modal
      if (this.selectedTab === 'active') {
        this.modalService.openModal(
          BrokerModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
            dnuButton: true,
            bfbButton: true,
          }
        );
      }
      // Edit Shipper Call Modal
      else {
        this.modalService.openModal(
          ShipperModalComponent,
          { size: 'small' },
          {
            ...event,
            type: 'edit',
          }
        );
      }
    }
    // Delete Call
    else if (event.type === 'delete') {
      businessName = this.getBusinessName(event, businessName);

      // Delete Broker Call
      if (this.selectedTab === 'active') {
        this.brokerService
          .deleteBrokerById(event.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success(
                `Broker "${businessName}" deleted`,
                'Success'
              );

              this.deleteDataById(event.id);
            },
            error: () => {
              this.notificationService.error(
                `Failed to delete Broker "${businessName}" `,
                'Error'
              );
            },
          });
      }
      // Delete Shipper Call
      else {
        businessName = this.getBusinessName(event, businessName);

        this.shipperService
          .deleteShipperById(event.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success(
                `Shipper "${businessName}" deleted`,
                'Success'
              );

              this.deleteDataById(event.id);
            },
            error: () => {
              this.notificationService.error(
                `Failed to delete Shipper "${businessName}" `,
                'Error'
              );
            },
          });
      }
    }
    // Raiting
    else if (event.type === 'raiting') {
      let raitingData = {
        entityTypeRatingId: this.selectedTab === 'active' ? 1 : 3,
        entityTypeId: event.data.id,
        thumb: event.subType === 'like' ? 1 : -1,
        tableData: event.data,
      };

      this.reviewRatingService
        .addRating(raitingData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.viewData = this.viewData.map((data: any) => {
            if (data.id === event.data.id) {
              data.actionAnimation = 'update';
              data.raiting = {
                hasLiked: res.currentCompanyUserRating === 1,
                hasDislike: res.currentCompanyUserRating === -1,
                likeCount: res?.upCount ? res.upCount : '0',
                dislikeCount: res?.downCount ? res.downCount : '0',
              };
            }

            return data;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        });
    }
  }

  // Get Business Name
  getBusinessName(event: any, businessName: string) {
    if (!businessName) {
      return (businessName = event.data.businessName);
    } else {
      return (businessName = businessName + ', ' + event.data.businessName);
    }
  }

  // Add Shipper Or Broker To Viewdata
  addData(dataId: any) {
    this.viewData = this.viewData.map((data: any) => {
      if (data.id === dataId) {
        data.actionAnimation = 'add';
      }
      return data;
    });

    this.updateDataCount();

    const inetval = setInterval(() => {
      this.viewData = closeAnimationAction(false, this.viewData);

      clearInterval(inetval);
    }, 2300);
  }

  // Update Shipper Or Broker In Viewdata
  updateData(dataId: number, updatedData: any) {
    this.viewData = this.viewData.map((data: any) => {
      if (data.id === dataId) {
        data = updatedData;
        data.actionAnimation = 'update';
      }

      return data;
    });

    const inetval = setInterval(() => {
      this.viewData = closeAnimationAction(false, this.viewData);

      clearInterval(inetval);
    }, 1000);
  }

  // Delete Shipper Or Broker From Viewdata
  deleteDataById(dataId: number) {
    this.viewData = this.viewData.map((data: any) => {
      if (data.id === dataId) {
        data.actionAnimation = 'delete';
      }

      return data;
    });

    this.updateDataCount();

    const inetval = setInterval(() => {
      this.viewData = closeAnimationAction(true, this.viewData);

      clearInterval(inetval);
    }, 900);
  }

  // Multiple Delete Shipper Or Broker From Viewdata
  multipleDeleteData(response: any) {
    this.viewData = this.viewData.map((data: any) => {
      response.map((r: any) => {
        if (data.id === r.id) {
          data.actionAnimation = 'delete-multiple';
        }
      });

      return data;
    });

    this.updateDataCount();

    const inetval = setInterval(() => {
      this.viewData = closeAnimationAction(true, this.viewData);

      clearInterval(inetval);
    }, 900);

    this.tableService.sendRowsSelected([]);
    this.tableService.sendResetSelectedColumns(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
    this.tableService.sendDeleteSelectedRows([]);

    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }

  // MAP
  selectItem(id: any) {
    this.mapsComponent.clickedMarker(id);
  }
}
