import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { ContactsDropdownMenuActionsBase } from '@pages/contacts/base-classes';

// components
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';
import { ContactsService } from '@shared/services/contacts.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// store
import { ContactState } from '@pages/contacts/state/contact.store';
import { ContactQuery } from '@pages/contacts/state/contact.query';

// pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { getToolsContactsColumnDefinition } from '@shared/utils/settings/table-settings/contacts-columns';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { AvatarColorsHelper } from '@shared/utils/helpers/avatar-colors.helper';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// enums
import { ContactsStringEnum } from '@pages/contacts/enums/contacts-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { DropdownMenuStringEnum } from '@shared/enums';

// constants
import { ContactsCardData } from '@pages/contacts/utils/constants/contacts-card-data.constants';

// models
import {
    CompanyContactResponse,
    GetCompanyContactListResponse,
} from 'appcoretruckassist';
import { ContactsBackFilter } from '@pages/contacts/pages/contacts-table/models/contacts-back-filter.model';
import { ContactsPhone } from '@pages/contacts/pages/contacts-table/models/contacts-phone.model';
import { ContactsEmail } from '@pages/contacts/pages/contacts-table/models/contacts-email.model';
import { ContactsTableToolbarAction } from '@pages/contacts/pages/contacts-table/models/contacts-table-toolbar-action.model';
import { ContactsTableHeadAction } from '@pages/contacts/pages/contacts-table/models/contacts-table-head-action.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';
import { TableColumnConfig } from '@shared/models';
import { CardTableData } from '@shared/models/table-models/card-table-data.model';

@Component({
    selector: 'app-contacts-table',
    templateUrl: './contacts-table.component.html',
    styleUrls: ['./contacts-table.component.scss'],
    providers: [NameInitialsPipe],
})
export class ContactsTableComponent
    extends ContactsDropdownMenuActionsBase
    implements OnInit, AfterViewInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public dropdownMenuStringEnum = DropdownMenuStringEnum;

    public resizeObserver: ResizeObserver;
    public activeViewMode: string = TableStringEnum.LIST;

    public selectedTab: string = TableStringEnum.ACTIVE;

    public contacts: ContactState[] = [];

    // table
    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: TableColumnConfig[] = [];

    // cards
    public cardTitle: string = ContactsCardData.cardTitle;
    public page: string = ContactsCardData.page;
    public rows: number = ContactsCardData.rows;

    public sendDataToCardsFront: CardRows[] =
        ContactsCardData.displayRowsFrontContacts;
    public sendDataToCardsBack: CardRows[] =
        ContactsCardData.displayRowsBackContacts;

    // filters
    public backFilterQuery = {
        labelId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    public mapingIndex: number = 0;

    constructor(
        // services
        protected modalService: ModalService,
        protected contactsService: ContactsService,

        private tableService: TruckassistTableService,

        private confirmationService: ConfirmationService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService,

        // store
        private contactQuery: ContactQuery,

        // pipes
        private nameInitialsPipe: NameInitialsPipe
    ) {
        super();
    }

    ngOnInit(): void {
        this.sendContactData();

        this.contactResetColumns();

        this.contactResize();

        this.confirmationSubscribe();

        this.contactCurrentToaggleColumn();

        this.contactCurrentSearchTableData();

        this.contactCurrentActionAnimation();

        this.contactCurrentDeleteSelectedRows();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private contactResetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) {
                    this.sendContactData();
                }
            });
    }

    private contactResize(): void {
        this.tableService.currentColumnWidth
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.event?.width) {
                    this.columns = this.columns.map((col) => {
                        if (
                            col.title ===
                            response.columns[response.event.index].title
                        )
                            col.width = response.event.width;

                        return col;
                    });
                }
            });
    }

    private contactCurrentToaggleColumn(): void {
        this.tableService.currentToaggleColumn
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response?.column) {
                    this.columns = this.columns.map((col) => {
                        if (col.field === response.column.field)
                            col.hidden = response.column.hidden;

                        return col;
                    });
                }
            });
    }

    private contactCurrentSearchTableData(): void {
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
                            this.contactBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action === TableStringEnum.STORE
                        ) {
                            this.sendContactData();
                        }
                    }
                }
            });
    }

    private contactCurrentActionAnimation(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // Add Contact
                if (res?.animation === TableStringEnum.ADD) {
                    this.viewData.push(this.mapContactData(res.data));

                    this.viewData = this.viewData.map((contact) => {
                        if (contact.id === res.id) {
                            contact.actionAnimation = TableStringEnum.ADD;
                        }

                        return contact;
                    });

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
                // Update Contact
                else if (res?.animation === TableStringEnum.UPDATE) {
                    const updatedContact = this.mapContactData(res.data, true);

                    this.viewData = this.viewData.map((contact) => {
                        if (contact.id === res.id) {
                            contact = updatedContact;
                            contact.actionAnimation = TableStringEnum.UPDATE;
                        }

                        return contact;
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
                // Delete Contact
                else if (res?.animation === TableStringEnum.DELETE) {
                    let contactIndex: number;

                    this.viewData = this.viewData.map(
                        (contact, index: number) => {
                            if (contact.id === res.id) {
                                contact.actionAnimation =
                                    TableStringEnum.DELETE;
                                contactIndex = index;
                            }

                            return contact;
                        }
                    );

                    const interval = setInterval(() => {
                        this.viewData =
                            MethodsGlobalHelper.closeAnimationAction(
                                false,
                                this.viewData
                            );

                        this.viewData.splice(contactIndex, 1);
                        clearInterval(interval);
                    }, 900);

                    this.updateDataCount();
                }
            });
    }

    private contactCurrentDeleteSelectedRows(): void {
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
                            template: TableStringEnum.CONTACT,
                            type: TableStringEnum.MULTIPLE_DELETE,
                            svg: true,
                        }
                    );
                }
            });
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    switch (res.type) {
                        case TableStringEnum.DELETE:
                            this.deleteContactById(res.id);

                            break;
                        case TableStringEnum.MULTIPLE_DELETE:
                            this.deleteContactList(res.array);

                            break;
                        default:
                            break;
                    }
                },
            });
    }

    private deleteContactById(contactId: number): void {
        this.contactsService
            .deleteCompanyContactById(contactId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteContactList(contactIds: number[]): void {
        this.contactsService
            .deleteAccountList(contactIds)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData = this.viewData.map((contact) => {
                    contactIds.map((id) => {
                        if (contact.id === id) {
                            contact.actionAnimation =
                                TableStringEnum.DELETE_MULTIPLE;
                        }
                    });

                    return contact;
                });

                this.updateDataCount();

                const interval = setInterval(() => {
                    this.viewData = MethodsGlobalHelper.closeAnimationAction(
                        true,
                        this.viewData
                    );

                    clearInterval(interval);
                }, 1000);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
            });
    }

    public observTableContainer(): void {
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

    private sendContactData(): void {
        const tableView = JSON.parse(
            localStorage.getItem(ContactsStringEnum.CONTACT_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.mapingIndex = 0;

        this.initTableOptions();

        const contactCount = JSON.parse(
            localStorage.getItem(ContactsStringEnum.CONTACT_TABLE_COUNT)
        );

        const contactData = this.getTabData();

        this.tableData = [
            {
                title: ContactsStringEnum.CONTACTS,
                field: TableStringEnum.ACTIVE,
                length: contactCount.contact,
                data: contactData,
                extended: false,
                gridNameTitle: ContactsStringEnum.CONTACT_2,
                stateName: ContactsStringEnum.CONTACTS_2,
                tableConfiguration: ContactsStringEnum.CONTACT,
                isActive: true,
                gridColumns: this.getGridColumns(ContactsStringEnum.CONTACT),
            },
        ];

        const td = this.tableData.find((t) => t.field === this.selectedTab);

        this.setContactData(td);
    }

    public getTabData() {
        this.contacts = this.contactQuery.getAll();
        return this.contacts?.length ? this.contacts : [];
    }

    public updateDataCount() {
        const contactCount = JSON.parse(
            localStorage.getItem(ContactsStringEnum.CONTACT_TABLE_COUNT)
        );

        const updatedTableData = [...this.tableData];

        updatedTableData[0].length = contactCount.contact;

        this.tableData = [...updatedTableData];
    }

    public getGridColumns(configType: string) {
        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${configType}-Configuration`)
        );

        return tableColumnsConfig
            ? tableColumnsConfig
            : getToolsContactsColumnDefinition();
    }

    public setContactData(tdata: CardTableData): void {
        this.columns = tdata.gridColumns;

        if (tdata.data.length) {
            this.viewData = tdata.data;
            this.viewData = this.viewData.map(
                (data: CompanyContactResponse) => {
                    return this.mapContactData(data);
                }
            );
        } else {
            this.viewData = [];
        }
    }

    public mapContactData(data: any, dontMapIndex?: boolean): void {
        if (!data?.avatarFile?.url && !dontMapIndex) {
            this.mapingIndex++;
        }
        return {
            ...data,
            isSelected: false,
            email: data?.contactEmails[0]?.email ?? null,
            emailSecond: data?.contactEmails[1]?.email ?? null,
            phone: data?.contactPhones[0]?.phone ?? null,
            phoneSecond: data?.contactPhones[1]?.phone ?? null,
            phoneThird: data?.contactPhones[2]?.phone ?? null,
            company: data?.companyName,
            textAddress: data?.address?.address ?? null,
            textShortName: this.nameInitialsPipe.transform(data.name),
            avatarColor: AvatarColorsHelper.getAvatarColors(this.mapingIndex),
            avatarImg: data?.avatarFile?.url ?? null,
            isShared: data.shared,
            lable: data?.companyContactLabel
                ? {
                      name: data?.companyContactLabel?.name ?? null,
                      color: data?.companyContactLabel?.code ?? null,
                  }
                : null,
            added: MethodsCalculationsHelper.convertDateFromBackend(
                data?.createdAt
            ),
            edited: MethodsCalculationsHelper.convertDateFromBackend(
                data?.updatedAt
            ),
            tableDropdownContent: this.getContactDropdownContent(),
        };
    }

    public getContactDropdownContent(): DropdownMenuItem[] {
        return DropdownMenuContentHelper.getContactDropdownContent();
    }

    public contactBackFilter(
        filter: ContactsBackFilter,
        isShowMore?: boolean
    ): void {
        this.contactsService
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

    public createContactPhones(element: ContactsPhone) {
        return [
            {
                id: element.id ?? 0,
                phone: element.phone ?? null,
                phoneExt: element.phoneExt ?? null,
                contactPhoneType: element.contactPhoneType.name ?? null,
                primary: element.primary ?? false,
            },
        ];
    }

    public createContactEmails(element: ContactsEmail) {
        return [
            {
                id: element.id ?? 0,
                email: element.email ?? null,
                contactEmailType: element.contactEmailType.name ?? null,
                primary: element.primary ?? false,
            },
        ];
    }

    public onToolBarAction(event: ContactsTableToolbarAction) {
        if (event.action === TableStringEnum.OPEN_MODAL) {
            this.modalService.openModal(ContactsModalComponent, {
                size: TableStringEnum.SMALL,
            });
        } else if (event.action === TableStringEnum.TAB_SELECTED) {
            this.mapingIndex = 0;

            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.setContactData(event.tabData);
        } else if (event.action === TableStringEnum.VIEW_MODE) {
            this.mapingIndex = 0;

            this.activeViewMode = event.mode;
        }
    }

    public onTableHeadActions(event: ContactsTableHeadAction) {
        if (event.action === TableStringEnum.SORT) {
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

    public handleShowMoreAction(): void {
        this.backFilterQuery.pageIndex++;

        this.contactBackFilter(this.backFilterQuery, true);
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
