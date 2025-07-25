import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

// base classes
import { UserDropdownMenuActionsBase } from '@pages/user/base-classes';

// settings
import { getUsersColumnDefinition } from '@shared/utils/settings/table-settings/users-columns';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { UserService } from '@pages/user/services/user.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';
import { UserCardsModalService } from '@pages/user/pages/user-card-modal/services/user-cards-modal.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// store
import { UserActiveQuery } from '@pages/user/state/user-active-state/user-active.query';
import { UserInactiveQuery } from '@pages/user/state/user-inactive-state/user-inactive.query';
import { UserActiveState } from '@pages/user/state/user-active-state/user-active.store';
import {
    UserInactiveState,
    UserInactiveStore,
} from '@pages/user/state/user-inactive-state/user-inactive.store';
import { select, Store } from '@ngrx/store';
import {
    selectActiveTabCards,
    selectInactiveTabCards,
} from '@pages/user/pages/user-card-modal/state';

// pipes
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';
import { ActivityTimePipe } from '@shared/pipes/activity-time.pipe';

// constants
import { UserTableConfig } from '@pages/user/pages/user-table/utils/constants/user-table-config.constants';
import { UserTableConfiguration } from '@pages/user/pages/user-table/utils/constants';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eDropdownMenu, eStringPlaceholder, eSharedString } from '@shared/enums';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CompanyUserResponse } from 'appcoretruckassist';
import { UserTableData } from '@pages/user/pages/user-table/models';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { TableColumnConfig } from '@shared/models';

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
    providers: [
        FormatPhonePipe,
        NameInitialsPipe,
        ThousandSeparatorPipe,
        ActivityTimePipe,
    ],
})
export class UserTableComponent
    extends UserDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public eDropdownMenu = eDropdownMenu;

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab = TableStringEnum.ACTIVE;

    public usersActive: UserActiveState[];
    public usersInactive: UserInactiveState[];

    // table
    public tableOptions: any;
    public tableData: any[];
    public viewData: any[];
    public columns: TableColumnConfig[];

    // cards
    public displayRowsFront: CardRows[] =
        UserTableConfiguration.displayRowsActiveFront;
    public displayRowsBack: CardRows[] =
        UserTableConfiguration.displayRowsActiveBack;

    public displayRows$: Observable<any>;

    // filters
    public backFilterQuery = UserTableConfig.BACK_FILTER_QUERY;

    public mapingIndex: number = 0;
    public inactiveTabClicked: boolean = false;

    constructor(
        // services
        protected modalService: ModalService,
        protected userService: UserService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        private confirmationService: ConfirmationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,
        private userCardsModalService: UserCardsModalService,
        private confirmationActivationService: ConfirmationActivationService,

        // store
        private usersActiveQuery: UserActiveQuery,
        private usersInactiveQuery: UserInactiveQuery,
        private usersInactiveStore: UserInactiveStore,
        private store: Store,

        // pipes
        private phoneFormater: FormatPhonePipe,
        private nameInitialsPipe: NameInitialsPipe,
        private datePipe: DatePipe,
        private activityTimePipe: ActivityTimePipe,
        private thousandSeparator: ThousandSeparatorPipe
    ) {
        super();
    }

    ngOnInit(): void {
        this.sendUserData();

        this.setTableFilter();

        this.resetColumns();

        this.currentColumnWidth();

        this.currentToaggleColumn();

        this.currentSearchTableData();

        this.currentActionAnimation();

        this.currentDeleteSelectedRows();

        this.confirmationSubscribe();

        this.confirmationActivationSubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE: {
                            if (res.template === TableStringEnum.USER_1) {
                                this.deleteUserById(res.id);
                            }
                            break;
                        }
                        case TableStringEnum.MULTIPLE_DELETE: {
                            this.multipleDeleteUsers(res.array);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                },
            });
    }

    private currentDeleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    const mappedRes = response.map((item) => {
                        return {
                            id: item.id,
                            data: {
                                ...item.tableData,
                                name:
                                    item.tableData.firstName +
                                    ' ' +
                                    item.tableData.lastName,
                            },
                        };
                    });

                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: TableStringEnum.USER_1,
                            type: TableStringEnum.MULTIPLE_DELETE,
                            image: true,
                        }
                    );
                }
            });
    }

    private currentActionAnimation(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // On Add Driver Active
                if (res?.animation === TableStringEnum.ADD) {
                    this.mapingIndex = 0;

                    this.viewData.push(this.mapUserData(res.data));

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user.actionAnimation = TableStringEnum.ADD;
                        }

                        return user;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 2300);
                }
                // On Update User
                else if (res?.animation === TableStringEnum.UPDATE) {
                    this.mapingIndex = 0;

                    const updatedDriver = this.mapUserData(res.data);

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user = updatedDriver;
                            user.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return user;
                    });

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 1000);
                }
                // On Update User Status
                else if (res?.animation === TableStringEnum.UPDATE_STATUS) {
                    this.mapingIndex = 0;

                    const updatedUser = this.mapUserData(res.data);

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user = updatedUser;
                            user.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return user;
                    });

                    const sortedUserData = this.viewData.sort(
                        (a, b) => b.userStatus - a.userStatus
                    );

                    this.viewData = [...sortedUserData];

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 900);
                }
            });
    }

    private currentSearchTableData(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.mapingIndex = 0;

                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backFilterQuery
                    );

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.API) {
                            this.userBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.sendUserData();
                        }
                    }
                }
            });
    }

    private currentToaggleColumn(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((columnData) => {
                        if (columnData.field === response.column.field) {
                            columnData.hidden = response.column.hidden;
                        }

                        return columnData;
                    });
                }
            });
    }

    private currentColumnWidth(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((columnData) => {
                        if (
                            columnData.title ===
                            response.columns[response.event.index].title
                        ) {
                            columnData.width = response.event.width;
                        }

                        return columnData;
                    });
                }
            });
    }

    private resetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) this.sendUserData();
            });
    }

    private setTableFilter(): void {
        this.tableService.currentSetTableFilter
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res?.filteredArray) {
                    if (res.selectedFilter) {
                        this.viewData = this.viewData?.filter((dataItem) =>
                            res.filteredArray.some(
                                (filterItem) => filterItem.id == dataItem.id
                            )
                        );
                    }

                    if (!res.selectedFilter) this.sendUserData();
                }
            });
    }

    // Responsive Observer
    private observTableContainer(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    // Table Options
    private initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                hideDataCount: true,
                showCountSelectedInList: false,
                showDepartmentFilter: true,
                showActivateButton:
                    this.selectedTab === TableStringEnum.INACTIVE,
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

    // Get Columns Definition
    private getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getUsersColumnDefinition();
    }

    // Send User Data
    private sendUserData(): void {
        const tableView = JSON.parse(localStorage.getItem(`User-table-view`));

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const userCount = JSON.parse(
            localStorage.getItem(TableStringEnum.USER_TABLE_COUNT)
        );

        const userActiveData =
            this.selectedTab === TableStringEnum.ACTIVE
                ? this.getTabData(TableStringEnum.ACTIVE)
                : [];

        const userInactiveData =
            this.selectedTab === TableStringEnum.INACTIVE
                ? this.getTabData(TableStringEnum.INACTIVE)
                : [];

        this.tableData = [
            {
                title: TableStringEnum.ACTIVE,
                field: TableStringEnum.ACTIVE,
                length: userCount.active,
                arhiveCount: 0,
                data: userActiveData,
                deactivatedUserArray: DataFilterHelper.checkSpecialFilterArray(
                    userActiveData,
                    TableStringEnum.STATUS
                ),
                gridNameTitle: TableStringEnum.USER,
                stateName: TableStringEnum.USERS,
                tableConfiguration: TableStringEnum.USER_2,
                isActive: this.selectedTab === TableStringEnum.ACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.USER_2),
            },
            {
                title: TableStringEnum.INACTIVE,
                field: TableStringEnum.INACTIVE,
                length: userCount.inactive,
                arhiveCount: 0,
                data: userInactiveData,
                deactivatedUserArray: DataFilterHelper.checkSpecialFilterArray(
                    userInactiveData,
                    TableStringEnum.STATUS
                ),
                gridNameTitle: TableStringEnum.USER,
                stateName: TableStringEnum.USERS,
                tableConfiguration: TableStringEnum.USER_2,
                isActive: this.selectedTab === TableStringEnum.INACTIVE,
                gridColumns: this.getGridColumns(TableStringEnum.USER_2),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setUserData(td);
        this.updateCardView();
    }

    // Get Tab Data
    private getTabData(
        dataType: string
    ): UserActiveState[] | UserInactiveState[] {
        if (dataType === TableStringEnum.ACTIVE) {
            this.usersActive = this.usersActiveQuery.getAll();

            return this.usersActive?.length ? this.usersActive : [];
        } else if (dataType === TableStringEnum.INACTIVE) {
            this.inactiveTabClicked = true;

            this.usersInactive = this.usersInactiveQuery.getAll();

            return this.usersInactive?.length ? this.usersInactive : [];
        }
    }

    // Set User Data
    private setUserData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;

            this.viewData = this.viewData.map((data: any) => {
                return this.mapUserData(data);
            });

            const sortedUserData = this.viewData.sort(
                (a, b) => b.userStatus - a.userStatus
            );

            this.viewData = [...sortedUserData];
        } else {
            this.viewData = [];
        }
    }

    // Map User Data
    public mapUserData(
        data: CompanyUserResponse,
        dontMapIndex?: boolean,
        isInvitationSent?: boolean
    ): any {
        //leave this any for now
        if (!data.avatarFile?.url && !dontMapIndex) this.mapingIndex++;

        const userFullName =
            data?.firstName && data?.lastName
                ? data.firstName + ' ' + data.lastName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER;

        return {
            ...data,
            isSelected: false,
            tableAvatar: {
                name: userFullName,
                avatar: data.avatarFile?.url ?? '',
                avatarColor: this.getAvatarColors(),
                textShortName: this.nameInitialsPipe.transform(
                    data?.firstName && data?.lastName
                        ? data.firstName + ' ' + data.lastName
                        : ''
                ),
            },
            textShortName: this.nameInitialsPipe.transform(userFullName),
            avatarColor: AvatarColorsHelper.getAvatarColors(this.mapingIndex),
            tableTableDept: data?.department?.name
                ? data.department.name
                : data?.department
                  ? data?.department
                  : '',
            tableTableOffice: data?.companyOffice?.name
                ? data.companyOffice.name
                : data?.companyOffice
                  ? data?.companyOffice
                  : '',
            tableTablePhone: data?.phone
                ? this.phoneFormater.transform(data.phone)
                : '',
            tableTableHired: data?.startDate
                ? this.datePipe.transform(data?.startDate, 'MM/dd/yy')
                : '',
            tableDeactivated: data?.deactivatedAt
                ? this.datePipe.transform(data.deactivatedAt, 'MM/dd/yy')
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePersonalDetailsPhone: data?.personalPhone
                ? this.phoneFormater.transform(data.personalPhone)
                : '',
            tablePersonalDetailsEmail: data?.personalEmail,
            tablePersonalDetailsAddress: data?.address?.address,
            tableTableStatus: {
                status: isInvitationSent
                    ? eSharedString.INVITED
                    : data?.userStatus === eStringPlaceholder.ZERO
                      ? eStringPlaceholder.NA_UPPERCASE
                      : data?.userStatus,
            },
            tableBillingDetailsBankName: data?.bank?.name,
            tableBillingDetailsRouting: data?.routingNumber,
            tableBillingDetailsAccount: data?.accountNumber,
            tablePaymentDetailsType: data?.paymentType?.name,
            tablePaymentDetailsComm: data?.commission
                ? data.commission + '%'
                : '',
            tablePaymentDetailsSalary: data?.salary
                ? '$' + this.thousandSeparator.transform(data.salary)
                : '',
            tableAdded: data.createdAt
                ? this.datePipe.transform(data.createdAt, 'MM/dd/yy')
                : '',
            tableEdited: data.updatedAt
                ? this.datePipe.transform(data.updatedAt, 'MM/dd/yy')
                : '',
            tableActivity: data.lastLogin
                ? this.activityTimePipe.transform(
                      data.lastLogin,
                      TableStringEnum.ACTIVITY
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableCantSelect: data.userStatus === TableStringEnum.OWNER,
            formType: data.is1099
                ? TableStringEnum.FORM_TYPE_1
                : TableStringEnum.W_2,
            // User Dropdown Action Set Up
            tableDropdownContent: this.getUserDropdownContent(
                data.userStatus,
                isInvitationSent
            ),
        };
    }

    public getUserDropdownContent(
        userStatus: string,
        isInvitationSent: boolean
    ): IDropdownMenuItem[] {
        return DropdownMenuContentHelper.getUserDropdownContent(
            this.selectedTab,
            userStatus,
            isInvitationSent
        );
    }

    // User Back Filter Query
    private userBackFilter(
        filter: {
            active: number;
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
        this.userService
            .getUsers(
                filter.active,
                filter.pageIndex,
                filter.pageSize,
                filter.companyId,
                filter.sort,
                filter.searchOne,
                filter.searchTwo,
                filter.searchThree
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((users) => {
                if (!isShowMore) {
                    this.viewData = users.pagination.data;

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapUserData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    users.pagination.data.map((data: any) => {
                        newData.push(this.mapUserData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // Change User Status
    public changeUserStatus(id: number, activate: boolean): void {
        this.userService
            .updateUserStatus(id, activate, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((user: UserTableData) => {
                        if (user.id === id)
                            user.actionAnimation =
                                TableStringEnum.UPDATE_STATUS;

                        return user;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                true,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 900);
                },
                error: () => {},
            });
    }

    private deleteUserById(id: number): void {
        this.userService
            .deleteUserById(id, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === id) {
                            user.actionAnimation = TableStringEnum.DELETE;
                        }

                        return user;
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                true,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 900);
                },
                error: () => {},
            });
    }

    private updateDataCount(): void {
        const userCount = JSON.parse(
            localStorage.getItem(TableStringEnum.USER_TABLE_COUNT)
        );

        this.tableData[0].length = userCount.active;
        this.tableData[1].length = userCount.inactive;

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = userCount.active;
        updatedTableData[1].length = userCount.inactive;

        this.tableData = [...updatedTableData];
    }

    // Get Avatar Color
    private getAvatarColors(): { background: string; color: string } {
        let textColors: string[] = [
            '#6D82C7',
            '#4DB6A2',
            '#E57373',
            '#E3B00F',
            '#BA68C8',
            '#BEAB80',
            '#81C784',
            '#FF8A65',
            '#64B5F6',
            '#F26EC2',
            '#A1887F',
            '#919191',
        ];

        let backgroundColors: string[] = [
            '#DAE0F1',
            '#D2EDE8',
            '#F9DCDC',
            '#F8EBC2',
            '#EED9F1',
            '#EFEADF',
            '#DFF1E0',
            '#FFE2D8',
            '#D8ECFD',
            '#FCDAF0',
            '#E7E1DF',
            '#E3E3E3',
        ];

        this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

        return {
            background: backgroundColors[this.mapingIndex],
            color: textColors[this.mapingIndex],
        };
    }

    // On ToolBar Actions
    public onToolBarAction(event: any): void {
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.modalService.openModal(UserModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.activeViewMode = event.mode;
        } else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.selectedTab = event.tabData.field;
            this.mapingIndex = 0;

            this.backFilterQuery.active =
                this.selectedTab === TableStringEnum.ACTIVE ? 1 : 0;
            this.backFilterQuery.pageIndex = 1;

            // Driver Inactive Api Call
            if (
                this.selectedTab === TableStringEnum.INACTIVE &&
                !this.inactiveTabClicked
            ) {
                this.userService
                    .getUsers(0, 1, 25)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((userPagination) => {
                        this.usersInactiveStore.set(
                            userPagination.pagination.data as any
                        );

                        this.sendUserData();
                    });
            } else {
                this.sendUserData();
            }
        } else if (event.action === TableStringEnum.ACTIVATE_ITEM) {
            const mappedEvent = [];

            this.viewData.map((data) => {
                event.tabData.data.forEach((element: number) => {
                    if (data.id === element) {
                        mappedEvent.push({
                            ...data,
                            name: data?.firstName + ' ' + data?.lastName,
                            avatarImg: data?.avatarFile,
                            showDepartment: true,
                        });
                    }
                });
            });

            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    data: null,
                    array: mappedEvent,
                    template: TableStringEnum.USER,
                    subType: TableStringEnum.USER,
                    type:
                        this.selectedTab === TableStringEnum.ACTIVE
                            ? TableStringEnum.DEACTIVATE_MULTIPLE
                            : TableStringEnum.ACTIVATE_MULTIPLE,
                    tableType: TableStringEnum.USERS,
                }
            );
        }
    }

    // On Head Actions
    public onTableHeadActions(event: any): void {
        if (event.action === TableStringEnum.SORT) {
            if (event.direction) {
                this.mapingIndex = 0;

                this.backFilterQuery.sort = event.direction;

                this.backFilterQuery.pageIndex = 1;

                this.userBackFilter(this.backFilterQuery);
            } else {
                this.sendUserData();
            }
        }
    }

    // Delete Multiple Users
    private multipleDeleteUsers(users: any): void {
        this.userService
            .deleteUserList(users, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((tableData: any) => {
                    users.map((userId: any) => {
                        if (tableData.id === userId) {
                            tableData.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;
                        }
                    });

                    return tableData;
                });

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

    public updateCardView(): void {
        switch (this.selectedTab) {
            case TableStringEnum.ACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectActiveTabCards)
                );

                break;
            case TableStringEnum.INACTIVE:
                this.displayRows$ = this.store.pipe(
                    select(selectInactiveTabCards)
                );

                break;
            default:
                break;
        }

        this.userCardsModalService.updateTab(this.selectedTab);
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                switch (res.type) {
                    case TableStringEnum.ACTIVATE: {
                        this.changeUserStatus(res.id, true);
                        break;
                    }
                    case TableStringEnum.DEACTIVATE: {
                        this.changeUserStatus(res.id, false);
                        break;
                    }
                    case TableStringEnum.ACTIVATE_MULTIPLE:
                    case TableStringEnum.DEACTIVATE_MULTIPLE:
                        const userIds = res.array.map((user) => {
                            return user.id;
                        });
                        this.changeUserStatusList(userIds);
                        break;
                    default:
                        break;
                }
            });
    }

    private changeUserStatusList(ids: number[]): void {
        this.userService
            .changeUserListStatus(ids, this.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    ids.forEach((id: number) => {
                        this.viewData = this.viewData.map(
                            (user: UserTableData) => {
                                if (user.id === id)
                                    user.actionAnimation =
                                        TableStringEnum.UPDATE;

                                return user;
                            }
                        );
                    });

                    this.updateDataCount();

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                true,
                                this.viewData
                            );

                        clearInterval(interval);
                    }, 900);

                    this.tableService.sendRowsSelected([]);
                    this.tableService.sendResetSelectedColumns(true);
                },
                error: () => {},
            });
    }

    public handleShowMoreAction(): void {
        this.backFilterQuery.pageIndex++;

        this.userBackFilter(this.backFilterQuery, true);
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});
        this.resizeObserver.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
