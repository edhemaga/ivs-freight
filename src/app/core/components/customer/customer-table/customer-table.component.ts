import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
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
import * as AppConst from 'src/app/const';
import { input_dropdown_animation } from '../../shared/ta-input-dropdown/ta-input-dropdown.animation';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ShipperListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [input_dropdown_animation('showHideDrop')]
})
export class CustomerTableComponent implements OnInit, OnDestroy {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public brokers: BrokerState[] = [];
  public shipper: ShipperState[] = [];
  public selectedTab = 'broker';
  public resetColumns: boolean;
  public agmMap: any;
  public styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };

  public searchForm!: FormGroup;
  public sortTypes: any[] = [];
  public sortDirection: string = 'asc';
  public activeSortType: any = {};
  public markerSelected: boolean = false;
  public mapLatitude: number = 41.860119;
  public mapLongitude: number = -87.660156;
  public sortBy: any;
  public searchValue: string = '';
  private tooltip: any;

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

      console.log('viewData', this.viewData);

      this.sortTypes = [
        {name: 'Business Name', id: 1, sortName: 'name'},
        {name: 'Location', id: 2, sortName: 'location'},
        {name: 'Rating', id: 3, sortName: 'rating'},
        {name: 'Date Added', id: 4, sortName: 'dateAdded'},
        {name: 'Last Used Date', id: 5, sortName: 'lastUsedDate'},
        {name: 'Pickups', id: 6, sortName: 'pickups'},
        {name: 'Deliveries', id: 7, sortName: 'deliveries'},
        {name: 'Avg. Pickup Time', id: 8, sortName: 'avgPickupTime'},
        {name: 'Avg. Delivery Time', id: 9, sortName: 'avgDeliveryTime'}
      ];

      this.activeSortType = this.sortTypes[0];

      this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
        this.sortDirection?.substr(1).toLowerCase())
      : '';
  
      this.searchForm = this.formBuilder.group({
        search: ''
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
    console.log('viewData', this.viewData);
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
    console.log('onToolbarAction event', event);
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
      console.log('event.mode', event.mode);
      if ( event.mode == 'Map' ) {
        this.sortShippers();
      }
    }
  }

  // Table Body Actions
  onTableBodyActions(event: any) {
    console.log('onTableBodyActions event', event);
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

  public getMapInstance(map) {
    this.agmMap = map;
  }

  clickedMarker(i) {
    console.log('clickedMarker i', i);
    this.viewData.map((data: any, index) => {
      if (data.isExpanded) {
        data.isExpanded = false;
      }

      if (data.isSelected && index != i) {
        data.isSelected = false;
      }
      else if ( index == i ) {
        data.isSelected = !data.isSelected;
        console.log('clickedMarker isSelected', data.isSelected);

        if ( data.isSelected ) {
          this.markerSelected = true;
          this.mapLatitude = data.latitude;
          this.mapLongitude = data.longitude;
        }
        else {
          this.markerSelected = false;
        }

        document.querySelectorAll('.si-float-wrapper').forEach(function(parentElement: HTMLElement) {
            parentElement.style.zIndex = '998';

            setTimeout(function() { 
              var childElements = parentElement.querySelectorAll('.show-marker-dropdown');
              if ( childElements.length ) parentElement.style.zIndex = '999';
            }, 1);
        });
        
        // data.markerAnimation = 'BOUNCE';

        // setTimeout(function() {
        //   data.markerAnimation = 'none';
        // }, 500);
      }
    });
  }

  expandInfo(item) {
    item.isExpanded = !item.isExpanded;
    this.ref.detectChanges();
  }

  showMoreOptions(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  changeSortDirection(direction) {
    this.sortDirection = direction;

    this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
        this.sortDirection?.substr(1).toLowerCase())
      : '';
      
    this.sortShippers();
  }
  
  changeSortCategory(item, column) {
    console.log('changeSortCategory item', item);
    this.activeSortType = item;

    this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
        this.sortDirection?.substr(1).toLowerCase())
      : '';
      
    this.sortShippers();
  }

  openPopover(t2) {
    t2.open();
    this.tooltip = t2;
  }

  mapClick() {
    this.viewData.map((data: any, index) => {
      if (data.isSelected) {
        data.isSelected = false;
      }
    });
  }

  sortShippers() {
    console.log('sortShippers sortBy', this.sortBy);

    this.shipperService
    .getShippersList(null, null, 1, 25, null, this.sortBy, this.searchValue)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (res: any) => {
        console.log('sortShippers', res);
        this.viewData = res.pagination.data;
        
        this.ref.detectChanges();
      },
      error: () => {
        this.notificationService.error(
          "Shippers can't be sorted",
          'Error:'
        );
      },
    });
  }
}
