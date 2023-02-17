import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { getUsersColumnDefinition } from 'src/assets/utils/settings/users-columns';
import { UserModalComponent } from '../../modals/user-modal/user-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { UserQuery } from '../state/user-state/user.query';
import { UserState } from '../state/user-state/user.store';
import { formatPhonePipe } from 'src/app/core/pipes/formatPhone.pipe';
import { NameInitialsPipe } from 'src/app/core/pipes/nameinitials';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import {
    closeAnimationAction,
    tableSearch,
} from 'src/app/core/utils/methods.globals';
import { UserTService } from '../state/user.service';
import { GetCompanyUserListResponse } from 'appcoretruckassist';
import { DatePipe } from '@angular/common';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import {
    Confirmation,
    ConfirmationModalComponent,
} from '../../modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from '../../modals/confirmation-modal/confirmation.service';

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
    selectedTab = 'active';
    activeViewMode: string = 'List';
    resizeObserver: ResizeObserver;
    mapingIndex: number = 0;
    users: UserState[] = [];
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

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendUserData();
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
                    this.mapingIndex = 0;

                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

                    if (searchEvent) {
                        if (searchEvent.action === 'api') {
                            this.userBackFilter(searchEvent.query);
                        } else if (searchEvent.action === 'store') {
                            this.sendUserData();
                        }
                    }
                }
            });

        // User Actions
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // On Add Driver Active
                if (res.animation === 'add') {
                    this.viewData.push(this.mapUserData(res.data));

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user.actionAnimation = 'add';
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
                // On Update User Status
                else if (res.animation === 'update-status') {
                    this.mapingIndex = 0;

                    const updatedUser = this.mapUserData(res.data);

                    this.viewData = this.viewData.map((user: any) => {
                        if (user.id === res.id) {
                            user = updatedUser;
                            user.actionAnimation = 'update';
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

        // Delete Selected Rows
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: any[]) => {
                if (response.length) {
                    let mappedRes = response.map((item) => {
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
                        { size: 'small' },
                        {
                            data: null,
                            array: mappedRes,
                            template: 'user',
                            type: 'multiple delete',
                            image: true,
                        }
                    );
                }
            });

        // Confirmation Subscribe
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Confirmation) => {
                    switch (res.type) {
                        case 'delete': {
                            if (res.template === 'user') {
                                this.deleteUserById(res.id);
                            }
                            break;
                        }
                        case 'activate': {
                            this.changeUserStatus(res.id);
                            break;
                        }
                        case 'deactivate': {
                            this.changeUserStatus(res.id);
                            break;
                        }
                        case 'multiple delete': {
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

    // ---------------------------  NgAfterViewInit ----------------------------------
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
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
                viewModeOptions: [
                    { name: 'List', active: this.activeViewMode === 'List' },
                    { name: 'Card', active: this.activeViewMode === 'Card' },
                ],
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit',
                    class: 'regular-text',
                    contentType: 'edit',
                },
                {
                    title: 'Reset Password',
                    name: 'reset-password',
                    class: 'regular-text',
                    contentType: 'reset',
                },
                {
                    title: 'Deactivate',
                    name: 'deactivate',
                    class: 'regular-text',
                    contentType: 'activate',
                },
                {
                    title: 'Delete',
                    name: 'delete',
                    type: 'users',
                    text: 'Are you sure you want to delete user(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                },
            ],
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
        this.initTableOptions();

        const userCount = JSON.parse(localStorage.getItem('userTableCount'));

        const userData = this.getTabData();

        this.tableData = [
            {
                title: 'User',
                field: 'active',
                length: userCount.users,
                data: userData,
                gridNameTitle: 'User',
                stateName: 'users',
                tableConfiguration: 'USER',
                isActive: true,
                gridColumns: this.getGridColumns('USER'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        console.log(td.data);

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
            userAvatar: {
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
            userTableDept: data?.department?.name ? data.department.name : '',
            userTableOffice: data?.companyOffice?.name
                ? data.companyOffice.name
                : '',
            userTablePhone: data?.phone
                ? this.phoneFormater.transform(data.phone)
                : '',
            uesrTableExt: data?.extensionPhone ? data.extensionPhone : '',
            userTableHired: data?.startDate
                ? this.datePipe.transform(data?.startDate, 'MM/dd/yy')
                : '',
            userTablePersonalPH: data?.personalPhone
                ? this.phoneFormater.transform(data.personalPhone)
                : '',
            userTableStatus: {
                status:
                    data?.userType?.name && data?.userType?.name !== '0'
                        ? data.userType.name
                        : 'No',
                isInvited: false,
            },
            userTableCommission: data?.commission ? data.commission + '%' : '',
            userTableSalary: data?.salary
                ? '$' + this.thousandSeparator.transform(data.salary)
                : '',
            userStatus: data.status,
        };
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
                            user.actionAnimation = 'delete';
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
        if (event.action === 'open-modal') {
            this.modalService.openModal(UserModalComponent, {
                size: 'small',
            });
        } else if (event.action === 'view-mode') {
            this.activeViewMode = event.mode;
        }
    }

    // On Head Actions
    onTableHeadActions(event: any) {
        if (event.action === 'sort') {
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
                name: event.data.userAvatar.name,
            },
        };

        // Edit
        if (event.type === 'edit') {
            this.modalService.openModal(
                UserModalComponent,
                { size: 'small' },
                {
                    ...event,
                    type: 'edit',
                    disableButton: event.data?.userType?.name !== 'Owner',
                }
            );
        }
        // Show More (Pagination)
        else if (event.type === 'show-more') {
            this.backFilterQuery.pageIndex++;

            this.userBackFilter(this.backFilterQuery, true);
        }
        // Activate Or Deactivate User
        else if (event.type === 'deactivate' || event.type === 'activate') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...confirmationModalData,
                    template: 'user',
                    type: event.data.status === 1 ? 'deactivate' : 'activate',
                    image: true,
                }
            );
        }
        // User Delete
        else if (event.type === 'delete') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...confirmationModalData,
                    template: 'user',
                    type: 'delete',
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
                            tableData.actionAnimation = 'delete-multiple';
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
