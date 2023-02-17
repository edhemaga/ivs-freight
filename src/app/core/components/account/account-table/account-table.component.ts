import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AccountModalComponent } from '../../modals/account-modal/account-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { AccountQuery } from '../state/account-state/account.query';
import { AccountState } from '../state/account-state/account.store';
import { AccountTService } from '../state/account.service';
import { getToolsAccountsColumnDefinition } from '../../../../../assets/utils/settings/toolsAccounts-columns';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';

@Component({
    selector: 'app-account-table',
    templateUrl: './account-table.component.html',
    styleUrls: ['./account-table.component.scss'],
})
export class AccountTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    resizeObserver: ResizeObserver;
    accounts: AccountState[] = [];
    backFilterQuery = {
        labelId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private accountQuery: AccountQuery,
        private accountService: AccountTService
    ) {}

    ngOnInit(): void {
        this.sendAccountData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendAccountData();
                }
            });

        // Resize
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((c) => {
                        if (
                            c.title ===
                            response.columns[response.event.index].title
                        ) {
                            c.width = response.event.width;
                        }

                        return c;
                    });
                }
            });

        // Toaggle Columns
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

        // Search
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res) {
                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

                    if (searchEvent) {
                        if (searchEvent.action === 'api') {
                            this.accountBackFilter(searchEvent.query);
                        } else if (searchEvent.action === 'store') {
                            this.sendAccountData();
                        }
                    }
                }
            });

        // Account Actions
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // Add Account
                if (res.animation === 'add') {
                    this.viewData.push(this.mapAccountData(res.data));

                    this.viewData = this.viewData.map((account: any) => {
                        if (account.id === res.id) {
                            account.actionAnimation = 'add';
                        }

                        return account;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 2300);

                    this.updateDataCount();
                }
                // Update Account
                else if (res.animation === 'update') {
                    const updatedAccount = this.mapAccountData(res.data);

                    this.viewData = this.viewData.map((account: any) => {
                        if (account.id === res.id) {
                            account = updatedAccount;
                            account.actionAnimation = 'update';
                        }

                        return account;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }
                // Delete Account
                else if (res.animation === 'delete') {
                    let accountIndex: number;

                    this.viewData = this.viewData.map(
                        (account: any, index: number) => {
                            if (account.id === res.id) {
                                account.actionAnimation = 'delete';
                                accountIndex = index;
                            }

                            return account;
                        }
                    );

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(accountIndex, 1);
                        clearInterval(inetval);
                    }, 900);

                    this.updateDataCount();
                }
            });

        // Delete Selected Rows
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                if (response.length) {
                    this.accountService
                        .deleteAccountList(response)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(() => {
                            this.viewData = this.viewData.map(
                                (account: any) => {
                                    response.map((r: any) => {
                                        if (account.id === r.id) {
                                            account.actionAnimation =
                                                'delete-multiple';
                                        }
                                    });

                                    return account;
                                }
                            );

                            this.updateDataCount();

                            const inetval = setInterval(() => {
                                this.viewData = closeAnimationAction(
                                    true,
                                    this.viewData
                                );

                                clearInterval(inetval);
                            }, 900);

                            this.tableService.sendRowsSelected([]);
                            this.tableService.sendResetSelectedColumns(true);
                        });
                }
            });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(entry.contentRect.width);
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                showLabelFilter: true,
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit-account',
                    class: 'regular-text',
                    contentType: 'edit',
                },
                {
                    title: 'Delete',
                    name: 'delete-account',
                    type: 'account',
                    text: 'Are you sure you want to delete account(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                },
            ],
        };
    }

    sendAccountData() {
        this.initTableOptions();

        const accontCount = JSON.parse(
            localStorage.getItem('accountTableCount')
        );

        const accountData = this.getTabData();

        this.tableData = [
            {
                title: 'Accounts',
                field: 'active',
                extended: false,
                length: accontCount.account,
                data: accountData,
                gridNameTitle: 'Account',
                stateName: 'accounts',
                tableConfiguration: 'ACCOUNT',
                isActive: true,
                gridColumns: this.getGridColumns('ACCOUNT'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setAccountData(td);
    }

    updateDataCount() {
        const accountCount = JSON.parse(
            localStorage.getItem('accountTableCount')
        );

        this.tableData[0].length = accountCount.account;
    }

    getTabData() {
        this.accounts = this.accountQuery.getAll();

        return this.accounts?.length ? this.accounts : [];
    }

    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getToolsAccountsColumnDefinition();
    }

    setAccountData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.mapAccountData(data);
            });

            // For Testing
            // for (let i = 0; i < 300; i++) {
            //   this.viewData.push(this.viewData[0]);
            // }
        } else {
            this.viewData = [];
        }
    }

    mapAccountData(data: any) {
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
        };
    }

    getHidenCharacters(data: any) {
        let caracters: any = '';

        for (let i = 0; i < data.password.length; i++) {
            caracters += '<div class="password-characters-container"></div>';
        }

        return caracters;
    }

    // Account Back Filter
    accountBackFilter(
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
    ) {
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
            .subscribe((account: any) => {
                if (!isShowMore) {
                    this.viewData = account.pagination.data;

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapAccountData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    account.pagination.data.map((data: any) => {
                        newData.push(this.mapAccountData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    onToolBarAction(event: any) {
        if (event.action === 'open-modal') {
            this.modalService.openModal(AccountModalComponent, {
                size: 'small',
            });
        } else if (event.action === 'tab-selected') {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.setAccountData(event.tabData);
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;
        }
    }

    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
            if (event.direction) {
                this.backFilterQuery.sort = event.direction;

                this.backFilterQuery.pageIndex = 1;

                this.accountBackFilter(this.backFilterQuery);
            } else {
                this.sendAccountData();
            }
        }
    }

    public onTableBodyActions(event: any) {
        if (event.type === 'show-more') {
            this.backFilterQuery.pageIndex++;

            this.accountBackFilter(this.backFilterQuery, true);
        } else if (event.type === 'edit-account') {
            this.modalService.openModal(
                AccountModalComponent,
                { size: 'small' },
                {
                    ...event,
                    type: 'edit',
                }
            );
        } else if (event.type === 'delete-account') {
            this.accountService
                .deleteCompanyAccountById(event.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});
        // this.resizeObserver.unobserve(
        //     document.querySelector('.table-container')
        // );
        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
