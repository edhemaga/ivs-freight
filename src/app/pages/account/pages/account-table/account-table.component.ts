import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, takeUntil } from 'rxjs';

// components
import { AccountModalComponent } from 'src/app/pages/account/pages/account-modal/account-modal.component';

// services
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { AccountService } from 'src/app/pages/account/services/account.service';

// store
import { AccountState } from 'src/app/pages/account/state/account.store';
import { AccountQuery } from 'src/app/pages/account/state/account.query';

// utils
import { getToolsAccountsColumnDefinition } from 'src/app/shared/utils/settings/table-settings/tools-accounts-columns';
import { MethodsGlobalHelper } from 'src/app/shared/utils/helpers/methods-global.helper';

// enums
import { AccountStringEnum } from 'src/app/pages/account/enums/account-string.enum';
import { TableActionsStringEnum } from 'src/app/shared/enums/table-actions-string.enum';

// models
import {
    CompanyAccountLabelResponse,
    CompanyAccountResponse,
} from 'appcoretruckassist';
import { AccountTableToolbarAction } from 'src/app/pages/account/pages/account-table/models/account-table-toolbard-action.model';
import { AccountTableBodyAction } from 'src/app/pages/account/pages/account-table/models/account-table-body-action.model';
import { AccountTableHeadAction } from 'src/app/pages/account/pages/account-table/models/account-table-head-action.model';
import { AccountCardData } from 'src/app/pages/account/utils/constants/account-card-data.constants';
import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

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

    // Data to display from model Broker
    public displayRowsFront: CardRows[] =
        AccountCardData.DISPLAY_ROWS_FRONT_ACTIVE;

    public cardTitle: string = AccountCardData.CARD_TITLE;
    public page: string = AccountCardData.PAGE;
    public rows: number = AccountCardData.ROWS;

    public sendDataToCardsFront: CardRows[];

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private accountQuery: AccountQuery,
        private accountService: AccountService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.sendAccountData();

        this.accountResetColumns();

        this.accountResize();

        this.accountCurrentToaggleColumn();

        this.accountCurrentSearchTableData();

        this.accountCurrentActionAnimation();

        this.accountCurrentDeleteSelectedRows();
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
    }

    private accountCurrentToaggleColumn(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((c) => {
                        if (c.field === response.column.field) {
                            c.hidden = response.column.hidden;
                        }

                        return c;
                    });
                }
            });
    }

    private accountCurrentSearchTableData(): void {
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableActionsStringEnum.API) {
                            this.accountBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableActionsStringEnum.STORE
                        ) {
                            this.sendAccountData();
                        }
                    }
                }
            });
    }

    private accountCurrentActionAnimation(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // Add Account
                if (res?.animation === TableActionsStringEnum.ADD) {
                    this.viewData.push(this.mapAccountData(res.data));

                    this.viewData = this.viewData.map(
                        (account: CompanyAccountResponse) => {
                            if (account.id === res.id) {
                                // account.actionAnimation =
                                //     TableActionsStringEnum.ADD;
                            }

                            return account;
                        }
                    );

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 2300);

                    this.updateDataCount();
                }

                // Update Account
                else if (res?.animation === TableActionsStringEnum.UPDATE) {
                    const updatedAccount = this.mapAccountData(res.data);

                    this.viewData = this.viewData.map(
                        (account: CompanyAccountResponse) => {
                            if (account.id === res.id) {
                                account = updatedAccount;
                                // account.actionAnimation =
                                //     TableActionsStringEnum.UPDATE;
                            }

                            return account;
                        }
                    );

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 1000);
                }

                // Delete Account
                else if (res?.animation === TableActionsStringEnum.DELETE) {
                    let accountIndex: number;

                    this.viewData = this.viewData.map(
                        (account: CompanyAccountResponse, index: number) => {
                            if (account.id === res.id) {
                                // account.actionAnimation =
                                //     TableActionsStringEnum.DELETE;
                                accountIndex = index;
                            }

                            return account;
                        }
                    );

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(accountIndex, 1);
                        clearInterval(inetval);
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
                    this.accountService
                        .deleteAccountList(response)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(() => {
                            this.viewData = this.viewData.map(
                                (account: CompanyAccountResponse) => {
                                    response.map((res) => {
                                        if (account.id === res.id) {
                                            // account.actionAnimation =
                                            //     TableActionsStringEnum.DELETE_MULTIPLE;
                                        }
                                    });

                                    return account;
                                }
                            );

                            this.updateDataCount();

                            const inetval = setInterval(() => {
                                this.viewData =
                                    MethodsGlobalHelper.closeAnimationAction(
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
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver?.observe(
            document.querySelector(TableActionsStringEnum.TABLE_CONTAINER)
        );
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                hideActivationButton: true,
                showLabelFilter: true,
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

    sendAccountData() {
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
    }

    updateDataCount() {
        const accountCount = JSON.parse(
            localStorage.getItem(AccountStringEnum.ACCOUNT_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = accountCount.account;

        this.tableData = [...updatedTableData];
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
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownOwnerContent(data),
            },
        };
    }
    getDropdownOwnerContent(data: any) {
        return [
            {
                title: 'Edit',
                name: 'edit-account',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: 'regular',
            },
            {
                title: 'View Details',
                name: 'view-details',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Go to Link',
                name: 'go-to-link',
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Copy Username',
                name: 'copy-username',
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Copy Password',
                name: 'copy-password',
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
            },
            {
                title: 'Share',
                name: 'share',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Print',
                name: 'print',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },

                svgClass: 'regular',
                hasBorder: true,
            },
            {
                title: 'Delete',
                name: 'delete-account',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'delete',
            },
        ];
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

    public onToolBarAction(event: AccountTableToolbarAction): void {
        if (event.action === TableActionsStringEnum.OPEN_MODAL) {
            this.modalService.openModal(AccountModalComponent, {
                size: 'small',
            });
        } else if (event.action === TableActionsStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.setAccountData(event.tabData);
        } else if (event.action === TableActionsStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        }
    }

    public onTableHeadActions(event: AccountTableHeadAction): void {
        if (event.action === TableActionsStringEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.sort = event.direction;

                this.backFilterQuery.pageIndex = 1;

                this.accountBackFilter(this.backFilterQuery);
            } else {
                this.sendAccountData();
            }
        }
    }

    public onTableBodyActions(event: AccountTableBodyAction): void {
        switch (event.type) {
            case TableActionsStringEnum.SHOW_MORE: {
                this.backFilterQuery.pageIndex++;
                this.accountBackFilter(this.backFilterQuery, true);
                break;
            }
            case AccountStringEnum.EDIT_ACCONUT: {
                this.modalService.openModal(
                    AccountModalComponent,
                    { size: TableActionsStringEnum.SMALL },
                    {
                        ...event,
                        type: TableActionsStringEnum.EDIT,
                    }
                );
                break;
            }
            case TableActionsStringEnum.GO_TO_LINK: {
                if (event.data?.url) {
                    this.clipboard.copy(event.data.url);
                }
                break;
            }
            case TableActionsStringEnum.COPY_PASSWORD: {
                this.clipboard.copy(event.data.password);
                break;
            }
            case TableActionsStringEnum.COPY_USERNAME: {
                this.clipboard.copy(event.data.password);
                break;
            }
            case AccountStringEnum.DELETE_ACCOUNT: {
                this.accountService
                    .deleteCompanyAccountById(event.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
                break;
            }
            case TableActionsStringEnum.LABLE_CHANGE: {
                this.saveAcountLabel(event.data);
                break;
            }
            case TableActionsStringEnum.UPDATE_LABLE: {
                this.updateAcountLable(event);
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateAcountLable(event: AccountTableBodyAction): void {
        // const companyAcountData = this.viewData.find(
        //     (e: CreateCompanyContactCommand) => e.id === event.id
        // );
        // const newdata: UpdateCompanyAccountCommand = {
        //     id: companyAcountData.id ?? null,
        //     name: companyAcountData.name ?? null,
        //     username: companyAcountData.username ?? null,
        //     password: companyAcountData.password ?? null,
        //     url: companyAcountData.url ?? null,
        //     companyAccountLabelId: event.data ? event.data.id : null,
        //     note: companyAcountData.note ?? null,
        // };
        // this.accountService
        //     .updateCompanyAccount(
        //         newdata,
        //         companyAcountData.colorRes,
        //         companyAcountData.colorLabels
        //     )
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe();
    }

    private saveAcountLabel(data: CompanyAccountLabelResponse): void {
        this.accountService
            .updateCompanyAccountLabel({
                id: data.id,
                name: data.name,
                colorId: data.colorId,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
