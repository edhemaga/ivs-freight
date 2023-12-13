import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';

//componets
import { AccountModalComponent } from '../../modals/account-modal/account-modal.component';

//services
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { AccountTService } from '../state/account.service';

//store
import { AccountState } from '../state/account-state/account.store';
import { AccountQuery } from '../state/account-state/account.query';

//utils
import { getToolsAccountsColumnDefinition } from '../../../../../assets/utils/settings/toolsAccounts-columns';
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';

//enum
import { AccountComponentEnum } from '../state/enums/account-constant-strings.enum';
import { ComponentsTableEnum } from 'src/app/core/model/enums';

//model
import {
    CompanyAccountLabelResponse,
    CompanyAccountResponse,
    CreateCompanyContactCommand,
    UpdateCompanyAccountCommand,
} from 'appcoretruckassist';
import {
    TableBodyActionsAccount,
    TableHeadActionAccount,
    TableToolBarActionActionsAccount,
} from 'src/app/core/model/account';

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
        private accountService: AccountTService,
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
    }

    private accountCurrentActionAnimation(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // Add Account
                if (res.animation === ComponentsTableEnum.ADD) {
                    this.viewData.push(this.mapAccountData(res.data));

                    this.viewData = this.viewData.map(
                        (account: CompanyAccountResponse) => {
                            if (account.id === res.id) {
                                account.actionAnimation =
                                    ComponentsTableEnum.ADD;
                            }

                            return account;
                        }
                    );

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
                else if (res.animation === ComponentsTableEnum.UPDATE) {
                    const updatedAccount = this.mapAccountData(res.data);

                    this.viewData = this.viewData.map(
                        (account: CompanyAccountResponse) => {
                            if (account.id === res.id) {
                                account = updatedAccount;
                                account.actionAnimation =
                                    ComponentsTableEnum.UPDATE;
                            }

                            return account;
                        }
                    );

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }

                // Delete Account
                else if (res.animation === ComponentsTableEnum.DELETE) {
                    let accountIndex: number;

                    this.viewData = this.viewData.map(
                        (account: CompanyAccountResponse, index: number) => {
                            if (account.id === res.id) {
                                account.actionAnimation =
                                    ComponentsTableEnum.DELETE;
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
                                    response.map((r) => {
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
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                hideActivationButton: true,
                showLabelFilter: true,
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
        };
    }

    sendAccountData() {
        const tableView = JSON.parse(
            localStorage.getItem(`Account-table-view`)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

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

    public onToolBarAction(event: TableToolBarActionActionsAccount): void {
        if (event.action === ComponentsTableEnum.OPEN_MODAL) {
            this.modalService.openModal(AccountModalComponent, {
                size: 'small',
            });
        } else if (event.action === ComponentsTableEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.setAccountData(event.tabData);
        } else if (event.action === ComponentsTableEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        }
    }

    public onTableHeadActions(event: TableHeadActionAccount): void {
        if (event.action === ComponentsTableEnum.SORT) {
            if (event.direction) {
                this.backFilterQuery.sort = event.direction;

                this.backFilterQuery.pageIndex = 1;

                this.accountBackFilter(this.backFilterQuery);
            } else {
                this.sendAccountData();
            }
        }
    }

    public onTableBodyActions(event: TableBodyActionsAccount): void {
        switch (event.type) {
            case ComponentsTableEnum.SHOW_MORE: {
                this.backFilterQuery.pageIndex++;
                this.accountBackFilter(this.backFilterQuery, true);
                break;
            }
            case AccountComponentEnum.EDIT_ACCONUT: {
                this.modalService.openModal(
                    AccountModalComponent,
                    { size: ComponentsTableEnum.SMALL },
                    {
                        ...event,
                        type: ComponentsTableEnum.EDIT,
                    }
                );
                break;
            }
            case ComponentsTableEnum.GO_TO_LINK: {
                if (event.data?.url) {
                    this.clipboard.copy(event.data.url);
                }
                break;
            }
            case ComponentsTableEnum.COPY_PASSWORD: {
                this.clipboard.copy(event.data.password);
                break;
            }
            case ComponentsTableEnum.COPY_USERNAME: {
                this.clipboard.copy(event.data.password);
                break;
            }
            case AccountComponentEnum.DELETE_ACCOUNT: {
                this.accountService
                    .deleteCompanyAccountById(event.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
                break;
            }
            case ComponentsTableEnum.LABLE_CHANGE: {
                this.saveAcountLabel(event.data);
                break;
            }
            case ComponentsTableEnum.UPDATE_LABLE: {
                this.updateAcountLable(event);
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateAcountLable(event: TableBodyActionsAccount): void {
        const companyAcountData = this.viewData.find(
            (e: CreateCompanyContactCommand) => e.id === event.id
        );

        const newdata: UpdateCompanyAccountCommand = {
            id: companyAcountData.id ?? null,
            name: companyAcountData.name ?? null,
            username: companyAcountData.username ?? null,
            password: companyAcountData.password ?? null,
            url: companyAcountData.url ?? null,
            companyAccountLabelId: event.data ? event.data.id : null,
            note: companyAcountData.note ?? null,
        };

        this.accountService
            .updateCompanyAccount(
                newdata,
                companyAcountData.colorRes,
                companyAcountData.colorLabels
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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
        // this.resizeObserver.unobserve(
        //     document.querySelector('.table-container')
        // );
        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
