import { untilDestroyed } from 'ngx-take-until-destroy';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import {
  getRepairsShopColumnDefinition,
  getRepairTrailerColumnDefinition,
  getRepairTruckColumnDefinition,
} from 'src/assets/utils/settings/repair-columns';
import { RepairShopModalComponent } from '../../modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Router } from '@angular/router';
import { RepairOrderModalComponent } from '../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import * as AppConst from 'src/app/const';
import { input_dropdown_animation } from '../../shared/ta-input-dropdown/ta-input-dropdown.animation';
import { ShopQuery } from '../state/shop-state/shop.query';
import { ShopState } from '../state/shop-state/shop.store';

@Component({
  selector: 'app-repair-table',
  templateUrl: './repair-table.component.html',
  styleUrls: ['./repair-table.component.scss', '../../../../../assets/scss/maps.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [input_dropdown_animation('showHideDrop')]
})
export class RepairTableComponent implements OnInit, OnDestroy {
  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';

  public agmMap: any;
  public styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };

  public sortTypes: any[] = [];
  public sortDirection: string = 'asc';
  public activeSortType: any = {};
  public markerSelected: boolean = false;
  public mapLatitude: number = 41.860119;
  public mapLongitude: number = -87.660156;
  public sortBy: any;
  public searchValue: string = '';
  public mapMarkers: any[] = [];
  public mapCircle: any = {
    lat: 41.860119,
    lng: -87.660156,
    radius: 160934.4 // 100 miles
  };
  public locationFilterOn: boolean = false;
  private tooltip: any;
  public locationRange: any = 100;

  public markerAnimations: any = {};
  public showMarkerWindow: any = {};
  public repairShops: ShopState[] = [];

  resetColumns: boolean;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    public router: Router,
    private ref: ChangeDetectorRef,
    private shopQuery: ShopQuery,
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getRepairData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(untilDestroyed(this))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendRepairData();
        }
      });

    // Switch Selected
    this.tableService.currentSwitchOptionSelected
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          if (res.switchType === 'PM') {
            this.router.navigate([`pm`]);
          }
        }
      });

      this.sortTypes = [
        {name: 'Business Name', id: 1, sortName: 'name'},
        {name: 'Location', id: 2, sortName: 'location', isHidden: true},
        {name: 'Favorites', id: 8, sortName: 'favorites'},
        {name: 'Available', id: 9, sortName: 'available'},
        {name: 'Rating', id: 3, sortName: 'rating'},
        {name: 'Date Added', id: 4, sortName: 'createdAt'},
        {name: 'Last Used Date', id: 5, sortName: 'updatedAt  '},
        {name: 'Orders', id: 6, sortName: 'orders'},
        {name: 'Total Cost', id: 7, sortName: 'cost'}
      ];

      this.activeSortType = this.sortTypes[0];

      this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
        this.sortDirection?.substr(1).toLowerCase())
      : '';
  }

  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        hideViewMode: false,
        showMapView: true,
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
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
        },
        {
          title: 'Delete',
          name: 'delete-repair',
          type: !this.selectedTab ? 'repair-shop' : 'repair',
          text: !this.selectedTab
            ? 'Are you sure you want to delete repair shop(s)?'
            : 'Are you sure you want to delete repair(s)',
          class: 'delete-text',
          contentType: 'delete',
        },
      ],
      export: true,
    };
  }

  getRepairData() {
    this.sendRepairData();
  }

  sendRepairData() {
    this.repairShops = this.shopQuery.getAll().length
        ? this.shopQuery.getAll()
        : [];

    console.log('repairShops', this.repairShops);
    console.log('selectedTab', this.selectedTab);

    this.tableData = [
      {
        title: 'Truck',
        field: 'active',
        length: 8,
        data: this.getDumyData(8, 'truck'),
        extended: false,
        selectTab: true,
        gridNameTitle: 'Truck',
        stateName: 'repair_trucks',
        gridColumns: this.getGridColumns('repair_trucks', this.resetColumns),
      },
      {
        title: 'Trailer',
        field: 'inactive',
        length: 15,
        data: this.getDumyData(15, 'trailer'),
        extended: false,
        selectTab: true,
        gridNameTitle: 'Trailer',
        stateName: 'repair_trailers',
        gridColumns: this.getGridColumns('repair_trailers', this.resetColumns),
      },
      {
        title: 'Shop',
        field: null,
        length: 25,
        data: this.repairShops,
        extended: false,
        checkPinned: true,
        gridNameTitle: 'Shop',
        stateName: 'repair_shops',
        gridColumns: this.getGridColumns('repair_shops', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setRepairData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'repair_trucks') {
        return getRepairTruckColumnDefinition();
      } else if (stateName === 'repair_trailers') {
        return getRepairTrailerColumnDefinition();
      } else if (stateName === 'repair_shops') {
        return getRepairsShopColumnDefinition();
      }
    }
  }

  setRepairData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
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
    });
  }

  getDumyData(numberOfCopy: number, dataType: string) {
    let dataTruck: any[] = [
      {
        id: 273,
        companyId: 1,
        repairShopId: 783,
        repairShopName: 'TA TRUCK GRAND BAY, AL',
        truckId: 187,
        truckNumber: '0408',
        trailerId: null,
        trailerNumber: null,
        categoryId: 1,
        category: 'truck',
        maintenanceDate: '05/28/20',
        mileage: 0,
        invoiceNo: '054250977',
        total: 0,
        doc: {
          unit: '0408',
          items: [
            {
              id: null,
              item: 'Mechanical hourly labor',
              price: '$59.50',
              quantity: 1,
              subtotal: null,
            },
            {
              id: null,
              item: 'Shop supply environmental fee',
              price: '$3.57',
              quantity: 1,
              subtotal: null,
            },
            {
              id: null,
              item: 'Tax',
              price: '$0.20',
              quantity: 1,
              subtotal: null,
            },
          ],
          total: '$63.27',
          types: [
            {
              id: 'mobile',
              name: 'Mobile',
              checked: false,
            },
            {
              id: 'shop',
              name: 'Shop',
              checked: false,
            },
            {
              id: 'towing',
              name: 'Towing',
              checked: false,
            },
            {
              id: 'parts',
              name: 'Parts',
              checked: false,
            },
            {
              id: 'tire',
              name: 'Tire',
              checked: false,
            },
            {
              id: 'dealer',
              name: 'Dealer',
              checked: false,
            },
          ],
          millage: '',
          repairShop: {
            id: 783,
            name: 'TA TRUCK GRAND BAY, AL',
            contact: {
              email: null,
              phone: '2518656175',
              address: '9201 Grand Bay Wilmer Rd, Grand Bay, AL 36541, USA',
            },
          },
          attachments: [
            {
              url: 'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/maintenance/273/0d81e528f4774cc4bd2af080ceb2c1161620664708-0408 5.28.20.pdf',
              fileName: '0408 5.28.20.pdf',
              fileItemGuid: '0d81e528-f477-4cc4-bd2a-f080ceb2c116',
            },
          ],
          additionalData: {
            note: 'Test<div><br></div>',
          },
        },
        createdAt: '2021-01-26T20:31:46',
        updatedAt: '2022-01-06T17:55:39',
        guid: '04a7a835-f9ab-4af4-aa72-33023e47e684',
        textUnit: '0408',
        textMillage: '',
        textRepairShopName: 'TA TRUCK GRAND BAY, AL',
        textTotal: '$63.27',
        descriptionItems:
          'Mechanical hourly labor<div class="description-dot"></div>Shop supply environmental fee<div class="description-dot"></div>Tax',
        description:
          'Mechanical hourly labor<span class="description-dot"></span>Shop supply environmental fee<span class="description-dot"></span>Tax',
        isSelected: false,
      },
    ];
    let dataTrailer: any[] = [
      {
        id: 108,
        companyId: 1,
        repairShopId: 140,
        repairShopName: 'IVS TRUCK REPAIR, INC.',
        truckId: null,
        truckNumber: null,
        trailerId: 59,
        trailerNumber: 'R17042',
        categoryId: 2,
        category: 'trailer',
        maintenanceDate: '03/09/20',
        mileage: 0,
        invoiceNo: '2188',
        total: 0,
        doc: {
          unit: 'R17042',
          items: [
            {
              id: null,
              item: 'Horizontal e track',
              price: '$27.5',
              quantity: 10,
              subtotal: null,
            },
            {
              id: null,
              item: 'Shop supply ',
              price: '$35',
              quantity: 1,
              subtotal: null,
            },
            {
              id: null,
              item: 'Total labor ',
              price: '$80',
              quantity: 1,
              subtotal: null,
            },
          ],
          total: '$390.00',
          types: [
            {
              id: 'mobile',
              name: 'Mobile',
              checked: false,
            },
            {
              id: 'shop',
              name: 'Shop',
              checked: true,
            },
            {
              id: 'towing',
              name: 'Towing',
              checked: false,
            },
            {
              id: 'parts',
              name: 'Parts',
              checked: true,
            },
            {
              id: 'tire',
              name: 'Tire',
              checked: false,
            },
            {
              id: 'dealer',
              name: 'Dealer',
              checked: false,
            },
          ],
          millage: '',
          repairShop: {
            id: 140,
            name: 'IVS TRUCK REPAIR, INC.',
            contact: {
              email: 'nicolas@ivstruckrepair.com',
              phone: '(708) 880-4117',
              address: '9720 Industrial Dr, Bridgeview, IL 60455, USA',
            },
          },
          attachments: [],
          additionalData: {
            note: '',
          },
        },
        createdAt: '2021-01-20T16:53:01',
        updatedAt: '2021-08-17T17:24:10',
        guid: '9dd9b4d2-000b-4d21-8246-e1bcba642f22',
        textUnit: 'R17042',
        textMillage: '',
        textRepairShopName: 'IVS TRUCK REPAIR, INC.',
        textTotal: '$390.00',
        descriptionItems:
          'Horizontal e track<div class="description-dot"></div>Shop supply<div class="description-dot"></div>Total labor',
        description:
          'Horizontal e track<span class="description-dot"></span>Shop supply<span class="description-dot"></span>Total labor',
      },
    ];
    let dataShop: any[] = [
      {
        id: 140,
        companyId: null,
        repairShopId: null,
        name: 'IVS TRUCK REPAIR, INC.',
        status: 1,
        pinned: 1,
        address: null,
        street: null,
        city: null,
        state: null,
        country: null,
        zip: null,
        longitude: -87.8063395,
        latitude: 41.7147018,
        email: null,
        phone: null,
        upCount: 2,
        downCount: 1,
        thumbUp: 259,
        thumbDown: null,
        commentList: null,
        doc: {
          email: 'nicolas@ivstruckrepair.com',
          phone: '(708) 880-4117',
          types: [
            {
              id: 'truck',
              name: 'Truck',
              checked: true,
            },
            {
              id: 'trailer',
              name: 'Trailer',
              checked: false,
            },
            {
              id: 'mobile',
              name: 'Mobile',
              checked: false,
            },
            {
              id: 'shop',
              name: 'Shop',
              checked: true,
            },
            {
              id: 'towing',
              name: 'Towing',
              checked: false,
            },
            {
              id: 'parts',
              name: 'Parts',
              checked: false,
            },
            {
              id: 'tire',
              name: 'Tire',
              checked: false,
            },
            {
              id: 'dealer',
              name: 'Dealer',
              checked: false,
            },
          ],
          address: {
            city: 'Bridgeview',
            state: 'Illinois',
            address: '9720 Industrial Dr, Bridgeview, IL 60455, USA',
            country: 'US',
            zipCode: '60455',
            stateShortName: 'IL',
          },
          addressUnit: '',
          additionalData: {
            note: 'tes',
          },
        },
        up: null,
        down: null,
        latestComment: null,
        repairCount: 183,
        total: '$300,798.86',
        guid: '9d3a3754-3616-4940-b92a-9366fc43a5b4',
        textPhone: '(708) 880-4117',
        textEmail: 'nicolas@ivstruckrepair.com',
        textAddress: '9720 Industrial Dr, Bridgeview, IL 60455, USA',
      },
    ];

    let data: any[] = [];

    for (let i = 0; i < numberOfCopy; i++) {
      if (dataType === 'truck') {
        data.push(dataTruck[0]);
      } else if (dataType === 'trailer') {
        data.push(dataTrailer[0]);
      } else {
        data.push(dataShop[0]);
      }
    }

    return data;
  }

  onToolBarAction(event: any) {
    console.log('onToolBarAction event', event);
    switch (event.action) {
      case 'tab-selected': {
        this.selectedTab = event.tabData.field;
        console.log('event.tabData', event.tabData);
        this.setRepairData(event.tabData);
        break;
      }
      case 'open-modal': {
        switch (this.selectedTab) {
          case 'active': {
            this.modalService.openModal(
              RepairOrderModalComponent,
              {
                size: 'large',
              },
              {
                type: 'new-truck',
              }
            );
            break;
          }
          case 'inactive': {
            this.modalService.openModal(
              RepairOrderModalComponent,
              {
                size: 'large',
              },
              {
                type: 'new-trailer',
              }
            );
            break;
          }
          default: {
            this.modalService.openModal(RepairShopModalComponent, {
              size: 'small',
            });
            break;
          }
        }
        break;
      }
      case 'view-mode': {
        this.tableOptions.toolbarActions.viewModeActive = event.mode;
        console.log('event.mode', event.mode);
        if ( event.mode == 'Map' ) {
          console.log('view-mode Map');
          this.markersDropAnimation();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public onTableBodyActions(event: any) {
    switch (this.selectedTab) {
      case 'active': {
        this.modalService.openModal(
          RepairOrderModalComponent,
          { size: 'large' },
          { ...event, type: 'edit-truck' }
        );
        break;
      }
      case 'inactive': {
        this.modalService.openModal(
          RepairOrderModalComponent,
          { size: 'large' },
          { ...event, type: 'edit-trailer' }
        );
        break;
      }
      default: {
        this.modalService.openModal(
          RepairShopModalComponent,
          { size: 'small' },
          event
        );
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.tableService.sendCurrentSwitchOptionSelected(null);
  }

  mapClick() {
    console.log('mapClick viewData', this.viewData);
    this.viewData.map((data: any, index) => {
      if (data.isSelected) {
        data.isSelected = false;
      }
    });
  }

  clickedMarker(id) {
    console.log('clickedMarker id', id);
    this.viewData.map((data: any, index) => {
      if (data.isExpanded) {
        data.isExpanded = false;
      }

      if (data.isSelected && data.id != id) {
        data.isSelected = false;
      }
      else if ( data.id == id ) {
        data.isSelected = !data.isSelected;

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
      }
    });
  }

  markersDropAnimation() {
    console.log('markersDropAnimation');
    var mainthis = this;

    setTimeout(() => {
      this.viewData.map((data: any) => {
        console.log('viewData data', data);
        if ( !mainthis.markerAnimations[data.id] ) {
          mainthis.markerAnimations[data.id] = true;
          console.log('markerAnimations', mainthis.markerAnimations, data.id);
        }
      });
        
      setTimeout(() => {
        this.viewData.map((data: any) => {
          if ( !mainthis.showMarkerWindow[data.id] ) {
            mainthis.showMarkerWindow[data.id] = true;
          }
        });
      }, 100);
    }, 1000);
  }

  changeSortDirection(direction) {
    this.sortDirection = direction;

    this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
        this.sortDirection?.substr(1).toLowerCase())
      : '';
      
    //this.sortShippers();
  }
  
  changeSortCategory(item, column) {
    console.log('changeSortCategory item', item);
    this.activeSortType = item;

    this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
        this.sortDirection?.substr(1).toLowerCase())
      : '';
      
    //this.sortShippers();
  }

  showMoreOptions(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  searchShops(value) {
    console.log('searchShippers searchValue', value);
    this.searchValue = value;
    //if ( this.searchValue.length > 3 ) {
      //this.sortShippers();
    //}
  }
}
