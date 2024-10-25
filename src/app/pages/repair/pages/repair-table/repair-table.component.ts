import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { forkJoin, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// services
import { RepairService } from '@shared/services/repair.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';
import { MapsService } from '@shared/services/maps.service';
import { RepairCardsModalService } from '@pages/repair/pages/repair-card-modal/services/repair-cards-modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import {
    CaMapComponent,
    CaSearchMultipleStatesService,
    ICaMapProps,
} from 'ca-components';

// store
import { RepairShopQuery } from '@pages/repair/state/repair-shop-state/repair-shop.query';
import { RepairShopState } from '@pages/repair/state/repair-shop-state/repair-shop.store';

import { RepairTruckState } from '@pages/repair/state/repair-truck-state/repair-truck.store';
import { RepairTruckQuery } from '@pages/repair/state/repair-truck-state/repair-truck.query';

import { RepairTrailerQuery } from '@pages/repair/state/repair-trailer-state/repair-trailer.query';

import {
    RepairTrailerState,
    RepairTrailerStore,
} from '@pages/repair/state/repair-trailer-state/repair-trailer.store';

import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectInactiveTabCards,
    selectRepairShopTabCards,
} from '@pages/repair/pages/repair-card-modal/state/repair-card-modal.selectors';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { RepairTableStringEnum } from '@pages/repair/pages/repair-table/enums/repair-table-string.enum';
import { TableActionsStringEnum } from '@shared/enums/table-actions-string.enum';

// constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { RepairCardConfigConstants } from '@pages/repair/utils/constants/repair-card-config.constants';
import { RepairConfiguration } from '@pages/repair/pages/repair-table/utils/constants/repair-configuration.constants';
import { MapConstants } from '@shared/utils/constants/map.constants';
import { RepairShopMapConfig } from '@pages/repair/pages/repair-table/utils/constants/repair-shop-map.config';

// helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';

// settings
import {
    getRepairTruckAndTrailerColumnDefinition,
    getRepairsShopColumnDefinition,
} from '@shared/utils/settings/table-settings/repair-columns';

// models
import { ShopBackFilter } from '@pages/repair/pages/repair-table/models/shop-back-filter.model';
import { MappedTruckTrailer } from '@pages/repair/pages/repair-table/models/mapped-truck-trailer.model';
import { MapList } from '@pages/repair/pages/repair-table/models/map-list.model';
import { ShopBackFilterQuery } from '@pages/repair/pages/repair-table/models/shop-back-filter-query.model';
import { RepairBackFilter } from '@pages/repair/pages/repair-table/models/repair-back-filter.model';
import { RepairBodyResponse } from '@pages/repair/pages/repair-table/models/repair-body-response.model';
import { RepairListResponse, RepairResponse } from 'appcoretruckassist';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';

// helpers
import { RepairTableHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table.helper';
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-date-formater.helper';
import { RepairTableBackFilterDataHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-back-filter-data.helper';
import { RepairShopMapMarkersHelper } from './utils/helpers/repair-shop-map-markers.helper';

@Component({
    selector: 'app-repair-table',
    templateUrl: './repair-table.component.html',
    styleUrls: [
        './repair-table.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    providers: [ThousandSeparatorPipe],
})
export class RepairTableComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$ = new Subject<void>();
    @ViewChild('mapsComponent', { static: false })
    public mapsComponent: CaMapComponent;
    public reapirTableData: any[] = [];

    public tableOptions;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];
    public selectedTab: TableStringEnum | string = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
    public repairTrucks: RepairTruckState[] = [];
    public repairTrailers: RepairTrailerState[] = [];
    public repairShops: RepairShopState[] = [];
    public resizeObserver: ResizeObserver;
    public inactiveTabClicked: boolean = false;
    public repairShopTabClicked: boolean = false;
    public activeTableData: string;
    public backFilterQuery: RepairBackFilter =
        RepairTableBackFilterDataHelper.backRepairFilterData();

    public shopFilterQuery: ShopBackFilterQuery =
        TableDropdownComponentConstants.SHOP_FILTER_QUERY;

    public displayRowsFront: CardRows[] =
        RepairConfiguration.displayRowsFrontActive;
    public displayRowsBack: CardRows[] =
        RepairConfiguration.displayRowsBackActive;

    public mapListData: MapList[] = [];

    //Data to display from model Truck
    public displayRowsFrontTruck: CardRows[] =
        RepairCardConfigConstants.displayRowsFrontTruck;
    public displayRowsBackTruck: CardRows[] =
        RepairCardConfigConstants.displayRowsBackTruck;

    // Data to display from model Trailer
    public displayRowsFrontTrailer: CardRows[] =
        RepairCardConfigConstants.displayRowsFrontTruck;
    public displayRowsBackTrailer: CardRows[] =
        RepairCardConfigConstants.displayRowsBackTruck;

    // Data to display from model Trailer
    public displayRowsFrontRepairShop: CardRows[] =
        RepairCardConfigConstants.displayRowsFrontRepairShop;
    public displayRowsBackRepairShop: CardRows[] =
        RepairCardConfigConstants.displayRowsBackRepairShop;

    //Title
    public cardTitle: string = TableStringEnum.TRUCK_TRUCK_NUMBER;

    // Page
    public page: string = RepairCardConfigConstants.page;

    //  Number of rows in card
    public rows: number = RepairCardConfigConstants.rows;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    public displayRows$: Observable<any>; //leave this as any for now

    public mapData: ICaMapProps = RepairShopMapConfig.repairShopMapConfig;

    constructor(
        // Router
        public router: Router,

        // Services
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private repairService: RepairService,
        private reviewRatingService: ReviewsRatingService,
        private mapsService: MapsService,
        private confiramtionService: ConfirmationService,
        private repairCardsModalService: RepairCardsModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        // Store
        private repairShopQuery: RepairShopQuery,
        private repairTruckQuery: RepairTruckQuery,
        private repairTrailerQuery: RepairTrailerQuery,
        private repairTrailerStore: RepairTrailerStore,
        private store: Store,

        // Pipes
        public datePipe: DatePipe,
        private thousandSeparator: ThousandSeparatorPipe,

        // Ref
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.sendRepairData();

        this.setTableFilter();

        this.resetColumns();

        this.switchSelected();

        this.resize();

        this.toggleColumns();

        this.search();

        this.repair();

        this.getSelectedTabTableData();

        this.confirmationSubscribe();

        this.deleteSelectedRows();

        if (this.selectedTab === TableStringEnum.REPAIR_SHOP) this.getMapData();
    }

    // TODO - Add to store logic
    private confirmationSubscribe(): void {
        this.confiramtionService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (res.type === TableStringEnum.MULTIPLE_DELETE) {
                        if (this.selectedTab === TableStringEnum.REPAIR_SHOP) {
                            this.repairService
                                .deleteRepairShopList(res.array)
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: () => {
                                        this.viewData = this.viewData.map(
                                            (repair) => {
                                                res.array.map((id) => {
                                                    if (repair.id === id)
                                                        repair.actionAnimation =
                                                            TableActionsStringEnum.DELETE_MULTIPLE;
                                                });

                                                return repair;
                                            }
                                        );

                                        // Remove deleted shop from view
                                        this.viewData = this.viewData.filter(
                                            (data) =>
                                                !res.array.includes(data.id)
                                        );
                                        this.updateDataCount();

                                        const interval = setInterval(() => {
                                            this.viewData =
                                                MethodsGlobalHelper.closeAnimationAction(
                                                    true,
                                                    this.viewData
                                                );

                                            clearInterval(interval);
                                        }, 900);

                                        this.tableService.sendRowsSelected([]);
                                        this.tableService.sendResetSelectedColumns(
                                            true
                                        );
                                    },
                                    error: () => {},
                                });
                        } else {
                            this.repairService
                                .deleteRepairList(res.array, this.selectedTab)
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: () => {
                                        this.viewData = this.viewData.map(
                                            (repair) => {
                                                res.array.map((id) => {
                                                    if (repair.id === id)
                                                        repair.actionAnimation =
                                                            TableActionsStringEnum.DELETE_MULTIPLE;
                                                });

                                                return repair;
                                            }
                                        );

                                        this.updateDataCount();

                                        const interval = setInterval(() => {
                                            this.viewData =
                                                MethodsGlobalHelper.closeAnimationAction(
                                                    true,
                                                    this.viewData
                                                );

                                            clearInterval(interval);
                                        }, 900);

                                        this.tableService.sendRowsSelected([]);
                                        this.tableService.sendResetSelectedColumns(
                                            true
                                        );
                                    },
                                    error: () => {},
                                });
                        }
                    } else if (res.type === TableStringEnum.DELETE) {
                        if (this.selectedTab === TableStringEnum.REPAIR_SHOP) {
                            const repairShopId = res.array?.[0]?.id ?? res.id;

                            this.repairService
                                .deleteRepairShopById(repairShopId)
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: () => {
                                        // Remove deleted shop from view
                                        this.viewData = this.viewData.filter(
                                            (data) => data.id !== repairShopId
                                        );
                                        this.updateDataCount();
                                        if (res.array?.length) {
                                            this.tableService.sendRowsSelected(
                                                []
                                            );
                                            this.tableService.sendResetSelectedColumns(
                                                true
                                            );
                                        }
                                    },
                                    error: () => {},
                                });
                        } else {
                            const repairId = res.array?.[0]?.id ?? res.id;

                            this.repairService
                                .deleteRepairById(repairId, this.selectedTab)
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: () => {
                                        this.updateDataCount();

                                        if (res.array?.length) {
                                            this.tableService.sendRowsSelected(
                                                []
                                            );
                                            this.tableService.sendResetSelectedColumns(
                                                true
                                            );
                                        }
                                    },
                                    error: () => {},
                                });
                        }
                    }
                }
            });

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.changeRepairShopStatus(res.data);
                }
            });
    }

    public changeRepairShopStatus(data): void {
        this.repairService.changeShopStatus(data.id);
        const updatedStore = this.viewData.findIndex(
            (item) => item.id === data.id
        );
        if (updatedStore !== -1) {
            const store = this.viewData[updatedStore];
            store.status = store.status === 0 ? 1 : 0;
            store.tableDropdownContent.content =
                this.getShopDropdownContent(data);
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    // Reset Columns
    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) {
                    this.sendRepairData();
                }
            });
    }

    public setTableFilter() {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (res.queryParams?.length) {
                        switch (res.filterType) {
                            case RepairTableStringEnum.CATEGORY_REPAIR_FILTER:
                                this.backFilterQuery.categoryIds =
                                    res.queryParams;
                                this.repairBackFilter(this.backFilterQuery);

                                break;
                            case RepairTableStringEnum.PM_FILTER:
                                this.backFilterQuery.pmTruckTitles =
                                    res.queryParams;
                                this.repairBackFilter(this.backFilterQuery);

                                break;
                            case RepairTableStringEnum.TRAILER_TYPE_FILTER:
                                this.backFilterQuery.trailerNumbers =
                                    res.queryParams;
                                this.repairBackFilter(this.backFilterQuery);

                                break;
                            case RepairTableStringEnum.TRUCK_TYPE_FILTER:
                                this.backFilterQuery.truckNumbers =
                                    res.queryParams;
                                this.repairBackFilter(this.backFilterQuery);

                                break;
                            case RepairTableStringEnum.TIME_FILTER:
                                const { fromDate, toDate } =
                                    RepairTableDateFormaterHelper.getDateRange(
                                        res.queryParams?.timeSelected
                                    );
                                this.backFilterQuery.dateTo = toDate;
                                this.backFilterQuery.dateFrom = fromDate;

                                this.repairBackFilter(this.backFilterQuery);

                                break;
                            case RepairTableStringEnum.MONEY_FILTER:
                                this.backFilterQuery.costFrom =
                                    res.queryParams?.singleFrom;
                                this.backFilterQuery.costTo =
                                    res.queryParams?.singleTo;

                                this.repairBackFilter(this.backFilterQuery);

                                break;
                            default:
                                this.sendRepairData();
                                break;
                        }
                    } else this.sendRepairData();

                    if (res?.filteredArray) {
                        if (res.selectedFilter) {
                            this.viewData = this.reapirTableData?.filter(
                                (repairData) =>
                                    res.filteredArray.some(
                                        (filterData) =>
                                            filterData.id === repairData.id
                                    )
                            );
                        }

                        if (!res.selectedFilter) this.sendRepairData();
                    }
                }
            });
    }

    // Switch Selected
    private switchSelected(): void {
        this.tableService.currentSwitchOptionSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    if (res.switchType === TableStringEnum.PM_2) {
                        this.router.navigate([TableStringEnum.PM]);
                    }
                }
            });
    }

    // Resize
    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((col) => {
                        if (
                            col.title ===
                            response.columns[response.event.index].title
                        ) {
                            col.width = response.event.width;
                        }

                        return col;
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

    private search(): void {
        // Search
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backFilterQuery.pageIndex = 1;
                    this.shopFilterQuery.pageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.selectedTab !== TableStringEnum.REPAIR_SHOP
                            ? this.backFilterQuery
                            : this.shopFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            if (
                                this.selectedTab !== TableStringEnum.REPAIR_SHOP
                            ) {
                                this.backFilterQuery.unitType =
                                    this.selectedTab === TableStringEnum.ACTIVE
                                        ? 1
                                        : 2;

                                this.repairBackFilter(this.backFilterQuery);
                            } else {
                                this.shopBackFilter(this.shopFilterQuery);
                            }
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.sendRepairData();
                        }
                    }
                }
            });
    }

    // Repair Actions
    private repair(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // - added any because res.data is throwing an error
                this.updateDataCount();

                // On Add Repair
                if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === res.tab
                ) {
                    this.viewData.push(
                        res.tab !== TableStringEnum.REPAIR_SHOP
                            ? this.mapTruckAndTrailerData(res.data)
                            : this.mapShopData(res.data)
                    );

                    this.viewData = this.viewData.map((repair) => {
                        if (repair.id === res.id) {
                            repair.actionAnimation = TableStringEnum.ADD;
                        }

                        return repair;
                    });

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 2300);
                }
                // On Update Repair
                else if (
                    res?.animation === TableStringEnum.UPDATE &&
                    this.selectedTab === res.tab
                ) {
                    const updatedRepair =
                        res.tab !== TableStringEnum.REPAIR_SHOP
                            ? this.mapTruckAndTrailerData(res.data)
                            : this.mapShopData(res.data);

                    this.viewData = this.viewData.map((repair) => {
                        if (repair.id === res.id) {
                            repair = updatedRepair;
                            repair.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return repair;
                    });

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 1000);
                }
                // On Delete Repair
                else if (
                    res?.animation === TableStringEnum.DELETE &&
                    this.selectedTab === res.tab
                ) {
                    let repairIndex: number;

                    this.viewData = this.viewData.map(
                        (repair, index: number) => {
                            if (repair.id === res.id) {
                                repair.actionAnimation = TableStringEnum.DELETE;
                                repairIndex = index;
                            }

                            return repair;
                        }
                    );

                    this.ref.detectChanges();

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(repairIndex, 1);
                        clearInterval(inetval);
                    }, 900);
                }
            });
    }

    // Observ Table Container
    private observTableContainer(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    // Repair Table Options
    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showRepairShop:
                    this.selectedTab === TableStringEnum.REPAIR_SHOP,
                showTimeFilter:
                    this.selectedTab !== TableStringEnum.REPAIR_SHOP,
                showRepairOrderFilter:
                    this.selectedTab !== TableStringEnum.REPAIR_SHOP,
                showPMFilter: this.selectedTab !== TableStringEnum.REPAIR_SHOP,
                showCategoryRepairFilter: true,
                showMoneyFilter: true,
                hideMoneySubType: true,
                hideActivationButton: true,
                showTruckPmFilter: this.selectedTab === TableStringEnum.ACTIVE,
                showTrailerPmFilter:
                    this.selectedTab === TableStringEnum.INACTIVE,
                showMoneyCount:
                    this.selectedTab !== TableStringEnum.REPAIR_SHOP,
                viewModeOptions: this.getViewModeOptions(),
            },
        };
    }

    // Get View Mode Options
    private getViewModeOptions(): {
        name: TableStringEnum;
        active: boolean;
    }[] {
        return this.selectedTab === TableStringEnum.REPAIR_SHOP
            ? [
                  {
                      name: TableStringEnum.LIST,
                      active: this.activeViewMode === TableStringEnum.LIST,
                  },
                  {
                      name: TableStringEnum.CARD,
                      active: this.activeViewMode === TableStringEnum.CARD,
                  },
                  {
                      name: TableStringEnum.MAP,
                      active: this.activeViewMode === TableStringEnum.MAP,
                  },
              ]
            : [
                  {
                      name: TableStringEnum.LIST,
                      active: this.activeViewMode === TableStringEnum.LIST,
                  },
                  {
                      name: TableStringEnum.CARD,
                      active: this.activeViewMode === TableStringEnum.CARD,
                  },
              ];
    }

    // Send Repair Data
    private sendRepairData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.REPAIR_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        this.checkActiveViewMode();

        const repairTruckTrailerCount = JSON.parse(
            localStorage.getItem(
                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
            )
        );
        this.backFilterQuery.unitType =
            this.selectedTab === TableStringEnum.INACTIVE ? 2 : 1;

        const repairTruckData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const repairTrailerData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        const repairShopData =
            this.selectedTab === TableStringEnum.REPAIR_SHOP
                ? this.getTabData(TableStringEnum.REPAIR_SHOP)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.TRUCK_2,
                field: TableStringEnum.ACTIVE,
                length: repairTruckTrailerCount.repairTrucks,
                moneyCount: 0,
                moneyCountSelected: false,
                data: repairTruckData,
                gridNameTitle: TableStringEnum.REPAIR,
                repairArray: DataFilterHelper.checkSpecialFilterArray(
                    repairTruckData,
                    TableStringEnum.ORDER_2,
                    TableStringEnum.REPAIR_TYPE
                ),
                stateName: 'repair_trucks',
                tableConfiguration: TableStringEnum.REPAIR_TRUCK,
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.REPAIR_TRUCK),
            },
            {
                title: TableStringEnum.TRAILER,
                field: TableStringEnum.INACTIVE,
                length: repairTruckTrailerCount.repairTrailers,
                moneyCount: 0,
                moneyCountSelected: false,
                data: repairTrailerData,
                gridNameTitle: TableStringEnum.REPAIR,
                repairArray: DataFilterHelper.checkSpecialFilterArray(
                    repairTrailerData,
                    TableStringEnum.ORDER_2,
                    TableStringEnum.REPAIR_TYPE
                ),
                stateName: 'repair_trailers',
                tableConfiguration: TableStringEnum.REPAIR_TRAILER,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getGridColumns(
                    TableStringEnum.REPAIR_TRAILER
                ),
            },
            {
                title: TableStringEnum.SHOP,
                field: TableStringEnum.REPAIR_SHOP,
                length: repairTruckTrailerCount.repairShops,
                data: repairShopData,
                gridNameTitle: TableStringEnum.REPAIR,
                stateName: 'repair_shops',
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    repairShopData,
                    TableStringEnum.IS_CLOSED
                ),
                tableConfiguration: 'REPAIR_SHOP',
                isActive: this.selectedTab === TableStringEnum.REPAIR_SHOP,
                gridColumns: this.getGridColumns('REPAIR_SHOP'),
                //inactive: true,
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setRepairData(td);
        this.updateCardView();

        if (this.selectedTab === TableStringEnum.REPAIR_SHOP) this.getMapData();
    }

    // Check If Selected Tab Has Active View Mode
    private checkActiveViewMode(): void {
        if (this.activeViewMode === TableStringEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.map((viewMode) => {
                if (viewMode.name === TableStringEnum.MAP) {
                    hasMapView = true;
                }
            });

            if (!hasMapView) {
                this.activeViewMode = TableStringEnum.LIST;

                viewModeOptions = this.getViewModeOptions();
            }

            this.tableOptions.toolbarActions.viewModeOptions = [
                ...viewModeOptions,
            ];
        }
    }

    // Get Tab Data From Store Or Via Api
    private getTabData(dataType: string): RepairTruckState[] {
        if (dataType === TableStringEnum.ACTIVE) {
            this.repairTrucks = this.repairTruckQuery.getAll();

            return this.repairTrucks?.length ? this.repairTrucks : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.repairTrailers = this.repairTrailerQuery.getAll();

            return this.repairTrailers?.length ? this.repairTrailers : [];
        } else if (dataType === TableStringEnum.REPAIR_SHOP) {
            this.repairShopTabClicked = true;

            this.repairShops = this.repairShopQuery.getAll();

            return this.repairShops?.length ? this.repairShops : [];
        }
    }

    // Get Repair Columns
    private getGridColumns(configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (
            configType === TableStringEnum.REPAIR_TRUCK ||
            configType === TableStringEnum.REPAIR_TRAILER
        ) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getRepairTruckAndTrailerColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getRepairsShopColumnDefinition();
        }
    }

    // Set Repair Data
    private setRepairData(tdata: CardTableData): void {
        this.columns = tdata.gridColumns;

        if (tdata.data.length) {
            this.viewData = tdata.data;

            this.viewData = this.viewData.map((data) => {
                if (
                    this.selectedTab === TableStringEnum.ACTIVE ||
                    this.selectedTab === TableStringEnum.INACTIVE
                ) {
                    switch (this.selectedTab) {
                        case TableStringEnum.ACTIVE:
                            this.sendDataToCardsFront =
                                this.displayRowsFrontTruck;
                            this.sendDataToCardsBack =
                                this.displayRowsBackTruck;
                            this.cardTitle = TableStringEnum.TRUCK_TRUCK_NUMBER;

                            break;
                        case TableStringEnum.INACTIVE:
                            this.sendDataToCardsFront =
                                this.displayRowsFrontTrailer;
                            this.sendDataToCardsBack =
                                this.displayRowsBackTrailer;
                            this.cardTitle =
                                TableStringEnum.TRAILER_TRAILER_NUMBER;
                            break;
                    }
                    this.getSelectedTabTableData();
                    return this.mapTruckAndTrailerData(data);
                } else {
                    this.sendDataToCardsFront = this.displayRowsFrontRepairShop;
                    this.sendDataToCardsBack = this.displayRowsBackRepairShop;
                    this.cardTitle = TableStringEnum.NAME;
                    return this.mapShopData(data);
                }
            });

            this.mapListData = JSON.parse(JSON.stringify(this.viewData));
        } else {
            this.viewData = [];
        }
        this.reapirTableData = this.viewData;
    }

    // Map Truck And Trailer Data
    private mapTruckAndTrailerData(data: RepairResponse): MappedTruckTrailer {
        return {
            ...data,
            isSelected: false,
            isRepairOrder: data?.repairType?.name === TableStringEnum.ORDER,
            tableUnit: data?.invoice,
            tableNumber:
                data?.truck?.truckNumber ||
                data?.trailer?.trailerNumber ||
                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            invoice: data?.invoice,
            payType: data.payType?.name,
            driver: data.driver?.firstName
                ? `${data.driver.firstName} ${data.driver.lastName || ''}`
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableType:
                data?.truck?.truckType?.logoName ||
                data?.trailer?.trailerType?.logoName ||
                TableStringEnum.NA,
            tableMake:
                data?.truck?.truckMakeName ||
                data?.trailer?.trailerMakeName ||
                TableStringEnum.NA,
            tableModel:
                data?.truck?.truckType?.name ||
                data?.trailer?.trailerType?.name ||
                TableStringEnum.NA,
            tableYear:
                (data.truck?.year || data.trailer?.year || TableStringEnum.NA) +
                '',
            tableOdometer: data.odometer
                ? this.thousandSeparator.transform(data.odometer)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableIssued: data?.date
                ? this.datePipe.transform(
                      data.date,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopName:
                data?.repairShop?.name ||
                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopAdress:
                data?.repairShop?.address?.address ||
                TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableServices: data?.serviceTypes ?? null,
            tableDescription: data?.items ?? null,
            descriptionItems: data?.items
                ? data.items.map((item) => {
                      return {
                          ...item,
                          descriptionPrice: item?.price
                              ? TableStringEnum.DOLLAR_SIGN +
                                this.thousandSeparator.transform(item.price)
                              : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                          descriptionTotalPrice: item?.subtotal
                              ? TableStringEnum.DOLLAR_SIGN +
                                this.thousandSeparator.transform(item.subtotal)
                              : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                          pmDescription: item?.pmTruck
                              ? item.pmTruck
                              : item?.pmTrailer
                              ? item.pmTrailer
                              : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                      };
                  })
                : null,
            tabelDescriptionDropTotal: data?.total
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.total)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableCost: data?.total
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.total)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAttachments: data?.files ?? [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getRepairDropdownContent(data?.repairType?.name),
            },
        };
    }

    // Map Shop Data
    // TODO find parametar data type
    private mapShopData(data: any): void {
        return {
            ...data,
            isSelected: false,
            tableAddress: data?.address?.address
                ? data.address.address
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopServices: data?.serviceTypes ? data?.serviceTypes : null,
            tableOpenHours: data?.openHoursToday,
            tableBankDetailsBankName: data?.bank?.name
                ? data.bank.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailsRouting: data?.routing
                ? data.routing
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableBankDetailsAccount: data?.account
                ? data.account
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            TableDropdownComponentConstantsCountBill: TableStringEnum.NA,
            TableDropdownComponentConstantsCountOrder: data?.order
                ? this.thousandSeparator.transform(data.order)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableShopRaiting: {
                hasLiked: data.currentCompanyUserRating === 1,
                hasDislike: data.currentCompanyUserRating === -1,
                likeCount: data?.upCount
                    ? data.upCount
                    : TableStringEnum.NUMBER_0,
                dislikeCount: data?.downCount
                    ? data.downCount
                    : TableStringEnum.NUMBER_0,
            },
            tableContactData: data?.contacts,
            tableExpense: data?.cost
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.cost)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableLUsed: data.lastVisited
                ? this.datePipe.transform(
                      data.lastVisited,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAdded: data.createdAt
                ? this.datePipe.transform(
                      data.createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: data.updatedAt
                ? this.datePipe.transform(
                      data.updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            isFavorite: data.pinned,
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,

            tableDropdownContent: {
                hasContent: true,
                content: this.getShopDropdownContent(data),
            },
        };
    }

    // Get Repair Dropdown Content
    private getRepairDropdownContent(repairType: string): DropdownItem[] {
        return RepairTableHelper.dropdownTableContent(
            this.selectedTab,
            repairType
        );
    }

    // Get Repair Dropdown Content

    // TODO - Add to store logic
    private getShopDropdownContent(shopData): DropdownItem[] {
        const defaultDropdownContent =
            TableDropdownComponentConstants.DROPDOWN_SHOP;
        const newDropdownContent: DropdownItem[] = [];

        defaultDropdownContent.forEach((dropItem) => {
            let newDropItem = { ...dropItem };

            if (dropItem.name === TableStringEnum.CLOSE_BUSINESS) {
                newDropItem.title = !shopData.status
                    ? TableStringEnum.OPEN_BUSINESS
                    : TableStringEnum.CLOSE_BUSINESS_2;
            }

            newDropdownContent.push(newDropItem);
        });

        return newDropdownContent;
    }

    // Repair Back Filters
    private repairBackFilter(
        filter: RepairBackFilter,
        isShowMore?: boolean
    ): void {
        this.repairService
            .getRepairList(
                filter.repairShopId,
                filter.unitType,
                filter.dateFrom,
                filter.dateTo,
                filter.isPM,
                filter.categoryIds,
                filter.pmTruckTitles,
                filter.pmTrailerTitles,
                filter.isOrder,
                filter.truckNumbers,
                filter.trailerNumbers,
                filter.costFrom,
                filter.costTo,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((repair: RepairListResponse) => {
                if (!isShowMore) {
                    this.viewData = repair.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapTruckAndTrailerData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    repair.pagination.data.map((data) => {
                        newData.push(this.mapTruckAndTrailerData(data));
                    });

                    this.viewData = [...newData];
                }
                this.backFilterQuery =
                    RepairTableBackFilterDataHelper.backRepairFilterData();
            });
    }

    // Shop Back Filters
    private shopBackFilter(filter: ShopBackFilter, isShowMore?: boolean): void {
        this.repairService
            .getRepairShopList(
                filter.active,
                filter.pinned,
                filter.companyOwned,
                false,
                filter.categoryIds,
                filter.long,
                filter.lat,
                filter.distance,
                filter.costFrom,
                filter.costTo,
                filter.visitedByMe,
                filter.driverId,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((shop) => {
                if (!isShowMore) {
                    this.viewData = shop.pagination.data;

                    this.viewData = this.viewData.map((data) => {
                        return this.mapShopData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    shop.pagination.data.map((data) => {
                        newData.push(this.mapShopData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Update Data Count
    private updateDataCount(): void {
        const repairTruckTrailerCount = JSON.parse(
            localStorage.getItem(
                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
            )
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = repairTruckTrailerCount.repairTrucks;
        updatedTableData[1].length = repairTruckTrailerCount.repairTrailers;
        updatedTableData[2].length = repairTruckTrailerCount.repairShops;

        this.tableData = [...updatedTableData];
    }

    // Table Toolbar Actions
    public onToolBarAction(event: TableToolbarActions): void {
        if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.unitType =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 2;

            this.backFilterQuery.pageIndex = 1;
            this.shopFilterQuery.pageIndex = 1;

            // Repair Trailer Api Call
            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.repairService
                    .getRepairList(
                        null,
                        2,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        1,
                        25,
                        null,
                        null,
                        null,
                        null
                    )
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((repairTrailerPagination) => {
                        this.repairTrailerStore.set(
                            repairTrailerPagination.pagination.data
                        );
                        this.sendRepairData();
                    });
            } else {
                this.sendRepairData();
            }
        } else if (event.action === TableStringEnum.OPEN_MODAL) {
            if (this.selectedTab === TableStringEnum.ACTIVE) {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: TableStringEnum.LARGE,
                    },
                    {
                        type: TableStringEnum.NEW_TRUCK,
                    }
                );
            } else if (this.selectedTab === TableStringEnum.INACTIVE) {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: TableStringEnum.LARGE,
                    },
                    {
                        type: TableStringEnum.NEW_TRAILER,
                    }
                );
            } else {
                this.modalService.openModal(RepairShopModalComponent, {
                    size: TableStringEnum.SMALL,
                });
            }
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;

            this.tableOptions.toolbarActions.hideSearch =
                event.mode == TableStringEnum.MAP;
        }
    }

    // Table Head Actions
    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === TableStringEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.sort = event.direction;
                this.backFilterQuery.pageIndex = 1;
                this.shopFilterQuery.pageIndex = 1;

                if (this.selectedTab !== TableStringEnum.REPAIR_SHOP) {
                    this.backFilterQuery.unitType =
                        this.selectedTab === TableStringEnum.ACTIVE ? 1 : 2;

                    this.repairBackFilter(this.backFilterQuery);
                } else {
                    this.shopFilterQuery.sort = event.direction;
                    this.shopBackFilter(this.shopFilterQuery);
                }
            } else {
                this.sendRepairData();
            }
        }
    }

    // Table Body Actions
    public onTableBodyActions(event: RepairBodyResponse): void {
        // Show More
        if (event.type === TableStringEnum.SHOW_MORE) {
            if (this.selectedTab !== TableStringEnum.REPAIR_SHOP) {
                this.backFilterQuery.unitType =
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 2;
            }

            this.selectedTab !== TableStringEnum.REPAIR_SHOP
                ? this.backFilterQuery.pageIndex++
                : this.shopFilterQuery.pageIndex++;

            this.selectedTab !== TableStringEnum.REPAIR_SHOP
                ? this.repairBackFilter(this.backFilterQuery, true)
                : this.shopBackFilter(this.shopFilterQuery, true);
        }

        // Edit
        else if (
            event.type === TableStringEnum.EDIT ||
            event.type === TableStringEnum.WRITE_REVIEW
        ) {
            switch (this.selectedTab) {
                case TableStringEnum.ACTIVE:
                case TableStringEnum.INACTIVE:
                    this.getRepairById(event.id);

                    break;
                default:
                    this.modalService.openModal(
                        RepairShopModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            ...event,
                            openedTab:
                                event.type === TableStringEnum.ADD_CONTRACT
                                    ? TableStringEnum.CONTRACT
                                    : event.type ===
                                      TableStringEnum.WRITE_REVIEW
                                    ? TableStringEnum.REVIEW
                                    : TableStringEnum.DETAILS,
                        }
                    );

                    break;
            }
        } else if (event.type === TableStringEnum.VIEW_DETAILS) {
            if (this.selectedTab === TableStringEnum.REPAIR_SHOP)
                this.router.navigate([`/list/repair/${event.id}/shop-details`]);
        }
        // Delete
        else if (
            event.type === TableStringEnum.DELETE_REPAIR ||
            event.type === TableStringEnum.DELETE
        ) {
            switch (this.selectedTab) {
                case TableStringEnum.REPAIR_SHOP:
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.DELETE },
                        {
                            ...event,
                            template: TableStringEnum.REPAIR_SHOP,
                            type: TableStringEnum.DELETE,
                        }
                    );

                    break;

                default:
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.DELETE },
                        {
                            ...event,
                            template: TableStringEnum.REPAIR_2,
                            type: TableStringEnum.DELETE,
                            subType:
                                this.selectedTab === TableStringEnum.ACTIVE
                                    ? TableStringEnum.TRUCK
                                    : TableStringEnum.TRAILER_2,
                        }
                    );
                    break;
            }
        } else if (event.type === TableStringEnum.CLOSE_BUSINESS) {
            const mappedEvent = {
                ...event,
                type: event.data.status
                    ? TableStringEnum.CLOSE
                    : TableStringEnum.OPEN,
            };

            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.INFO,
                    subType: TableStringEnum.REPAIR_SHOP,
                    subTypeStatus: TableStringEnum.BUSINESS,
                    tableType:
                        ConfirmationActivationStringEnum.REPAIR_SHOP_TEXT,
                    modalTitle: event.data.name,
                    modalSecondTitle: event.data?.address?.address
                        ? event.data.address.address
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        }
        // Finish Order
        else if (event.type === TableStringEnum.FINISH_ORDER) {
            switch (this.selectedTab) {
                case TableStringEnum.ACTIVE:
                case TableStringEnum.INACTIVE:
                    this.getRepairById(event.id, true);

                    break;
                default:
                    break;
            }
        }

        // Rating
        else if (event.type === TableStringEnum.RATING) {
            const raitingData = {
                entityTypeRatingId: 2,
                entityTypeId: event.data.id,
                thumb: event.subType === TableStringEnum.LIKE ? 1 : -1,
                tableData: event.data,
            };

            this.reviewRatingService
                .addRating(raitingData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    const newViewData = [...this.viewData];

                    newViewData.map((data) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation = TableStringEnum.UPDATE;
                            data.tableShopRaiting = {
                                hasLiked: res.currentCompanyUserRating === 1,
                                hasDislike: res.currentCompanyUserRating === -1,
                                likeCount: res?.upCount
                                    ? res.upCount
                                    : TableStringEnum.NUMBER_0,
                                dislikeCount: res?.downCount
                                    ? res.downCount
                                    : TableStringEnum.NUMBER_0,
                            };
                        }
                    });

                    this.viewData = [...newViewData];

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 1000);

                    this.mapsService.addRating(res);
                });
        }

        // Favorite
        else if (event.type === TableStringEnum.FAVORITE) {
            this.repairService
                .addShopFavorite(event.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    const newViewData = [...this.viewData];

                    newViewData.map((data) => {
                        if (data.id === event.data.id) {
                            data.actionAnimation = TableStringEnum.UPDATE;
                            data.isFavorite = !data.isFavorite;
                        }
                    });

                    const sortedByFavorite = newViewData.sort(
                        (a, b) => b.isFavorite - a.isFavorite
                    );

                    this.viewData = [...sortedByFavorite];

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 1000);
                });
        }
    }

    private getRepairById(id: number, isFinishOrder: boolean = false): void {
        this.repairService
            .getRepairById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((repair) => {
                    const editData = {
                        data: {
                            ...repair,
                        },
                        type:
                            this.selectedTab === TableStringEnum.ACTIVE
                                ? TableStringEnum.EDIT_TRUCK
                                : TableStringEnum.EDIT_TRAILER,
                        finishOrderBtn: repair?.repairType?.id === 2,
                        isFinishOrder,
                    };

                    this.modalService.openModal(
                        RepairOrderModalComponent,
                        { size: TableStringEnum.LARGE },
                        {
                            ...editData,
                        }
                    );
                })
            )
            .subscribe();
    }

    // Get Tab Table Data For Selected Tab
    private getSelectedTabTableData(): void {
        if (this.tableData?.length) {
            this.activeTableData = this.tableData.find(
                (table) => table.field === this.selectedTab
            );
        }
    }

    // Delete Selected Rows

    // TODO - Add to store logic
    private deleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template:
                                this.selectedTab !== TableStringEnum.REPAIR_SHOP
                                    ? TableStringEnum.REPAIR_2
                                    : TableStringEnum.REPAIR_SHOP,
                            type:
                                mappedRes?.length > 1
                                    ? TableStringEnum.MULTIPLE_DELETE
                                    : TableStringEnum.DELETE,
                            subType:
                                this.selectedTab === TableStringEnum.ACTIVE
                                    ? TableStringEnum.TRUCK
                                    : TableStringEnum.TRAILER_2,
                        }
                    );
                }
            });
    }

    // Show More Data
    public onShowMore(): void {
        this.onTableBodyActions({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
        this.tableService.sendCurrentSwitchOptionSelected(null);
        // this.resizeObserver.unobserve(
        //     document.querySelector(TableStringEnum.TABLE_CONTAINER)
        // );
        this.resizeObserver.disconnect();
    }

    // MAP Find parameter type
    public selectItem(data: any, index: number): void {
        this.mapsComponent.onMarkerClick(
            index,
            null,
            this.mapData.markers[index]
        );

        this.mapListData.map((item) => {
            if (item.id == data[0]) {
                // let itemIndex = this.mapsComponent.viewData.findIndex(
                //     (item2) => item2.id === item.id
                // );
                // if (
                //     itemIndex > -1 &&
                //     this.mapsComponent.viewData[itemIndex].showMarker
                // ) {
                //     item.isSelected =
                //         this.mapsComponent.viewData[itemIndex].isSelected;
                // } else {
                //     this.mapsComponent.clusterMarkers.map((cluster) => {
                //         const clusterData = cluster.pagination.data;
                //         let clusterItemIndex = clusterData.findIndex(
                //             (item2) => item2.id === data[0]
                //         );
                //         if (clusterItemIndex > -1) {
                //             if (!data[1]) {
                //                 if (
                //                     !cluster.isSelected ||
                //                     (cluster.isSelected &&
                //                         cluster.detailedInfo?.id == data[0])
                //                 ) {
                //                     this.mapsComponent.clickedCluster(cluster);
                //                 }
                //                 if (cluster.isSelected) {
                //                     this.mapsComponent.showClusterItemInfo([
                //                         cluster,
                //                         clusterData[clusterItemIndex],
                //                     ]);
                //                 }
                //             }
                //             item.isSelected = cluster.isSelected;
                //         }
                //     });
                // }
            }
        });
    }

    public updateMapList(mapListResponse): void {
        const newMapList = mapListResponse.pagination.data;
        let listChanged = false;
        let addData = mapListResponse.addData ? true : false;

        if (!addData) {
            for (let i = 0; i < this.mapListData.length; i++) {
                const item = this.mapListData[i];

                const itemIndex = newMapList.findIndex(
                    (item2) => item2.id === item.id
                );

                if (itemIndex == -1) {
                    this.mapListData.splice(i, 1);
                    listChanged = true;
                    i--;
                }
            }
        }

        for (let b = 0; b < newMapList.length; b++) {
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

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE:
                this.cardTitle = TableStringEnum.INVOICE;
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.INACTIVE:
                this.cardTitle = TableStringEnum.INVOICE;
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );
                break;
            case TableStringEnum.REPAIR_SHOP:
                this.cardTitle = TableStringEnum.NAME;
                this.displayRows$ = this.store.pipe(
                    select(selectRepairShopTabCards)
                );
                break;
            default:
                break;
        }
        this.repairCardsModalService.updateTab(this.selectedTab);
    }

    public getMapData(): void {
        const mapMarkers = this.viewData.map((data) => {
            return {
                position: { lat: data.latitude, lng: data.longitude },
                icon: {
                    url: RepairShopMapMarkersHelper.getMapMarker(data),
                    labelOrigin: new google.maps.Point(80, 18),
                },
                infoWindowContent: null,
                label: {
                    text: data.name,
                    fontSize: '11px',
                    color: '#424242',
                    fontWeight: '500',
                },
                labelOrigin: { x: 90, y: 15 },
            };
        });

        this.mapData = {
            ...this.mapData,
            viewData: [...this.viewData],
            markers: mapMarkers,
        };
    }
}
