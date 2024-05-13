import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Subject, Subscription, takeUntil, tap } from 'rxjs';

// Modals
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// Services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TableCardDropdownActionsService } from '@shared/components/ta-table-card-dropdown-actions/services/table-card-dropdown-actions.service';
import { CardsModalConfigService } from '@shared/components/ta-shared-modals/cards-modal/services/cards-modal-config.service';

// Models
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '@shared/utils/settings/table-settings/load-columns';
import { LoadListResponse } from 'appcoretruckassist';
import {
    DeleteComment,
    DropdownItem,
} from '@shared/models/card-models/card-table-data.model';
import { GridColumn } from '@shared/models/table-models/grid-column.model';
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';
import { LoadModel } from './models/load.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';

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

// Enum
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// Store
import { LoadQuery } from '@shared/components/ta-shared-modals/cards-modal/state/load-modal.query';

// Utils
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';

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
    public activeViewMode: string = TableStringEnum.CARD;
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

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private loadServices: LoadService,
        private tableDropdownService: TableCardDropdownActionsService,
        private imageBase64Service: ImageBase64Service,
        private loadActiveQuery: LoadActiveQuery,
        private loadClosedQuery: LoadClosedQuery,
        private loadPandinQuery: LoadPendingQuery,
        private loadTemplateQuery: LoadTemplateQuery,
        private thousandSeparator: ThousandSeparatorPipe,
        public datePipe: DatePipe,
        private confiramtionService: ConfirmationService,
        private nameInitialsPipe: NameInitialsPipe,
        private loadQuery: LoadQuery,
        private cardsModalService: CardsModalConfigService
    ) {}

    ngOnInit(): void {
        this.updateCardView();

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
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.PENDING:
                this.pendingTabCardsConfig();
                break;

            case TableStringEnum.TEMPLATE:
                this.templateTabCardsConfig();
                break;

            case TableStringEnum.ACTIVE:
                this.activeTabCardsConfig();
                break;

            case TableStringEnum.CLOSED:
                this.closedTabCardsConfig();
                break;

            default:
                break;
        }

        this.cardsModalService.updateTab(this.selectedTab);
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
                            this.sendLoadData();
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
                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                name: item.tableData?.fullName,
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
                            image: true,
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
                showTimeFilter: this.selectedTab !== TableStringEnum.TEMPLATE,
                showDispatcherFilter:
                    this.selectedTab !== TableStringEnum.TEMPLATE,
                showStatusFilter: this.selectedTab !== TableStringEnum.TEMPLATE,
                showLtlFilter: true,
                showMoneyFilter: true,
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

    private mapLoadData(data: LoadModel): LoadModel {
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

        return {
            ...data,
            isSelected: false,
            loadInvoice: {
                invoice: data?.loadNumber
                    ? data.loadNumber
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                type: data?.type?.name
                    ? data.type.name
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadDispatcher: {
                name: data?.dispatcher?.fullName
                    ? data.dispatcher.fullName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                avatar: data?.dispatcher?.avatar
                    ? this.imageBase64Service.sanitizer(data.dispatcher.avatar)
                    : null,
            },
            loadTotal: {
                total: data?.totalRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(data.totalRate)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                subTotal: data?.totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(data.totalAdjustedRate)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadBroker: {
                hasBanDnu: data?.broker?.ban || data?.broker?.dnu,
                isDnu: data?.broker?.dnu,
                name: data?.broker?.businessName
                    ? data.broker.businessName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadTruckNumber: {
                number: data?.dispatch?.truck?.truckNumber
                    ? data.dispatch.truck.truckNumber
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                color: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadTrailerNumber: {
                number: data?.dispatch?.trailer?.trailerNumber
                    ? data.dispatch.trailer.trailerNumber
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                color: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadPickup: {
                count: data?.stops[0]?.stopLoadOrder
                    ? data.stops[0].stopLoadOrder
                    : null,
                location:
                    data?.stops[0]?.shipper?.address?.city +
                    TableStringEnum.COMA +
                    data?.stops[0]?.shipper?.address?.stateShortName,
                date: data?.stops[0]?.dateFrom
                    ? this.datePipe.transform(
                          data.stops[0].dateFrom,
                          TableStringEnum.DATE_FORMAT
                      )
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                time: data?.stops[0]?.timeFrom
                    ? data.stops[0].timeFrom
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadDelivery: {
                count: data?.stops[data.stops.length - 1]?.stopLoadOrder
                    ? data.stops[data.stops.length - 1].stopLoadOrder
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                location:
                    data?.stops[data.stops.length - 1]?.shipper?.address?.city +
                    TableStringEnum.COMA +
                    data?.stops[data.stops.length - 1]?.shipper?.address
                        ?.stateShortName,
                date: data?.stops[data.stops.length - 1]?.dateFrom
                    ? this.datePipe.transform(
                          data.stops[data.stops.length - 1].dateFrom,
                          TableStringEnum.DATE_FORMAT
                      )
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                time: data?.stops[data.stops.length - 1]?.timeFrom
                    ? data.stops[data.stops.length - 1].timeFrom
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadStatus: {
                status: data?.status?.name
                    ? data.status?.name
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                color: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                time:
                    data?.lastStatusPassed?.hours +
                    TableStringEnum.HOURS +
                    data?.lastStatusPassed?.minutes +
                    TableStringEnum.MINUTES,
            },
            textMiles: data?.totalMiles
                ? data.totalMiles + TableStringEnum.MILES
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textCommodity: data?.generalCommodity?.name
                ? data.generalCommodity.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textWeight: data?.weight
                ? data.weight + TableStringEnum.POUNDS
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textBase: data?.baseRate
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.baseRate)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textAdditional: data?.additionalBillingRatesTotal
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(
                      data?.additionalBillingRatesTotal
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textAdvance: data?.advancePay
                ? TableStringEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.advancePay)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textPayTerms: data?.broker?.payTerm?.name
                ? data.broker.payTerm?.name
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textDriver:
                data?.dispatch?.driver?.firstName &&
                data?.dispatch?.driver?.lastName
                    ? data?.dispatch?.driver?.firstName.charAt(0) +
                      TableStringEnum.DOT +
                      data?.dispatch?.driver?.lastName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            comments: commentsWithAvatarColor,
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownLoadContent(),
            },
        };
    }

    private getDropdownLoadContent(): DropdownItem[] {
        return TableDropdownComponentConstants.DROPDOWN_DATA;
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
        filter: {
            loadType: number | undefined;
            statusType: number | undefined;
            status: number | undefined;
            dispatcherId: number | undefined;
            dispatchId: number | undefined;
            brokerId: number | undefined;
            shipperId: number | undefined;
            dateFrom: string | undefined;
            dateTo: string | undefined;
            revenueFrom: number | undefined;
            revenueTo: number | undefined;
            truckId: number | undefined;
            pageIndex: number;
            pageSize: number;
            companyId: number | undefined;
            sort: string | undefined;
            searchOne: string | undefined;
            searchTwo: string | undefined;
            searchThree: string | undefined;
        },
        isShowMore?: boolean
    ): void {
        this.loadServices
            .getLoadList(
                filter.loadType,
                filter.statusType,
                filter.status,
                filter.dispatcherId,
                filter.dispatchId,
                filter.brokerId,
                filter.shipperId,
                filter.dateFrom,
                filter.dateTo,
                filter.revenueFrom,
                filter.revenueTo,
                filter.truckId,
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
                    // TODO can't find modal for this data and when this function is called
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

    private onTableBodyActions(event: { type: string; id?: number }): void {
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
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.DELETE },
                {
                    type: TableStringEnum.DELETE,
                }
            );

            this.confiramtionService.confirmationData$.subscribe((response) => {
                if (response.type === TableStringEnum.DELETE) {
                    this.loadServices
                        .deleteLoadById(event.id)
                        .pipe(takeUntil(this.destroy$))

                        .subscribe();
                }
            });
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

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
