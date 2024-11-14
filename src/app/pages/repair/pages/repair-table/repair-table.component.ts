import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
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
    IMapMarkers,
    IMapBoundsZoom,
    IMapSelectedMarkerData,
} from 'ca-components';

// store
import { RepairShopQuery } from '@pages/repair/state/repair-shop-state/repair-shop.query';

import { RepairTruckState } from '@pages/repair/state/repair-truck-state/repair-truck.store';
import { RepairTruckQuery } from '@pages/repair/state/repair-truck-state/repair-truck.query';

import { RepairTrailerStore } from '@pages/repair/state/repair-trailer-state/repair-trailer.store';
import { RepairTrailerQuery } from '@pages/repair/state/repair-trailer-state/repair-trailer.query';

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
import { RepairTableStringEnum } from '@pages/repair/pages/repair-table/enums';
import { TableActionsStringEnum } from '@shared/enums/table-actions-string.enum';

// constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { RepairShopMapConfig } from '@pages/repair/pages/repair-table/utils/constants/repair-shop-map.config';
import { RepairCardConfigConstants } from '@pages/repair/pages/repair-card/utils/constants';
import { RepairConfiguration } from '@pages/repair/pages/repair-table/utils/constants';

// helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import {
    RepairShopMapMarkersHelper,
    RepairShopMapDropdownHelper,
    RepairTableBackFilterDataHelper,
    RepairTableDateFormaterHelper,
    RepairTableHelper,
} from '@pages/repair/pages/repair-table/utils/helpers';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
/* import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component'; */

// settings
import {
    getRepairTruckAndTrailerColumnDefinition,
    getRepairShopColumnDefinition,
} from '@shared/utils/settings/table-settings/repair-columns';

// models
import {
    MapList,
    MappedTruckTrailer,
    ShopBackFilter,
    ShopBackFilterQuery,
    RepairBackFilter,
    RepairBodyResponse,
    MappedRepairShop,
} from '@pages/repair/pages/repair-table/models';
import {
    RepairListResponse,
    RepairResponse,
    RepairShopListDto,
} from 'appcoretruckassist';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { SortColumn } from '@shared/components/ta-sort-dropdown/models';

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
    @ViewChild('mapsComponent', { static: false })
    public mapsComponent: CaMapComponent;

    private destroy$ = new Subject<void>();

    public viewData: any[] = [];
    public tableData: any[] = [];
    public tableOptions: any;

    public activeViewMode: string = TableStringEnum.LIST;
    public columns: TableColumnConfig[] = [];

    public resizeObserver: ResizeObserver;

    public selectedTab: string = TableStringEnum.ACTIVE;

    public activeTableDataLength: number;

    public isTrailerTabClicked: boolean = false;

    public repairTableData: RepairResponse[] = [];

    // filters
    public filter: string;

    public backFilterQuery: RepairBackFilter =
        RepairTableBackFilterDataHelper.backRepairFilterData();

    public shopFilterQuery: ShopBackFilterQuery =
        TableDropdownComponentConstants.SHOP_FILTER_QUERY;

    // cards
    public cardTitle: string = TableStringEnum.TRUCK_TRUCK_NUMBER;

    public page: string = RepairCardConfigConstants.page;
    public rows: number = RepairCardConfigConstants.rows;

    public displayRows$: Observable<any>; //leave this as any for now

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    public displayRowsFront: CardRows[] =
        RepairConfiguration.displayRowsFrontActive;
    public displayRowsBack: CardRows[] =
        RepairConfiguration.displayRowsBackActive;

    public displayRowsFrontTruck: CardRows[] =
        RepairCardConfigConstants.displayRowsFrontTruck;
    public displayRowsBackTruck: CardRows[] =
        RepairCardConfigConstants.displayRowsBackTruck;

    public displayRowsFrontTrailer: CardRows[] =
        RepairCardConfigConstants.displayRowsFrontTruck;
    public displayRowsBackTrailer: CardRows[] =
        RepairCardConfigConstants.displayRowsBackTruck;

    public displayRowsFrontRepairShop: CardRows[] =
        RepairCardConfigConstants.displayRowsFrontRepairShop;
    public displayRowsBackRepairShop: CardRows[] =
        RepairCardConfigConstants.displayRowsBackRepairShop;

    // map
    public mapListData: MapList[] = [];

    public mapData: ICaMapProps = RepairShopMapConfig.repairShopMapConfig;
    public mapListPagination: { pageIndex: number; pageSize: number } =
        RepairShopMapConfig.repairShopMapListPagination;
    public mapClustersPagination: { pageIndex: number; pageSize: number } =
        RepairShopMapConfig.repairShopMapListPagination;
    public mapClustersObject: {
        northEastLatitude: number;
        northEastLongitude: number;
        southWestLatitude: number;
        southWestLongitude: number;
        zoomLevel: number;
    } = null;
    public mapListSearchValue: string | null = null;
    public mapListSortDirection: string | null = null;
    public repairShopMapListSortColumns: SortColumn[] =
        RepairShopMapConfig.repairShopMapListSortColumns;
    public isAddedNewRepairShop: boolean = false;

    constructor(
        // router
        public router: Router,

        // Ref
        private ref: ChangeDetectorRef,

        // pipes
        public datePipe: DatePipe,
        private thousandSeparator: ThousandSeparatorPipe,

        // services
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private repairService: RepairService,
        private reviewRatingService: ReviewsRatingService,
        private mapsService: MapsService,
        private confirmationService: ConfirmationService,
        private repairCardsModalService: RepairCardsModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // store
        private repairShopQuery: RepairShopQuery,
        private repairTruckQuery: RepairTruckQuery,
        private repairTrailerQuery: RepairTrailerQuery,
        private repairTrailerStore: RepairTrailerStore,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.sendRepairData();

        this.resetColumns();

        this.getSelectedTabTableData();

        this.resize();

        this.toggleColumns();

        this.addUpdateRepair();

        this.deleteSelectedRows();

        this.search();

        this.setTableFilter();

        this.switchSelected();

        this.addMapListScrollEvent();

        this.addSelectedMarkerListener();

        this.rowsSelected();

        this.openCloseBussinessSelectedRows();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    /* Global */

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    if (res.type === TableStringEnum.MULTIPLE_DELETE) {
                        if (this.selectedTab === TableStringEnum.REPAIR_SHOP) {
                            this.deleteRepairShopList(res?.array);
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

                                        this.handleCloseAnimationAction(true);

                                        this.tableService.sendRowsSelected([]);
                                        this.tableService.sendResetSelectedColumns(
                                            true
                                        );
                                    },
                                });
                        }
                    } else if (res.type === TableStringEnum.DELETE) {
                        if (this.selectedTab === TableStringEnum.REPAIR_SHOP) {
                            this.deleteRepairShop(res?.id);
                        } else {
                            const repairId = res.array?.[0]?.id ?? res.id;

                            this.repairService
                                .deleteRepair(repairId, this.selectedTab)
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
                                });
                        }
                    }
                }
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const repairShopIds = res?.array?.map(({ id }) => id) ?? [
                        res.data.id,
                    ];

                    this.filter = null;

                    repairShopIds.forEach((id) =>
                        this.updateRepairShopStatus(id)
                    );
                }
            });
    }

    private rowsSelected(): void {
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res && this.selectedTab === TableStringEnum.REPAIR_SHOP) {
                    let selectedClosedCount = 0;
                    let selectedOpenCount = 0;

                    res.forEach(({ tableData: { status } }) =>
                        status ? selectedOpenCount++ : selectedClosedCount++
                    );

                    this.tableOptions.toolbarActions.showMoveToOpenList =
                        selectedClosedCount && !selectedOpenCount;

                    this.tableOptions.toolbarActions.showMoveToClosedList =
                        selectedOpenCount && !selectedClosedCount;
                }
            });
    }

    private openCloseBussinessSelectedRows(): void {
        this.tableService.currentBussinessSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.length) {
                    const mappedRes = res.map(({ tableData: repairShop }) => {
                        const { id } = repairShop;

                        return {
                            id,
                            data: {
                                ...repairShop,
                            },
                            modalTitle: repairShop.name,
                            modalSecondTitle: repairShop?.address?.address,
                        };
                    });

                    this.modalService.openModal(
                        ConfirmationActivationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.INFO,
                            subType: TableStringEnum.REPAIR_SHOP,
                            subTypeStatus: TableStringEnum.BUSINESS,
                            tableType:
                                ConfirmationActivationStringEnum.REPAIR_SHOP_TEXT,
                            type: mappedRes[0].data.status
                                ? TableStringEnum.CLOSE
                                : TableStringEnum.OPEN,
                        }
                    );
                }
            });
    }

    private handleAfterActions(): void {
        this.updateDataCount();
        this.updateMapItem();

        this.tableService.sendRowsSelected([]);
        this.tableService.sendResetSelectedColumns(true);

        this.tableService.sendResetSpecialFilters(true);

        this.handleCloseAnimationAction(true);
    }

    /* Repair */

    /* Repair Shop */

    public updateRepairShopStatus(repairShopId: number): void {
        this.repairService
            .updateRepairShopStatus(repairShopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendRepairData();

                this.handleAfterActions();
            });
    }

    private updateRepairShopFavorite(repairShopId: number): void {
        this.repairService
            .updateRepairShopFavorite(repairShopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const newViewData = this.viewData.map((repairShop) => {
                    const { id, isFavorite, status, companyOwned } = repairShop;

                    return id === repairShopId
                        ? {
                              ...repairShop,
                              isFavorite: !isFavorite,
                              actionAnimation: TableStringEnum.UPDATE,
                              tableDropdownContent: {
                                  ...repairShop.tableDropdownContent,
                                  content:
                                      this.getRepairShopTableDropdownContent(
                                          status,
                                          !isFavorite,
                                          companyOwned
                                      ),
                              },
                          }
                        : repairShop;
                });

                const sortedByFavorite = newViewData.sort(
                    (a, b) => b.isFavorite - a.isFavorite
                );

                this.viewData = [...sortedByFavorite];

                this.handleCloseAnimationAction(false);

                this.updateMapItem(
                    this.viewData.find((item) => item.id === repairShopId)
                );
            });
    }

    private deleteRepairShop(repairShopId: number): void {
        this.repairService
            .deleteRepairShop(repairShopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((repairShop) =>
                        repairShop.id === repairShopId
                            ? {
                                  ...repairShop,
                                  actionAnimation: TableStringEnum.DELETE,
                              }
                            : repairShop
                    );

                    this.handleAfterActions();
                },
            });
    }

    private deleteRepairShopList(repairShopIds: number[]): void {
        this.repairService
            .deleteRepairShopList(repairShopIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((repairShop) =>
                        repairShopIds.includes(repairShop.id)
                            ? {
                                  ...repairShop,
                                  actionAnimation: TableStringEnum.DELETE,
                              }
                            : repairShop
                    );

                    this.handleAfterActions();
                },
            });
    }

    ///////////////////////////////////////////////////////////////////////////////////////

    private addUpdateRepair(): void {
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

                    this.handleCloseAnimationAction(false);
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

                    this.handleCloseAnimationAction(false);
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

                    this.handleCloseAnimationAction(false);

                    this.viewData.splice(repairIndex, 1);
                }
            });
    }

    private switchSelected(): void {
        this.tableService.currentSwitchOptionSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.switchType === TableStringEnum.PM_2)
                    this.router.navigate([TableStringEnum.PM]);
            });
    }

    private toggleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((column) => {
                        if (column.field === response.column.field)
                            column.hidden = response.column.hidden;

                        return column;
                    });
                }
            });
    }

    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) this.sendRepairData();
            });
    }

    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((column) => {
                        if (
                            column.title ===
                            response.columns[response.event.index].title
                        )
                            column.width = response.event.width;

                        return column;
                    });
                }
            });
    }

    private search(): void {
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

    public onShowMore(): void {
        this.onTableBodyActions({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showRepairShop:
                    this.selectedTab === TableStringEnum.REPAIR_SHOP,
                showStateFilter:
                    this.selectedTab === TableStringEnum.REPAIR_SHOP,
                showLocationFilter:
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
                showMoveToOpenList:
                    this.selectedTab === TableStringEnum.REPAIR_SHOP,
                showMoveToClosedList: true,
                viewModeOptions: this.getViewModeOptions(),
            },
        };
    }

    private checkActiveViewMode(): void {
        if (this.activeViewMode === TableStringEnum.MAP) {
            let hasMapView = false;

            let viewModeOptions =
                this.tableOptions.toolbarActions.viewModeOptions;

            viewModeOptions.forEach((viewMode) => {
                if (viewMode.name === TableStringEnum.MAP) hasMapView = true;
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

    private getSelectedTabTableData(): void {
        if (this.tableData?.length)
            this.activeTableDataLength = this.tableData.find(
                (table) => table.field === this.selectedTab
            ).length;
    }

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

    private getGridColumns(configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (
            configType === TableStringEnum.REPAIR_TRUCK ||
            configType === TableStringEnum.REPAIR_TRAILER
        )
            return (
                tableColumnsConfig ?? getRepairTruckAndTrailerColumnDefinition()
            );
        else return tableColumnsConfig ?? getRepairShopColumnDefinition();
    }

    private getTabData(dataType: string): RepairTruckState[] {
        if (dataType === TableStringEnum.ACTIVE) {
            const repairTrucks = this.repairTruckQuery.getAll();

            return repairTrucks?.length ? repairTrucks : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.isTrailerTabClicked = true;

            const repairTrailers = this.repairTrailerQuery.getAll();

            return repairTrailers?.length ? repairTrailers : [];
        } else if (dataType === TableStringEnum.REPAIR_SHOP) {
            const repairShops = this.repairShopQuery.getAll();

            return repairShops?.length ? repairShops : [];
        }
    }

    private setRepairData(tdata: CardTableData): void {
        this.columns = tdata.gridColumns;

        if (tdata.data.length) {
            this.viewData = tdata.data;

            this.viewData = this.viewData.map(
                (data: RepairResponse | RepairShopListDto) => {
                    return this.selectedTab !== TableStringEnum.REPAIR_SHOP
                        ? this.mapTruckAndTrailerData(data)
                        : this.mapShopData(data);
                }
            );

            // filter closed businesses
            if (this.selectedTab === TableStringEnum.REPAIR_SHOP)
                this.viewData = this.filterClosedRepairShopData(
                    this.viewData,
                    this.filter
                );

            // set data for cards based on tab active
            this.selectedTab === TableStringEnum.ACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFrontTruck),
                  (this.sendDataToCardsBack = this.displayRowsBackTruck))
                : this.selectedTab === TableStringEnum.INACTIVE
                ? ((this.sendDataToCardsFront = this.displayRowsFrontTrailer),
                  (this.sendDataToCardsBack = this.displayRowsBackTrailer))
                : ((this.sendDataToCardsFront =
                      this.displayRowsFrontRepairShop),
                  (this.sendDataToCardsBack = this.displayRowsBackRepairShop));

            // get Tab Table Data For Selected Tab
            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }

        this.repairTableData = this.viewData;
    }

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

        this.backFilterQuery.unitType =
            this.selectedTab === TableStringEnum.INACTIVE ? 2 : 1;

        const repairTruckTrailerCount = JSON.parse(
            localStorage.getItem(
                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
            )
        );

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
                stateName: RepairTableStringEnum.REPAIR_TRUCKS,
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
                stateName: RepairTableStringEnum.REPAIR_TRAILERS,
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
                stateName: RepairTableStringEnum.REPAIR_SHOPS,
                closedArray: DataFilterHelper.checkSpecialFilterArray(
                    repairShopData,
                    TableStringEnum.STATUS
                ),
                tableConfiguration: RepairTableStringEnum.REPAIR_SHOP,
                isActive: this.selectedTab === TableStringEnum.REPAIR_SHOP,
                gridColumns: this.getGridColumns(
                    RepairTableStringEnum.REPAIR_SHOP
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setRepairData(td);
        this.updateCardView();
    }

    private filterClosedRepairShopData(
        data: RepairShopListDto[],
        activeFilter?: string
    ) {
        return data.filter((repairShop) =>
            activeFilter
                ? activeFilter === TableStringEnum.CLOSED_ARRAY
                    ? !repairShop.status
                    : true
                : repairShop.status
        );
    }

    private handleCloseAnimationAction(isDelete: boolean): void {
        setTimeout(() => {
            this.viewData = MethodsGlobalHelper.closeAnimationAction(
                isDelete,
                this.viewData
            );
        }, 900);
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filteredArray) {
                    if (res.selectedFilter) {
                        // reset filters

                        this.filter = res.filterName;

                        this.sendRepairData();

                        this.viewData = this.repairTableData?.filter(
                            (repairData) =>
                                res.filteredArray.some(
                                    (filterData) =>
                                        filterData.id === repairData.id
                                )
                        );
                    }

                    if (!res.selectedFilter && res.filterName === this.filter) {
                        this.filter = null;
                        this.viewData = this.repairTableData;

                        this.sendRepairData();
                    }
                }

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
                }
            });
    }

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
                    const newData = [...this.viewData];

                    repair.pagination.data.map((data) => {
                        newData.push(this.mapTruckAndTrailerData(data));
                    });

                    this.viewData = [...newData];
                }

                this.backFilterQuery =
                    RepairTableBackFilterDataHelper.backRepairFilterData();
            });
    }

    private shopBackFilter(filter: ShopBackFilter, isShowMore?: boolean): void {
        this.repairService
            .getRepairShopList(
                filter.active,
                filter.pinned,
                filter.companyOwned,
                filter.isCompanyRelated,
                filter.categoryIds,
                filter.long,
                filter.lat,
                filter.distance,
                '',
                250,
                filter.costFrom,
                filter.costTo,
                filter.visitedByMe,
                filter.driverId,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                null,
                null,
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
                    const newData = [...this.viewData];

                    shop.pagination.data.map((data) => {
                        newData.push(this.mapShopData(data));
                    });

                    this.viewData = [...newData];
                }
            });
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

    public onToolBarAction(event: TableToolbarActions): void {
        if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.unitType =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 2;

            this.backFilterQuery.pageIndex = 1;
            this.shopFilterQuery.pageIndex = 1;

            this.filter = null;

            this.mapsService.selectedMarker(null);

            // Repair Trailer Api Call
            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.isTrailerTabClicked
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

            this.filter = null;

            this.mapsService.selectedMarker(null);
        }
    }

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

    public onTableBodyActions(event: RepairBodyResponse): void {
        // Show More
        if (event.type === TableStringEnum.SHOW_MORE) {
            if (this.selectedTab !== TableStringEnum.REPAIR_SHOP) {
                this.backFilterQuery.unitType =
                    this.selectedTab === TableStringEnum.ACTIVE ? 1 : 2;

                this.backFilterQuery.pageIndex++;

                this.repairBackFilter(this.backFilterQuery, true);
            } else {
                this.shopFilterQuery.pageIndex++;

                this.shopBackFilter(this.shopFilterQuery, true);
            }
        }

        // Edit & Write Review
        else if (
            event.type === TableStringEnum.EDIT ||
            event.type === TableStringEnum.WRITE_REVIEW
        ) {
            if (this.selectedTab !== TableStringEnum.REPAIR_SHOP) {
                this.getRepairById(event.id);
            } else {
                const openedTab =
                    event.type === TableStringEnum.ADD_CONTRACT
                        ? TableStringEnum.CONTRACT
                        : event.type === TableStringEnum.WRITE_REVIEW
                        ? TableStringEnum.REVIEW
                        : TableStringEnum.DETAILS;

                this.modalService.openModal(
                    RepairShopModalComponent,
                    { size: TableStringEnum.SMALL },
                    { ...event, openedTab }
                );
            }
        }

        // View Details
        else if (event.type === TableStringEnum.VIEW_DETAILS) {
            if (this.selectedTab === TableStringEnum.REPAIR_SHOP)
                this.router.navigate([`/list/repair/${event.id}/details`]);
        }

        // Delete
        else if (
            event.type === TableStringEnum.DELETE_REPAIR ||
            event.type === TableStringEnum.DELETE
        ) {
            const template =
                this.selectedTab === TableStringEnum.REPAIR_SHOP
                    ? TableStringEnum.REPAIR_SHOP
                    : TableStringEnum.REPAIR_2;

            const subType =
                this.selectedTab === TableStringEnum.ACTIVE
                    ? TableStringEnum.TRUCK
                    : TableStringEnum.TRAILER_2;

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.DELETE },
                {
                    ...event,
                    template,
                    type: TableStringEnum.DELETE,
                    ...(this.selectedTab !== TableStringEnum.REPAIR_SHOP && {
                        subType,
                    }),
                }
            );
        }

        // Close Business
        else if (event.type === TableStringEnum.CLOSE_BUSINESS) {
            const mappedEvent = {
                ...event,
                type: event.data?.status
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
                    modalTitle: event.data?.name,
                    modalSecondTitle: event.data?.address?.address,
                }
            );
        }

        // Add Bill
        else if (event.type === TableStringEnum.ADD_BILL) {
            const editData = {
                data: {
                    id: event.id,
                },
                type: event.type,
            };

            this.modalService.openModal(
                RepairOrderModalComponent,
                { size: TableStringEnum.LARGE },
                {
                    ...editData,
                }
            );
        }

        // Finish Order
        else if (event.type === TableStringEnum.FINISH_ORDER) {
            if (this.selectedTab !== TableStringEnum.REPAIR_SHOP)
                this.getRepairById(event.id, true);
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
                    const newViewData = this.viewData.map((data) =>
                        data.id === event.data.id
                            ? {
                                  ...data,
                                  actionAnimation: TableStringEnum.UPDATE,
                                  tableShopRaiting: {
                                      hasLiked:
                                          res.currentCompanyUserRating === 1,
                                      hasDislike:
                                          res.currentCompanyUserRating === -1,
                                      likeCount: res.upCount,
                                      dislikeCount: res.downCount,
                                  },
                              }
                            : data
                    );

                    this.viewData = [...newViewData];

                    this.handleCloseAnimationAction(false);

                    this.mapsService.addRating(res);

                    this.updateMapItem(
                        this.viewData.find((item) => item.id === event.data.id)
                    );
                });
        }

        // Favorite
        else if (event.type === TableStringEnum.FAVORITE) {
            this.updateRepairShopFavorite(event.data.id);
        }
    }

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
                content: this.getRepairTableDropdownContent(
                    data?.repairType?.name
                ),
            },
        };
    }

    private mapShopData(repairShop: RepairShopListDto): MappedRepairShop {
        const {
            address,
            shopServiceType,
            serviceTypes,
            openHours,
            openHoursToday,
            bill,
            order,
            bankResponse,
            routing,
            account,
            currentCompanyUserRating,
            upCount,
            downCount,
            contacts,
            cost,
            lastVisited,
            dateDeactivated,
            createdAt,
            updatedAt,
            fileCount,
            pinned,
            status,
            companyOwned,
        } = repairShop;

        return {
            ...repairShop,
            isSelected: false,
            tableAddress: address?.address,
            tableShopServiceType: shopServiceType?.name,
            tableShopServices: serviceTypes,
            tableOpenHours: null /*  {
                openHours,
                openHoursToday,
            }, */,
            tableRepairCountBill: bill,
            tableRepairCountOrder: order,
            tableBankDetailsBankName: bankResponse?.name,
            tableBankDetailsRouting: routing,
            tableBankDetailsAccount: account,
            tableRaiting: {
                hasLiked: currentCompanyUserRating === 1,
                hasDislike: currentCompanyUserRating === -1,
                likeCount: upCount,
                dislikeCount: downCount,
            },
            tableContactData: contacts,
            tableExpense:
                TableStringEnum.DOLLAR_SIGN +
                (cost
                    ? this.thousandSeparator.transform(cost)
                    : cost.toString()),
            tableLastUsed: lastVisited
                ? this.datePipe.transform(
                      lastVisited,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableDeactivated: dateDeactivated
                ? this.datePipe.transform(
                      dateDeactivated,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableAdded: createdAt
                ? this.datePipe.transform(
                      createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            tableEdited: updatedAt
                ? this.datePipe.transform(
                      updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : null,
            fileCount,
            isFavorite: pinned,
            tableDropdownContent: {
                hasContent: true,
                content: this.getRepairShopTableDropdownContent(
                    status,
                    pinned,
                    companyOwned
                ),
            },
        };
    }

    private getRepairTableDropdownContent(repairType: string): DropdownItem[] {
        return RepairTableHelper.getRepairTableDropdownContent(
            this.selectedTab,
            repairType
        );
    }

    private getRepairShopTableDropdownContent(
        status: number,
        isPinned: boolean,
        isCompanyOwned: boolean
    ): DropdownItem[] {
        return RepairTableHelper.getRepairShopTableDropdownContent(
            status,
            isPinned,
            isCompanyOwned
        );
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

    public onGetInfoWindowData(markerId: number): void {
        this.repairService
            .getRepairShopById(markerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    const repairShopData = this.mapShopData(res);

                    let selectedMarkerData: IMapSelectedMarkerData | null =
                        null;

                    this.mapData.clusterMarkers.forEach((clusterMarker) => {
                        const clusterItemIndex =
                            clusterMarker.data.pagination?.data?.findIndex(
                                (clusterItem) => clusterItem.id === markerId
                            );

                        if (clusterItemIndex > -1) {
                            selectedMarkerData = {
                                ...clusterMarker,
                                infoWindowContent: {
                                    ...clusterMarker.infoWindowContent,
                                    selectedClusterItemData: {
                                        ...RepairShopMapDropdownHelper.getRepairShopMapDropdownConfig(
                                            repairShopData,
                                            true
                                        ),
                                        data: repairShopData,
                                    },
                                },
                            };
                        }
                    });

                    this.mapData.markers.forEach((markerData) => {
                        if (markerData.data.id === markerId) {
                            selectedMarkerData = {
                                ...markerData,
                                infoWindowContent:
                                    RepairShopMapDropdownHelper.getRepairShopMapDropdownConfig(
                                        repairShopData
                                    ),
                                data: repairShopData,
                            };
                        }
                    });

                    this.mapsService.selectedMarker(
                        selectedMarkerData ? repairShopData.id : 0
                    );

                    this.mapData = { ...this.mapData, selectedMarkerData };

                    this.updateMapItem(repairShopData);
                },
                error: () => {},
            });
    }

    public onMapBoundsChange(event: IMapBoundsZoom): void {
        const ne = event.bounds.getNorthEast(); // LatLng of the north-east corner
        const sw = event.bounds.getSouthWest(); // LatLng of the south-west corder

        this.mapClustersObject = {
            northEastLatitude: parseFloat(ne.lat().toFixed(6)),
            northEastLongitude: parseFloat(ne.lng().toFixed(6)),
            southWestLatitude: parseFloat(sw.lat().toFixed(6)),
            southWestLongitude: parseFloat(sw.lng().toFixed(6)),
            zoomLevel: event.zoom,
        };

        this.mapListPagination = {
            ...this.mapListPagination,
            pageIndex: 1,
        };

        this.mapClustersPagination = {
            ...this.mapClustersPagination,
            pageIndex: 1,
        };

        this.getRepairShopClusters();

        this.getRepairShopMapList();
    }

    public getRepairShopClusters(isClusterPagination?: boolean): void {
        this.repairService
            .getRepairShopClusters(
                this.mapClustersObject.northEastLatitude,
                this.mapClustersObject.northEastLongitude,
                this.mapClustersObject.southWestLatitude,
                this.mapClustersObject.southWestLongitude,
                this.mapClustersObject.zoomLevel,
                this.isAddedNewRepairShop, // addedNew flag
                null, // shipperLong
                null, // shipperLat
                null, // shipperDistance
                null, // shipperStates
                [], // categoryIds?: Array<number>,
                null, // _long?: number,
                null, // lat?: number,
                null, // distance?: number,
                null, // costFrom?: number,
                null, // costTo?: number,
                null, // lastFrom?: number,
                null, // lastTo?: number,
                null, // ppgFrom?: number,
                null, // ppgTo?: number,
                this.mapClustersPagination.pageIndex, // pageIndex
                this.mapClustersPagination.pageSize, // pageSize
                null, // companyId
                this.shopFilterQuery.sort ?? 'nameDesc', // sortBy
                null, // search
                null, // search1
                null // search2
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((clustersResponse) => {
                if (isClusterPagination) {
                    let selectedMarkerData: IMapMarkers | null = {
                        ...this.mapData.selectedMarkerData,
                    };

                    const findClusterData = clustersResponse.find(
                        (data) =>
                            this.mapData.selectedMarkerData?.position?.lat ===
                                data.latitude &&
                            this.mapData.selectedMarkerData?.position.lng ===
                                data.longitude
                    );

                    if (findClusterData) {
                        selectedMarkerData = {
                            ...selectedMarkerData,
                            infoWindowContent: {
                                ...selectedMarkerData.infoWindowContent,
                                clusterData: [
                                    ...selectedMarkerData.infoWindowContent
                                        .clusterData,
                                    ...findClusterData.pagination.data,
                                ],
                            },
                        };
                    }

                    this.mapData = {
                        ...this.mapData,
                        selectedMarkerData,
                    };
                } else {
                    const clusterMarkers: IMapMarkers[] = [];
                    const markers: IMapMarkers[] = [];

                    clustersResponse?.forEach((data, index) => {
                        const previousClusterData =
                            this.mapData.clusterMarkers.find(
                                (item) =>
                                    item.position.lat === data.latitude &&
                                    item.position.lng === data.longitude
                            );

                        let clusterInfoWindowContent = data.pagination?.data
                            ? {
                                  clusterData: [...data.pagination.data],
                                  selectedClusterItemData: null,
                              }
                            : null;

                        if (
                            previousClusterData?.infoWindowContent
                                ?.selectedClusterItemData
                        ) {
                            clusterInfoWindowContent = {
                                ...clusterInfoWindowContent,
                                selectedClusterItemData:
                                    previousClusterData?.infoWindowContent
                                        ?.selectedClusterItemData,
                            };
                        }

                        const markerData = {
                            position: {
                                lat: data.latitude,
                                lng: data.longitude,
                            },
                            icon: {
                                url: RepairShopMapMarkersHelper.getMapMarker(
                                    data.favourite,
                                    data.isClosed,
                                    data?.count,
                                    data?.count > 1
                                ),
                                labelOrigin: new google.maps.Point(80, 15),
                            },
                            infoWindowContent: clusterInfoWindowContent,
                            label: data.name
                                ? {
                                      text: data.name.toUpperCase(),
                                      fontSize: '11px',
                                      color: '#424242',
                                      fontWeight: '500',
                                  }
                                : null,
                            labelOrigin: { x: 90, y: 15 },
                            options: {
                                zIndex: index + 1,
                                animation: google.maps.Animation.DROP,
                            },
                            data,
                        };

                        if (data.count > 1) clusterMarkers.push(markerData);
                        else markers.push(markerData);
                    });

                    this.mapData = {
                        ...this.mapData,
                        clusterMarkers,
                        markers,
                    };
                }

                if (this.isAddedNewRepairShop)
                    this.isAddedNewRepairShop = false;

                this.ref.detectChanges();
            });
    }

    public getRepairShopMapList(): void {
        if (!this.mapClustersObject) return;

        this.repairService
            .getRepairShopMapList(
                this.mapClustersObject.northEastLatitude,
                this.mapClustersObject.northEastLongitude,
                this.mapClustersObject.southWestLatitude,
                this.mapClustersObject.southWestLongitude,
                null, // category ids
                null, // _long
                null, // lat
                null, // distance
                null, // costFrom
                null, // costTo
                this.mapListPagination.pageIndex,
                this.mapListPagination.pageSize,
                null, // companyId
                this.mapListSortDirection, // sort
                this.mapListSearchValue, // search
                null, // search1
                null // search2
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((mapListResponse: any) => {
                const mappedListData = mapListResponse?.pagination?.data?.map(
                    (item) => {
                        const mapItemData = this.mapShopData(item);

                        return mapItemData;
                    }
                );

                const newMapListData = {
                    ...mapListResponse,
                    pagination: {
                        ...mapListResponse?.pagination,
                        data: mappedListData,
                    },
                    addData:
                        this.mapListPagination.pageIndex > 1 ? true : false,
                };

                this.mapListData =
                    this.mapListPagination.pageIndex > 1
                        ? [...this.mapListData, ...mappedListData]
                        : mappedListData;

                this.ref.detectChanges();
            });
    }

    public onResetSelectedMarkerItem(isBackButton?: boolean): void {
        const selectedMarkerData = isBackButton
            ? {
                  ...this.mapData.selectedMarkerData,
                  infoWindowContent: {
                      ...this.mapData.selectedMarkerData.infoWindowContent,
                      selectedClusterItemData: null,
                  },
              }
            : null;

        this.mapData = {
            ...this.mapData,
            selectedMarkerData,
        };

        this.mapsService.selectedMarker(0);
    }

    public addMapListScrollEvent(): void {
        this.mapsService.mapListScrollChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.mapListPagination = {
                    ...this.mapListPagination,
                    pageIndex: this.mapListPagination.pageIndex + 1,
                };

                this.getRepairShopMapList();
            });
    }

    public addSelectedMarkerListener(): void {
        this.mapsService.selectedMapListCardChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id) this.onGetInfoWindowData(id);
                else this.onResetSelectedMarkerItem();
            });
    }

    public onClusterMarkerClick(selectedMarker: IMapMarkers): void {
        const selectedMarkerData: IMapSelectedMarkerData | null =
            this.mapData.clusterMarkers.find(
                (clusterMarker) =>
                    clusterMarker.position.lat ===
                        selectedMarker.position.lat &&
                    clusterMarker.position.lng === selectedMarker.position.lng
            ) ?? null;

        this.mapData = { ...this.mapData, selectedMarkerData };
    }

    public onClusterListScroll(clusterMarker: IMapMarkers): void {
        if (
            clusterMarker?.data?.count / this.mapClustersPagination.pageIndex >
            25
        ) {
            this.mapClustersPagination = {
                ...this.mapClustersPagination,
                pageIndex: this.mapClustersPagination.pageIndex + 1,
            };

            this.getRepairShopClusters(true);
        }
    }

    public onMapListSearch(search: string): void {
        this.mapListSearchValue = search;

        this.mapListPagination = {
            ...this.mapListPagination,
            pageIndex: 1,
        };

        this.getRepairShopMapList();
    }

    public onMapListSort(sortDirection: string): void {
        this.mapListSortDirection = sortDirection;

        this.getRepairShopMapList();
    }

    public updateMapItem(item?): void {
        if (this.activeViewMode === TableStringEnum.MAP) {
            this.isAddedNewRepairShop = true;

            this.mapListPagination = {
                ...this.mapListPagination,
                pageIndex: 1,
            };

            this.mapClustersPagination = {
                ...this.mapClustersPagination,
                pageIndex: 1,
            };

            this.getRepairShopClusters();

            this.getRepairShopMapList();

            if (item) this.mapsService.markerUpdate(item);
        }
    }

    public trackByIdentity = (index: number, item: any): number => item?.id;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
        this.tableService.sendCurrentSwitchOptionSelected(null);

        this.resizeObserver.disconnect();
    }
}
