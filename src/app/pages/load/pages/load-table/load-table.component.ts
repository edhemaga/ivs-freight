import {
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';

// Modals
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// Services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TableCardDropdownActionsService } from '@shared/components/ta-table-card-dropdown-actions/services/table-card-dropdown-actions.service';
import { CardsModalConfigService } from '@shared/components/ta-shared-modals/cards-modal/services/cards-modal-config.service';
import { LoadCardModalService } from '@pages/load/pages/load-card-modal/services/load-card-modal.service';

// Models
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '@shared/utils/settings/table-settings/load-columns';
import {
    DeleteComment,
    DropdownItem,
} from '@shared/models/card-models/card-table-data.model';
import { GridColumn } from '@shared/models/table-models/grid-column.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { LoadListResponse } from 'appcoretruckassist';
import { LoadModel } from '@pages/load/pages/load-table/models/load.model';

// Queries
import { LoadActiveQuery } from '@pages/load/state/load-active-state/load-active.query';
import { LoadClosedQuery } from '@pages/load/state/load-closed-state/load-closed.query';
import { LoadPendingQuery } from '@pages/load/state/load-pending-state/load-pending.query';
import { LoadTemplateQuery } from '@pages/load/state/load-template-state/load-template.query';

// Store
import { LoadActiveState } from '@pages/load/state/load-active-state/load-active.store';
import { LoadClosedState } from '@pages/load/state/load-closed-state/load-closed.store';
import { LoadPandingState } from '@pages/load/state/load-pending-state/load-pending.store';
import { LoadTemplateState } from '@pages/load/state/load-template-state/load-template.store';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { DatePipe } from '@angular/common';
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

//Helpers
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums/load-modal-string.enum';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string,enum';
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { LoadModalStopItemsStringEnum } from '@pages/load/enums/load-modal-stop-items-string.enum';
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';

// Components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// Store
import { LoadQuery } from '@shared/components/ta-shared-modals/cards-modal/state/load-modal.query';
import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectPendingTabCards,
} from '@pages/load/pages/load-card-modal/state/load-card-modal.selectors';

// Utils
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-date-formater.helper';
import { DropdownContentHelper } from '@shared/utils/helpers/dropdown-content.helper';

@Component({
    selector: 'app-load-table',
    templateUrl: './load-table.component.html',
    styleUrls: ['./load-table.component.scss'],
    providers: [ThousandSeparatorPipe, NameInitialsPipe],
})
export class LoadTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public loadTableData: any[] = [];
    public tableOptions;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = TableStringEnum.PENDING;
    public activeViewMode: string = TableStringEnum.LIST;
    public resizeObserver: ResizeObserver;
    public loadActive: LoadActiveState[] = [];
    public loadClosed: LoadClosedState[] = [];
    public loadPanding: LoadPandingState[] = [];
    public loadTemplate: LoadTemplateState[] = [];

    public loadingPage: boolean = false;
    public activeTableData: CardTableData;
    public backLoadFilterQuery: FilterOptionsLoad =
        TableDropdownComponentConstants.LOAD_BACK_FILTER;

    public cardTitleLink: string = TableStringEnum.LOAD_DETAILS;

    public cardTitle: string;
    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    public mapingIndex: number = 0;
    public dataSubscription: Subscription;

    public displayRows$: Observable<any>; //leave this as any for now

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private loadServices: LoadService,
        private tableDropdownService: TableCardDropdownActionsService,
        private loadActiveQuery: LoadActiveQuery,
        private loadClosedQuery: LoadClosedQuery,
        private loadPandinQuery: LoadPendingQuery,
        private loadTemplateQuery: LoadTemplateQuery,
        private thousandSeparator: ThousandSeparatorPipe,
        public datePipe: DatePipe,
        private confiramtionService: ConfirmationService,
        private nameInitialsPipe: NameInitialsPipe,
        private loadQuery: LoadQuery,
        private cardsModalService: CardsModalConfigService,
        private loadCardsModalService: LoadCardModalService,

        private cdRef: ChangeDetectorRef,

        //store
        private store: Store
    ) {}

    ngOnInit(): void {
        this.sendLoadData();

        this.resetColumns();

        this.getSelectedTabTableData();

        this.resize();

        this.toggleColumns();

        this.search();

        this.deleteSelectedRows();

        this.driverActions();

        this.setTableFilter();

        this.commentsUpdate();

        this.onDropdownActions();

        this.watchForLoadChanges();

        this.getLoadStatusFilter();

        this.getLoadDispatcherFilter();

        this.confirmationDataSubscribe();

        this.currentSelectedRowsSubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private watchForLoadChanges(): void {
        this.loadServices.modalAction$.subscribe((action) => {
            this.sendLoadData();
        });
    }

    private confirmationDataSubscribe(): void {
        this.confiramtionService.confirmationData$.subscribe((res) => {
            if (res.type === TableStringEnum.DELETE) {
                if (this.selectedTab === TableStringEnum.TEMPLATE) {
                    this.deleteLoadTemplateById(res.id);
                } else {
                    this.deleteLoadById(res.id);
                }
            } else if (res.type === TableStringEnum.MULTIPLE_DELETE) {
                if (this.selectedTab === TableStringEnum.TEMPLATE) {
                    this.deleteLoadTemplateList(res.array);
                } else {
                    this.deleteLoadList(res.array);
                }
            }
        });
    }

    private pendingTabCardsConfig(): void {
        this.loadQuery.pending$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const filteredCardRowsFront =
                        res.front_side.filter(Boolean);

                    const filteredCardRowsBack = res.back_side.filter(Boolean);

                    this.cardTitle = TableStringEnum.LOAD_INVOICE;

                    this.sendDataToCardsFront = filteredCardRowsFront;

                    this.sendDataToCardsBack = filteredCardRowsBack;
                }
            });
    }

    private templateTabCardsConfig(): void {
        this.loadQuery.template$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const filteredCardRowsFront = res.front_side.filter(
                        (row) => row !== null
                    );

                    const filteredCardRowsBack = res.back_side.filter(
                        (row) => row !== null
                    );

                    this.cardTitle = TableStringEnum.LOAD_INVOICE;

                    this.sendDataToCardsFront = filteredCardRowsFront;

                    this.sendDataToCardsBack = filteredCardRowsBack;
                }
            });
    }

    private activeTabCardsConfig(): void {
        this.loadQuery.active$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const filteredCardRowsFront =
                        res.front_side.filter(Boolean);

                    const filteredCardRowsBack = res.back_side.filter(Boolean);

                    this.cardTitle = TableStringEnum.LOAD_INVOICE;

                    this.sendDataToCardsFront = filteredCardRowsFront;

                    this.sendDataToCardsBack = filteredCardRowsBack;
                }
            });
    }

    private closedTabCardsConfig(): void {
        this.loadQuery.closed$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const filteredCardRowsFront =
                        res.front_side.filter(Boolean);

                    const filteredCardRowsBack = res.back_side.filter(Boolean);

                    this.cardTitle = TableStringEnum.LOAD_INVOICE;

                    this.sendDataToCardsFront = filteredCardRowsFront;

                    this.sendDataToCardsBack = filteredCardRowsBack;
                }
            });
    }

    public commentsUpdate(): void {
        this.dataSubscription = this.loadServices.data$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                const foundObject = this.viewData.findIndex(
                    (item) => item.id === data.entityTypeId
                );
                if (foundObject !== -1) {
                    this.viewData[foundObject].comments.push(data);

                    this.viewData[foundObject].commentsCount =
                        this.viewData[foundObject].commentsCount + 1;
                }
            });

        this.dataSubscription = this.loadServices.removeComment$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: DeleteComment) => {
                const foundObject = this.viewData.find(
                    (item) => item.id === data.entityTypeId
                );
                const indexToRemove = foundObject.comments.findIndex(
                    (comment) => comment.id === data.commentId
                );
                if (indexToRemove !== -1) {
                    foundObject.comments.splice(indexToRemove, 1);
                    foundObject.commentsCount = foundObject.commentsCount - 1;
                }
            });
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                switch (res?.filterType) {
                    case LoadFilterStringEnum.USER_FILTER:
                        this.backLoadFilterQuery.dispatcherIds =
                            res.queryParams ?? null;

                        this.loadBackFilter(this.backLoadFilterQuery);

                        break;
                    case LoadFilterStringEnum.STATUS_FILTER:
                        this.backLoadFilterQuery.status =
                            res.queryParams ?? null;

                        this.loadBackFilter(this.backLoadFilterQuery);

                        break;
                    case LoadFilterStringEnum.TIME_FILTER:
                        if (res.queryParams?.timeSelected) {
                            const { fromDate, toDate } =
                                RepairTableDateFormaterHelper.getDateRange(
                                    res.queryParams?.timeSelected,
                                    res.queryParams.year ?? null
                                );

                            this.backLoadFilterQuery.dateTo = toDate;
                            this.backLoadFilterQuery.dateFrom = fromDate;
                        } else {
                            this.backLoadFilterQuery.dateTo = null;
                            this.backLoadFilterQuery.dateFrom = null;
                        }

                        this.loadBackFilter(this.backLoadFilterQuery);

                        break;
                    case LoadFilterStringEnum.MONEY_FILTER:
                        this.backLoadFilterQuery.rateFrom =
                            res.queryParams?.firstFormFrom ?? null;
                        this.backLoadFilterQuery.rateTo =
                            res.queryParams?.firstFormTo ?? null;

                        this.backLoadFilterQuery.paidFrom =
                            res.queryParams?.secondFormFrom ?? null;
                        this.backLoadFilterQuery.paidTo =
                            res.queryParams?.secondFormTo ?? null;

                        this.backLoadFilterQuery.dueFrom =
                            res.queryParams?.thirdFormFrom ?? null;
                        this.backLoadFilterQuery.dueTo =
                            res.queryParams?.thirdFormTo ?? null;

                        this.loadBackFilter(this.backLoadFilterQuery);

                        break;
                    case LoadFilterStringEnum.LOAD_TYPE_FILTER:
                        this.backLoadFilterQuery.loadType =
                            res.queryParams?.loadType ?? null;

                        this.loadBackFilter(this.backLoadFilterQuery);

                        break;
                    default:
                        this.sendLoadData();
                        break;
                }

                if (res?.filteredArray) {
                    if (!res.selectedFilter) {
                        this.viewData = this.loadTableData?.filter((loadData) =>
                            res.filteredArray.every(
                                (filterData) => filterData.id === loadData.id
                            )
                        );
                    }

                    if (res.selectedFilter) this.viewData = this.loadTableData;
                }
            });
    }

    // Resize
    private resize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
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

    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendLoadData();
                }
            });
    }

    private toggleColumns(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((col) => {
                        if (col.field === response.column.field) {
                            col.hidden = response.column.hidden;
                        }

                        return col;
                    });
                }
            });
    }

    private search(): void {
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backLoadFilterQuery.statusType =
                        this.selectedTab === TableStringEnum.TEMPLATE
                            ? undefined
                            : this.selectedTab === TableStringEnum.ACTIVE
                            ? 2
                            : this.selectedTab === TableStringEnum.CLOSED
                            ? 3
                            : 1;
                    this.backLoadFilterQuery.pageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backLoadFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            this.loadBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.backLoadFilterQuery.searchOne = null;
                            this.backLoadFilterQuery.searchTwo = null;
                            this.backLoadFilterQuery.searchThree = null;

                            this.loadBackFilter(this.backLoadFilterQuery);
                        }
                    }
                }
            });
    }

    private deleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length && !this.loadingPage) {
                    const loadTab =
                        this.selectedTab === TableStringEnum.TEMPLATE
                            ? TableStringEnum.TEMPLATE_2
                            : this.selectedTab === TableStringEnum.ACTIVE
                            ? TableStringEnum.ACTIVE_2
                            : this.selectedTab === TableStringEnum.CLOSED
                            ? TableStringEnum.CLOSED_2
                            : TableStringEnum.PENDING_2;

                    const modalTitle =
                        TableStringEnum.DELETE_2 +
                        LoadModalStringEnum.EMPTY_SPACE_STRING +
                        loadTab +
                        (loadTab === TableStringEnum.TEMPLATE_2
                            ? LoadModalStringEnum.EMPTY_STRING
                            : LoadModalStringEnum.EMPTY_SPACE_STRING +
                              TableStringEnum.LOAD_2);

                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                name:
                                    this.selectedTab ===
                                    TableStringEnum.TEMPLATE
                                        ? item.tableData.name
                                        : item.tableData?.fullName,
                            },
                        };
                    });
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.LOAD,
                            type: TableStringEnum.MULTIPLE_DELETE,
                            subType: this.selectedTab,
                            modalHeaderTitle: modalTitle,
                        }
                    );
                }
            });
    }

    private driverActions(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // On Add Driver Active

                if (
                    res?.animation === TableStringEnum.ADD &&
                    this.selectedTab === TableStringEnum.ACTIVE
                ) {
                }
                // On Update Driver
                else if (res?.animation === TableStringEnum.UPDATE) {
                }
                // On Update Driver Status
                else if (res?.animation === TableStringEnum.UPDATE_STATUS) {
                }
                // On Delete Driver
                else if (res?.animation === TableStringEnum.DELETE) {
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
                hideActivationButton: true,
                showDispatcherFilter:
                    this.selectedTab !== TableStringEnum.TEMPLATE,
                showTimeFilter: this.selectedTab !== TableStringEnum.TEMPLATE,
                showStatusFilter: this.selectedTab !== TableStringEnum.TEMPLATE,
                //showLtlFilter: true, - hide for now
                showMoneyFilter: true,
                loadMoneyFilter: true,
                hideDeleteButton:
                    this.selectedTab !== TableStringEnum.TEMPLATE &&
                    this.selectedTab !== TableStringEnum.PENDING,
                viewModeOptions: [
                    {
                        name: TableStringEnum.LIST,
                        active: this.activeViewMode === TableStringEnum.LIST,
                    },
                    {
                        name: TableStringEnum.CARD,
                        active: this.activeViewMode === TableStringEnum.CARD,
                    },
                ],
            },
        };
    }

    public getStatusLabelStyle(status: string | undefined): string {
        const styles = TableStringEnum.STYLES;

        if (status === TableStringEnum.ASSIGNED) {
            return styles + TableStringEnum.ASSIGNED_COLOR;
        } else if (status === TableStringEnum.LOADED) {
            return styles + TableStringEnum.LOADED_COLOR;
        } else if (status === TableStringEnum.DISPATCHED) {
            return styles + TableStringEnum.DISPATCHED_COLOR;
        } else {
            return styles + TableStringEnum.DEFAULT_COLOR;
        }
    }

    private sendLoadData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(TableStringEnum.LOAD_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const loadCount = JSON.parse(
            localStorage.getItem(TableStringEnum.LOAD_TABLE_COUNT)
        );

        const loadTemplateData =
            this.selectedTab === TableStringEnum.TEMPLATE
                ? this.getTabData(TableStringEnum.TEMPLATE)
                : [];

        const loadPendingData =
            this.selectedTab === TableStringEnum.PENDING
                ? this.getTabData(TableStringEnum.PENDING)
                : [];

        const loadActiveData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const repairClosedData =
            this.selectedTab === TableStringEnum.CLOSED
                ? this.getTabData(TableStringEnum.CLOSED)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.TEMPLATE_2,
                field: TableStringEnum.TEMPLATE,
                length: loadCount.templateCount,
                data: loadTemplateData,
                extended: false,
                gridNameTitle: TableStringEnum.LOAD,
                moneyCountSelected: false,
                ltlArray: DataFilterHelper.checkSpecialFilterArray(
                    loadTemplateData,
                    TableStringEnum.LTL,
                    TableStringEnum.TYPE
                ),
                ftlArray: DataFilterHelper.checkSpecialFilterArray(
                    loadTemplateData,
                    TableStringEnum.FTL,
                    TableStringEnum.TYPE
                ),
                stateName: TableStringEnum.LOADS,
                tableConfiguration: 'LOAD_TEMPLATE',
                isActive: this.selectedTab === TableStringEnum.TEMPLATE,
                gridColumns: this.getGridColumns(
                    TableStringEnum.TEMPLATE,
                    'LOAD_TEMPLATE'
                ),
            },
            {
                title: TableStringEnum.PENDING_2,
                field: TableStringEnum.PENDING,
                length: loadCount.pendingCount,
                data: loadPendingData,
                extended: false,
                moneyCountSelected: false,
                gridNameTitle: TableStringEnum.LOAD,
                ltlArray: DataFilterHelper.checkSpecialFilterArray(
                    loadPendingData,
                    TableStringEnum.LTL,
                    TableStringEnum.TYPE
                ),
                ftlArray: DataFilterHelper.checkSpecialFilterArray(
                    loadPendingData,
                    TableStringEnum.FTL,
                    TableStringEnum.TYPE
                ),
                stateName: TableStringEnum.LOADS,
                tableConfiguration: 'LOAD_REGULAR',
                isActive: this.selectedTab === TableStringEnum.PENDING,
                gridColumns: this.getGridColumns(
                    TableStringEnum.PENDING,
                    'LOAD_REGULAR'
                ),
            },
            {
                title: TableStringEnum.ACTIVE_2,
                field: TableStringEnum.ACTIVE,
                length: loadCount.activeCount,
                data: loadActiveData,
                moneyCountSelected: false,
                ftlArray: DataFilterHelper.checkSpecialFilterArray(
                    loadActiveData,
                    TableStringEnum.FTL,
                    TableStringEnum.TYPE
                ),
                extended: false,
                gridNameTitle: TableStringEnum.LOAD,
                stateName: TableStringEnum.LOADS,
                tableConfiguration: 'LOAD_REGULAR',
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    TableStringEnum.ACTIVE,
                    'LOAD_REGULAR'
                ),
            },
            {
                title: TableStringEnum.CLOSED_2,
                field: TableStringEnum.CLOSED,
                length: loadCount.closedCount,
                moneyCountSelected: false,
                data: repairClosedData,
                ftlArray: DataFilterHelper.checkSpecialFilterArray(
                    repairClosedData,
                    TableStringEnum.FTL,
                    TableStringEnum.TYPE
                ),
                extended: false,
                gridNameTitle: TableStringEnum.LOAD,
                stateName: TableStringEnum.LOADS,
                tableConfiguration: 'LOAD_CLOSED',
                isActive: this.selectedTab === TableStringEnum.CLOSED,
                gridColumns: this.getGridColumns(
                    TableStringEnum.CLOSED,
                    'LOAD_CLOSED'
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);
        this.setLoadData(td);
        this.updateCardView();
        this.cdRef.detectChanges();
    }

    private getGridColumns(activeTab: string, configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (activeTab === TableStringEnum.TEMPLATE) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadTemplateColumnDefinition();
        } else if (activeTab === TableStringEnum.CLOSED) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadClosedColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadActiveAndPendingColumnDefinition();
        }
    }

    private setLoadData(td: CardTableData): void {
        this.columns = td.gridColumns;
        if (td.data?.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapLoadData(data);
            });
        } else {
            this.viewData = [];
        }

        this.loadTableData = this.viewData;
    }

    private setTruckTooltipColor(truckName: string): string {
        if (truckName === TruckNameStringEnum.SEMI_TRUCK) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (truckName === TruckNameStringEnum.SEMI_SLEEPER) {
            return TooltipColorsStringEnum.YELLOW;
        } else if (truckName === TruckNameStringEnum.BOX_TRUCK) {
            return TooltipColorsStringEnum.RED;
        } else if (truckName === TruckNameStringEnum.CARGO_VAN) {
            return TooltipColorsStringEnum.BLUE;
        } else if (truckName === TruckNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (truckName === TruckNameStringEnum.TOW_TRUCK) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (truckName === TruckNameStringEnum.SPOTTER) {
            return TooltipColorsStringEnum.BROWN;
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        if (trailerName === TrailerNameStringEnum.REEFER) {
            return TooltipColorsStringEnum.BLUE;
        } else if (trailerName === TrailerNameStringEnum.DRY_VAN) {
            return TooltipColorsStringEnum.DARK_BLUE;
        } else if (trailerName === TrailerNameStringEnum.DUMPER) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (trailerName === TrailerNameStringEnum.TANKER) {
            return TooltipColorsStringEnum.GREEN;
        } else if (trailerName === TrailerNameStringEnum.PNEUMATIC_TANKER) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER_STINGER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CHASSIS) {
            return TooltipColorsStringEnum.BROWN;
        } else if (trailerName === TrailerNameStringEnum.LOW_BOY_RGN) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.STEP_DECK) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.FLAT_BED) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.SIDE_KIT) {
            return TooltipColorsStringEnum.ORANGE;
        } else if (trailerName === TrailerNameStringEnum.CONESTOGA) {
            return TooltipColorsStringEnum.GOLD;
        } else if (trailerName === TrailerNameStringEnum.CONTAINER) {
            return TooltipColorsStringEnum.YELLOW;
        }
    }

    private mapLoadData(data: LoadModel) /* : LoadModel */ {
        let commentsWithAvatarColor;
        if (data.comments) {
            commentsWithAvatarColor = Object.values(data?.comments).map(
                (comment) => {
                    this.mapingIndex++;
                    return {
                        ...comment,
                        avatarColor: AvatarColorsHelper.getAvatarColors(
                            this.mapingIndex
                        ),
                        textShortName: this.nameInitialsPipe.transform(
                            comment.companyUser.fullName
                        ),
                    };
                }
            );
        }

        const {
            id,
            billing,
            broker,
            createdAt,
            delivery,
            dispatcher,
            driver,
            fileCount,
            lastStatusPassed,
            loadDetails,
            loadNumber,
            loadRequirements,
            baseRate,
            additionalBillingRatesTotal,
            loadType,
            miles,
            pickup,
            status,
            advancePay,
            totalRate,
            updatedAt,
        } = data;

        return {
            ...data,
            id,
            isSelected: false,
            loadInvoice: {
                invoice: loadNumber
                    ? loadNumber
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                type: loadType?.name
                    ? loadType.name
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadDispatcher: {
                name: dispatcher?.fullName
                    ? dispatcher.fullName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                avatar: dispatcher?.avatarFile?.url,
            },
            avatarImg: driver?.avatarFile?.url,
            tableDriver: driver?.firstName
                ? driver?.firstName + ' ' + driver?.lastName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTruck: driver?.truckNumber,
            tableTrailer: driver?.trailerNumber,
            loadTotal: {
                total: totalRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(totalRate)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                subTotal: data?.totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(data.totalAdjustedRate)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadBroker: {
                hasBanDnu: broker?.ban || broker?.dnu,
                isDnu: broker?.dnu,
                name: broker?.businessName
                    ? broker.businessName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            contact: broker?.contact,
            phone: broker?.phone,
            referenceNumber: loadDetails?.referenceNumber,
            textCommodity: loadDetails?.generalCommodityName,
            textWeight: loadDetails?.weight,
            tableTrailerColor: this.setTrailerTooltipColor(
                loadRequirements?.trailerType?.name
            ),
            tableTrailerName: loadRequirements?.trailerType?.name,
            tableTruckColor: this.setTruckTooltipColor(
                loadRequirements?.truckType?.name
            ),
            truckTypeClass: loadRequirements?.truckType?.logoName
                ? loadRequirements?.truckType?.logoName.replace(
                      TableStringEnum.SVG,
                      TableStringEnum.EMPTY_STRING_PLACEHOLDER
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTrailerTypeClass: loadRequirements?.trailerType?.logoName
                ? loadRequirements?.trailerType?.logoName.replace(
                      TableStringEnum.SVG,
                      TableStringEnum.EMPTY_STRING_PLACEHOLDER
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTruckName: loadRequirements?.truckType?.name,
            loadTrailerNumber: loadRequirements?.trailerType?.logoName,
            loadTruckNumber:
                loadRequirements?.truckType?.logoName ??
                TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            loadPickup: [
                {
                    count: pickup?.count ?? null,
                    location: pickup?.location,
                    date: pickup?.date
                        ? this.datePipe.transform(
                              pickup?.date,
                              TableStringEnum.DATE_FORMAT
                          )
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    time: pickup?.time
                        ? pickup?.time
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    delivery: false,
                },
                {
                    count: delivery?.count ?? null,
                    location: delivery?.location,
                    date: delivery?.date
                        ? this.datePipe.transform(
                              delivery?.date,
                              TableStringEnum.DATE_FORMAT
                          )
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    time: delivery?.time
                        ? delivery?.time
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    delivery: true,
                },
            ],

            loadStatus: {
                status: status?.statusValue?.name
                    ? status?.statusValue?.name
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                color: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                tab: this.selectedTab,
                time:
                    (lastStatusPassed?.days
                        ? lastStatusPassed?.days +
                          ' ' +
                          TableStringEnum.DAY +
                          ' '
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER) +
                    (lastStatusPassed?.hours
                        ? lastStatusPassed?.hours +
                          ' ' +
                          TableStringEnum.HOURS +
                          ' '
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER) +
                    (lastStatusPassed?.minutes
                        ? lastStatusPassed?.minutes +
                          ' ' +
                          TableStringEnum.MINUTES
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER),
            },
            total: miles?.totalMiles,
            empty: miles?.emptyMiles,
            loaded: miles?.loaded,
            tableDoorType: loadRequirements?.doorType?.name,
            tableSuspension: loadRequirements?.suspension?.name,
            year: loadRequirements?.year,
            liftgate: loadRequirements?.liftgate
                ? LoadModalStopItemsStringEnum.YES
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAssignedUnitTruck: {
                text: driver?.truckNumber,
                type: driver?.truckType?.name,
                color: this.setTruckTooltipColor(driver?.truckType?.name),
                hover: false,
            },
            tableAssignedUnitTrailer: {
                text: driver?.trailerNumber,
                type: driver?.trailerType?.name,
                color: this.setTrailerTooltipColor(driver?.trailerType?.name),
                hover: false,
            },
            tabelLength: loadRequirements?.trailerLength?.name
                ? DataFilterHelper.getLengthNumber(
                      loadRequirements?.trailerLength?.name
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textBase: baseRate
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(baseRate)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textAdditional: additionalBillingRatesTotal
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(additionalBillingRatesTotal)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textAdvance: advancePay
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(advancePay)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textPayTerms: billing?.payTermName
                ? billing.payTermName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textDriver:
                data?.dispatch?.driver?.firstName &&
                data?.dispatch?.driver?.lastName
                    ? data?.dispatch?.driver?.firstName.charAt(0) +
                      TableStringEnum.DOT +
                      data?.dispatch?.driver?.lastName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            comments: commentsWithAvatarColor,
            rate:
                TableStringEnum.DOLLAR_SIGN +
                ' ' +
                this.thousandSeparator.transform(billing?.rate),

            paid:
                billing?.paid !== 0
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(billing?.paid)
                    : TableStringEnum.DOLLAR_SIGN + '0.00',

            tableAdded: createdAt
                ? this.datePipe.transform(
                      createdAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: updatedAt
                ? this.datePipe.transform(
                      updatedAt,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAttachments: data?.files ? data.files : [],
            fileCount: fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownLoadContent(data),
            },
        };
    }

    private getDropdownLoadContent(data: LoadModel): DropdownItem[] {
        return DropdownContentHelper.getDropdownLoadContent(
            data,
            this.selectedTab
        );
    }

    private getTabData(dataType: string): LoadActiveState {
        if (dataType === TableStringEnum.ACTIVE) {
            this.loadActive = this.loadActiveQuery.getAll();

            return this.loadActive?.length ? this.loadActive : [];
        } else if (dataType === TableStringEnum.CLOSED) {
            this.loadClosed = this.loadClosedQuery.getAll();

            return this.loadClosed?.length ? this.loadClosed : [];
        } else if (dataType === TableStringEnum.PENDING) {
            this.loadPanding = this.loadPandinQuery.getAll();
            return this.loadPanding?.length ? this.loadPanding : [];
        } else if (dataType === TableStringEnum.TEMPLATE) {
            this.loadTemplate = this.loadTemplateQuery.getAll();
            return this.loadTemplate?.length ? this.loadTemplate : [];
        }
    }

    private loadBackFilter(
        filter: FilterOptionsLoad,
        isShowMore?: boolean
    ): void {
        this.loadServices
            .getLoadList(
                filter.loadType,
                filter.statusType,
                filter.status,
                filter.dispatcherIds,
                filter.dispatcherId,
                filter.dispatchId,
                filter.brokerId,
                filter.shipperId,
                filter.dateFrom,
                filter.dateTo,
                filter.revenueFrom,
                filter.revenueTo,
                filter.truckId,
                filter.rateFrom,
                filter.rateTo,
                filter.paidFrom,
                filter.paidTo,
                filter.dueFrom,
                filter.dueTo,
                filter.pickup,
                filter.delivery,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((loads: LoadListResponse) => {
                if (!isShowMore) {
                    this.viewData = loads.pagination.data;

                    this.viewData = this.viewData.map((data: LoadModel) => {
                        return this.mapLoadData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    loads.pagination.data.map((data: any) => {
                        newData.push(this.mapLoadData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // ---------------------------- Table Actions ------------------------------
    public onToolBarAction(event: TableToolbarActions): void {
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.modalService.openModal(LoadModalComponent, { size: 'load' });
        } else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;
            this.getLoadStatusFilter();
            this.getLoadDispatcherFilter();

            this.backLoadFilterQuery.statusType =
                this.selectedTab === TableStringEnum.TEMPLATE
                    ? undefined
                    : this.selectedTab === TableStringEnum.ACTIVE
                    ? 2
                    : this.selectedTab === TableStringEnum.CLOSED
                    ? 3
                    : 1;

            this.backLoadFilterQuery.pageIndex = 1;

            this.sendLoadData();
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        }
    }

    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === TableStringEnum.SORT) {
            if (event.direction) {
                this.backLoadFilterQuery.statusType =
                    this.selectedTab === TableStringEnum.TEMPLATE
                        ? undefined
                        : this.selectedTab === TableStringEnum.ACTIVE
                        ? 2
                        : this.selectedTab === TableStringEnum.CLOSED
                        ? 3
                        : 1;
                this.backLoadFilterQuery.pageIndex = 1;
                this.backLoadFilterQuery.sort = event.direction;

                this.loadBackFilter(this.backLoadFilterQuery);
            } else {
                this.sendLoadData();
            }
        }
    }

    public onDropdownActions(): void {
        this.tableDropdownService.openModal$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.onTableBodyActions(res);
            });
    }

    private onTableBodyActions(event: {
        type: string;
        id?: number;
        data?: any;
    }): void {
        if (event.type === TableStringEnum.SHOW_MORE) {
            this.backLoadFilterQuery.statusType =
                this.selectedTab === TableStringEnum.TEMPLATE
                    ? undefined
                    : this.selectedTab === TableStringEnum.ACTIVE
                    ? 2
                    : this.selectedTab === TableStringEnum.CLOSED
                    ? 3
                    : 1;

            this.backLoadFilterQuery.pageIndex++;

            this.loadBackFilter(this.backLoadFilterQuery, true);
        } else if (event.type === TableStringEnum.DELETE) {
            const loadTab =
                this.selectedTab === TableStringEnum.TEMPLATE
                    ? TableStringEnum.TEMPLATE_2
                    : this.selectedTab === TableStringEnum.ACTIVE
                    ? TableStringEnum.ACTIVE_2
                    : this.selectedTab === TableStringEnum.CLOSED
                    ? TableStringEnum.CLOSED_2
                    : TableStringEnum.PENDING_2;

            const modalTitle =
                TableStringEnum.DELETE_2 +
                LoadModalStringEnum.EMPTY_SPACE_STRING +
                loadTab +
                (loadTab === TableStringEnum.TEMPLATE_2
                    ? LoadModalStringEnum.EMPTY_STRING
                    : LoadModalStringEnum.EMPTY_SPACE_STRING +
                      TableStringEnum.LOAD_2);

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.DELETE,
                    template: TableStringEnum.LOAD,
                    subType: this.selectedTab,
                    modalHeaderTitle: modalTitle,
                }
            );
        } else if (event.type === TableStringEnum.EDIT) {
            this.loadServices
                .getLoadById(event.id)
                .pipe(
                    takeUntil(this.destroy$),
                    tap((load) => {
                        const editData = {
                            data: {
                                ...load,
                            },
                            type: event.type,
                            selectedTab: this.selectedTab,
                        };

                        this.modalService.openModal(
                            LoadModalComponent,
                            { size: TableStringEnum.LOAD },
                            {
                                ...editData,
                                disableButton: false,
                            }
                        );
                    })
                )
                .subscribe();
        }
    }

    private getSelectedTabTableData(): void {
        if (this.tableData?.length)
            this.activeTableData = this.tableData.find(
                (table) => table.field === this.selectedTab
            );
    }

    public onShowMore(): void {
        this.onTableBodyActions({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.PENDING:
                this.displayRows$ = this.store.pipe(
                    select(selectPendingTabCards)
                );
                break;
            default:
                break;
        }
        this.loadCardsModalService.updateTab(this.selectedTab);
    }

    private getLoadStatusFilter(): void {
        const loadTab =
            this.selectedTab === TableStringEnum.TEMPLATE
                ? null
                : this.selectedTab === TableStringEnum.ACTIVE
                ? TableStringEnum.ACTIVE_2
                : this.selectedTab === TableStringEnum.CLOSED
                ? TableStringEnum.CLOSED_2
                : TableStringEnum.PENDING_2;

        if (loadTab) {
            this.loadServices
                .getLoadStatusFilter(loadTab)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    if (res) {
                        const filterOptionsData = {
                            selectedTab: this.selectedTab,
                            options: [...res],
                        };

                        this.tableService.sendLoadStatusFilter(
                            filterOptionsData
                        );
                    }
                });
        }
    }

    private getLoadDispatcherFilter(): void {
        const loadTab =
            this.selectedTab === TableStringEnum.TEMPLATE
                ? null
                : this.selectedTab === TableStringEnum.ACTIVE
                ? TableStringEnum.ACTIVE_2
                : this.selectedTab === TableStringEnum.CLOSED
                ? TableStringEnum.CLOSED_2
                : TableStringEnum.PENDING_2;

        if (loadTab) {
            this.loadServices
                .getLoadDispatcherFilter(loadTab)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    if (res) {
                        this.tableService.sendActionAnimation({
                            animation:
                                LoadFilterStringEnum.DISPATCH_DATA_UPDATE,
                            data: res,
                            id: null,
                        });
                    }
                });
        }
    }

    private deleteLoadById(id: number): void {
        this.loadServices
            .deleteLoadById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.sendLoadData());
    }

    private deleteLoadList(ids: number[]): void {
        this.loadServices
            .deleteLoadList(ids, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendLoadData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    private deleteLoadTemplateById(id: number): void {
        this.loadServices
            .deleteLoadTemplateById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.sendLoadData());
    }

    private deleteLoadTemplateList(ids: number[]): void {
        this.loadServices
            .deleteLoadTemplateList(ids)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.sendLoadData();

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    private currentSelectedRowsSubscribe(): void {
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    let isDeleteHidden = false;

                    res.map((item) => {
                        if (
                            (this.selectedTab !== TableStringEnum.TEMPLATE &&
                                this.selectedTab !== TableStringEnum.PENDING) ||
                            item?.tableData?.status?.statusValue?.name !==
                                TableStringEnum.UNASSIGNED
                        ) {
                            isDeleteHidden = true;
                        }
                    });

                    this.tableOptions.toolbarActions.hideDeleteButton =
                        isDeleteHidden;
                }
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
