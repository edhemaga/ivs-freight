import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, takeUntil, Observable } from 'rxjs';
import { FuelPurchaseModalComponent } from '../../modals/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';

import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import {
  getFuelStopColumnDefinition,
  getFuelTransactionColumnDefinition,
} from '../../../../../assets/utils/settings/accounting-fuel-columns';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { AfterViewInit } from '@angular/core';
import { tableSearch } from 'src/app/core/utils/methods.globals';
import { FuelStopModalComponent } from '../../modals/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { FuelState } from '../state/fule-state/fuel-state.store';
import { FuelQuery } from '../state/fule-state/fuel-state.query';
import {
  FuelStopListResponse,
  FuelTransactionListResponse,
} from 'appcoretruckassist';

@Component({
  selector: 'app-fuel-table',
  templateUrl: './fuel-table.component.html',
  styleUrls: [
    './fuel-table.component.scss',
    '../../../../../assets/scss/maps.scss',
  ],
  providers: [TaThousandSeparatorPipe],
})
export class FuelTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;

  private destroy$ = new Subject<void>();

  tableOptions: any = {};
  tableData: any[] = [];
  viewData: any[] = [];
  columns: any[] = [];
  selectedTab = 'active';
  activeViewMode: string = 'List';

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

  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  fuelData: FuelTransactionListResponse | FuelStopListResponse;

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    private thousandSeparator: TaThousandSeparatorPipe,
    private fuelQuery: FuelQuery
  ) {}
  ngOnInit(): void {
    this.sendFuelData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.sendFuelData();
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

    // Search
    this.tableService.currentSearchTableData
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          /* this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
          this.backFilterQuery.pageIndex = 1;

          const searchEvent = tableSearch(res, this.backFilterQuery);

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              this.driverBackFilter(searchEvent.query, true);
            } else if (searchEvent.action === 'store') {
              this.sendDriverData();
            }
          } */
        }
      });

    // Delete Selected Rows
    this.tableService.currentDeleteSelectedRows
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        if (response.length) {
          /* let mappedRes = response.map((item) => {
            return {
              id: item.id,
              data: { ...item.tableData, name: item.tableData?.fullName },
            };
          });
          this.modalService.openModal(
            ConfirmationModalComponent,
            { size: 'small' },
            {
              data: null,
              array: mappedRes,
              template: 'driver',
              type: 'multiple delete',
              image: true,
            }
          ); */
        }
      });

    // Fuel Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // On Add Driver Active
        if (res.animation === 'add' && this.selectedTab === 'active') {
          /* this.viewData.push(this.mapDriverData(res.data));

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'add';
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 2300); */
        }
        // On Add Driver Inactive
        else if (res.animation === 'add' && this.selectedTab === 'inactive') {
          /* this.updateDataCount(); */
        }
        // On Update Driver
        else if (res.animation === 'update') {
          /* const updatedDriver = this.mapDriverData(res.data);

          this.viewData = this.viewData.map((driver: any) => {
            if (driver.id === res.id) {
              driver = updatedDriver;
              driver.actionAnimation = 'update';
            }

            return driver;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000); */
        }
        // On Update Driver Status
        else if (res.animation === 'update-status') {
          /* let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation =
                this.selectedTab === 'active' ? 'deactivate' : 'activate';
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 900); */
        }
        // On Delete Driver
        else if (res.animation === 'delete') {
          /* let driverIndex: number;

          this.viewData = this.viewData.map((driver: any, index: number) => {
            if (driver.id === res.id) {
              driver.actionAnimation = 'delete';
              driverIndex = index;
            }

            return driver;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(driverIndex, 1);
            clearInterval(inetval);
          }, 900); */
        }
      });

    // Map
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

  initTableOptions(): void {
    this.tableOptions = {
      toolbarActions: {
        showTimeFilter: this.selectedTab === 'active',
        showTruckFilter: this.selectedTab === 'active',
        showLocationFilter: true,
        showFuelStopFilter: this.selectedTab === 'active',
        showMoneyFilter: true,
        fuelMoneyFilter: true,
        showCategoryFuelFilter: this.selectedTab === 'active',
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

  getGridColumns(configType: string) {
    const tableColumnsConfig = JSON.parse(
      localStorage.getItem(`table-${configType}-Configuration`)
    );

    if (configType === 'FUEL_TRANSACTION') {
      return tableColumnsConfig
        ? tableColumnsConfig
        : getFuelTransactionColumnDefinition();
    } else {
      return tableColumnsConfig
        ? tableColumnsConfig
        : getFuelStopColumnDefinition();
    }
  }

  sendFuelData() {
    this.initTableOptions();

    const fuelCount = JSON.parse(localStorage.getItem('fuelTableCount'));

    this.getTabData();

    this.tableData = [
      {
        title: 'Transactions',
        field: 'active',
        length: fuelCount.fuelTransactions,
        data: this.fuelData,
        gridNameTitle: 'Fuel',
        tableConfiguration: 'FUEL_TRANSACTION',
        isActive: this.selectedTab === 'active',
        gridColumns: this.getGridColumns('FUEL_TRANSACTION'),
      },
      {
        title: 'Stop',
        field: 'inactive',
        length: fuelCount.fuelStops,
        data: this.fuelData,
        gridNameTitle: 'Fuel',
        tableConfiguration: 'FUEL_STOP',
        isActive: this.selectedTab === 'inactive',
        gridColumns: this.getGridColumns('FUEL_STOP'),
      },
    ];

    console.log(this.tableData);

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setFuelData(td);
  }

  getTabData() {
    if (this.selectedTab === 'active') {
      return this.fuelQuery.fuelTransactions$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.fuelData = data.pagination.data;
        });
    } else {
      return this.fuelQuery.fuelStops$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.fuelData = data.pagination.data;
        });
    }
  }

  setFuelData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data) => {
        data.isSelected = false;
        return data;
      });
    } else {
      this.viewData = [];
    }
  }

  onToolBarAction(event: any) {
    if (event.action === 'open-modal') {
      if (this.selectedTab === 'active') {
        this.modalService.openModal(FuelPurchaseModalComponent, {
          size: 'small',
        });
      } else {
        this.modalService.openModal(FuelStopModalComponent, {
          size: 'small',
        });
      }
    } else if (event.action === 'tab-selected') {
      this.selectedTab = event.tabData.field;

      this.sendFuelData();
    } else if (event.action === 'view-mode') {
      this.activeViewMode = event.mode;
    }
  }

  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
       /*  this.backFilterQuery.active = this.selectedTab === 'active' ? 1 : 0;
        this.backFilterQuery.pageIndex = 1;
        this.backFilterQuery.sort = event.direction;

        this.driverBackFilter(this.backFilterQuery); */
      } else {
        this.sendFuelData();
      }
    }
  }

  onTableBodyActions(event: any) {
    if (event.type === 'edit') {
      if (this.selectedTab === 'active') {
        this.modalService.openModal(
          FuelPurchaseModalComponent,
          { size: 'small' },
          {
            ...event,
          }
        );
      } else {
        this.modalService.openModal(
          FuelStopModalComponent,
          {
            size: 'small',
          },
          {
            ...event,
          }
        );
      }
    }
  }

  selectItem(id) {
    this.mapsComponent.clickedMarker(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
