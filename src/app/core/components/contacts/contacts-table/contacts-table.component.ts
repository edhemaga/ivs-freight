import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetCompanyContactListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';

import { ContactModalComponent } from '../../modals/contact-modal/contact-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ContactQuery } from '../state/contact-state/contact.query';
import { ContactState } from '../state/contact-state/contact.store';
import { ContactTService } from '../state/contact.service';
import { NameInitialsPipe } from '../../../pipes/nameinitials';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ImageBase64Service } from '../../../utils/base64.image';
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';
import { getToolsContactsColumnDefinition } from '../../../../../assets/utils/settings/contacts-columns';

@Component({
    selector: 'app-contacts-table',
    templateUrl: './contacts-table.component.html',
    styleUrls: ['./contacts-table.component.scss'],
    providers: [NameInitialsPipe],
})
export class ContactsTableComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    tableOptions: any = {};
    tableData: any[] = [];
    viewData: any[] = [];
    columns: any[] = [];
    selectedTab = 'active';
    activeViewMode: string = 'List';
    resizeObserver: ResizeObserver;
    contacts: ContactState[] = [];
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
    mapingIndex: number = 0;

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private contactQuery: ContactQuery,
        private nameInitialsPipe: NameInitialsPipe,
        private contactService: ContactTService,
        private imageBase64Service: ImageBase64Service
    ) {}

    ngOnInit(): void {
        this.sendContactData();

        // Reset Columns
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response) {
                    this.sendContactData();
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
                            this.contactBackFilter(searchEvent.query);
                        } else if (searchEvent.action === 'store') {
                            this.sendContactData();
                        }
                    }
                }
            });

        // Contact Actions
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                // Add Contact
                if (res.animation === 'add') {
                    this.viewData.push(this.mapContactData(res.data));

                    this.viewData = this.viewData.map((contact: any) => {
                        if (contact.id === res.id) {
                            contact.actionAnimation = 'add';
                        }

                        return contact;
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
                // Update Contact
                else if (res.animation === 'update') {
                    const updatedContact = this.mapContactData(res.data, true);

                    this.viewData = this.viewData.map((contact: any) => {
                        if (contact.id === res.id) {
                            contact = updatedContact;
                            contact.actionAnimation = 'update';
                        }

                        return contact;
                    });

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        clearInterval(inetval);
                    }, 1000);
                }
                // Delete Contact
                else if (res.animation === 'delete') {
                    let contactIndex: number;

                    this.viewData = this.viewData.map(
                        (contact: any, index: number) => {
                            if (contact.id === res.id) {
                                contact.actionAnimation = 'delete';
                                contact = index;
                            }

                            return contact;
                        }
                    );

                    const inetval = setInterval(() => {
                        this.viewData = closeAnimationAction(
                            false,
                            this.viewData
                        );

                        this.viewData.splice(contactIndex, 1);
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
                    this.contactService
                        .deleteAccountList(response)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(() => {
                            this.viewData = this.viewData.map(
                                (contact: any) => {
                                    response.map((r: any) => {
                                        if (contact.id === r.id) {
                                            contact.actionAnimation =
                                                'deletemultiple';
                                        }
                                    });

                                    return contact;
                                }
                            );

                            this.updateDataCount();

                            const inetval = setInterval(() => {
                                this.viewData = closeAnimationAction(
                                    true,
                                    this.viewData
                                );

                                clearInterval(inetval);
                            }, 1000);

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

    // Send Contact Data
    sendContactData() {
        const tableView = JSON.parse(
            localStorage.getItem(`Contact-table-view`)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.mapingIndex = 0;

        this.initTableOptions();

        const contactCount = JSON.parse(
            localStorage.getItem('contactTableCount')
        );

        const contactData = this.getTabData();
        this.tableData = [
            {
                title: 'Contacts',
                field: 'active',
                length: contactCount.contact,
                data: contactData,
                extended: false,
                gridNameTitle: 'Contact',
                stateName: 'contacts',
                tableConfiguration: 'CONTACT',
                isActive: true,
                gridColumns: this.getGridColumns('CONTACT'),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);
        this.setContactData(td);
    }

    // Get Contact Data From Store Or Via Api Call
    getTabData() {
        this.contacts = this.contactQuery.getAll();
        return this.contacts?.length ? this.contacts : [];
    }

    // Update Contact Count
    updateDataCount() {
        const contactCount = JSON.parse(
            localStorage.getItem('contactTableCount')
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = contactCount.contact;

        this.tableData = [...updatedTableData];
    }

    // Get Columns Definition
    getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getToolsContactsColumnDefinition();
    }

    // Set Countact Data
    setContactData(td: any) {
        this.columns = td.gridColumns;

        if (td.data.length) {
            this.viewData = td.data;
            this.viewData = this.viewData.map((data: any) => {
                return this.mapContactData(data);
            });
            // For Testing
            // for (let i = 0; i < 300; i++) {
            //   this.viewData.push(this.viewData[0]);
            // }
        } else {
            this.viewData = [];
        }
    }

    // Map Contact Data
    mapContactData(data: any, dontMapIndex?: boolean) {
        if (!data?.avatar && !dontMapIndex) {
            this.mapingIndex++;
        }

        return {
            ...data,
            isSelected: false,
            email: data?.contactEmails[0]?.email
                ? data?.contactEmails[0]?.email
                : '',
            phone: data?.contactPhones[0]?.phone
                ? data?.contactPhones[0]?.phone
                : '',
            textAddress: data?.address?.address ? data.address.address : '',
            textShortName: this.nameInitialsPipe.transform(data.name),
            avatarColor: this.getAvatarColors(),
            avatarImg: data?.avatar
                ? this.imageBase64Service.sanitizer(data.avatar)
                : '',
            isShared: data.shared,
            textShared: !data?.shared ? 'Only You' : 'Nije povezano',
            lable: data?.companyContactLabel
                ? {
                      name: data?.companyContactLabel?.name
                          ? data.companyContactLabel.name
                          : '',
                      color: data?.companyContactLabel?.code
                          ? data.companyContactLabel.code
                          : '',
                  }
                : null,
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownContactContent(data),
            },
        };
    }
    getDropdownContactContent(data: any) {
        return [
            {
                title: 'Edit',
                name: 'edit-contact',
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
                title: 'Send SMS',
                name: 'send-sms',
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
                name: 'delete-contact',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'delete',
            },
        ];
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

    // Contact Back Filter
    contactBackFilter(
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
        this.contactService
            .getContacts(
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
            .subscribe((contact: GetCompanyContactListResponse) => {
                if (!isShowMore) {
                    this.viewData = contact.pagination.data;

                    this.viewData = this.viewData.map((data: any) => {
                        return this.mapContactData(data);
                    });
                } else {
                    let newData = [...this.viewData];

                    contact.pagination.data.map((data: any) => {
                        newData.push(this.mapContactData(data));
                    });

                    this.viewData = [...newData];
                }
            });
    }

    // On Toolbar Actions
    onToolBarAction(event: any) {
        if (event.action === 'open-modal') {
            this.modalService.openModal(ContactModalComponent, {
                size: 'small',
            });
        } else if (event.action === 'tab-selected') {
            this.mapingIndex = 0;

            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.setContactData(event.tabData);
        } else if (event.action === 'view-mode') {
            this.mapingIndex = 0;

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

                this.contactBackFilter(this.backFilterQuery);
            } else {
                this.sendContactData();
            }
        }
    }

    // On Body Actions
    onTableBodyActions(event: any) {
        if (event.type === 'show-more') {
            this.backFilterQuery.pageIndex++;
            this.contactBackFilter(this.backFilterQuery, true);
        } else if (event.type === 'edit-contact') {
            this.modalService.openModal(
                ContactModalComponent,
                { size: 'small' },
                {
                    ...event,
                    type: 'edit',
                }
            );
        } else if (event.type === 'delete-contact') {
            this.contactService
                .deleteCompanyContactById(event.id)
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
