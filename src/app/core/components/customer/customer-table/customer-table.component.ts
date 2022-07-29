import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { ShipperState, ShipperStore } from '../state/shipper-state/shipper.store';
import { ShipperQuery } from '../state/shipper-state/shipper.query';
import { ShipperTService } from '../state/shipper-state/shipper.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss', '../../../../../assets/scss/maps.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerTableComponent implements OnInit, OnDestroy {
  @ViewChild('mapsComponent', {static: false}) public mapsComponent: any;

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public brokers: BrokerState[] = [];
  public shipper: ShipperState[] = [];
  public selectedTab = 'broker';
  public resetColumns: boolean;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private brokerQuery: BrokerQuery,
    private brokerService: BrokerTService,
    private shipperQuery: ShipperQuery,
    private shipperService: ShipperTService,
    private notificationService: NotificationService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private shipperStore: ShipperStore
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
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
          if (this.selectedTab === 'broker') {
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
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: false,
        hideViewMode: this.selectedTab === 'broker' ? true : false,
        showMapView: this.selectedTab === 'broker' ? false : true,
        viewModeActive: 'List'
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
            this.selectedTab === 'broker'
              ? 'Are you sure you want to delete customer(s)?'
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
    if (this.selectedTab === 'broker') {
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
        field: 'broker',
        length: this.brokers.length,
        data: this.brokers,
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Customer',
        stateName: 'brokers',
        gridColumns: this.getGridColumns('brokers', this.resetColumns),
      },
      {
        title: 'Shipper',
        field: 'shipper',
        length: this.shipper.length,
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
    
    this.initTableOptions();

    this.viewData = this.viewData.map((data: any) => {
      if (this.selectedTab === 'broker') {
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
      loadCount: '',
      total: '',
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

  // Toolbar Actions
  onToolBarAction(event: any) {
    // Add Call
    if (event.action === 'open-modal') {
      // Add Broker Call Modal
      if (this.selectedTab === 'broker') {
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
    }
    else if (event.action === 'view-mode') {
      this.tableOptions.toolbarActions.viewModeActive = event.mode;
    }
  }

  // Table Body Actions
  onTableBodyActions(event: any) {
    // Edit Call
    if (event.type === 'edit-cutomer-or-shipper') {
      // Edit Broker Call Modal
      if (this.selectedTab === 'broker') {
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
      if (this.selectedTab === 'broker') {
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
  }

  selectItem(id) {
    this.mapsComponent.clickedMarker(id);
  }
}
