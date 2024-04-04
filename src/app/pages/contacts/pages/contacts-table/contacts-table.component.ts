import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// components
import { ContactsModalComponent } from '../contacts-modal/contacts-modal.component';
import { ConfirmationModalComponent } from 'src/app/core/components/modals/confirmation-modal/confirmation-modal.component';

// service
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { ContactsService } from '../../../../shared/services/contacts.service';
import { ImageBase64Service } from 'src/app/shared/services/image-base64.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { ConfirmationService } from 'src/app/core/components/modals/confirmation-modal/state/state/services/confirmation.service';

// store
import { ContactState } from '../../state/contact.store';
import { ContactQuery } from '../../state/contact.query';

// pipes
import { NameInitialsPipe } from 'src/app/shared/pipes/name-initials.pipe';

// helpers
import {
    tableSearch,
    closeAnimationAction,
} from 'src/app/core/utils/methods.globals';
import { getToolsContactsColumnDefinition } from 'src/assets/utils/settings/contacts-columns';
import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';
import { AvatarColorsHelper } from 'src/app/shared/utils/helpers/avatar-colors.helper';

// enums
import { ContactsStringEnum } from '../../enums/contacts-string.enum';
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

// constants
import { TableDropdownComponentConstants } from 'src/app/shared/utils/constants/table-dropdown-component.constants';

// data for cards
import { ContactsCardData } from '../../utils/constants/contacts-card-data.constants';
import { DataForCardsAndTables } from 'src/app/core/components/shared/model/table-components/all-tables.modal';

// models
import {
    CompanyAccountLabelResponse,
    CompanyContactResponse,
    GetCompanyContactListResponse,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import { ContactsBackFilter } from '../../models/contacts-back-filter.model';
import { ContactsPhone } from '../../models/contacts-phone.model';
import { ContactsEmail } from '../../models/contacts-email.model';
import {
    TableBodyActionsContract,
    TableHeadActionContract,
    TableToolBarActionActionsContract,
} from 'src/app/core/model/contact';
import { CardRows } from 'src/app/core/components/shared/model/card-data.model';
import { DropdownItem } from 'src/app/shared/models/card-table-data.model';

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

    public tableOptions: any = {};
    public tableData: any[] = [];
    public viewData: any[] = [];
    public columns: any[] = [];
    public selectedTab: string = TableStringEnum.ACTIVE;
    public activeViewMode: string = TableStringEnum.LIST;
    public resizeObserver: ResizeObserver;
    public contacts: ContactState[] = [];
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

    public cardTitle: string = ContactsCardData.cardTitle;

    public page: string = ContactsCardData.page;
    public rows: number = ContactsCardData.rows;

    public sendDataToCardsFront: CardRows[] =
        ContactsCardData.displayRowsFrontContacts;
    public sendDataToCardsBack: CardRows[] =
        ContactsCardData.displayRowsBackContacts;

    constructor(
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private contactQuery: ContactQuery,
        private nameInitialsPipe: NameInitialsPipe,
        private contactService: ContactsService,
        private imageBase64Service: ImageBase64Service,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.sendContactData();

        this.contractResetColumns();

        this.contractResize();

        this.confirmationSubscribe();

        this.contractCurrentToaggleColumn();

        this.contractCurrentSearchTableData();

        this.contractCurrentActionAnimation();

        this.contractCurrentDeleteSelectedRows();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    private contractResetColumns(): void {
        this.tableService.currentResetColumns
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response) {
                    this.sendContactData();
                }
            });
    }

    private contractResize(): void {
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

    private contractCurrentToaggleColumn(): void {
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

    private contractCurrentSearchTableData(): void {
        this.tableService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.mapingIndex = 0;

                    this.backFilterQuery.pageIndex = 1;

                    const searchEvent = tableSearch(res, this.backFilterQuery);

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

    private contractCurrentActionAnimation(): void {
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
                        this.viewData = closeAnimationAction(
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
                        this.viewData = closeAnimationAction(
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
                        this.viewData = closeAnimationAction(
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

    private contractCurrentDeleteSelectedRows(): void {
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
        this.contactService
            .deleteCompanyContactById(contactId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteContactList(contactIds: number[]): void {
        this.contactService
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
                    this.viewData = closeAnimationAction(true, this.viewData);

                    clearInterval(interval);
                }, 1000);

                this.tableService.sendRowsSelected([]);
                this.tableService.sendResetSelectedColumns(true);
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

        this.resizeObserver?.observe(
            document.querySelector(TableStringEnum.TABLE_CONTAINER)
        );
    }

    // Table Options
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

    // Send Contact Data
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

    // Get Contact Data From Store Or Via Api Call
    getTabData() {
        this.contacts = this.contactQuery.getAll();
        return this.contacts?.length ? this.contacts : [];
    }

    // Update Contact Count
    updateDataCount() {
        const contactCount = JSON.parse(
            localStorage.getItem(ContactsStringEnum.CONTACT_TABLE_COUNT)
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
    setContactData(tdata: DataForCardsAndTables): void {
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

    // Map Contact Data
    public mapContactData(data: any, dontMapIndex?: boolean): void {
        if (!data?.avatar && !dontMapIndex) {
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
            avatarImg: data?.avatar
                ? this.imageBase64Service.sanitizer(data.avatar)
                : null,
            isShared: data.shared,
            lable: data?.companyContactLabel
                ? {
                      name: data?.companyContactLabel?.name ?? null,
                      color: data?.companyContactLabel?.code ?? null,
                  }
                : null,
            added: convertDateFromBackend(data?.createdAt),
            edited: convertDateFromBackend(data?.updatedAt),
            tableDropdownContent: {
                hasContent: true,
                content: this.getDropdownContactContent(),
            },
        };
    }
    public getDropdownContactContent(): DropdownItem[] {
        return TableDropdownComponentConstants.DROPDOWN_CONTACTS_CONTENT;
    }

    // Contact Back Filter
    public contactBackFilter(
        filter: ContactsBackFilter,
        isShowMore?: boolean
    ): void {
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

    private saveContractLabel(data: CompanyAccountLabelResponse): void {
        this.contactService
            .updateCompanyContactLabel({
                id: data.id,
                name: data.name,
                colorId: data.colorId,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private updateCompanyContactLabel(event: TableBodyActionsContract): void {
        // const companyContractData = this.viewData.find(
        //     (e: CreateCompanyContactCommand) => e.id === event.id
        // );

        const newdata: UpdateCompanyContactCommand = {
            // id: companyContractData.id ?? null,
            // name: companyContractData.name ?? null,
            // companyContactLabelId: event.data ? event.data.id : null,
            // avatar: companyContractData.avatar ?? null,
            // address: companyContractData.address ?? null,
            // shared: companyContractData.shared ?? null,
            // note: companyContractData.note ?? null,
            // contactEmails: companyContractData.contactEmails
            //     ? this.createContactEmails(companyContractData.contactEmails[0])
            //     : null,
            // contactPhones: companyContractData.contactPhones
            //     ? this.createContactPhones(companyContractData.contactPhones[0])
            //     : null,
        };

        this.contactService
            .updateCompanyContact(
                newdata
                // companyContractData.colorRes,
                // companyContractData.colorLabels
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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
    // On Toolbar Actions
    onToolBarAction(event: TableToolBarActionActionsContract) {
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

    // On Head Actions
    public onTableHeadActions(event: TableHeadActionContract) {
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

    // On Body Actions
    public onTableBodyActions(event: TableBodyActionsContract): void {
        if (event.type === TableStringEnum.SHOW_MORE) {
            this.backFilterQuery.pageIndex++;
            this.contactBackFilter(this.backFilterQuery, true);
        } else if (event.type === ContactsStringEnum.EDIT_CONTACT) {
            this.modalService.openModal(
                ContactsModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.EDIT,
                }
            );
        } else if (event.type === TableStringEnum.DELTETE_CONTACT) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    template: TableStringEnum.CONTACT,
                    type: TableStringEnum.DELETE,
                    svg: true,
                }
            );
        } else if (event.type === TableStringEnum.UPDATE_LABEL) {
            this.saveContractLabel(event.data);
        } else if (event.type === TableStringEnum.UPDATE_LABEL) {
            this.updateCompanyContactLabel(event);
        }
    }

    ngOnDestroy(): void {
        this.tableService.sendActionAnimation({});

        this.resizeObserver.disconnect();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
