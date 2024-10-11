import {
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    ViewChild,
} from '@angular/core';
import {
    filter,
    forkJoin,
    Observable,
    Subject,
    Subscription,
    takeUntil,
    tap,
} from 'rxjs';

// Modals
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// Services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TableCardDropdownActionsService } from '@shared/components/ta-table-card-dropdown-actions/services/table-card-dropdown-actions.service';
import { LoadCardModalService } from '@pages/load/pages/load-card-modal/services/load-card-modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { CaSearchMultipleStatesService } from 'ca-components';
import { BrokerService } from '@pages/customer/services/broker.service';

// Models
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '@shared/utils/settings/table-settings/load-columns';
import {
    CardDetails,
    DeleteComment,
    DropdownItem, 
} from '@shared/models/card-models/card-table-data.model';
import { GridColumn } from '@shared/models/table-models/grid-column.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import {
    AddressResponse,
    LoadListResponse,
    LoadStatus,
    LoadTemplateListResponse,
    TableType,
} from 'appcoretruckassist';
import { LoadModel } from '@pages/load/pages/load-table/models/load.model';
import { LoadTemplate } from '@pages/load/pages/load-table/models/load-template.model';

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
import { LoadStatusHelper } from '@shared/utils/helpers/load-status.helper';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string.enum';
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { LoadModalStopItemsStringEnum } from '@pages/load/enums/load-modal-stop-items-string.enum';
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';
import { LoadStatusEnum } from '@shared/enums/load-status.enum';

// Components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// Store
import { LoadQuery } from '@shared/components/ta-shared-modals/cards-modal/state/load-modal.query';
import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectClosedTabCards,
    selectPendingTabCards,
    selectTemplateTabCards,
} from '@pages/load/pages/load-card-modal/state/load-card-modal.selectors';

// Utils
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-date-formater.helper';
import { DropdownContentHelper } from '@shared/utils/helpers/dropdown-content.helper';

// Router
import { Router } from '@angular/router';

@Component({
    selector: 'app-load-table',
    templateUrl: './load-table.component.html',
    styleUrls: ['./load-table.component.scss'],
    providers: [ThousandSeparatorPipe, NameInitialsPipe],
})
export class LoadTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('toolbarComponent') toolbarComponent: TaTableToolbarComponent;

    private destroy$ = new Subject<void>();
    public loadTableData: any[] = [];
    public tableOptions;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = TableStringEnum.ACTIVE;
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
        private loadCardsModalService: LoadCardModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private cdRef: ChangeDetectorRef,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private brokerService: BrokerService,

        //store
        private store: Store,

        // Router
        private router: Router
    ) {}

    ngOnInit(): void {
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

        this.getLoadStatusFilter();

        this.getLoadDispatcherFilter();

        this.confirmationDataSubscribe();

        this.currentSelectedRowsSubscribe();

        this.upadateStatus();

        this.onLoadChange();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private upadateStatus(): void {
        this.loadServices.statusAction$
            .pipe(
                takeUntil(this.destroy$),
                filter((statusAction) => statusAction !== null)
            )
            .subscribe((status) => {
                const foundObject = this.viewData.find(
                    (item) => item.id === status.id
                );

                if (!foundObject) return;

                if (
                    [
                        LoadStatusEnum[12],
                        LoadStatusEnum[52],
                        LoadStatusEnum[53],
                        LoadStatusEnum[54],
                    ].includes(status.dataBack) ||
                    ([LoadStatusEnum[44], LoadStatusEnum[55]].includes(
                        status.dataBack
                    ) &&
                        [
                            LoadStatusEnum[4],
                            LoadStatusEnum[5],
                            LoadStatusEnum[7],
                            LoadStatusEnum[52],
                            LoadStatusEnum[53],
                            LoadStatusEnum[54],
                        ].includes(foundObject?.status.statusString)) ||
                    (status.dataBack === LoadStatusEnum[3] &&
                        [LoadStatusEnum[44], LoadStatusEnum[55]].includes(
                            foundObject?.status.statusString
                        ))
                ) {
                    const mappedEvent = {
                        ...foundObject,
                        data: {
                            ...foundObject,
                            nameBack: status.dataBack,
                            nameFront: status.dataFront,
                        },
                    };

                    this.modalService.openModal(
                        ConfirmationActivationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            ...mappedEvent,
                            type: TableStringEnum.STATUS,
                            template: TableStringEnum.STATUS_2,
                            subType: TableStringEnum.STATUS_2,
                            modalTitle: foundObject.loadNumber,
                            modalSecondTitle: foundObject.driver?.truckNumber,
                        }
                    );
                } else {
                    this.updateLoadStatus(
                        status.id,
                        status.dataBack,
                        foundObject.status.statusString,
                        status.isRevert
                    );
                }
            });
    }

    private confirmationDataSubscribe(): void {
        this.confiramtionService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.template === TableStringEnum.COMMENT) return;
                if (res.type === TableStringEnum.DELETE) {
                    if (res.template === TableStringEnum.BROKER) {
                        this.deleteBrokerById(res.id);
                    } else {
                        if (this.selectedTab === TableStringEnum.TEMPLATE) {
                            this.deleteLoadTemplateById(res.id);
                        } else {
                            this.deleteLoadById(res.id);
                        }
                    }
                } else if (res.type === TableStringEnum.MULTIPLE_DELETE) {
                    if (this.selectedTab === TableStringEnum.TEMPLATE) {
                        this.deleteLoadTemplateList(res.array);
                    } else {
                        this.deleteLoadList(res.array);
                    }
                }
            });

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((confirmationResponse) => {
                const foundObject = this.viewData.find(
                    (item) => item.id === confirmationResponse.id
                );

                if (!foundObject) return;

                this.updateLoadStatus(
                    confirmationResponse.id,
                    confirmationResponse.data.nameBack,
                    foundObject.status.statusString,
                    confirmationResponse.data.isRevert,
                    confirmationResponse.newLocation ?? null
                );
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

    private onLoadChange() {
        this.loadServices.modalAction$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadServices
                    .getAllLoads(this.backLoadFilterQuery, this.selectedTab)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.sendLoadData();
                    });
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
        this.caSearchMultipleStatesService.currentSearchTableData
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
                showMoneyFilter: this.selectedTab !== TableStringEnum.TEMPLATE,
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

        this.loadServices
            .getAllLoads(this.backLoadFilterQuery, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
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
                        length: loadCount?.templateCount,
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
                        tableConfiguration: TableType.LoadTemplate,
                        isActive: this.selectedTab === TableStringEnum.TEMPLATE,
                        gridColumns: this.getGridColumns(
                            TableStringEnum.TEMPLATE,
                            TableType.LoadTemplate
                        ),
                    },
                    {
                        title: TableStringEnum.PENDING_2,
                        field: TableStringEnum.PENDING,
                        length: loadCount?.pendingCount,
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
                        tableConfiguration: TableType.LoadRegular,
                        isActive: this.selectedTab === TableStringEnum.PENDING,
                        gridColumns: this.getGridColumns(
                            TableStringEnum.PENDING,
                            TableType.LoadRegular
                        ),
                    },
                    {
                        title: TableStringEnum.ACTIVE_2,
                        field: TableStringEnum.ACTIVE,
                        length: loadCount?.activeCount,
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
                        tableConfiguration: TableType.LoadRegular,
                        isActive: this.selectedTab === TableStringEnum.ACTIVE,
                        gridColumns: this.getGridColumns(
                            TableStringEnum.ACTIVE,
                            TableType.LoadRegular
                        ),
                    },
                    {
                        title: TableStringEnum.CLOSED_2,
                        field: TableStringEnum.CLOSED,
                        length: loadCount?.closedCount,
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
                        tableConfiguration: TableType.LoadClosed,
                        isActive: this.selectedTab === TableStringEnum.CLOSED,
                        gridColumns: this.getGridColumns(
                            TableStringEnum.CLOSED,
                            TableType.LoadClosed
                        ),
                    },
                ];

                const td = this.tableData.find(
                    (t) => t.field === this.selectedTab
                );
                this.setLoadData(td);
                this.updateCardView();
                this.cdRef.detectChanges();
            });
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
                if (this.selectedTab !== TableStringEnum.TEMPLATE) {
                    return this.mapLoadData(data);
                } else {
                    return this.mapTemplateData(data);
                }
            });
        } else {
            this.viewData = [];
        }

        this.loadTableData = this.viewData;
    }

    private setTruckTooltipColor(truckName: string): string {
        switch (truckName) {
            case TruckNameStringEnum.SEMI_TRUCK:
            case TruckNameStringEnum.SEMI_SLEEPER:
                return TooltipColorsStringEnum.BLUE;
            case TruckNameStringEnum.BOX_TRUCK:
            case TruckNameStringEnum.REEFER_TRUCK:
            case TruckNameStringEnum.CARGO_VAN:
                return TooltipColorsStringEnum.YELLOW;
            case TruckNameStringEnum.DUMP_TRUCK:
            case TruckNameStringEnum.CEMENT_TRUCK:
            case TruckNameStringEnum.GARBAGE_TRUCK:
                return TooltipColorsStringEnum.RED;
            case TruckNameStringEnum.TOW_TRUCK:
            case TruckNameStringEnum.CAR_HAULER:
            case TruckNameStringEnum.SPOTTER:
                return TooltipColorsStringEnum.LIGHT_GREEN;
            default:
                return;
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        switch (trailerName) {
            case TrailerNameStringEnum.FLAT_BED:
            case TrailerNameStringEnum.STEP_DECK:
            case TrailerNameStringEnum.LOW_BOY_RGN:
            case TrailerNameStringEnum.CHASSIS:
            case TrailerNameStringEnum.CONESTOGA:
            case TrailerNameStringEnum.SIDE_KIT:
            case TrailerNameStringEnum.CONTAINER:
                return TooltipColorsStringEnum.BLUE;
            case TrailerNameStringEnum.DRY_VAN:
            case TrailerNameStringEnum.REEFER:
                return TooltipColorsStringEnum.YELLOW;
            case TrailerNameStringEnum.END_DUMP:
            case TrailerNameStringEnum.BOTTOM_DUMP:
            case TrailerNameStringEnum.HOPPER:
            case TrailerNameStringEnum.TANKER:
            case TrailerNameStringEnum.PNEUMATIC_TANKER:
                return TooltipColorsStringEnum.RED;
            case TrailerNameStringEnum.CAR_HAULER:
            case TrailerNameStringEnum.CAR_HAULER_STINGER:
                return TooltipColorsStringEnum.LIGHT_GREEN;
            default:
                return;
        }
    }
    private mapTemplateData(data: LoadModel): LoadTemplate {
        const {
            id,
            billing,
            broker,
            createdAt,
            dispatcher,
            dispatch,
            brokerContact,
            weight,
            referenceNumber,
            loadRequirements,
            baseRate,
            additionalBillingRatesTotal,
            generalCommodity,
            stops,
            totalPaid,
            advancePay,
            totalRate,
            totalAdjustedRate,
            updatedAt,
        } = data;

        return {
            ...data,
            id,
            isSelected: false,
            loadTemplateName: data.name,
            loadDispatcher: {
                name: dispatcher?.fullName,
                avatar: dispatcher?.avatarFile?.url,
            },
            avatarImg: dispatch?.driver?.avatarFile?.url,
            tableDriver: dispatch?.driver?.firstName
                ? dispatch?.driver?.firstName + ' ' + dispatch?.driver?.lastName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTruck: dispatch?.truck?.truckNumber,
            tableTrailer: dispatch?.trailer?.trailerNumber,
            loadTotal: {
                total: totalRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(totalRate)
                    : null,
                subTotal: data?.totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(data.totalAdjustedRate)
                    : null,
            },
            loadBroker: {
                hasBanDnu: broker?.ban || broker?.dnu,
                isDnu: broker?.dnu,
                name: broker?.businessName,
            },
            contact: brokerContact?.contactName,
            phone: brokerContact?.phone
                ? brokerContact.phone +
                  (brokerContact.phoneExt ? ' x ' + brokerContact.phoneExt : '')
                : null,

            referenceNumber: referenceNumber,
            textCommodity: generalCommodity?.name,
            textWeight: weight,
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
                : null,
            tableTruckName: loadRequirements?.truckType?.name,
            loadTrailerNumber: loadRequirements?.trailerType?.logoName,
            loadTruckNumber: loadRequirements?.truckType?.logoName,

            loadPickup: [
                {
                    count: stops[0]?.stopOrder,
                    location: stops[0]?.shipper?.address?.city,
                    delivery: false,
                },
                {
                    count: stops[1]?.stopOrder,
                    location: stops[1]?.shipper?.address?.city,

                    delivery: true,
                },
            ],

            total: data?.totalMiles,
            empty: data?.emptyMiles,
            loaded: data?.loaded,
            tableDoorType: loadRequirements?.doorType?.name,
            tableSuspension: loadRequirements?.suspension?.name,
            year: loadRequirements?.year,
            liftgate: loadRequirements?.liftgate
                ? LoadModalStopItemsStringEnum.YES
                : null,
            tableAssignedUnitTruck: {
                text: dispatch?.truck?.truckNumber,
                type: dispatch?.truck?.model,
                color: this.setTruckTooltipColor(dispatch?.truck?.model),
                hover: false,
            },
            tableAssignedUnitTrailer: {
                text: dispatch?.trailer?.trailerNumber,
                type: dispatch?.trailer?.model,
                color: this.setTrailerTooltipColor(dispatch?.trailer?.model),
                hover: false,
            },
            tabelLength: loadRequirements?.trailerLength?.name
                ? DataFilterHelper.getLengthNumber(
                      loadRequirements?.trailerLength?.name
                  )
                : null,
            textBase: baseRate
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(baseRate)
                : null,
            textAdditional: additionalBillingRatesTotal
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(additionalBillingRatesTotal)
                : null,
            textAdvance: advancePay
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(advancePay)
                : null,
            textPayTerms: billing?.payTermName ? billing.payTermName : null,
            textDriver:
                data?.dispatch?.driver?.firstName &&
                data?.dispatch?.driver?.lastName
                    ? data?.dispatch?.driver?.firstName.charAt(0) +
                      TableStringEnum.DOT +
                      data?.dispatch?.driver?.lastName
                    : null,
            rate: {
                paid:
                    TableStringEnum.DOLLAR_SIGN +
                    ' ' +
                    this.thousandSeparator.transform(totalRate),
                paidDue: totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(totalAdjustedRate)
                    : null,
            },
            paid:
                totalPaid !== 0
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(totalPaid)
                    : TableStringEnum.DOLLAR_SIGN + '0.00',

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
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownLoadContent(data),
            },
        };
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
            paidDate,
            invoicedDate,
            totalAdjustedRate,
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
                avatar:
                    dispatcher?.avatarFile?.url ??
                    TableStringEnum.EMPTY_STRING_PLACEHOLDER,
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
            phone: broker?.phone
                ? broker.phone +
                  (broker.phoneExt ? ' x ' + broker.phoneExt : '')
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
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
            truckTypeClass: loadRequirements?.truckType?.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            tableTrailerTypeClass: loadRequirements?.trailerType?.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
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
                time: LoadStatusHelper.calculateStatusTime(
                    lastStatusPassed as any
                ), //leave this any for now
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
            rate: {
                paid:
                    TableStringEnum.DOLLAR_SIGN +
                    ' ' +
                    this.thousandSeparator.transform(billing.rate),
                paidDue: totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(totalAdjustedRate)
                    : null,
                status: status?.statusValue?.name,
            },
            tableInvoice: invoicedDate
                ? this.datePipe.transform(
                      invoicedDate,
                      TableStringEnum.DATE_FORMAT
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaid: paidDate
                ? this.datePipe.transform(paidDate, TableStringEnum.DATE_FORMAT)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            paid:
                billing?.paid !== 0
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(billing?.paid)
                    : TableStringEnum.DOLLAR_SIGN + '0.00',
            payTerm: billing.payTermName
                ? TableStringEnum.DOLLAR_SIGN +
                  ' ' +
                  this.thousandSeparator.transform(billing.payTermName)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            ageUnpaid:
                billing.ageUnpaid ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            agePaid:
                billing.agePaid ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            due: billing.due
                ? TableStringEnum.DOLLAR_SIGN +
                  ' ' +
                  this.thousandSeparator.transform(billing.due)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

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
        if (this.selectedTab === TableStringEnum.TEMPLATE) {
            this.loadTemplateBackFilter(this.backLoadFilterQuery);
            return;
        }
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
                null,
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
                filter.longitude,
                filter.latitude,
                filter.distance,
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
    private loadTemplateBackFilter(
        filter: FilterOptionsLoad,
        isShowMore?: boolean
    ): void {
        this.loadServices
            .getLoadTemplateList(
                filter.loadType,
                filter.rateFrom,
                filter.rateTo,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((loads: LoadTemplateListResponse) => {
                if (!isShowMore) {
                    this.viewData = loads.pagination.data;

                    this.viewData = this.viewData.map((data: LoadModel) => {
                        return this.mapTemplateData(data);
                    });
                } else {
                    const newData = [...this.viewData];
                    this.viewData = loads.pagination.data;

                    this.viewData.map((data: LoadModel) => {
                        newData.push(this.mapTemplateData(data));
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
            this.toolbarComponent?.flipCards(false);
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
                if (this.selectedTab === TableStringEnum.TEMPLATE) {
                    this.loadTemplateBackFilter(this.backLoadFilterQuery);
                } else {
                    this.loadBackFilter(this.backLoadFilterQuery);
                }
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
                .getLoadById(
                    event.id,
                    this.selectedTab === TableStringEnum.TEMPLATE
                )
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
        } else if (event.type === TableStringEnum.VIEW_DETAILS) {
            this.router.navigate([`/list/load/${event.id}/details`]);
        } else if (
            event.type === TableStringEnum.CONVERT_TO_TEMPLATE ||
            event.type === TableStringEnum.CONVERT_TO_LOAD
        ) {
            this.loadServices
                .getLoadById(
                    event.id,
                    this.selectedTab === TableStringEnum.TEMPLATE
                )
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
                                loadAction: event.type,
                                selectedTab:
                                    event.type ===
                                    TableStringEnum.CONVERT_TO_TEMPLATE
                                        ? TableStringEnum.TEMPLATE
                                        : null,
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
            case TableStringEnum.TEMPLATE:
                this.displayRows$ = this.store.pipe(
                    select(selectTemplateTabCards)
                );
                break;
            case TableStringEnum.CLOSED:
                this.displayRows$ = this.store.pipe(
                    select(selectClosedTabCards)
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
                            ![
                                TableStringEnum.UNASSIGNED,
                                TableStringEnum.BOOKED,
                            ].includes(
                                item?.tableData?.status?.statusValue
                                    ?.name as TableStringEnum
                            )
                        ) {
                            isDeleteHidden = true;
                        }
                    });

                    this.tableOptions.toolbarActions.hideDeleteButton =
                        isDeleteHidden;
                }
            });
    }

    private updateLoadStatus(
        id: number,
        status: LoadStatus,
        previousStatus: LoadStatus,
        isRevert: boolean,
        newLocation?: AddressResponse
    ): void {
        this.loadServices
            .updateLoadStatus(id, status, isRevert, newLocation)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadServices.getLoadInsideListById(id).subscribe((res) => {
                    this.loadServices.updateLoadPartily();
                });
            });
    }

    public saveValueNote(event: { value: string; id: number }): void {
        this.viewData.map((item: CardDetails) => {
            if (item.id === event.id) {
                item.note = event.value;
            }
        });

        const noteData = {
            value: event.value,
            id: event.id,
            selectedTab: this.selectedTab,
        };

        this.loadServices.updateNote(noteData);
    }
    public deleteBrokerById(id: number): void {
        this.brokerService
            .deleteBrokerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadServices.triggerModalAction();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
