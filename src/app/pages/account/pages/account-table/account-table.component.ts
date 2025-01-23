import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy,
    Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, takeUntil } from 'rxjs';

// components
import { AccountModalComponent } from '@pages/account/pages/account-modal/account-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// base classes
import { AccountDropdownMenuActionsBase } from '@pages/account/base-classes';

// services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { AccountService } from '@pages/account/services/account.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// store
import { AccountState } from '@pages/account/state/account.store';
import { AccountQuery } from '@pages/account/state/account.query';
import { accountCardModalQuery } from '@pages/account/pages/account-card-modal/state/account-card-modal.query';

// utils
import { getToolsAccountsColumnDefinition } from '@shared/utils/settings/table-settings/tools-accounts-columns';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { AccountStringEnum } from '@pages/account/enums/account-string.enum';
import { TableActionsStringEnum } from '@shared/enums/table-actions-string.enum';
import { DropdownMenuStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// constants
import { AccountFilterConstants } from '@pages/account/pages/account-table/utils/constants/account-filter.constants';

// models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';
import { AccountTableToolbarAction } from '@pages/account/pages/account-table/models/account-table-toolbard-action.model';
import { AccountTableHeadAction } from '@pages/account/pages/account-table/models/account-table-head-action.model';
import { AccountCardData } from '@pages/account/utils/constants/account-card-data.constants';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { AccountResponse } from '@pages/account/pages/account-table/models/account-response.model';
import { TableBodyColumns } from '@shared/components/ta-table/ta-table-body/models/table-body-columns.model';
import { AccountFilter } from '@pages/account/pages/account-table/models/account-filter.model';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

@Component({
    selector: 'app-account-table',
    templateUrl: './account-table.component.html',
    styleUrls: ['./account-table.component.scss'],
})
export class AccountTableComponent
    extends AccountDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableActionsStringEnum.LIST;

    public selectedTab: string = TableActionsStringEnum.ACTIVE;

    public accounts: AccountState[];

    // table
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: AccountResponse[] = [];
    public columns: TableBodyColumns[] = [];

    // cards
    public cardTitle: string = AccountCardData.CARD_TITLE;
    public page: string = AccountCardData.PAGE;
    public rows: number = AccountCardData.ROWS;

    public displayRowsFront: CardRows[] =
        AccountCardData.DISPLAY_ROWS_FRONT_ACTIVE;
    public displayRowsBack: CardRows[] =
        AccountCardData.DISPLAY_ROWS_FRONT_ACTIVE;

    // filters
    public backFilterQuery: AccountFilter = {
        ...AccountFilterConstants.accountFilterQuery,
    };

    constructor(
        @Inject(DOCUMENT) protected documentRef: Document,

        // clipboard
        protected clipboard: Clipboard,

        // services
        protected modalService: ModalService,
        protected accountService: AccountService,

        private tableService: TruckassistTableService,
        private confiramtionService: ConfirmationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // store
        private accountCardModalQuery: accountCardModalQuery,
        private accountQuery: AccountQuery
    ) {
        super(documentRef, clipboard, modalService, accountService);
    }

    ngOnInit(): void {
        this.sendAccountData();

        this.confirmationSubscribe();

        this.accountResetColumns();

        this.accountResize();

        this.accountCurrentToaggleColumn();

        this.accountCurrentSearchTableData();

        this.accountCurrentActionAnimation();

        this.accountCurrentDeleteSelectedRows();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private accountResetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) {
                    this.sendAccountData();
                }
            });
    }

    private accountResize(): void {
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

    private accountCurrentToaggleColumn(): void {
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

    private accountCurrentSearchTableData(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableActionsStringEnum.API)
                            this.accountBackFilter(searchEvent.query);
                        else if (
                            searchEvent.action === TableActionsStringEnum.STORE
                        )
                            this.sendAccountData();
                    }
                }
            });
    }

    private accountCurrentActionAnimation(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.animation === TableActionsStringEnum.ADD) {
                    this.viewData.push(this.mapAccountData(res.data));

                    this.viewData = this.viewData.map(
                        (account: AccountResponse) => {
                            if (account.id === res.id)
                                account.actionAnimation =
                                    TableActionsStringEnum.ADD;

                            return account;
                        }
                    );

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 2300);

                    this.updateDataCount();
                }

                // Update Account
                else if (res?.animation === TableActionsStringEnum.UPDATE) {
                    const updatedAccount = this.mapAccountData(res.data);

                    this.viewData = this.viewData.map(
                        (account: AccountResponse) => {
                            if (account.id === res.id) {
                                account = updatedAccount;
                                account.actionAnimation =
                                    TableActionsStringEnum.UPDATE;
                            }

                            return account;
                        }
                    );

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 1000);
                }

                // Delete Account
                else if (res?.animation === TableActionsStringEnum.DELETE) {
                    let accountIndex: number;

                    this.viewData = this.viewData.map(
                        (account: AccountResponse, index: number) => {
                            if (account.id === res.id) {
                                account.actionAnimation =
                                    TableActionsStringEnum.DELETE;
                                accountIndex = index;
                            }

                            return account;
                        }
                    );

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(accountIndex, 1);
                        clearInterval(interval);
                    }, 900);

                    this.updateDataCount();
                }
            });
    }

    private accountCurrentDeleteSelectedRows(): void {
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
                            template: DropdownMenuStringEnum.ACCOUNT,
                            type: TableStringEnum.MULTIPLE_DELETE,
                        }
                    );
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

        this.resizeObserver?.observe(
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                hideActivationButton: true,
                showLabelFilter: true,
                hidePrintButton: true,
                viewModeOptions: [
                    {
                        name: TableActionsStringEnum.LIST,
                        active:
                            this.activeViewMode === TableActionsStringEnum.LIST,
                    },
                    {
                        name: TableActionsStringEnum.CARD,
                        active:
                            this.activeViewMode === TableActionsStringEnum.CARD,
                    },
                ],
            },
        };
    }

    private sendAccountData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(AccountStringEnum.ACCOUNT_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const accontCount = JSON.parse(
            localStorage.getItem(AccountStringEnum.ACCOUNT_TABLE_COUNT)
        );

        const accountData = this.getTabData();

        this.tableData = [
            {
                title: AccountStringEnum.ACCOUNTS,
                field: TableActionsStringEnum.ACTIVE,
                extended: false,
                length: accontCount.account,
                data: accountData,
                gridNameTitle: AccountStringEnum.ACCOUNT_2,
                stateName: AccountStringEnum.ACCOUNTS_2,
                tableConfiguration: AccountStringEnum.ACCOUNT,
                isActive: true,
                gridColumns: this.getGridColumns(AccountStringEnum.ACCOUNT),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setAccountData(td);

        this.tabCardsConfig();
    }

    private updateDataCount(): void {
        const accountCount = JSON.parse(
            localStorage.getItem(AccountStringEnum.ACCOUNT_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = accountCount.account;

        this.tableData = [...updatedTableData];
    }

    public getTabData(): AccountState[] {
        this.accounts = this.accountQuery.getAll();

        return this.accounts?.length ? this.accounts : [];
    }

    private getGridColumns(configType: string): string[] {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getToolsAccountsColumnDefinition();
    }

    private setAccountData(td: any): void {
        //leave this any for now
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: AccountResponse) => {
                return this.mapAccountData(data);
            });
        } else this.viewData = [];
    }

    private mapAccountData(data: any): any {
        //leave any for now
        return {
            ...data,
            isSelected: false,
            lable: data?.companyAccountLabel
                ? {
                      name: data?.companyAccountLabel?.name
                          ? data.companyAccountLabel.name
                          : '',
                      color: data?.companyAccountLabel?.code
                          ? data.companyAccountLabel.code
                          : '',
                  }
                : null,
            accountPassword: {
                hiden: true,
                apiCallStarted: false,
                password: data?.password ? data.password : '',
                hidemCharacters: this.getHidenCharacters(data),
            },
            tableDropdownContent: this.getAccountDropdownContent(data?.url),
        };
    }

    private getAccountDropdownContent(url: string): DropdownMenuItem[] {
        return DropdownMenuContentHelper.getAccountDropdownContent(url);
    }

    public getHidenCharacters(data: AccountResponse): string {
        let caracters = '';

        for (let i = 0; i < data.password.length; i++) {
            caracters += '<div class="password-characters-container"></div>';
        }

        return caracters;
    }

    private accountBackFilter(
        filter: {
            labelId: number | undefined;
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
        this.accountService
            .getAccounts(
                filter.labelId,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((account: GetCompanyAccountListResponse) => {
                if (!isShowMore) {
                    this.viewData = account.pagination.data;

                    this.viewData = this.viewData.map(
                        (data: AccountResponse) => {
                            return this.mapAccountData(data);
                        }
                    );
                } else {
                    let newData = [...this.viewData];

                    account.pagination.data.map((data: AccountResponse) => {
                        newData.push(this.mapAccountData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    public onToolBarAction(event: AccountTableToolbarAction): void {
        if (event.action === TableActionsStringEnum.OPEN_MODAL)
            this.modalService.openModal(AccountModalComponent, {
                size: TableStringEnum.SMALL,
            });
        else if (event.action === TableActionsStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.setAccountData(event.tabData);
        } else if (event.action === TableActionsStringEnum.VIEW_MODE)
            this.activeViewMode = event.mode;
    }

    public onTableHeadActions(event: AccountTableHeadAction): void {
        if (event.action === TableActionsStringEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.sort = event.direction;

                this.backFilterQuery.pageIndex = 1;

                this.accountBackFilter(this.backFilterQuery);
            } else this.sendAccountData();
        }
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

        this.accountService.updateNote(noteData);
    }

    private confirmationSubscribe(): void {
        this.confiramtionService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE:
                            this.deleteAccountList([res.id]);

                            break;
                        case TableStringEnum.MULTIPLE_DELETE:
                            this.deleteAccountList(res.array);

                            break;
                        default:
                            break;
                    }
                },
            });
    }

    private deleteAccountList(ids: number[]): void {
        this.accountService
            .deleteAccountList(ids)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map(
                    (account: AccountResponse) => {
                        ids.map((id) => {
                            if (account.id === id)
                                account.actionAnimation =
                                    TableActionsStringEnum.DELETE_MULTIPLE;
                        });

                        return account;
                    }
                );

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(interval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    private tabCardsConfig(): void {
        this.accountCardModalQuery.active$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const filteredCardRowsFront =
                        res.front_side.filter(Boolean);

                    const filteredCardRowsBack = res.back_side.filter(Boolean);

                    this.cardTitle = TableStringEnum.NAME;

                    this.displayRowsFront = filteredCardRowsFront;

                    this.displayRowsBack = filteredCardRowsBack;
                }
            });
    }

    public handleShowMoreAction(): void {
        this.backFilterQuery.pageIndex++;

        this.accountBackFilter(this.backFilterQuery, true);
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
