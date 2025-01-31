import {
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ViewChild,
} from '@angular/core';
import {
    filter,
    map,
    Observable,
    Subject,
    switchMap,
    take,
    takeUntil,
} from 'rxjs';

// Services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TableCardDropdownActionsService } from '@shared/components/ta-table-card-dropdown-actions/services/table-card-dropdown-actions.service';
import { LoadCardModalService } from '@pages/load/pages/load-card-modal/services/load-card-modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { CaSearchMultipleStatesService } from 'ca-components';
import { DispatchHubService } from '@shared/services/dispatch-hub.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Models
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import {
    LoadListDto,
    LoadListResponse,
    LoadStatusType,
    SortOrder,
} from 'appcoretruckassist';
import { IGetLoadListParam } from '@pages/load/pages/load-table/models/index';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { DatePipe } from '@angular/common';
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

// Enums
import { TableStringEnum, LoadStatusEnum } from '@shared/enums/index';
import { eActiveViewMode, eLoadStatusType, LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/index';

// Components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// Store
import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectClosedTabCards,
    selectPendingTabCards,
    selectTemplateTabCards,
} from '@pages/load/pages/load-card-modal/state/load-card-modal.selectors';

// Utils
import { RepairTableDateFormaterHelper } from '@pages/repair/pages/repair-table/utils/helpers/repair-table-date-formater.helper';

// Router
import { Router } from '@angular/router';

// Helpers
import { LoadTableHelper } from 'src/app/pages/load/pages/load-table/utils/helpers/load-table.helper';

@Component({
    selector: 'app-load-table',
    templateUrl: './load-table.component.html',
    styleUrls: ['./load-table.component.scss'],
    providers: [ThousandSeparatorPipe, NameInitialsPipe],
})
export class LoadTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('toolbarComponent') toolbarComponent: TaTableToolbarComponent;

    private destroy$ = new Subject<void>();
    private filter: IGetLoadListParam = TableDropdownComponentConstants.FILTER;

    public selectedTab: string = TableStringEnum.ACTIVE_2;
    public resizeObserver: ResizeObserver;
    public loadingPage: boolean = false;
    public cardTitleLink: string = TableStringEnum.LOAD_DETAILS;
    public cardTitle: string;
    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    public displayRows$: Observable<any>; //leave this as any for now

    constructor(
        //services
        private tableService: TruckassistTableService,
        private modalService: ModalService,
        private loadServices: LoadService,
        private dispatchHubService: DispatchHubService,
        private tableDropdownService: TableCardDropdownActionsService,
        private confiramtionService: ConfirmationService,
        private loadCardsModalService: LoadCardModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        public loadStoreService: LoadStoreService,

        //pipes
        public datePipe: DatePipe,

        //store
        private store: Store,

        // Router
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadStoreService.dispatchLoadList({
            statusType: eLoadStatusType.Active,
        });

        this.dispatchHubService.connect();

        this.manageDispatchHubListeners();
        this.manageSubscriptions();

        this.updateCardView();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observeTableContainer();
        }, 10);
    }

    public setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                const selectedtab: eLoadStatusType =
                    eLoadStatusType[this.selectedTab];
                const { ...params } = filter || {};

                switch (res?.filterType) {
                    case LoadFilterStringEnum.DISPATCHER_FILTER:
                        this.filter = {
                            ...params,
                            dispatcherIds: res.queryParams ?? null,
                        };

                        break;
                    case LoadFilterStringEnum.STATUS_FILTER:
                        this.filter = {
                            ...params,
                            status: res.queryParams ?? null,
                        };

                        break;
                    case LoadFilterStringEnum.TIME_FILTER:
                        if (res.queryParams?.timeSelected) {
                            const { fromDate, toDate } =
                                RepairTableDateFormaterHelper.getDateRange(
                                    res.queryParams?.timeSelected,
                                    res.queryParams.year ?? null
                                );

                            this.filter = {
                                ...params,
                                dateTo: toDate,
                                dateFrom: fromDate,
                            };
                        } else {
                            this.filter = {
                                ...params,
                                dateTo: null,
                                dateFrom: null,
                            };
                        }

                        break;
                    case LoadFilterStringEnum.MONEY_FILTER:
                        this.filter = {
                            ...params,
                            rateFrom:
                                res.queryParams?.moneyArray[0].from ?? null,
                            rateTo: res.queryParams?.moneyArray[0].to ?? null,
                            paidFrom:
                                res.queryParams?.moneyArray[1].from ?? null,
                            paidTo: res.queryParams?.moneyArray[1].to ?? null,
                            dueFrom:
                                res.queryParams?.moneyArray[2].from ?? null,
                            dueTo: res.queryParams?.moneyArray[2].to ?? null,
                        };

                        break;
                    case LoadFilterStringEnum.LOAD_TYPE_FILTER:
                        this.filter = {
                            ...params,
                            loadType: res.queryParams?.loadType ?? null,
                        };

                        break;
                    default:
                        break;
                }

                this.loadStoreService.dispatchGetList(
                    {
                        ...this.filter,
                        statusType: selectedtab,
                    },
                    selectedtab
                );
            });
    }

    public onToolBarAction(event: TableToolbarActions): void {
        const { action, mode } = event || {};
        if (action === TableStringEnum.OPEN_MODAL) {
            this.loadStoreService.dispatchGetCreateLoadModalData();
        } else if (action === TableStringEnum.TAB_SELECTED) {
            const { ...params } = this.filter || {};
            const { tabData } = event || {};
            const { field } = tabData || {};
            const selectedTab = LoadTableHelper.capitalizeFirstLetter(field);

            this.selectedTab = selectedTab;
            this.toolbarComponent?.flipCards(false);

            this.filter = {
                ...params,
                statusType: eLoadStatusType[this.selectedTab],
                pageIndex: 1,
                pageSize: 25,
            };

            this.getLoadStatusFilter();
            this.loadStoreService.dispatchGetList(
                this.filter,
                eLoadStatusType[selectedTab]
            );
            this.updateCardView();
        } else if (action === TableStringEnum.VIEW_MODE) {
            this.loadStoreService.dispatchSetActiveViewMode(
                eActiveViewMode[mode]
            );
        }
    }

    public onTableHeadActions(event: {
        action: string;
        direction: string;
        sortOrder: SortOrder;
        sortBy: string;
    }): void {
        const { action } = event || {};
        if (action === TableStringEnum.SORT) {
            const { ...params } = this.filter || {};
            const { direction, sortOrder, sortBy } = event || {};

            if (direction) {
                const statusType: number | null =
                    eLoadStatusType[this.selectedTab] === eLoadStatusType.Template
                        ? null
                        : eLoadStatusType[this.selectedTab];

                this.filter = {
                    ...params,
                    pageIndex: 1,
                    sortOrder,
                    sortBy,
                    statusType,
                };
            } else {
                this.filter = {
                    ...params,
                    sortOrder: null,
                    sortBy: null,
                };
            }

            this.loadStoreService.dispatchGetList(
                this.filter,
                eLoadStatusType[this.selectedTab]
            );
        }
    }

    public onDropdownActions(): void {
        this.tableDropdownService.openModal$
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                this.onTableBodyActions(event);
            });
    }

    public onShowMore(): void {
        this.onTableBodyActions({
            type: TableStringEnum.SHOW_MORE,
        });
    }

    //TODO: move cards to load store
    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE_2:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );
                break;

            case TableStringEnum.PENDING_2:
                this.displayRows$ = this.store.pipe(
                    select(selectPendingTabCards)
                );
                break;
            case TableStringEnum.TEMPLATE_2:
                this.displayRows$ = this.store.pipe(
                    select(selectTemplateTabCards)
                );
                break;
            case TableStringEnum.CLOSED_2:
                this.displayRows$ = this.store.pipe(
                    select(selectClosedTabCards)
                );
                break;
            default:
                break;
        }
        this.loadCardsModalService.updateTab(this.selectedTab?.toLowerCase());
    }

    public saveValueNote(event: { value: string; id: number }): void {
        const { id, value } = event || {};
        this.loadStoreService.dispatchSaveValueNote(id, value);
    }

    private manageSubscriptions(): void {
        this.confirmationDataSubscribe();
        this.currentSelectedRowsSubscribe();

        this.onDeleteSelectedRows();
        this.onUpdateStatus();

        this.onColumnToggle();
        this.onResetColumns();
        this.onTableUnlock();
        this.onResize();
        this.onSearch();

        this.setTableFilter();
        this.getLoadStatusFilter();
    }

    private onColumnToggle(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((toggledColumn) => {
                this.loadStoreService.dispatchTableColumnToggled(toggledColumn);
            });
    }

    private onTableUnlock(): void {
        this.tableService.currentUnlockTable
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadStoreService.dispatchTableColumnReset();
            });
    }

    private onUpdateStatus(): void {
        this.loadServices.statusAction$
            .pipe(
                takeUntil(this.destroy$),
                filter((statusAction) => statusAction !== null),
                switchMap((status) => {
                    return this.loadStoreService.viewData$.pipe(
                        take(1),
                        map((viewData) => {
                            return { status, viewData };
                        })
                    );
                })
            )
            .subscribe((param) => {
                const { status, viewData } = param;
                const { isRevert } = status || {};

                const updatingItem = viewData.find(
                    (item) => item.id === status.id
                );

                if (!updatingItem) return;

                // if user selects Assigend status and
                // Load does not already have a truck, trailer and driver assigned we should show load modal
                const isAssignedStatusSelected = [LoadStatusEnum[2]].includes(
                    status.dataBack
                );
                const isTruckTrailerDriverSelected = !!updatingItem.driver;

                const isPaidOrShortPaid = [
                    LoadStatusEnum[13],
                    LoadStatusEnum[16],
                ].includes(status.dataBack);

                const isTonuFromCancelled =
                    [LoadStatusEnum[25]].includes(status.dataBack) &&
                    updatingItem?.status.statusString === LoadStatusEnum[55];

                if (
                    (isAssignedStatusSelected &&
                        !isTruckTrailerDriverSelected) ||
                    isPaidOrShortPaid ||
                    isTonuFromCancelled
                ) {
                    this.onTableBodyActions({
                        type: TableStringEnum.EDIT,
                        id: updatingItem.id,
                    });
                    return;
                }

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
                        ].includes(updatingItem?.status.statusString)) ||
                    (status.dataBack === LoadStatusEnum[3] &&
                        [LoadStatusEnum[44], LoadStatusEnum[55]].includes(
                            updatingItem?.status.statusString
                        ))
                ) {
                    const mappedEvent = {
                        ...updatingItem,
                        data: {
                            ...updatingItem,
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
                            modalTitle: updatingItem.loadNumber,
                            modalSecondTitle: updatingItem.driver?.truckNumber,
                        }
                    );
                } else {
                    this.loadStoreService.dispatchUpdateOrRevertLoadStatus(
                        {
                            id: updatingItem.id,
                            status: status.dataBack,
                        },
                        isRevert
                    );
                }
            });
    }

    private confirmationDataSubscribe(): void {
        this.confiramtionService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((confirmationData) => {
                const { type, template } = confirmationData || {};

                // TODO: move to helper
                if (type === TableStringEnum.DELETE) {
                    if (template === TableStringEnum.COMMENT) {
                        const { data } = confirmationData || {};
                        const { commentId, entityTypeId } = data || {};

                        this.loadStoreService.dispatchDeleteCommentById(
                            commentId,
                            entityTypeId
                        );
                    } else {
                        const { id } = confirmationData || {};

                        this.loadStoreService.dispatchDeleteLoadOrTemplateById(id, eLoadStatusType[this.selectedTab]);
                    }
                } else if (type === TableStringEnum.MULTIPLE_DELETE) {
                    const { array } = confirmationData || {};

                    this.loadStoreService.dispatchBulkDeleteBulkLoadsOrTemplates(array, eLoadStatusType[this.selectedTab])
                }
            });

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((confirmationResponse) => {
                this.loadStoreService.dispatchUpdateloadStatusConfirmation(confirmationResponse);
            });
    }

    private getLoadStatusFilter(): void {
        if (this.selectedTab !== TableStringEnum.TEMPLATE_2)
            this.loadStoreService.dispatchGetLoadStatusFilter(
                <LoadStatusType>this.selectedTab
            );
    }

    private onResize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                const { event, columns } = response || {};
                const { width, index } = event || {};

                if (width)
                    this.loadStoreService.dispatchTableColumnResize(
                        columns,
                        width,
                        index
                    );
            });
    }

    private onResetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) this.loadStoreService.dispatchTableColumnReset();
            });
    }

    private onSearch(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                if (event) {
                    const {
                        chipAdded,
                        isChipDelete,
                        query,
                        chips,
                        addToQuery,
                        search: eventSearch,
                    } = event || {};
                    const { search, search1, search2 } = this.filter || {};
                    const selectedTab = eLoadStatusType[this.selectedTab];
                    let _search: string = search;
                    let _search1: string = search1;
                    let _search2: string = search2;

                    if (chipAdded) {
                        switch (query) {
                            case 'searchOne':
                                _search = eventSearch;
                                break;
                            case 'searchTwo':
                                _search1 = eventSearch;
                                break;
                            case 'searchThree':
                                _search2 = eventSearch;
                                break;
                        }
                    } else if (isChipDelete && !!chips) {
                        _search = chips[0]?.searchText ?? null;
                        _search1 = chips[1]?.searchText ?? null;
                        _search2 = chips[2]?.searchText ?? null;
                    }

                    this.filter = {
                        ...this.filter,
                        search: _search,
                        search1: _search1,
                        search2: _search2,
                    };

                    this.loadStoreService.dispatchGetList(
                        this.filter,
                        selectedTab
                    );
                }
            });
    }

    private onDeleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length && !this.loadingPage) {
                    const modalTitle = LoadTableHelper.composeDeleteModalTitle(this.selectedTab);

                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                name:
                                    this.selectedTab ===
                                    TableStringEnum.TEMPLATE_2
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
                            subType: this.selectedTab?.toLowerCase(),
                            modalHeaderTitle: modalTitle,
                        }
                    );
                }
            });
    }
    
    private observeTableContainer(): void {
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

    private onTableBodyActions(event: {
        type: string;
        id?: number;
        data?: any;
    }): void {
        const { ...params } = this.filter || {};
        const { type } = event || {};
        const { id } = event || {};
        const selectedTab: eLoadStatusType =
            eLoadStatusType[this.selectedTab];

        if (type === TableStringEnum.SHOW_MORE) {
            this.filter = {
                ...params,
                pageIndex: params.pageIndex ? params.pageIndex + 1 : 1,
                statusType: selectedTab,
                pageSize: 25,
            };

            this.loadStoreService.dispatchGetList(
                this.filter,
                selectedTab,
                true
            );
        } else if (type === TableStringEnum.DELETE) {
            const modalTitle = LoadTableHelper.composeDeleteModalTitle(this.selectedTab);

            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.DELETE,
                    template: TableStringEnum.LOAD,
                    subType: this.selectedTab?.toLowerCase(),
                    modalHeaderTitle: modalTitle,
                }
            );
        } else if (type === TableStringEnum.EDIT) {
            this.loadStoreService.dispatchGetEditLoadOrTemplateModalData(
                id,
                selectedTab,
                type
            );
        } else if (type === TableStringEnum.VIEW_DETAILS) {
            this.router.navigate([`/list/load/${event.id}/details`]);
        } else if (
            type === TableStringEnum.CONVERT_TO_TEMPLATE ||
            type === TableStringEnum.CONVERT_TO_LOAD
        ) {
            this.loadStoreService.dispatchGetConvertToLoadOrTemplateModalData(
                id,
                selectedTab,
                type
            );
        }
    }

    private currentSelectedRowsSubscribe(): void {
        this.tableService.currentRowsSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: { id: number; tableData: LoadListDto }[]) => {
                if (res) {
                    const selectedIds = res.map((_) => _.id);
                    let isDeleteHidden = true;

                    res.map((item) => {
                        const { tableData } = item || {};
                        const { status } = tableData || {};
                        const { statusValue } = status || {};
                        const { name } = statusValue || {};

                        if (
                            this.selectedTab === TableStringEnum.ACTIVE_2 ||
                            this.selectedTab === TableStringEnum.CLOSED_2 ||
                            (name !== TableStringEnum.UNASSIGNED &&
                                name !== TableStringEnum.BOOKED)
                        ) {
                            isDeleteHidden = false;
                        }
                    });

                    this.loadStoreService.dsipatchCanDeleteSelectedDataRows(
                        isDeleteHidden,
                        selectedIds
                    );
                }
            });
    }

    private manageDispatchHubListeners(): void {
        this.dispatchHubService
            .onLoadChanged()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                // TODO: update api services to get proper type after merge

                this.loadStoreService.dispatchUpdateLoadStatusSignalR(
                    response as LoadListResponse
                );
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
    }
}
