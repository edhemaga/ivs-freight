import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';

// Compoenents
import { LoadModalComponent } from '../../modals/load-modal/load-modal.component';

// Services
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { LoadTService } from '../state/load.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';

// Models
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '../../../../../assets/utils/settings/load-columns';
import { LoadListResponse } from 'appcoretruckassist';
import { DisplayLoadConfiguration } from '../load-card-data';
import {
    DropdownItem,
    GridColumn,
    ToolbarActions,
} from '../../shared/model/cardTableData';
import {
    CardRows,
    Search,
    TableOptionsInterface,
} from '../../shared/model/cardData';
import { DataForCardsAndTables } from '../../shared/model/table-components/all-tables.modal';
import {
    FilterOptionsLoad,
    LoadModel,
} from '../../shared/model/table-components/load-modal';

// Queries
import { LoadActiveQuery } from '../state/load-active-state/load-active.query';
import { LoadClosedQuery } from '../state/load-closed-state/load-closed.query';
import { LoadPandinQuery } from '../state/load-pending-state/load-pending.query';
import { LoadTemplateQuery } from '../state/load-template-state/load-template.query';

// Store
import { LoadActiveState } from '../state/load-active-state/load-active.store';
import { LoadClosedState } from '../state/load-closed-state/load-closed.store';
import { LoadPandingState } from '../state/load-pending-state/load-panding.store';
import { LoadTemplateState } from '../state/load-template-state/load-template.store';

// Pipes
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { DatePipe } from '@angular/common';
import { tableSearch } from 'src/app/core/utils/methods.globals';

// Constants
import { TableDropdownLoadComponentConstants } from 'src/app/core/utils/constants/table-components.constants';

//Helpers
import { checkSpecialFilterArray } from 'src/app/core/helpers/dataFilter';

// Enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-load-table',
    templateUrl: './load-table.component.html',
    styleUrls: ['./load-table.component.scss'],
    providers: [TaThousandSeparatorPipe],
})
export class LoadTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public loadTableData: any[] = [];
    public tableOptions: TableOptionsInterface;
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: GridColumn[] = [];
    public selectedTab: string = ConstantStringTableComponentsEnum.PENDING;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    public resizeObserver: ResizeObserver;
    public loadActive: LoadActiveState[] = [];
    public loadClosed: LoadClosedState[] = [];
    public loadPanding: LoadPandingState[] = [];
    public loadTemplate: LoadTemplateState[] = [];

    public loadingPage: boolean = false;
    public activeTableData: DataForCardsAndTables;
    public backLoadFilterQuery: FilterOptionsLoad =
        TableDropdownLoadComponentConstants.LOAD_BACK_FILTER;

    //Data to display from model
    public displayRowsFrontTemplate: CardRows[] =
        DisplayLoadConfiguration.displayRowsFrontTemplate;

    public displayRowsBackTemplate: CardRows[] =
        DisplayLoadConfiguration.displayRowsBackTemplate;

    public displayRowsFront: CardRows[] =
        DisplayLoadConfiguration.displayRowsFront;
    public displayRowsBack: CardRows[] =
        DisplayLoadConfiguration.displayRowsBack;

    public page: string = DisplayLoadConfiguration.page;
    public rows: number = DisplayLoadConfiguration.rows;

    public cardTitle: string;

    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];

    constructor(
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private loadServices: LoadTService,
        private imageBase64Service: ImageBase64Service,
        private loadActiveQuery: LoadActiveQuery,
        private loadClosedQuery: LoadClosedQuery,
        private loadPandinQuery: LoadPandinQuery,
        private loadTemplateQuery: LoadTemplateQuery,
        private thousandSeparator: TaThousandSeparatorPipe,
        public datePipe: DatePipe,
        private confiramtionService: ConfirmationService
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
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
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
            .subscribe((res: Search) => {
                if (res) {
                    this.backLoadFilterQuery.statusType =
                        this.selectedTab ===
                        ConstantStringTableComponentsEnum.TEMPLATE
                            ? undefined
                            : this.selectedTab ===
                              ConstantStringTableComponentsEnum.ACTIVE
                            ? 2
                            : this.selectedTab ===
                              ConstantStringTableComponentsEnum.CLOSED
                            ? 3
                            : 1;
                    this.backLoadFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(
                        res,
                        this.backLoadFilterQuery
                    );
                    if (searchEvent) {
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            this.loadBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
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
                        { size: ConstantStringTableComponentsEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: ConstantStringTableComponentsEnum.LOAD,
                            type: ConstantStringTableComponentsEnum.MULTIPLE_DELETE,
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
                    res?.animation === ConstantStringTableComponentsEnum.ADD &&
                    this.selectedTab ===
                        ConstantStringTableComponentsEnum.ACTIVE
                ) {
                }
                // On Update Driver
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.UPDATE
                ) {
                }
                // On Update Driver Status
                else if (
                    res?.animation ===
                    ConstantStringTableComponentsEnum.UPDATE_STATUS
                ) {
                }
                // On Delete Driver
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.DELETE
                ) {
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
            document.querySelector(
                ConstantStringTableComponentsEnum.TABLE_CONTAINER
            )
        );
    }

    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                hideActivationButton: true,
                showTimeFilter:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.TEMPLATE,
                showDispatcherFilter:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.TEMPLATE,
                showStatusFilter:
                    this.selectedTab !==
                    ConstantStringTableComponentsEnum.TEMPLATE,
                showLtlFilter: true,
                showMoneyFilter: true,
                viewModeOptions: [
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
                ],
            },
        };
    }

    public getStatusLabelStyle(status: string | undefined): string {
        const styles = ConstantStringTableComponentsEnum.STYLES;

        if (status === ConstantStringTableComponentsEnum.ASSIGNED) {
            return styles + ConstantStringTableComponentsEnum.ASSIGNED_COLOR;
        } else if (status === ConstantStringTableComponentsEnum.LOADED) {
            return styles + ConstantStringTableComponentsEnum.LOADED_COLOR;
        } else if (status === ConstantStringTableComponentsEnum.DISPATCHED) {
            return styles + ConstantStringTableComponentsEnum.DISPATCHED_COLOR;
        } else {
            return styles + ConstantStringTableComponentsEnum.DEFAULT_COLOR;
        }
    }

    private sendLoadData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.LOAD_TABLE_VIEW
            )
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const loadCount = JSON.parse(
            localStorage.getItem(
                ConstantStringTableComponentsEnum.LOAD_TABLE_COUNT
            )
        );

        const loadTemplateData =
            this.selectedTab === ConstantStringTableComponentsEnum.TEMPLATE
                ? this.getTabData(ConstantStringTableComponentsEnum.TEMPLATE)
                : [];

        const loadPendingData =
            this.selectedTab === ConstantStringTableComponentsEnum.PENDING
                ? this.getTabData(ConstantStringTableComponentsEnum.PENDING)
                : [];

        const loadActiveData =
            this.selectedTab === ConstantStringTableComponentsEnum.ACTIVE
                ? this.getTabData(ConstantStringTableComponentsEnum.ACTIVE)
                : [];

        const repairClosedData =
            this.selectedTab === ConstantStringTableComponentsEnum.CLOSED
                ? this.getTabData(ConstantStringTableComponentsEnum.CLOSED)
                : [];

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.TEMPLATE_2,
                field: ConstantStringTableComponentsEnum.TEMPLATE,
                length: loadCount.templateCount,
                data: loadTemplateData,
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.LOAD,
                moneyCountSelected: false,
                ltlArray: checkSpecialFilterArray(
                    loadTemplateData,
                    ConstantStringTableComponentsEnum.LTL,
                    ConstantStringTableComponentsEnum.TYPE
                ),
                ftlArray: checkSpecialFilterArray(
                    loadTemplateData,
                    ConstantStringTableComponentsEnum.FTL,
                    ConstantStringTableComponentsEnum.TYPE
                ),
                stateName: ConstantStringTableComponentsEnum.LOADS,
                tableConfiguration: 'LOAD_TEMPLATE',
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.TEMPLATE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.TEMPLATE,
                    'LOAD_TEMPLATE'
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.PENDING_2,
                field: ConstantStringTableComponentsEnum.PENDING,
                length: loadCount.pendingCount,
                data: loadPendingData,
                extended: false,
                moneyCountSelected: false,
                gridNameTitle: ConstantStringTableComponentsEnum.LOAD,
                ltlArray: checkSpecialFilterArray(
                    loadPendingData,
                    ConstantStringTableComponentsEnum.LTL,
                    ConstantStringTableComponentsEnum.TYPE
                ),
                ftlArray: checkSpecialFilterArray(
                    loadPendingData,
                    ConstantStringTableComponentsEnum.FTL,
                    ConstantStringTableComponentsEnum.TYPE
                ),
                stateName: ConstantStringTableComponentsEnum.LOADS,
                tableConfiguration: 'LOAD_REGULAR',
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.PENDING,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.PENDING,
                    'LOAD_REGULAR'
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.ACTIVE_2,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: loadCount.activeCount,
                data: loadActiveData,
                moneyCountSelected: false,
                ftlArray: checkSpecialFilterArray(
                    loadActiveData,
                    ConstantStringTableComponentsEnum.FTL,
                    ConstantStringTableComponentsEnum.TYPE
                ),
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.LOAD,
                stateName: ConstantStringTableComponentsEnum.LOADS,
                tableConfiguration: 'LOAD_REGULAR',
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.ACTIVE,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.ACTIVE,
                    'LOAD_REGULAR'
                ),
            },
            {
                title: ConstantStringTableComponentsEnum.CLOSED_2,
                field: ConstantStringTableComponentsEnum.CLOSED,
                length: loadCount.closedCount,
                moneyCountSelected: false,
                data: repairClosedData,
                ftlArray: checkSpecialFilterArray(
                    repairClosedData,
                    ConstantStringTableComponentsEnum.FTL,
                    ConstantStringTableComponentsEnum.TYPE
                ),
                extended: false,
                gridNameTitle: ConstantStringTableComponentsEnum.LOAD,
                stateName: ConstantStringTableComponentsEnum.LOADS,
                tableConfiguration: 'LOAD_CLOSED',
                isActive:
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.CLOSED,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.CLOSED,
                    'LOAD_CLOSED'
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);
        this.setLoadData(td);
    }

    private getGridColumns(activeTab: string, configType: string): void {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        if (activeTab === ConstantStringTableComponentsEnum.TEMPLATE) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadTemplateColumnDefinition();
        } else if (activeTab === ConstantStringTableComponentsEnum.CLOSED) {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadClosedColumnDefinition();
        } else {
            return tableColumnsConfig
                ? tableColumnsConfig
                : getLoadActiveAndPendingColumnDefinition();
        }
    }

    private setLoadData(td: DataForCardsAndTables): void {
        this.columns = td.gridColumns;
        if (td.data?.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data) => {
                return this.mapLoadData(data);
            });

            // Set data for active tab
            this.selectedTab === ConstantStringTableComponentsEnum.TEMPLATE
                ? ((this.sendDataToCardsFront = this.displayRowsFrontTemplate),
                  (this.sendDataToCardsBack = this.displayRowsBackTemplate),
                  (this.cardTitle = ConstantStringTableComponentsEnum.NAME_1))
                : ((this.sendDataToCardsFront = this.displayRowsFront),
                  (this.sendDataToCardsBack = this.displayRowsBack),
                  (this.cardTitle =
                      ConstantStringTableComponentsEnum.LOAD_INVOICE));

            // Get Tab Table Data For Selected Tab
            this.getSelectedTabTableData();
        } else {
            this.viewData = [];
        }

        this.loadTableData = this.viewData;
    }

    private mapLoadData(data: LoadModel): LoadModel {
        return {
            ...data,
            isSelected: false,
            loadInvoice: {
                invoice: data?.loadNumber
                    ? data.loadNumber
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                type: data?.type?.name
                    ? data.type.name
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadDispatcher: {
                name: data?.dispatcher?.fullName
                    ? data.dispatcher.fullName
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                avatar: data?.dispatcher?.avatar
                    ? this.imageBase64Service.sanitizer(data.dispatcher.avatar)
                    : null,
            },
            loadTotal: {
                total: data?.totalRate
                    ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(data.totalRate)
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                subTotal: data?.totalAdjustedRate
                    ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                      this.thousandSeparator.transform(data.totalAdjustedRate)
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadBroker: {
                hasBanDnu: data?.broker?.ban || data?.broker?.dnu,
                isDnu: data?.broker?.dnu,
                name: data?.broker?.businessName
                    ? data.broker.businessName
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadTruckNumber: {
                number: data?.dispatch?.truck?.truckNumber
                    ? data.dispatch.truck.truckNumber
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                color: ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadTrailerNumber: {
                number: data?.dispatch?.trailer?.trailerNumber
                    ? data.dispatch.trailer.trailerNumber
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                color: ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadPickup: {
                count: data?.stops[0]?.stopLoadOrder
                    ? data.stops[0].stopLoadOrder
                    : null,
                location:
                    data?.stops[0]?.shipper?.address?.city +
                    ConstantStringTableComponentsEnum.COMA +
                    data?.stops[0]?.shipper?.address?.stateShortName,
                date: data?.stops[0]?.dateFrom
                    ? this.datePipe.transform(
                          data.stops[0].dateFrom,
                          ConstantStringTableComponentsEnum.DATE_FORMAT
                      )
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                time: data?.stops[0]?.timeFrom
                    ? data.stops[0].timeFrom
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadDelivery: {
                count: data?.stops[data.stops.length - 1]?.stopLoadOrder
                    ? data.stops[data.stops.length - 1].stopLoadOrder
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                location:
                    data?.stops[data.stops.length - 1]?.shipper?.address?.city +
                    ConstantStringTableComponentsEnum.COMA +
                    data?.stops[data.stops.length - 1]?.shipper?.address
                        ?.stateShortName,
                date: data?.stops[data.stops.length - 1]?.dateFrom
                    ? this.datePipe.transform(
                          data.stops[data.stops.length - 1].dateFrom,
                          ConstantStringTableComponentsEnum.DATE_FORMAT
                      )
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                time: data?.stops[data.stops.length - 1]?.timeFrom
                    ? data.stops[data.stops.length - 1].timeFrom
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadStatus: {
                status: data?.status?.name
                    ? data.status?.name
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                color: ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                time:
                    data?.lastStatusPassed?.hours +
                    ConstantStringTableComponentsEnum.HOURS +
                    data?.lastStatusPassed?.minutes +
                    ConstantStringTableComponentsEnum.MINUTES,
            },
            textMiles: data?.totalMiles
                ? data.totalMiles + ConstantStringTableComponentsEnum.MILES
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textCommodity: data?.generalCommodity?.name
                ? data.generalCommodity.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textWeight: data?.weight
                ? data.weight + ConstantStringTableComponentsEnum.POUNDS
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textBase: data?.baseRate
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.baseRate)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textAdditional: data?.additionalBillingRatesTotal
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(
                      data?.additionalBillingRatesTotal
                  )
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textAdvance: data?.advancePay
                ? ConstantStringTableComponentsEnum.DOLLAR_SIGN +
                  this.thousandSeparator.transform(data.advancePay)
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textPayTerms: data?.broker?.payTerm?.name
                ? data.broker.payTerm?.name
                : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            textDriver:
                data?.dispatch?.driver?.firstName &&
                data?.dispatch?.driver?.lastName
                    ? data?.dispatch?.driver?.firstName.charAt(0) +
                      ConstantStringTableComponentsEnum.DOT +
                      data?.dispatch?.driver?.lastName
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
            loadComment: {
                count: data?.commentsCount
                    ? data.commentsCount
                    : ConstantStringTableComponentsEnum.EMPTY_STRING_PLACEHOLDER,
                comments: data.comments,
            },
            tableAttachments: data?.files ? data.files : [],
            fileCount: data?.fileCount,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownLoadContent(),
            },
        };
    }

    private getDropdownLoadContent(): DropdownItem[] {
        return TableDropdownLoadComponentConstants.DROPDOWN_DATA;
    }

    private getTabData(dataType: string): LoadActiveState {
        if (dataType === ConstantStringTableComponentsEnum.ACTIVE) {
            this.loadActive = this.loadActiveQuery.getAll();

            return this.loadActive?.length ? this.loadActive : [];
        } else if (dataType === ConstantStringTableComponentsEnum.CLOSED) {
            this.loadClosed = this.loadClosedQuery.getAll();

            return this.loadClosed?.length ? this.loadClosed : [];
        } else if (dataType === ConstantStringTableComponentsEnum.PENDING) {
            this.loadPanding = this.loadPandinQuery.getAll();
            return this.loadPanding?.length ? this.loadPanding : [];
        } else if (dataType === ConstantStringTableComponentsEnum.TEMPLATE) {
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
    public onToolBarAction(event: ToolbarActions): void {
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            this.modalService.openModal(LoadModalComponent, { size: 'load' });
        } else if (
            event.action === ConstantStringTableComponentsEnum.TAB_SELECTED
        ) {
            this.selectedTab = event.tabData.field;

            this.backLoadFilterQuery.statusType =
                this.selectedTab === ConstantStringTableComponentsEnum.TEMPLATE
                    ? undefined
                    : this.selectedTab ===
                      ConstantStringTableComponentsEnum.ACTIVE
                    ? 2
                    : this.selectedTab ===
                      ConstantStringTableComponentsEnum.CLOSED
                    ? 3
                    : 1;

            this.backLoadFilterQuery.pageIndex = 1;

            this.sendLoadData();
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;
        }
    }

    public onTableHeadActions(event: {
        action: string;
        direction: string;
    }): void {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
            if (event.direction) {
                this.backLoadFilterQuery.statusType =
                    this.selectedTab ===
                    ConstantStringTableComponentsEnum.TEMPLATE
                        ? undefined
                        : this.selectedTab ===
                          ConstantStringTableComponentsEnum.ACTIVE
                        ? 2
                        : this.selectedTab ===
                          ConstantStringTableComponentsEnum.CLOSED
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

    private onTableBodyActions(event: { type: string; id?: number }): void {
        if (event.type === ConstantStringTableComponentsEnum.SHOW_MORE) {
            this.backLoadFilterQuery.statusType =
                this.selectedTab === ConstantStringTableComponentsEnum.TEMPLATE
                    ? undefined
                    : this.selectedTab ===
                      ConstantStringTableComponentsEnum.ACTIVE
                    ? 2
                    : this.selectedTab ===
                      ConstantStringTableComponentsEnum.CLOSED
                    ? 3
                    : 1;

            this.backLoadFilterQuery.pageIndex++;

            this.loadBackFilter(this.backLoadFilterQuery, true);
        } else if (event.type === ConstantStringTableComponentsEnum.DELETE) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.DELETE },
                {
                    type: ConstantStringTableComponentsEnum.DELETE,
                }
            );

            this.confiramtionService.confirmationData$.subscribe((response) => {
                if (
                    response.type === ConstantStringTableComponentsEnum.DELETE
                ) {
                    this.loadServices
                        .deleteLoadById(event.id)
                        .pipe(takeUntil(this.destroy$))

                        .subscribe();
                }
            });
        } else if (event.type === ConstantStringTableComponentsEnum.EDIT) {
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
                            { size: ConstantStringTableComponentsEnum.LOAD },
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
            type: ConstantStringTableComponentsEnum.SHOW_MORE,
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
