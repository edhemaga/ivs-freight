import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { UserService } from '@pages/user/services/user.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ModalService } from '@shared/services/modal.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';

// helpers
import { getUsersColumnDefinition } from '@shared/utils/settings/table-settings/users-columns';
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { DataFilterHelper } from '@shared/utils/helpers/data-filter.helper';

// store
import { UserActiveQuery } from '@pages/user/state/user-active-state/user-active.query';
import { UserActiveState } from '@pages/user/state/user-active-state/user-active.store';

import { UserInactiveQuery } from '@pages/user/state/user-inactive-state/user-inactive.query';
import {
    UserInactiveState,
    UserInactiveStore,
} from '@pages/user/state/user-inactive-state/user-inactive.store';

// pipes
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// constants
import { UserConstants } from '@pages/user/utils/constants/user.constants';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DisplayUserConfiguration } from '@pages/user/utils/constants/user-card-data.constants';

// models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CompanyUserResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
    providers: [FormatPhonePipe, NameInitialsPipe, ThousandSeparatorPipe],
})
export class UserTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = TableStringEnum.ACTIVE;
    activeViewMode: string = TableStringEnum.LIST;
    resizeObserver: ResizeObserver;
    mapingIndex: number = 0;
    public usersActive: UserActiveState[];
    public usersInactive: UserInactiveState[];

    public inactiveTabClicked: boolean = false;

    //Data to display from model
    public displayRowsFront: CardRows[] =
        DisplayUserConfiguration.displayRowsFront;

    public displayRowsBack: CardRows[] =
        DisplayUserConfiguration.displayRowsBack;

    public page: string = DisplayUserConfiguration.page;

    public rows: number = DisplayUserConfiguration.rows;

    public cardTitle: string = DisplayUserConfiguration.cardTitle;

    backFilterQuery = {
        active: 1,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    constructor(
        // service
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // store
        private usersActiveQuery: UserActiveQuery,
        private usersInactiveQuery: UserInactiveQuery,
        private usersInactiveStore: UserInactiveStore,

        // pipe
        private phoneFormater: FormatPhonePipe,
        private nameInitialsPipe: NameInitialsPipe,
        public datePipe: DatePipe,
        private thousandSeparator: ThousandSeparatorPipe
    ) {}

    // ---------------------------  NgOnInit ----------------------------------
    ngOnInit(): void {
        this.sendUserData();

        this.setTableFilter();

        this.resetColumns();

        this.currentColumnWidth();

        this.currentToaggleColumn();

        this.currentSearchTableData();

        this.currentActionAnimation();

        this.currentDeleteSelectedRows();

        this.confirmationData();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private confirmationData(): void {
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
                        case TableStringEnum.ACTIVATE: {
                            this.changeUserStatus(res.id);
                            break;
                        }
                        case TableStringEnum.DEACTIVATE: {
                            this.changeUserStatus(res.id);
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        clearInterval(inetval);
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

    // Table Options
    initTableOptions(): void {
        this.tableOptions = {
            toolbarActions: {
                hideDataCount: true,
                showArhiveCount: true,
                showCountSelectedInList: false,
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
    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getUsersColumnDefinition();
    }

    // Send User Data
    sendUserData() {
        const tableView = JSON.parse(localStorage.getItem(`User-table-view`));

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.initTableOptions();

        const userCount = JSON.parse(localStorage.getItem(TableStringEnum.USER_TABLE_COUNT));

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
    setUserData(td: any) {
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
    public mapUserData(data: CompanyUserResponse, dontMapIndex?: boolean): any {
        //leave this any for now
        if (!data.avatarFile?.url && !dontMapIndex) this.mapingIndex++;

        return {
            ...data,
            isSelected: false,
            tableAvatar: {
                name:
                    data?.firstName && data?.lastName
                        ? data.firstName + ' ' + data.lastName
                        : '',
                avatar: data.avatarFile?.url ?? '',
                avatarColor: this.getAvatarColors(),
                textShortName: this.nameInitialsPipe.transform(
                    data?.firstName && data?.lastName
                        ? data.firstName + ' ' + data.lastName
                        : ''
                ),
            },
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
            tableDeactivated: 'NA',
            tablePersonalDetailsPhone: data?.personalPhone
                ? this.phoneFormater.transform(data.personalPhone)
                : '',
            tablePersonalDetailsEmail: 'NA',
            tableTableStatus: {
                status:
                    data?.userType?.name && data?.userType?.name !== '0'
                        ? data.userType.name
                        : 'No',
                isInvited: false,
            },
            tableBillingDetailsBankName: 'NA',
            tableBillingDetailsRouting: 'NA',
            tableBillingDetailsAccount: 'NA',
            tablePaymentDetailsType: 'NA',
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
            userStatus: data.status as any, //leave this any for now
            tableCantSelect: data.userType.name === 'Owner',
            // User Dropdown Action Set Up
            tableDropdownContent: {
                hasContent: true,
                content:
                    data.userType.name.toLowerCase() === 'owner'
                        ? this.getOwnerDropdown(data)
                        : this.getDropdownContent(data),
            },
        };
    }

    // Get User Dropdown Content
    public getOwnerDropdown(data: CompanyUserResponse): DropdownItem[] {
        return UserConstants.getUserTableOwnerDropdown(data);
    }

    public getDropdownContent(data: CompanyUserResponse): DropdownItem[] {
        const dropdownContent = UserConstants.getUserTableDropdown(data);
        data.verified ? dropdownContent.splice(2, 1) : dropdownContent;
        return dropdownContent;
    }

    // User Back Filter Query
    userBackFilter(
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
    ) {
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
    changeUserStatus(id: number) {
        this.userService
            .updateUserStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    deleteUserById(id: number) {
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

                    const inetval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                true,
                                this.viewData
                            );

                        clearInterval(inetval);
                    }, 900);
                },
                error: () => {},
            });
    }

    updateDataCount() {
        const userCount = JSON.parse(localStorage.getItem(TableStringEnum.USER_TABLE_COUNT));

        this.tableData[0].length = userCount.active;

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = userCount.active;

        this.tableData = [...updatedTableData];
    }

    // Get Avatar Color
    getAvatarColors() {
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
    onToolBarAction(event: any) {
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
        }
    }

    // On Head Actions
    onTableHeadActions(event: any) {
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

    // On Body Actions
    onTableBodyActions(event: any) {
        const confirmationModalData = {
            ...event,
            data: {
                ...event.data,
                name: event.data?.firstName,
            },
        };

        // Edit
        if (event.type === TableStringEnum.EDIT) {
            this.modalService.openModal(
                UserModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.EDIT,
                    disableButton:
                        event.data?.userType?.name !== TableStringEnum.OWNER,
                }
            );
        }
        // Show More (Pagination)
        else if (event.type === TableStringEnum.SHOW_MORE) {
            this.backFilterQuery.pageIndex++;

            this.userBackFilter(this.backFilterQuery, true);
        }
        // Activate Or Deactivate User
        else if (
            event.type === TableStringEnum.DEACTIVATE ||
            event.type === TableStringEnum.ACTIVATE
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...confirmationModalData,
                    template: TableStringEnum.USER_1,
                    type:
                        event.data.status === 1
                            ? TableStringEnum.DEACTIVATE
                            : TableStringEnum.ACTIVATE,
                    image: true,
                }
            );
        }
        // User Reset Password
        else if (event.type === TableStringEnum.RESET_PASSWORD) {
            this.userService
                .userResetPassword(event.data.email)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {});
        }
        // User Resend Ivitation
        else if (event.type === TableStringEnum.RESEND_INVITATION) {
            this.userService
                .userResendIvitation({
                    email: event.data.email,
                    isResendConfirmation: true,
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {});
        }
        // User Delete
        else if (event.type === TableStringEnum.DELETE) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...confirmationModalData,
                    template: TableStringEnum.USER_1,
                    type: TableStringEnum.DELETE,
                    image: true,
                }
            );
        }
    }

    // Delete Multiple Users
    multipleDeleteUsers(users: any) {
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

                const inetval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(inetval);
                }, 900);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    // ---------------------------  NgOnDestroy ----------------------------------
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
