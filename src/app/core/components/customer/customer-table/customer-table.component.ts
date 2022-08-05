import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { closeAnimationAction, tableSearch } from 'src/app/core/utils/methods.globals';
import {
  getBrokerColumnDefinition,
  getShipperColumnDefinition,
} from 'src/assets/utils/settings/customer-columns';
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
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: [
    './customer-table.component.scss',
    '../../../../../assets/scss/maps.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [TaThousandSeparatorPipe],
})
export class CustomerTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public brokers: BrokerState[] = [];
  public shipper: ShipperState[] = [];
  public selectedTab = 'active';
  public resetColumns: boolean;
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
  ) {}

  ngOnInit(): void {
    this.sendCustomerData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(untilDestroyed(this))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendCustomerData();
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

    // Add-Update Broker-Shipper
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
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
      .pipe(untilDestroyed(this))
      .subscribe((response: any[]) => {
        // Multiple Delete
        if (response.length) {
          // Delete Broker List
          if (this.selectedTab === 'active') {
            this.brokerService
              .deleteBrokerList(response)
              .pipe(untilDestroyed(this))
              .subscribe(() => {
                this.notificationService.success(
                  'Brokers successfully deleted',
                  'Success:'
                );

                this.multipleDeleteData(response);
              });
          }
          // Delete Shipper List
          else {
            this.shipperService
              .deleteShipperList(response)
              .pipe(untilDestroyed(this))
              .subscribe(() => {
                this.notificationService.success(
                  'Shippers successfully deleted',
                  'Success:'
                );

                this.multipleDeleteData(response);
              });
          }
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
              this.brokerAndShipperBackFilter(searchEvent.query);
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
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: false,
        showMapView: this.selectedTab === 'active' ? false : true,
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
      export: true,
    };
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
        length: brokerShipperCount?.broker ? brokerShipperCount.broker : 0,
        data: this.brokers,
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Customer',
        stateName: 'brokers',
        gridColumns: this.getGridColumns('brokers', this.resetColumns),
      },
      {
        title: 'Shipper',
        field: 'inactive',
        length: brokerShipperCount?.shipper ? brokerShipperCount.shipper : 0,
        data: this.shipper,
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Customer',
        stateName: 'shippers',
        gridColumns: this.getGridColumns('shippers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setCustomerData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return stateName === 'brokers'
        ? getBrokerColumnDefinition()
        : getShipperColumnDefinition();
    }
  }

  setCustomerData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    console.log('Customer Data');
    console.log(this.viewData);

    this.viewData = this.viewData.map((data: any) => {
      if (this.selectedTab === 'active') {
        return this.mapBrokerData(data);
      } else {
        return this.mapShipperData(data);
      }
    });
  }

  // Map Broker Data
  mapBrokerData(data: any) {
    return {
      ...data,
      isSelected: false,
      textAddress: data?.mainAddress
        ? data.mainAddress.city + ', ' + data.mainAddress.state
        : '',
      loadCount: data?.loadCount ? this.thousandSeparator.transform(data.loadCount) : '',
      textTotal: data?.total ? '$' + this.thousandSeparator.transform(data.total) : '',
    };
  }

  // Map Shipper Data
  mapShipperData(data: any) {
    return {
      ...data,
      isSelected: false,
      textDbaName: '',
      textAddress: data?.address
        ? data.address.city + ', ' + data.address.state
        : '',
      mcNumber: '',
      loadCount: '',
      total: '',
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
  brokerAndShipperBackFilter(filter: {
    ban: number | undefined;
    dnu: number | undefined;
    pageIndex: number;
    pageSize: number;
    companyId: number | undefined;
    sort: string | undefined;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
  }) {
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
        .pipe(untilDestroyed(this))
        .subscribe((brokers: GetBrokerListResponse) => {
          this.viewData = brokers.pagination.data;

          this.viewData = this.viewData.map((data: any) => {
            return this.mapBrokerData(data);
          });
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
        .pipe(untilDestroyed(this))
        .subscribe((shippers: ShipperListResponse) => {
          this.viewData = shippers.pagination.data;

          this.viewData = this.viewData.map((data: any) => {
            return this.mapShipperData(data);
          });
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

      this.sendCustomerData();
    } else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  // Head Actions
  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        this.backFilterQuery.sort = event.direction;

        this.brokerAndShipperBackFilter(this.backFilterQuery);
      } else {
        this.sendCustomerData();
      }
    }
  }

  // Table Body Actions
  onTableBodyActions(event: any) {
    // Edit Call
    if (event.type === 'edit-cutomer-or-shipper') {
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
      // Delete Broker Call
      if (this.selectedTab === 'active') {
        this.brokerService
          .deleteBrokerById(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Broker successfully deleted',
                'Success:'
              );

              this.deleteDataById(event.id);
            },
            error: () => {
              this.notificationService.error(
                `Broker with id: ${event.id} couldn't be deleted`,
                'Error:'
              );
            },
          });
      }
      // Delete Shipper Call
      else {
        this.shipperService
          .deleteShipperById(event.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Shipper successfully deleted',
                'Success:'
              );

              this.deleteDataById(event.id);
            },
            error: () => {
              this.notificationService.error(
                `Broker with id: ${event.id} couldn't be deleted`,
                'Error:'
              );
            },
          });
      }
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
    }, 1000);
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
    }, 1000);
  }

  // Multiple Delete Shipper Or Broker From Viewdata
  multipleDeleteData(response: any) {
    this.viewData = this.viewData.map((data: any) => {
      response.map((r: any) => {
        if (data.id === r.id) {
          data.actionAnimation = 'delete';
        }
      });

      return data;
    });

    this.updateDataCount();

    const inetval = setInterval(() => {
      this.viewData = closeAnimationAction(true, this.viewData);

      clearInterval(inetval);
    }, 1000);

    this.tableService.sendRowsSelected([]);
    this.tableService.sendResetSelectedColumns(true);
  }

  ngOnDestroy(): void {
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
