import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuelPurchaseModalComponent } from '../../modals/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';

import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { getAccountingFuelColumnDefinition } from '../../../../../assets/utils/settings/accounting-fuel-columns';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

@Component({
  selector: 'app-fuel-table',
  templateUrl: './fuel-table.component.html',
  styleUrls: [
    './fuel-table.component.scss',
    '../../../../../assets/scss/maps.scss',
  ],
  providers: [TaThousandSeparatorPipe],
})
export class FuelTableComponent implements OnInit, OnDestroy {
  @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;

  private destroy$ = new Subject<void>();

  tableOptions: any = {};
  tableData: any[] = [];
  viewData: any[] = [];
  columns: any[] = [];
  selectedTab = 'active';
  activeViewMode: string = 'List';
  resetColumns: boolean;

  sortTypes: any[] = [];
  sortDirection: string = 'asc';
  activeSortType: any = {};
  sortBy: any;
  searchValue: string = '';
  locationFilterOn: boolean = false;

  fuelPriceColors: any[] = [
    '#4CAF4F',
    '#8AC34A',
    '#FEC107',
    '#FF9800',
    '#EF5350',
    '#919191',
  ];

  fuelPriceHoverColors: any[] = [
    '#43A047',
    '#7CB242',
    '#FFB300',
    '#FB8C00',
    '#F34235',
    '#6C6C6C',
  ];

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private thousandSeparator: TaThousandSeparatorPipe
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.sendFuelData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendFuelData();
        }
      });

    this.sortTypes = [
      { name: 'Business Name', id: 1, sortName: 'name' },
      { name: 'Location', id: 2, sortName: 'location', isHidden: true },
      { name: 'Favorites', id: 8, sortName: 'favorites' },
      { name: 'Fuel Price', id: 9, sortName: 'fuelPrice' },
      { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
      { name: 'Purchase', id: 6, sortName: 'purchase' },
      { name: 'Total Cost', id: 7, sortName: 'cost' },
    ];

    this.activeSortType = this.sortTypes[0];

    this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
          this.sortDirection?.substr(1).toLowerCase())
      : '';
  }

  initTableOptions(): void {
    this.tableOptions = {
      toolbarActions: {
        showTimeFilter: this.selectedTab === 'active',
        showTruckFilter: this.selectedTab === 'active',
        showLocationFilter: true,
        showFuelStopFilter: this.selectedTab === 'active',
        showMoneyFilter: true,
        showCategoryFilter: this.selectedTab === 'active',
        viewModeOptions: this.getViewModeOptions(),
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
          show: true,
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
        },
        {
          title: 'Delete',
          name: 'delete',
          type: 'fuel',
          text: 'Are you sure you want to delete fuel(s)?',
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

  sendFuelData() {
    this.initTableOptions();
    
    this.tableData = [
      {
        title: 'Transactions',
        field: 'active',
        length: 8,
        data: this.getDumyData(8),
        gridNameTitle: 'Fuel',
        gridColumns: this.getGridColumns('fuel', this.resetColumns),
      },
      {
        title: 'Stop',
        field: 'inactive',
        length: 3,
        data: this.getDumyData(3),
        gridNameTitle: 'Fuel',
        gridColumns: this.getGridColumns('fuel', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setFuelData(td);
  }

  getGridColumns(stateName: string, resetColumns: boolean) {
    const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );

    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getAccountingFuelColumnDefinition();
    }
  }

  setFuelData(td: any) {
    this.viewData = td.data;
    this.columns = td.gridColumns;

    this.viewData = this.viewData.map((data) => {
      data.isSelected = false;
      return data;
    });
  }

  fuelItemsDumyData = [
    {
      categoryId: 911,
      category: 'Refeer',
      qty: 29.18,
      unit: null,
      price: 4.81,
      subtotal: 140.41,
    },
    {
      categoryId: 907,
      category: 'Diesel',
      qty: 48.09,
      unit: null,
      price: 4.81,
      subtotal: 231.4,
    },
  ];

  getDumyData(numberOfCopy: number) {
    let data: any[] = [
      {
        address: {
          address: '1 International Square, Kansas City, MO 64153, USA',
          addressUnit: null,
          city: 'Kansas City',
          country: 'US',
          state: 'MO',
          stateShortName: 'MO',
          street: 'International Square',
          streetNumber: '1',
          zipCode: '64153',
        },
        api: 1,
        apiTransactionId: 979637489,
        fuelTableItem: this.fuelItemsDumyData
          .map((item) => item.category?.trim())
          .join(
            '<div class="description-dot-container"><span class="description-dot"></span></div>'
          ),
        descriptionItems: this.fuelItemsDumyData.map((item) => {
          return {
            ...item,
            description: 'Test',
            descriptionPrice: item?.price
              ? '$' + this.thousandSeparator.transform(item.price)
              : '',
            descriptionTotalPrice: item?.subtotal
              ? '$' + this.thousandSeparator.transform(item.subtotal)
              : '',
            pmDescription: null,
          };
        }),
        companyId: 1,
        companyName: 'Test Company',
        createdAt: '2022-03-24T00:10:11',
        doc: null,
        driverFullName: 'Jamarcus Cobb',
        driverId: 406,
        fuelItems: [
          {
            categoryId: 911,
            category: 'Refeer',
            qty: 29.18,
            unit: null,
            price: 4.81,
            subtotal: 140.41,
          },
          {
            categoryId: 907,
            category: 'Diesel',
            qty: 48.09,
            unit: null,
            price: 4.81,
            subtotal: 231.4,
          },
        ],
        guid: 'b5821a68-4673-4540-8c1f-de64025568a7',
        id: 2683,
        items: 'Refeer<div class="description-dot"></div>Diesel',
        invoice: '0091585',
        location: 'SANFORD, NC',
        latitude: 41.860119,
        longitude: -79.2168734,
        name: 'CIRCLE K #2723778',
        supplierId: 106235,
        supplierName: null,
        timezoneOffset: -5,
        cardNumber: '7083052138884300041',
        transactionDate: '03/23/22',
        transactionTime: '10:49 PM',
        truckId: 200,
        truckNumber: '1419',
        updatedAt: '2022-03-24T00:10:11',
        qty: '77.27',
        total: 371.81,
      },
    ];

    for (let i = 0; i < numberOfCopy; i++) {
      data.push(data[0]);
    }

    return data;
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      this.modalService.openModal(FuelPurchaseModalComponent, {
        size: 'small',
      });
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.sendFuelData();
    } else if (event.action === 'view-mode') {
      this.activeViewMode = event.mode;
    }
  }

  public onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      this.modalService.openModal(
        FuelPurchaseModalComponent,
        { size: 'small' },
        {
          ...event,
        }
      );
    }
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

  changeSortCategory(item) {
    this.activeSortType = item;

    this.sortBy = this.sortDirection
      ? this.activeSortType.sortName +
        (this.sortDirection[0]?.toUpperCase() +
          this.sortDirection?.substr(1).toLowerCase())
      : '';

    //this.sortShippers();
  }

  searchStops(value) {
    this.searchValue = value;
    //if ( this.searchValue.length > 3 ) {
    //this.sortShippers();
    //}
  }

  selectItem(id) {
    this.mapsComponent.clickedMarker(id);
  }
}
