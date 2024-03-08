import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

//Services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';
import { UserTService } from '../state/user.service';

//Components
import { UserModalComponent } from '../../modals/user-modal/user-modal.component';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';

//Utils
import { getUsersColumnDefinition } from 'src/assets/utils/settings/users-columns';

//State
import { UserQuery } from '../state/user-state/user.query';
import { UserState } from '../state/user-state/user.store';

//Pipe
import { formatPhonePipe } from 'src/app/core/pipes/formatPhone.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { NameInitialsPipe } from 'src/app/core/pipes/nameinitials';
import { DatePipe } from '@angular/common';

//Methodes
import {
    closeAnimationAction,
    tableSearch,
} from 'src/app/core/utils/methods.globals';

//Helpers
import { checkSpecialFilterArray } from 'src/app/core/helpers/dataFilter';
import { UserTableDropdown, UserTableOwnerDropdown } from '../state/user-utils';

//Enum
import { GetCompanyUserListResponse } from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';
import { DisplayUserConfiguration } from '../user-card-data';
import { CardRows } from '../../shared/model/cardData';
import { DropdownItem } from '../../shared/model/card-table-data.model';

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
    providers: [formatPhonePipe, NameInitialsPipe, TaThousandSeparatorPipe],
})
export class UserTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = ConstantStringTableComponentsEnum.ACTIVE;
    activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
    resizeObserver: ResizeObserver;
    mapingIndex: number = 0;
    users: UserState[] = [];

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
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private userQuery: UserQuery,
        private phoneFormater: formatPhonePipe,
        private nameInitialsPipe: NameInitialsPipe,
        private imageBase64Service: ImageBase64Service,
        private userService: UserTService,
        public datePipe: DatePipe,
        private thousandSeparator: TaThousandSeparatorPipe,
        private confirmationService: ConfirmationService
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
                        case ConstantStringTableComponentsEnum.DELETE: {
                            if (
                                res.template ===
                                ConstantStringTableComponentsEnum.USER_1
                            ) {
                                this.deleteUserById(res.id);
                            }
                            break;
                        }
                        case ConstantStringTableComponentsEnum.ACTIVATE: {
                            this.changeUserStatus(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.DEACTIVATE: {
                            this.changeUserStatus(res.id);
                            break;
                        }
                        case ConstantStringTableComponentsEnum.MULTIPLE_DELETE: {
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
                        { size: ConstantStringTableComponentsEnum.SMALL },
                        {
                            data: null,
                            array: mappedRes,
                            template: ConstantStringTableComponentsEnum.USER_1,
                            type: ConstantStringTableComponentsEnum.MULTIPLE_DELETE,
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
                if (res?.animation === ConstantStringTableComponentsEnum.ADD) {
                    this.mapingIndex = 0;

                    this.viewData.push(this.mapUserData(res.data));

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user.actionAnimation =
                                ConstantStringTableComponentsEnum.ADD;
                        }

                        return user;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 2300);
                }
                // On Update User
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.UPDATE
                ) {
                    this.mapingIndex = 0;

                    const updatedDriver = this.mapUserData(res.data);

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user = updatedDriver;
                            user.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                        }

                        return user;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }
                // On Update User Status
                else if (
                    res?.animation ===
                    ConstantStringTableComponentsEnum.UPDATE_STATUS
                ) {
                    this.mapingIndex = 0;

                    const updatedUser = this.mapUserData(res.data);

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user = updatedUser;
                            user.actionAnimation =
                                ConstantStringTableComponentsEnum.UPDATE;
                        }

                        return user;
                    });

                    const sortedUserData = this.viewData.sort(
                        (a, b) => b.userStatus - a.userStatus
                    );

                    this.viewData = [...sortedUserData];

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 900);
                }
            });
    }

    private currentSearchTableData(): void {
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.mapingIndex = 0;

                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

                    if (searchEvent) {
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            this.userBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
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

        const userCount = JSON.parse(localStorage.getItem('userTableCount'));

        const userData = this.getTabData();

        this.tableData = [
            {
                title: ConstantStringTableComponentsEnum.USER,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: userCount.users,
                arhiveCount: 0,
                data: userData,
                deactivatedUserArray: checkSpecialFilterArray(
                    userData,
                    ConstantStringTableComponentsEnum.STATUS
                ),
                gridNameTitle: ConstantStringTableComponentsEnum.USER,
                stateName: ConstantStringTableComponentsEnum.USERS,
                tableConfiguration: ConstantStringTableComponentsEnum.USER_2,
                isActive: true,
                gridColumns: this.getGridColumns(
                    ConstantStringTableComponentsEnum.USER_2
                ),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setUserData(td);
    }

    // Get Tab Data
    getTabData() {
        this.users = this.userQuery.getAll();

        return this.users?.length ? this.users : [];
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
    mapUserData(data: any, dontMapIndex?: boolean) {
        if (!data?.avatar && !dontMapIndex) {
            this.mapingIndex++;
        }

        return {
            ...data,
            isSelected: false,
            tableAvatar: {
                name:
                    data?.firstName && data?.lastName
                        ? data.firstName + ' ' + data.lastName
                        : '',
                avatar: data?.avatar
                    ? this.imageBase64Service.sanitizer(data.avatar)
                    : '',
                avatarColor: this.getAvatarColors(),
                textShortName: this.nameInitialsPipe.transform(
                    data?.firstName && data?.lastName
                        ? data.firstName + ' ' + data.lastName
                        : ''
                ),
            },
            tableTableDept: data?.department?.name ? data.department.name : '',
            tableTableOffice: data?.companyOffice?.name
                ? data.companyOffice.name
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
            userStatus: data.status,
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
    public getOwnerDropdown(data): DropdownItem[] {
        return UserTableOwnerDropdown(data);
    }

    public getDropdownContent(data): DropdownItem[] {
        const dropdownContent = UserTableDropdown(data);
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
            .subscribe((users: GetCompanyUserListResponse) => {
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
            .deleteUserById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === id) {
                            user.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE;
                        }

                        return user;
                    });

                    this.updateDataCount();

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
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
        const userCount = JSON.parse(localStorage.getItem('userTableCount'));

        this.tableData[0].length = userCount.users;

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = userCount.users;

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
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            this.modalService.openModal(UserModalComponent, {
                size: ConstantStringTableComponentsEnum.SMALL,
            });
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.activeViewMode = event.mode;
        }
    }

    // On Head Actions
    onTableHeadActions(event: any) {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
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
        if (event.type === ConstantStringTableComponentsEnum.EDIT) {
            this.modalService.openModal(
                UserModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    type: ConstantStringTableComponentsEnum.EDIT,
                    disableButton:
                        event.data?.userType?.name !==
                        ConstantStringTableComponentsEnum.OWNER,
                }
            );
        }
        // Show More (Pagination)
        else if (event.type === ConstantStringTableComponentsEnum.SHOW_MORE) {
            this.backFilterQuery.pageIndex++;

            this.userBackFilter(this.backFilterQuery, true);
        }
        // Activate Or Deactivate User
        else if (
            event.type === ConstantStringTableComponentsEnum.DEACTIVATE ||
            event.type === ConstantStringTableComponentsEnum.ACTIVATE
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...confirmationModalData,
                    template: ConstantStringTableComponentsEnum.USER_1,
                    type:
                        event.data.status === 1
                            ? ConstantStringTableComponentsEnum.DEACTIVATE
                            : ConstantStringTableComponentsEnum.ACTIVATE,
                    image: true,
                }
            );
        }
        // User Reset Password
        else if (
            event.type === ConstantStringTableComponentsEnum.RESET_PASSWORD
        ) {
            this.userService
                .userResetPassword(event.data.email)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {});
        }
        // User Resend Ivitation
        else if (
            event.type === ConstantStringTableComponentsEnum.RESEND_INVITATION
        ) {
            this.userService
                .userResendIvitation({
                    email: event.data.email,
                    isResendConfirmation: true,
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {});
        }
        // User Delete
        else if (event.type === ConstantStringTableComponentsEnum.DELETE) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...confirmationModalData,
                    template: ConstantStringTableComponentsEnum.USER_1,
                    type: ConstantStringTableComponentsEnum.DELETE,
                    image: true,
                }
            );
        }
    }

    // Delete Multiple Users
    multipleDeleteUsers(users: any) {
        this.userService
            .deleteUserList(users)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((tableData: any) => {
                    users.map((userId: any) => {
                        if (tableData.id === userId) {
                            tableData.actionAnimation =
                                ConstantStringTableComponentsEnum.DELETE_MULTIPLE;
                        }
                    });

                    return tableData;
                });

                this.updateDataCount();

                const inetval = setInterval(() => {
                    this.viewData = closeAnimationAction(true, this.viewData);

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
