import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

// settings
import {
    getRepairTruckAndTrailerColumnDefinition,
    getRepairShopColumnDefinition,
} from '@shared/utils/settings/table-settings/repair-columns';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import {
    CaSearchMultipleStatesService,
    ICaMapProps,
    IMapMarkers,
    IMapBoundsZoom,
    IMapSelectedMarkerData,
    SortColumn,
    MapMarkerIconService,
    IMapPagination,
    IMapBounds,
} from 'ca-components';

// base classes
import { RepairDropdownMenuActionsBase } from '@pages/repair/base-classes';

// services
import { RepairService } from '@shared/services/repair.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { MapsService } from '@shared/services/maps.service';
import { RepairCardsModalService } from '@pages/repair/pages/repair-card-modal/services/repair-cards-modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';

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
import { DispatchColorFinderPipe } from '@shared/pipes';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { RepairTableStringEnum } from '@pages/repair/pages/repair-table/enums';
import { DropdownMenuStringEnum } from '@shared/enums';

// constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';
import { RepairShopMapConfig } from '@pages/repair/pages/repair-table/utils/constants/repair-shop-map.config';
import { RepairCardConfigConstants } from '@pages/repair/pages/repair-card/utils/constants';
import { RepairConfiguration } from '@pages/repair/pages/repair-table/utils/constants';

// helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import {
    RepairShopMapDropdownHelper,
    RepairTableBackFilterDataHelper,
    RepairTableDateFormaterHelper,
} from '@pages/repair/pages/repair-table/utils/helpers';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// models
import {
    MapList,
    MappedRepair,
    ShopBackFilter,
    ShopBackFilterQuery,
    RepairBackFilter,
    MappedRepairShop,
} from '@pages/repair/pages/repair-table/models';
import {
    RepairListResponse,
    RepairResponse,
    RepairShopListDto,
} from 'appcoretruckassist';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

@Component({
    selector: 'app-repair-table',
    templateUrl: './repair-table.component.html',
    styleUrls: [
        './repair-table.component.scss',
        '../../../../../assets/scss/maps.scss',
    ],
    providers: [ThousandSeparatorPipe, DispatchColorFinderPipe],
})
export class RepairTableComponent
    extends RepairDropdownMenuActionsBase
    implements OnInit, OnDestroy, AfterViewInit
{
    public destroy$ = new Subject<void>();

    public dropdownMenuStringEnum = DropdownMenuStringEnum;
    public tableStringEnum = TableStringEnum;

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab: string = TableStringEnum.ACTIVE;

    public isTrailerTabClicked: boolean = false;

    public repairTableData: RepairResponse[] = [];

    // table
    public tableOptions: any;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];

    public activeTableDataLength: number;

    public tabResultLength: number = 0;

    // cards
    public displayRows$: Observable<any>;

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

    // filters
    public filter: string;

    public backFilterQuery: RepairBackFilter =
        RepairTableBackFilterDataHelper.backRepairFilterData();

    public shopFilterQuery: ShopBackFilterQuery =
        TableDropdownComponentConstants.SHOP_FILTER_QUERY;

    // map
    public mapListData: MapList[] = [];
    public mapData: ICaMapProps = RepairShopMapConfig.repairShopMapConfig;

    public mapListPagination: IMapPagination =
        RepairShopMapConfig.repairShopMapListPagination;
    public mapClustersPagination: IMapPagination =
        RepairShopMapConfig.repairShopMapListPagination;

    public mapClustersObject: IMapBounds = null;

    public mapListSearchValue: string | null = null;
    public mapListSortDirection: string | null = null;

    public mapStateFilter: string[] | null = null;
    public mapListCount: number = 0;

    public repairShopMapListSortColumns: SortColumn[] =
        RepairShopMapConfig.repairShopMapListSortColumns;

    public isAddedNewRepairShop: boolean = false;
    public isSelectedFromMapList: boolean = false;
    public isSelectedFromDetails: boolean = false;

    constructor(
        // router
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected repairService: RepairService,
        protected reviewsRatingService: ReviewsRatingService,

        private tableService: TruckassistTableService,
        private mapsService: MapsService,
        private confirmationService: ConfirmationService,
        private repairCardsModalService: RepairCardsModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private markerIconService: MapMarkerIconService,

        // store
        private repairShopQuery: RepairShopQuery,
        private repairTruckQuery: RepairTruckQuery,
        private repairTrailerQuery: RepairTrailerQuery,
        private repairTrailerStore: RepairTrailerStore,
        private store: Store,

        // ref
        private ref: ChangeDetectorRef,

        // pipes
        private datePipe: DatePipe,
        private thousandSeparator: ThousandSeparatorPipe,
        private dispatchColorFinderPipe: DispatchColorFinderPipe
    ) {
        super();
    }

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

        this.addMapListScrollEvent();

        this.addSelectedMarkerListener();

        this.rowsSelected();

        this.openCloseBussinessSelectedRows();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();

        this.checkSelectedMarker();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    public trackByIdentity = (_: number, item: any): number => item?.id;

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const { id, array, type } = res;

                    const isRepairShop =
                        this.selectedTab === TableStringEnum.REPAIR_SHOP;

                    if (type === TableStringEnum.MULTIPLE_DELETE) {
                        isRepairShop
                            ? this.deleteRepairShopList(array)
                            : this.deleteRepairList(array);
                    } else if (type === TableStringEnum.DELETE) {
                        isRepairShop
                            ? this.deleteRepairShop(id)
                            : this.deleteRepair(id);
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
                        const { id, name, address } = repairShop;

                        return {
                            id,
                            data: {
                                ...repairShop,
                            },
                            modalTitle: name,
                            modalSecondTitle: address?.address,
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
                            ? this.mapRepairData(res.data)
                            : this.mapShopData(res.data)
                    );

                    this.viewData = this.viewData.map((repair) => {
                        if (repair.id === res.id) {
                            repair.actionAnimation = TableStringEnum.ADD;
                        }

                        return repair;
                    });

                    this.handleCloseAnimationAction(false);

                    if (this.activeViewMode === TableStringEnum.MAP) {
                        this.isAddedNewRepairShop = true;
                        this.getMapData();
                    }
                }

                // On Update Repair
                else if (
                    res?.animation === TableStringEnum.UPDATE &&
                    this.selectedTab === res.tab
                ) {
                    const updatedRepair =
                        res.tab !== TableStringEnum.REPAIR_SHOP
                            ? this.mapRepairData(res.data)
                            : this.mapShopData(res.data);

                    this.viewData = this.viewData.map((repair) => {
                        if (repair.id === res.id) {
                            repair = updatedRepair;
                            repair.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return repair;
                    });

                    this.handleCloseAnimationAction(false);

                    if (this.activeViewMode === TableStringEnum.MAP) {
                        this.isAddedNewRepairShop = true;
                        this.getMapData();
                    }
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

    private deleteRepair(repairId: number): void {
        this.repairService
            .deleteRepair(repairId, null, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((repair) =>
                        repair.id === repairId
                            ? {
                                  ...repair,
                                  actionAnimation: TableStringEnum.DELETE,
                              }
                            : repair
                    );

                    this.handleAfterActions();
                },
            });
    }

    private deleteRepairList(repairIds: number[]): void {
        let repairShopIds = [];

        repairIds.forEach((repairId) => {
            const repair = this.viewData.find(
                (repair) => repair?.id === repairId
            );

            const {
                repairShop: { id },
            } = repair;

            repairShopIds = [...repairShopIds, id];
        });

        this.repairService
            .deleteRepairList(repairIds, repairShopIds, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((repair) =>
                        repairIds.includes(repair.id)
                            ? {
                                  ...repair,
                                  actionAnimation: TableStringEnum.DELETE,
                              }
                            : repair
                    );

                    this.handleAfterActions();
                },
            });
    }

    public updateRepairShopStatus(repairShopId: number): void {
        this.repairService
            .updateRepairShopStatus(repairShopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendRepairData();

                this.handleAfterActions();
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
                showMoveToClosedList:
                    this.selectedTab === TableStringEnum.REPAIR_SHOP,
                hideSearch: this.activeViewMode === TableStringEnum.MAP,
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

            this.tableOptions.toolbarActions = {
                ...this.tableOptions.toolbarActions,
                viewModeOptions: [...viewModeOptions],
                hideSearch: this.activeViewMode === TableStringEnum.MAP,
            };
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
                        ? this.mapRepairData(data)
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
                    (this.sendDataToCardsBack =
                        this.displayRowsBackRepairShop));

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

        this.tabResultLength = td.data.length;
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

    public resetFilter(): void {
        this.tableService.sendCurrentSetTableFilter({});
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

                        this.updateMapItem();

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

                        this.updateMapItem();
                    }
                }

                if (res) {
                    switch (res.filterType) {
                        case RepairTableStringEnum.CATEGORY_REPAIR_FILTER:
                            this.backFilterQuery.categoryIds = res.queryParams;
                            break;
                        case RepairTableStringEnum.PM_FILTER:
                            this.backFilterQuery.pmTruckTitles =
                                res.queryParams;
                            break;
                        case RepairTableStringEnum.TRAILER_TYPE_FILTER:
                            this.backFilterQuery.trailerNumbers =
                                res.queryParams;
                            break;
                        case RepairTableStringEnum.TRUCK_TYPE_FILTER:
                            this.backFilterQuery.truckNumbers = res.queryParams;

                            break;
                        case RepairTableStringEnum.TIME_FILTER:
                            delete this.backFilterQuery.dateTo;
                            delete this.backFilterQuery.dateFrom;
                            if (res.queryParams) {
                                const { fromDate, toDate } =
                                    RepairTableDateFormaterHelper.getDateRange(
                                        res.queryParams?.timeSelected
                                    );

                                this.backFilterQuery.dateTo = toDate;
                                this.backFilterQuery.dateFrom = fromDate;
                            }
                            break;
                        case RepairTableStringEnum.STATE_FILTER:
                            if (res.action === TableStringEnum.SET) {
                                this.viewData = this.repairTableData?.filter(
                                    (address) => {
                                        const inCanadaArray =
                                            res.queryParams.canadaArray.some(
                                                (canadaState) =>
                                                    canadaState.stateName ===
                                                    address['address']['state']
                                            );

                                        const inUsaArray =
                                            res.queryParams.usaArray.some(
                                                (usaState) =>
                                                    usaState.stateName ===
                                                    address['address']['state']
                                            );

                                        return inCanadaArray || inUsaArray;
                                    }
                                );

                                this.mapStateFilter = [
                                    ...res.queryParams.canadaArray.map(
                                        (canadaState) => {
                                            return canadaState.stateName;
                                        }
                                    ),
                                    ...res.queryParams.usaArray.map(
                                        (usaState) => {
                                            return usaState.stateName;
                                        }
                                    ),
                                ];
                            }

                            if (res.action === TableStringEnum.CLEAR) {
                                this.viewData = this.repairTableData;
                                this.mapStateFilter = null;
                            }
                        case RepairTableStringEnum.MONEY_FILTER:
                            this.backFilterQuery.costFrom =
                                res.queryParams?.from;
                            this.backFilterQuery.costTo = res.queryParams?.to;
                            break;
                        default:
                            this.sendRepairData();
                            break;
                    }

                    if (this.selectedTab !== TableStringEnum.REPAIR_SHOP)
                        this.repairBackFilter(this.backFilterQuery);
                    else {
                        if (
                            res.filterType !==
                            RepairTableStringEnum.STATE_FILTER
                        )
                            this.shopBackFilter(this.backFilterQuery);

                        this.isAddedNewRepairShop = true;
                        this.getMapData();
                    }
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
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 2,
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
                        return this.mapRepairData(data);
                    });
                } else {
                    const newData = [...this.viewData];

                    repair.pagination.data.map((data) => {
                        newData.push(this.mapRepairData(data));
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
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );

                break;
            case TableStringEnum.INACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );

                break;
            case TableStringEnum.REPAIR_SHOP:
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
            this.tabResultLength = event.tabData.length;

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
                        type: DropdownMenuStringEnum.ADD_REPAIR_BILL_TRUCK,
                    }
                );
            } else if (this.selectedTab === TableStringEnum.INACTIVE) {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    {
                        size: TableStringEnum.LARGE,
                    },
                    {
                        type: DropdownMenuStringEnum.ADD_REPAIR_BILL_TRAILER,
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

    private mapRepairData(repair: RepairResponse): MappedRepair {
        const {
            repairType,
            date,
            datePaid,
            payType,
            truck,
            trailer,
            invoice,
            orderNumber,
            unitType,
            odometer,
            driver,
            repairShop,
            serviceTypes,
            shopServiceType,
            items,
            total,
            createdAt,
            updatedAt,
            files,
            fileCount,
        } = repair;

        // description items special styles index array
        const pmItemsIndexArray = [];

        items.forEach(
            (item, index) =>
                (item?.pmTruck || item?.pmTrailer) &&
                pmItemsIndexArray.push(index)
        );

        return {
            ...repair,
            isSelected: false,
            isRepairOrder: repairType?.name === DropdownMenuStringEnum.ORDER,
            tableIssued: this.datePipe.transform(
                date,
                TableStringEnum.DATE_FORMAT
            ),
            tablePaid: datePaid
                ? this.datePipe.transform(datePaid, TableStringEnum.DATE_FORMAT)
                : null,
            tablePayType: payType?.name,
            tableNumber: truck?.truckNumber || trailer?.trailerNumber,
            tableUnit: invoice || orderNumber,
            tableVehicleType: truck
                ? `${TableStringEnum.TRUCKS}/${truck?.truckType.logoName}`
                : `${TableStringEnum.TRAILERS}/${trailer?.trailerType.logoName}`,
            vehicleTypeClass: (
                truck?.truckType.name || trailer?.trailerType.name
            )
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            vehicleTooltipTitle:
                truck?.truckType.name || trailer?.trailerType.name,
            vehicleTooltipColor: this.dispatchColorFinderPipe.transform(
                truck?.truckType.id || trailer?.trailerType.id,
                unitType?.name?.toLowerCase(),
                true
            ),
            tableMake: truck?.truckMakeName || trailer?.trailerMakeName,
            tableModel: truck?.model || trailer?.model,
            tableYear: truck?.year || trailer?.year,
            tableOdometer: odometer
                ? this.thousandSeparator.transform(odometer) +
                  TableStringEnum.LETTER_M_MILES
                : null,
            avatarImg: driver?.avatarFile?.url,
            tableDriver: driver
                ? `${driver?.firstName} ${driver?.lastName}`
                : null,
            tableShopName: repairShop?.name,
            tableShopAdress: repairShop?.address?.address,
            tableServiceType: shopServiceType?.name,
            tableServices: serviceTypes,
            tableDescription: items
                ? items.map((item) => {
                      return {
                          ...item,
                          descriptionPrice: item?.price
                              ? TableStringEnum.DOLLAR_SIGN +
                                this.thousandSeparator.transform(item.price)
                              : null,
                          descriptionTotalPrice: item?.subtotal
                              ? TableStringEnum.DOLLAR_SIGN +
                                this.thousandSeparator.transform(item.subtotal)
                              : null,
                          pmDescription:
                              item?.pmTruck || item?.pmTrailer || null,
                      };
                  })
                : null,
            tableDescriptionSpecialStylesIndexArray: pmItemsIndexArray,
            tableDescriptionDropTotal: total
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(total)
                : null,
            tableCost: total
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(total)
                : null,
            tableAdded: this.datePipe.transform(
                createdAt,
                TableStringEnum.DATE_FORMAT
            ),
            tableEdited: this.datePipe.transform(
                updatedAt,
                TableStringEnum.DATE_FORMAT
            ),
            tableAttachments: files,
            fileCount,
            tableDropdownContent: this.getRepairDropdownContent(
                repairType?.name
            ),
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
            tableOpenHours: {
                openHours,
                openHoursToday,
            },
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
            isFavoriteDisabled: !status || companyOwned,
            tableDropdownContent: this.getRepairShopDropdownContent(
                !!status,
                pinned,
                companyOwned
            ),
        };
    }

    private getRepairDropdownContent(repairType: string): DropdownMenuItem[] {
        return DropdownMenuContentHelper.getRepairDropdownContent(
            this.selectedTab,
            repairType
        );
    }

    private getRepairShopDropdownContent(
        isOpenBusiness: boolean,
        isPinned: boolean,
        isCompanyOwned: boolean
    ): DropdownMenuItem[] {
        return DropdownMenuContentHelper.getRepairShopDropdownContent(
            isOpenBusiness,
            isPinned,
            isCompanyOwned
        );
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
                                    : TableStringEnum.REPAIR_SHOP_3,
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

    public onGetInfoWindowData(
        markerId: number,
        isFromMapList?: boolean
    ): void {
        this.mapsService.selectedMarker(markerId);

        this.isSelectedFromMapList = isFromMapList;

        this.getMapData(false, markerId);
    }

    public getRepairShopById(markerId: number): void {
        this.repairService
            .getRepairShopById(markerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const repairShopData = this.mapShopData(res);

                    let selectedMarkerData: IMapSelectedMarkerData | null =
                        null;

                    this.mapData.clusterMarkers.forEach((clusterMarker) => {
                        const clusterItemIndex =
                            clusterMarker.infoWindowContent?.clusterData?.findIndex(
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

                    const markerData = this.mapData.markers.find(
                        (marker) => marker.data?.id === markerId
                    );

                    if (markerData)
                        selectedMarkerData = {
                            ...markerData,
                            infoWindowContent:
                                RepairShopMapDropdownHelper.getRepairShopMapDropdownConfig(
                                    repairShopData
                                ),
                            data: repairShopData,
                        };

                    this.mapsService.selectedMarker(
                        selectedMarkerData ? repairShopData.id : null
                    );

                    this.mapData = { ...this.mapData, selectedMarkerData };

                    this.ref.detectChanges();
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

        if (this.isSelectedFromDetails) {
            this.onGetInfoWindowData(this.mapsService.selectedMarkerId);
            this.isSelectedFromDetails = false;
        } else this.getMapData();
    }

    public getRepairShopClusters(
        isClusterPagination?: boolean,
        selectedMarkerId?: number
    ): void {
        this.repairService
            .getRepairShopClusters(
                this.mapClustersObject?.northEastLatitude,
                this.mapClustersObject?.northEastLongitude,
                this.mapClustersObject?.southWestLatitude,
                this.mapClustersObject?.southWestLongitude,
                this.mapClustersObject?.zoomLevel,
                this.isAddedNewRepairShop, // addedNew flag
                null, // shipperLong
                null, // shipperLat
                null, // shipperDistance
                this.mapStateFilter, // shipperStates
                this.backFilterQuery.categoryIds, // categoryIds?: Array<number>,
                null, // _long?: number,
                null, // lat?: number,
                null, // distance?: number,
                this.backFilterQuery.costFrom, // costFrom?: number,
                this.backFilterQuery.costTo, // costTo?: number,
                null, // lastFrom?: number,
                null, // lastTo?: number,
                null, // ppgFrom?: number,
                null, // ppgTo?: number,
                this.mapsService.selectedMarkerId ?? null, // selectedId
                this.filter === TableStringEnum.CLOSED_ARRAY ? 0 : null, // active
                this.mapClustersPagination.pageIndex, // pageIndex
                this.mapClustersPagination.pageSize, // pageSize
                null, // companyId
                this.mapListSortDirection ?? null, // sortBy
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

                    clustersResponse?.forEach((data) => {
                        const previousClusterData =
                            this.mapData.clusterMarkers.find(
                                (item) =>
                                    item.position.lat === data.latitude &&
                                    item.position.lng === data.longitude
                            );

                        const previousMarkerData = this.mapData.markers.find(
                            (item2) =>
                                item2.position.lat === data.latitude &&
                                item2.position.lng === data.longitude
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

                        if (previousClusterData || previousMarkerData) {
                            const newMarkerData = {
                                ...(previousMarkerData || previousClusterData),
                                infoWindowContent: clusterInfoWindowContent,
                            };

                            if (data.count > 1)
                                clusterMarkers.push(newMarkerData);
                            else markers.push(newMarkerData);
                        } else {
                            let markerData: IMapMarkers = {
                                position: {
                                    lat: data.latitude,
                                    lng: data.longitude,
                                },
                                infoWindowContent: clusterInfoWindowContent,
                                label: data.name,
                                isFavorite: data.favourite,
                                isClosed: data.isClosed,
                                id: data.id,
                                data,
                            };

                            const markerIcon =
                                data.count > 1
                                    ? this.markerIconService.getClusterMarkerIcon(
                                          markerData
                                      )
                                    : this.markerIconService.getMarkerIcon(
                                          data.id,
                                          data.name,
                                          data.isClosed,
                                          data.favourite
                                      );

                            markerData = {
                                ...markerData,
                                content: markerIcon,
                            };

                            if (data.count > 1) clusterMarkers.push(markerData);
                            else markers.push(markerData);
                        }
                    });

                    this.mapData = {
                        ...this.mapData,
                        clusterMarkers,
                        markers,
                    };
                }

                if (this.isAddedNewRepairShop)
                    this.isAddedNewRepairShop = false;

                if (selectedMarkerId) this.getRepairShopById(selectedMarkerId);

                this.ref.detectChanges();
            });
    }

    public getRepairShopMapList(): void {
        if (!this.mapClustersObject) return;

        this.repairService
            .getRepairShopMapList(
                this.mapClustersObject?.northEastLatitude,
                this.mapClustersObject?.northEastLongitude,
                this.mapClustersObject?.southWestLatitude,
                this.mapClustersObject?.southWestLongitude,
                this.backFilterQuery.categoryIds, // category ids
                null, // _long
                null, // lat
                null, // distance
                this.backFilterQuery.costFrom, // costFrom
                this.backFilterQuery.costTo, // costTo
                this.filter === TableStringEnum.CLOSED_ARRAY ? 0 : null, // active
                this.mapStateFilter, // states
                !this.isSelectedFromMapList
                    ? this.mapsService.selectedMarkerId
                    : null, // selectedId
                this.mapListPagination.pageIndex,
                this.mapListPagination.pageSize,
                null, // companyId
                this.mapListSortDirection ?? null, // sort
                this.mapListSearchValue, // search
                null, // search1
                null // search2
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((mapListResponse) => {
                const mappedListData = mapListResponse?.pagination?.data?.map(
                    (item) => {
                        const mapItemData = this.mapShopData(item);

                        return mapItemData;
                    }
                );

                this.mapListCount = mapListResponse?.pagination?.count;

                this.mapListData =
                    this.mapListPagination.pageIndex > 1
                        ? [...this.mapListData, ...mappedListData]
                        : mappedListData;
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

        this.isSelectedFromMapList = false;

        this.mapsService.selectedMarker(null);

        if (this.activeViewMode === TableStringEnum.MAP) {
            this.getRepairShopClusters();

            this.getRepairShopMapList();
        }

        this.ref.detectChanges();
    }

    public addMapListScrollEvent(): void {
        this.mapsService.mapListScrollChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const isNewPage =
                    this.mapListCount / this.mapListPagination.pageIndex > 25;

                if (isNewPage) {
                    this.mapListPagination = {
                        ...this.mapListPagination,
                        pageIndex: this.mapListPagination.pageIndex + 1,
                    };

                    this.getRepairShopMapList();
                }
            });
    }

    public addSelectedMarkerListener(): void {
        this.mapsService.selectedMapListCardChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id) this.onGetInfoWindowData(id, true);
                else this.onResetSelectedMarkerItem();
            });
    }

    public onClusterMarkerClick(selectedMarker: IMapMarkers): void {
        if (this.mapsService.selectedMarkerId) this.onResetSelectedMarkerItem();

        const selectedMarkerData: IMapSelectedMarkerData | null =
            this.mapData.clusterMarkers.find(
                (clusterMarker) =>
                    clusterMarker.position.lat ===
                        selectedMarker.position.lat &&
                    clusterMarker.position.lng === selectedMarker.position.lng
            ) ?? null;

        this.mapData = { ...this.mapData, selectedMarkerData };

        this.ref.detectChanges();
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

    public updateMapItem<T>(repairShop?: T): void {
        if (this.activeViewMode === TableStringEnum.MAP) {
            this.isAddedNewRepairShop = true;

            this.getMapData();

            if (repairShop) this.mapsService.markerUpdate(repairShop);
        }
    }

    public getMapData(
        isClusterPagination?: boolean,
        selectedMarkerId?: number
    ): void {
        this.mapListPagination = {
            ...this.mapListPagination,
            pageIndex: 1,
        };

        this.mapClustersPagination = {
            ...this.mapClustersPagination,
            pageIndex: 1,
        };

        if (this.activeViewMode === TableStringEnum.MAP) {
            this.getRepairShopClusters(isClusterPagination, selectedMarkerId);

            this.getRepairShopMapList();
        }
    }

    public checkSelectedMarker(): void {
        const isAlreadySelectedMarker =
            this.mapData?.selectedMarkerData?.data?.id ===
            this.mapsService.selectedMarkerId;

        if (this.mapsService.selectedMarkerId && !isAlreadySelectedMarker)
            this.isSelectedFromDetails = true;
    }

    public handleShowMoreAction(): void {
        const isRepairShopTab =
            this.selectedTab === TableStringEnum.REPAIR_SHOP;

        const filterQuery = isRepairShopTab
            ? this.shopFilterQuery
            : this.backFilterQuery;

        filterQuery.pageIndex++;

        isRepairShopTab
            ? this.shopBackFilter(filterQuery, true)
            : this.repairBackFilter(filterQuery, true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();
    }
}
