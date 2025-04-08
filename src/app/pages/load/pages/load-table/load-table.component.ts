import {
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import {
    filter,
    map,
    Observable,
    Subject,
    switchMap,
    take,
    takeUntil,
} from 'rxjs';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { LoadCardModalService } from '@pages/load/pages/load-card-modal/services/load-card-modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { CaSearchMultipleStatesService, IFilterAction } from 'ca-components';
import { DispatchHubService } from '@shared/services/dispatch-hub.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// store
import { Store, select } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectClosedTabCards,
    selectPendingTabCards,
    selectTemplateTabCards,
} from '@pages/load/pages/load-card-modal/state/load-card-modal.selectors';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { DatePipe } from '@angular/common';
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// enums
import {
    TableStringEnum,
    LoadStatusEnum,
    eDropdownMenu,
    eActiveViewMode,
    eDropdownMenuColumns,
} from '@shared/enums/index';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

// constants
import { TableDropdownComponentConstants } from '@shared/utils/constants/table-dropdown-component.constants';

// helpers
import { LoadTableHelper } from 'src/app/pages/load/pages/load-table/utils/helpers/load-table.helper';

// models
import { TableToolbarActions } from '@shared/models/table-models/table-toolbar-actions.model';
import { LoadListDto, LoadListResponse, SortOrder } from 'appcoretruckassist';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { IGetLoadListParam } from '@pages/load/pages/load-table/models';
import { CardRows, TableCardBodyActions } from '@shared/models';

import { IStateFilters } from '@shared/interfaces';

// Helpers
import { FilterHelper } from '@shared/utils/helpers';
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

@Component({
    selector: 'app-load-table',
    templateUrl: './load-table.component.html',
    styleUrls: ['./load-table.component.scss'],
    providers: [ThousandSeparatorPipe, NameInitialsPipe],
})
export class LoadTableComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('toolbarComponent') toolbarComponent: TaTableToolbarComponent;

    public destroy$ = new Subject<void>();

    public eDropdownMenu = eDropdownMenu;

    public resizeObserver: ResizeObserver;

    public selectedTab: string = TableStringEnum.ACTIVE_2;

    public loadingPage: boolean = false;
    public cardTitleLink: string = TableStringEnum.LOAD_DETAILS;
    public cardTitle: string;
    public sendDataToCardsFront: CardRows[];
    public sendDataToCardsBack: CardRows[];
    public displayRows$: Observable<any>; //leave this as any for now
    public tableStringEnum = TableStringEnum;

    // filters
    private filter: IGetLoadListParam = TableDropdownComponentConstants.FILTER;

    private isTableLocked: boolean = true;
    private isToolbarDropdownMenuColumnsActive: boolean = false;
    public toolbarDropdownMenuOptions: IDropdownMenuItem[] = [];

    constructor(
        // router
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected loadStoreService: LoadStoreService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        private loadServices: LoadService,
        private dispatchHubService: DispatchHubService,
        private confiramtionService: ConfirmationService,
        private loadCardsModalService: LoadCardModalService,
        private confirmationActivationService: ConfirmationActivationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // pipes
        public datePipe: DatePipe,

        // store
        private store: Store
    ) {
        super();
    }

    ngOnInit(): void {
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

    private mapFilters(
        res: IFilterAction,
        currentFilters: IStateFilters
    ): IStateFilters {
        return FilterHelper.mapFilters(res, currentFilters);
    }

    public setFilters(filters: IFilterAction): void {
        const selectedtab: eLoadStatusType = eLoadStatusType[this.selectedTab];

        this.loadStoreService.dispatchGetList(
            {
                ...this.mapFilters(filters, this.filter),
                statusType: selectedtab,
            },
            selectedtab
        );
    }

    private setToolbarDropdownMenuContent(
        selectedTab: string,
        isTableLocked: boolean,
        isColumnsDropdownActive: boolean,
        loadColumnsList?: IDropdownMenuItem[]
    ): void {
        this.toolbarDropdownMenuOptions =
            LoadTableHelper.getToolbarDropdownMenuContent(
                selectedTab,
                isTableLocked,
                isColumnsDropdownActive,
                loadColumnsList
            );
    }

    private updateToolbarDropdownMenuContentUnlockLockAction(): void {
        this.isTableLocked = !this.isTableLocked;

        this.setToolbarDropdownMenuContent(
            this.selectedTab,
            this.isTableLocked,
            this.isToolbarDropdownMenuColumnsActive
        );
    }

    private updateToolbarDropdownMenuContentColumnsAction(): void {
        this.isToolbarDropdownMenuColumnsActive =
            !this.isToolbarDropdownMenuColumnsActive;

        const loadColumns =
            DropdownMenuColumnsActionsHelper.getDropdownMenuColumnsContent(
                this.selectedTab
            );

        this.setToolbarDropdownMenuContent(
            this.selectedTab,
            this.isTableLocked,
            this.isToolbarDropdownMenuColumnsActive,
            loadColumns
        );
    }

    public onToolBarAction(event: TableToolbarActions): void {
        const { action, mode } = event || {};
        if (action === TableStringEnum.OPEN_MODAL) {
            this.loadStoreService.dispatchGetCreateLoadModalData();
        } else if (action === TableStringEnum.TAB_SELECTED) {
            const { ...params } = this.filter || {};
            const selectedTab = LoadTableHelper.capitalizeFirstLetter(mode);

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
            this.setToolbarDropdownMenuContent(
                selectedTab,
                this.isTableLocked,
                this.isToolbarDropdownMenuColumnsActive
            );
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
                    eLoadStatusType[this.selectedTab] ===
                    eLoadStatusType.Template
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

                const isNewStatusFromTonu =
                    status.dataBack ===
                        LoadStatusEnum[LoadStatusEnum.TonuUnpaid] ||
                    status.dataBack ===
                        LoadStatusEnum[LoadStatusEnum.TonuShortPaid] ||
                    status.dataBack ===
                        LoadStatusEnum[LoadStatusEnum.TonuClaim] ||
                    status.dataBack ===
                        LoadStatusEnum[LoadStatusEnum.TonuPaid] ||
                    status.dataBack ===
                        LoadStatusEnum[LoadStatusEnum.TonuInvoiced] ||
                    status.dataBack ===
                        LoadStatusEnum[LoadStatusEnum.TonuInvoicedFactoring];

                if (
                    (isAssignedStatusSelected &&
                        !isTruckTrailerDriverSelected) ||
                    isPaidOrShortPaid ||
                    isTonuFromCancelled ||
                    isNewStatusFromTonu
                ) {
                    const selectedTab: eLoadStatusType =
                        eLoadStatusType[this.selectedTab];
                    this.loadStoreService.dispatchGetEditLoadOrTemplateModalData(
                        updatingItem.id,
                        selectedTab,
                        TableStringEnum.EDIT
                    );
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

                        this.loadStoreService.dispatchDeleteLoadOrTemplateById(
                            id,
                            eLoadStatusType[this.selectedTab]
                        );
                    }
                } else if (type === TableStringEnum.MULTIPLE_DELETE) {
                    const { array } = confirmationData || {};

                    this.loadStoreService.dispatchBulkDeleteBulkLoadsOrTemplates(
                        array,
                        eLoadStatusType[this.selectedTab]
                    );
                }
            });

        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((confirmationResponse) => {
                this.loadStoreService.dispatchUpdateloadStatusConfirmation(
                    confirmationResponse
                );
            });
    }

    private getLoadStatusFilter(): void {
        if (this.selectedTab !== TableStringEnum.TEMPLATE_2)
            this.loadStoreService.loadDispatchFilters({
                loadStatusType: this.selectedTab,
            });
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
        // TODO: WHY NOT USE EMMITER?
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
                    const modalTitle = LoadTableHelper.composeDeleteModalTitle(
                        this.selectedTab
                    );

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

    public handleShowMoreAction(): void {
        const { ...params } = this.filter || {};
        const selectedTab: eLoadStatusType = eLoadStatusType[this.selectedTab];

        this.filter = {
            ...params,
            pageIndex: params.pageIndex ? params.pageIndex + 1 : 1,
            statusType: selectedTab,
            pageSize: 25,
        };

        this.loadStoreService.dispatchGetList(this.filter, selectedTab, true);
    }

    public updateToolbarDropdownMenuContent(action?: string): void {
        if (!action) {
            this.isToolbarDropdownMenuColumnsActive = false;

            this.setToolbarDropdownMenuContent(
                this.selectedTab,
                this.isTableLocked,
                this.isToolbarDropdownMenuColumnsActive
            );

            return;
        }

        switch (action) {
            case eDropdownMenuColumns.UNLOCK_TABLE_TYPE:
            case eDropdownMenuColumns.LOCK_TABLE_TYPE:
                this.updateToolbarDropdownMenuContentUnlockLockAction();

                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
            case eDropdownMenuColumns.COLUMNS_BACK_TYPE:
                this.updateToolbarDropdownMenuContentColumnsAction();

                break;
            default:
                break;
        }
    }

    public handleToolbarDropdownMenuActions<T>(
        action: TableCardBodyActions<T>
    ) {
        const mappedAction = {
            ...action,
            subType: DropdownMenuColumnsActionsHelper.getTableType(
                this.selectedTab
            ),
        };

        this.handleDropdownMenuActions(mappedAction, eDropdownMenu.LOAD);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
        this.tableService.sendUnlockTable({});

        this.resizeObserver.disconnect();
    }
}
