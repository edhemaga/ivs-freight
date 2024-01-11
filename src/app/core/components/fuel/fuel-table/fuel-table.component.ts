import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

//Components
import { FuelPurchaseModalComponent } from '../../modals/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '../../modals/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';

//Services
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

//Utils
import {
    getFuelStopColumnDefinition,
    getFuelTransactionColumnDefinition,
} from '../../../../../assets/utils/settings/accounting-fuel-columns';
import { TableFuel } from 'src/app/core/utils/constants/table-components.constants';

//Pipes
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

//Helpers
import { checkSpecialFilterArray } from 'src/app/core/helpers/dataFilter';

//Models
import { FuelStopListResponse } from '../../../../../../appcoretruckassist/model/fuelStopListResponse';
import { FuelTransactionListResponse } from '../../../../../../appcoretruckassist/model/fuelTransactionListResponse';
import { TableColumnConfig } from '../../shared/model/table-components/all-tables.modal';

//States
import { FuelQuery } from '../state/fule-state/fuel-state.query';

//Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

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
    public fuelTableData: any[] = [];
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;

    public sortTypes: any[] = [];
    public sortDirection: string = ConstantStringTableComponentsEnum.ASC;
    public activeSortType: any = {};
    public sortBy: any;
    public searchValue: string = '';
    public locationFilterOn: boolean = false;

    public fuelPriceColors: string[] = TableFuel.FUEL_PRICE_COLORS;

    public fuelPriceHoverColors: string[] = TableFuel.FUEL_PRICE_HOVER_COLORS;

    public resizeObserver: ResizeObserver;
    public fuelData: FuelTransactionListResponse | FuelStopListResponse;

    public mapListData = [];

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private thousandSeparator: TaThousandSeparatorPipe,
        public datePipe: DatePipe,
        private fuelQuery: FuelQuery,
        private ref: ChangeDetectorRef
    ) {}

    //-------------------------------NG ON INIT-------------------------------
    ngOnInit(): void {
        this.sendFuelData();

        this.resetColumns();

        this.resize();

        this.toggleColumns();

        this.search();

        this.deleteSelectedRows();

        this.fuelActions();

        this.sorting();

        // Map
        this.sortTypes = TableFuel.SORT_TYPES;

        this.activeSortType = this.sortTypes[0];
    }

    //-------------------------------NG AFTER INIT-------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private sorting(): void {
        this.sortBy = this.sortDirection
            ? this.activeSortType.sortName +
              (this.sortDirection[0]?.toUpperCase() +
                  this.sortDirection?.substr(1).toLowerCase())
            : '';
    }

    // Reset Columns
    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendFuelData();
                }
            });
    }

    // Resize
    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((c) => {
                        if (
                            c.title ===
                            response.columns[response.event.index].title
                        ) {
                            c.width = response.event.width;
                        }

                        return c;
                    });
                }
            });
    }

    // Toggle Columns
    private toggleColumns(): void {
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
    }

    // Search
    private search(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filteredArray) {
                    if (res.selectedFilter) {
                        this.viewData = this.fuelTableData;
                        this.viewData = this.viewData?.filter((fuelData) =>
                            res.filteredArray.some(
                                (filterData) => filterData.id == fuelData.id
                            )
                        );
                    }

                    if (!res.selectedFilter) this.viewData = this.fuelTableData;
                }
            });
    }

    // Delete Selected Rows
    private deleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                if (response.length) {
                }
            });
    }

    // Fuel Actions
    private fuelActions(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // On Add Driver Active
                if (
                    res.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                ) {
                }

                // On Add Driver Inactive
                else if (
                    res.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.INACTIVE
                ) {
                }

                // On Update Driver
                else if (
                    res.animation === ConstantStringTableComponentsEnum.UPDATE
                ) {
                }

                // On Update Driver Status
                else if (
                    res.animation ===
                    ConstantStringTableComponentsEnum.UPDATE_STATUS
                ) {
                }

                // On Delete Driver
                else if (
                    res.animation === ConstantStringTableComponentsEnum.DELETE
                ) {
                }
            });
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showTimeFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                showTruckFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                showFuelPermanentlyClosed:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                showLocationFilter: true,
                showFuelStopFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                showMoneyFilter: true,
                fuelMoneyFilter: true,
                showCategoryFuelFilter:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                viewModeOptions: this.getViewModeOptions(),
            },
            actions: [
                {
                    title: ConstantStringTableComponentsEnum.EDIT_2,
                    name: ConstantStringTableComponentsEnum.EDIT,
                    class: ConstantStringTableComponentsEnum.REGULAR_TEXT,
                    contentType: ConstantStringTableComponentsEnum.EDIT,
                    show: true,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    iconName: ConstantStringTableComponentsEnum.EDIT,
                },
                {
                    title: ConstantStringTableComponentsEnum.DELETE_2,
                    name: ConstantStringTableComponentsEnum.DELETE,
                    type: ConstantStringTableComponentsEnum.FUEL_1,
                    text: 'Are you sure you want to delete fuel(s)?',
                    class: ConstantStringTableComponentsEnum.DELETE_TEXT,
                    contentType: ConstantStringTableComponentsEnum.DELETE,
                    show: true,
                    danger: true,
                    svg: 'assets/svg/truckassist-table/dropdown/content/delete.svg',
                    iconName: ConstantStringTableComponentsEnum.DELETE,
                    redIcon: true,
                },
            ],
        };
    }

    getViewModeOptions() {
        return this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
            ? [
                  {
                      name: ConstantStringTableComponentsEnum.LIST,
                      active:
                          this.activeViewMode ===
                          ConstantStringTableComponentsEnum.LIST,
                  },
                  {
                      name: ConstantStringTableComponentsEnum.CARD,
                      active:
                          this.activeViewMode ===
                          ConstantStringTableComponentsEnum.CARD,
                  },
              ]
            : [
                  {
                      name: ConstantStringTableComponentsEnum.LIST,
                      active:
                          this.activeViewMode ===
                          ConstantStringTableComponentsEnum.LIST,
                  },
                  {
                      name: ConstantStringTableComponentsEnum.CARD,
                      active:
                          this.activeViewMode ===
                          ConstantStringTableComponentsEnum.CARD,
                  },
                  {
                      name: ConstantStringTableComponentsEnum.MAP,
                      active:
                          this.activeViewMode ===
                          ConstantStringTableComponentsEnum.MAP,
                  },
              ];
    }

    sendFuelData() {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.FUEL_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        this.checkActiveViewMode();

        const fuelCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.FUEL_TABLE_COUNT
            )
        );

        this.getTabData();

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.TRANSACTIONS,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: fuelCount.fuelTransactions,
                data: this.fuelData,
                gridNameTitle: ConstantStringTableComponentsEnum.FUEL,
                fuelArray: checkSpecialFilterArray(
                    this.fuelData,
                    ConstantStringTableComponentsEnum.ARHIVED_DATA
                ),
                tableConfiguration:
                    ConstantStringTableComponentsEnum.FUEL_TRANSACTION,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.FUEL_TRANSACTION
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.STOP,
                field: ConstantStringTableComponentsEnum.INACTIVE,
                length: fuelCount.fuelStops,
                data: this.fuelData,
                gridNameTitle: ConstantStringTableComponentsEnum.FUEL,
                closedArray: checkSpecialFilterArray(
                    this.fuelData,
                    ConstantStringTableComponentsEnum.IS_CLOSED
                ),
                tableConfiguration: ConstantStringTableComponentsEnum.FUEL_STOP,
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.FUEL_STOP
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setFuelData(td);
    }

    // Check If Selected Tab Has Active View Mode
    checkActiveViewMode() {
        if (this.activeViewMode === ConstantStringTableComponentsEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode: any) => {
                if (viewMode.name === ConstantStringTableComponentsEnum.MAP) {
                    hasMapView = true;
                }
            });

            if (!hasMapView) {
                this.activeViewMode = ConstantStringTableComponentsEnum.LIST;

                viewModeOptions = this.getViewModeOptions();
            }

            this.tableOptions.toolbarActions.viewModeOptions = [
                ...viewModeOptions,
            ];
        }
    }

    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (configType === ConstantStringTableComponentsEnum.FUEL_TRANSACTION) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getFuelTransactionColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getFuelStopColumnDefinition();
        }
    }

    getTabData() {
        if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
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
            this.viewData = [...td.data];

            this.mapListData = JSON.parse(JSON.stringify(this.viewData));

            this.viewData = this.viewData.map((data) => {
                return this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE
                    ? this.mapFuelTransactionsData(data)
                    : this.mapFuelStopsData(data);
            });
        } else {
            this.viewData = [];
        }

        this.fuelTableData = this.viewData;
    }

    mapFuelTransactionsData(data: any) {
        return {
            ...data,
            isSelected: false,
            tableTruckNumber: data?.truck?.truckNumber
                ? data.truck.truckNumber
                : '',
            tableDriverName:
                data?.driver?.firstName || data?.driver?.lastName
                    ? data.driver.firstName + ' ' + data.driver.lastName
                    : '',
            tableFuelCardNumber: data?.fuelCard?.cardNumber
                ? data.fuelCard.cardNumber
                : '',
            tableTransactionDate: data?.transactionDate
                ? this.datePipe.transform(data.transactionDate, 'MM/dd/yy')
                : '',
            tableTransactionTime: 'Treba da se poveze',
            tableFuelStopName: data?.fuelStopStore?.businessName
                ? data.fuelStopStore.businessName
                : '',
            tableLocation: data?.fuelStopStore?.address?.address
                ? data.fuelStopStore.address.address
                : '',
            fuelTableItem: data?.fuelItems
                ? data.fuelItems
                      .map((item) => item.category?.trim())
                      .join(
                          '<div class="description-dot-container"><span class="description-dot"></span></div>'
                      )
                : null,
            descriptionItems: data?.fuelItems
                ? data.fuelItems.map((item) => {
                      return {
                          ...item,
                          descriptionPrice: item?.price
                              ? '$' +
                                this.thousandSeparator.transform(item.price)
                              : '',
                          descriptionTotalPrice: item?.subtotal
                              ? '$' +
                                this.thousandSeparator.transform(item.subtotal)
                              : '',
                          pmDescription: null,
                      };
                  })
                : null,
            tableQTY: 'Treba da se pogleda gde je property',
            tbalePPG: 'Treba da se pogleda gde je property',
            tabelDescriptionDropTotal: data?.total
                ? '$' + this.thousandSeparator.transform(data.total)
                : '',
            tableTotal: data?.total
                ? '$ ' + this.thousandSeparator.transform(data.total)
                : '',
        };
    }

    mapFuelStopsData(data: any) {
        return {
            ...data,
            isSelected: false,
            tableName: data?.fuelStopFranchise?.businessName
                ? data.fuelStopFranchise.businessName
                : '',
            tableStore: data?.store ? data.store : '',
            tableAddress: data?.address?.address ? data.address.address : '',
            tablePPG: data?.pricePerGallon ? data.pricePerGallon : '',
            tableLast: data?.fuelStopExtensions[0]?.totalCost
                ? data.fuelStopExtensions[0].totalCost
                : '',
            tableUsed: data?.fuelStopExtensions[0]?.lastUsed
                ? data.fuelStopExtensions[0].lastUsed
                : '',
            tableTotalCost:
                'Nema propery ili treba da se mapira iz fuelStopExtensions',
            isFavorite: data.fuelStopExtensions[0].favourite,
        };
    }

    onToolBarAction(event: any) {
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.modalService.openModal(FuelPurchaseModalComponent, {
                    size: ConstantStringTableComponentsEnum.SMALL,
                });
            } else {
                this.modalService.openModal(FuelStopModalComponent, {
                    size: ConstantStringTableComponentsEnum.SMALL,
                });
            }
        } else if (
            event.action === ConstantStringTableComponentsEnum.TAB_SELECTED
        ) {
            this.selectedTab = event.tabData.field;
            this.sendFuelData();
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == ConstantStringTableComponentsEnum.MAP;
        }
    }

    onTableHeadActions(event: any) {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
            if (event.direction) {
            } else {
                this.sendFuelData();
            }
        }
    }

    onTableBodyActions(event: any) {
        if (event.type === ConstantStringTableComponentsEnum.EDIT) {
            if (this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE) {
                this.modalService.openModal(
                    FuelPurchaseModalComponent,
                    { size: ConstantStringTableComponentsEnum.SMALL },
                    {
                        ...event,
                    }
                );
            } else {
                this.modalService.openModal(
                    FuelStopModalComponent,
                    {
                        size: ConstantStringTableComponentsEnum.SMALL,
                    },
                    {
                        ...event,
                    }
                );
            }
        }
    }

    selectItem(data: any) {
        this.mapsComponent.clickedMarker(data[0]);

        this.mapListData.map((item) => {
            if (item.id == data[0]) {
                let itemIndex = this.mapsComponent.viewData.findIndex(
                    (item2) => item2.id === item.id
                );

                if (
                    itemIndex > -1 &&
                    this.mapsComponent.viewData[itemIndex].showMarker
                ) {
                    item.isSelected =
                        this.mapsComponent.viewData[itemIndex].isSelected;
                } else {
                    this.mapsComponent.clusterMarkers.map((cluster) => {
                        var clusterData = cluster.pagination.data;

                        let clusterItemIndex = clusterData.findIndex(
                            (item2) => item2.id === data[0]
                        );

                        if (clusterItemIndex > -1) {
                            if (!data[1]) {
                                if (
                                    !cluster.isSelected ||
                                    (cluster.isSelected &&
                                        cluster.detailedInfo?.id == data[0])
                                ) {
                                    this.mapsComponent.clickedCluster(cluster);
                                }

                                if (cluster.isSelected) {
                                    this.mapsComponent.showClusterItemInfo([
                                        cluster,
                                        clusterData[clusterItemIndex],
                                    ]);
                                }
                            }

                            item.isSelected = cluster.isSelected;
                        }
                    });
                }
            }
        });
    }

    updateMapList(mapListResponse) {
        var newMapList = mapListResponse.pagination.data;
        var listChanged = false;
        var addData = mapListResponse.addData ? true : false;

        if (!addData) {
            for (var i = 0; i < this.mapListData.length; i++) {
                let item = this.mapListData[i];

                let itemIndex = newMapList.findIndex(
                    (item2) => item2.id === item.id
                );

                if (itemIndex == -1) {
                    this.mapListData.splice(i, 1);
                    listChanged = true;
                    i--;
                }
            }
        }

        for (var b = 0; b < newMapList.length; b++) {
            let item = newMapList[b];

            let itemIndex = this.mapListData.findIndex(
                (item2) => item2.id === item.id
            );

            if (itemIndex == -1) {
                if (addData) {
                    this.mapListData.push(item);
                } else {
                    this.mapListData.splice(b, 0, item);
                    listChanged = true;
                    b--;
                }
            }
        }

        if (listChanged || mapListResponse.changedSort) {
            if (mapListResponse.changedSort)
                this.mapListData = mapListResponse.pagination.data;
            this.ref.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
