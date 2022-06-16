import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { closeAnimationAction } from 'src/app/core/utils/methods.globals';
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

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'broker';
  resetColumns: boolean;
  public brokers: BrokerState[] = [];
  public shipper: ShipperState[] = [];

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private brokerQuery: BrokerQuery,
    private brokerService: BrokerTService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initTableOptions();

    this.getCustomerData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendCustomerData();
        }
      });

    // Add, Update Broker-Shiper
    this.tableService.currentActionAnimation
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
         if (res.animation === 'update' && res.tab === 'broker') {
          const updatedBroker = this.mapBrokerData(res.data);

          this.viewData = this.viewData.map((broker: any) => {
            if (broker.id === res.id) {
              broker = updatedBroker;
              broker.actionAnimation = 'update';
            }

            return broker;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
      });

      // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
    .pipe(untilDestroyed(this))
    .subscribe((response: any[]) => {
      if (response.length) {
        this.brokerService
          .deleteBrokerList(response)
          .pipe(untilDestroyed(this))
          .subscribe(() => {
            this.viewData = this.viewData.map((broker: any) => {
              response.map((r: any) => {
                if (broker.id === r.id) {
                  broker.actionAnimation = 'delete';
                }
              });

              return broker;
            });

            const inetval = setInterval(() => {
              this.viewData = closeAnimationAction(true, this.viewData);

              clearInterval(inetval);
            }, 1000);

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
          title: 'Edit',
          name: 'edit-cutomer-or-shipper',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'customer',
          text:
            this.selectedTab === 'broker'
              ? 'Are you sure you want to delete customer(s)?'
              : 'Are you sure you want to delete shipper(s)?',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getCustomerData() {
    this.sendCustomerData();
  }

  sendCustomerData() {
    this.tableData = [
      {
        title: 'Broker',
        field: 'broker',
        length: 0,
        data: this.getBrokerShipperTabData('broker'),
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Broker',
        stateName: 'brokers',
        gridColumns: this.getGridColumns('brokers', this.resetColumns),
      },
      {
        title: 'Shipper',
        field: 'shipper',
        length: 0,
        data: this.getBrokerShipperTabData('shipper'),
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Shipper',
        stateName: 'shippers',
        gridColumns: this.getGridColumns('shippers', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.tableData[0].length = this.tableData[0].data.length;
    this.tableData[1].length = this.tableData[1].data.length;

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

    this.viewData = this.viewData.map((data: any) => {
      return this.mapBrokerData(data);
    });

    console.log('setCustomerData');
    console.log(this.viewData);
  }

  mapBrokerData(data: any) {
    return {
      ...data,
      isSelected: false,
      textAddress: data?.mainAddress
        ? data.mainAddress.city + ', ' + data.mainAddress.state
        : '',
      loadCount: '',
      total: '',
    };
  }

  getBrokerShipperTabData(dataType: string) {
    if (dataType === 'broker') {
      this.brokers = this.brokerQuery.getAll();

      console.log('Brokers Data');
      console.log(this.brokers);

      return this.brokers?.length ? this.brokers : [];
    } else {
      return [];
    }
  }

  public onTableBodyActions(event: any) {
    console.log(event);
    if (event.type === 'edit-cutomer-or-shipper' && this.selectedTab === 'broker') {
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
    } else if (event.type === 'edit-cutomer-or-shipper' && this.selectedTab === 'shipper') {
       this.modalService.openModal(
        ShipperModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
        }
      );
    } else if (event.type === 'delete' && this.selectedTab === 'broker') {
      console.log('Poziva se single delete brokera');

      this.brokerService
        .deleteBrokerById(event.id)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Broker successfully deleted',
              'Success:'
            );

            this.viewData = this.viewData.map((broker: any) => {
              if (broker.id === event.id) {
                broker.actionAnimation = 'delete';
              }

              return broker;
            });

            const inetval = setInterval(() => {
              this.viewData = closeAnimationAction(true, this.viewData);

              clearInterval(inetval);
            }, 1000);
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

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      console.log(this.selectedTab);

      if (this.selectedTab === 'broker') {
        this.modalService.openModal(BrokerModalComponent, { size: 'medium' });
      } else {
        this.modalService.openModal(ShipperModalComponent, { size: 'medium' });
      }
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;
      this.setCustomerData(event.tabData);
    }
  }


  ngOnDestroy(): void {
    this.tableService.sendActionAnimation({});
    this.tableService.sendDeleteSelectedRows([]);
  }
}
