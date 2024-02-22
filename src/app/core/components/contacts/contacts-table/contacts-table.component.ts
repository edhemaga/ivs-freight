import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

//components
import { ContactModalComponent } from '../../modals/contact-modal/contact-modal.component';

//service
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ContactTService } from '../state/contact.service';
import { ImageBase64Service } from '../../../utils/base64.image';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

//store
import { ContactState } from '../state/contact-state/contact.store';
import { ContactQuery } from '../state/contact-state/contact.query';
import { NameInitialsPipe } from '../../../pipes/nameinitials';

//methods
import {
    tableSearch,
    closeAnimationAction,
} from '../../../utils/methods.globals';

//utils
import { getToolsContactsColumnDefinition } from '../../../../../assets/utils/settings/contacts-columns';

//enums
import { ContractComponentEnum } from '../state/enum/contract-string.enum';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

// constants
import { TableContacts } from 'src/app/core/utils/constants/table-components.constants';

//model
import {
    CompanyAccountLabelResponse,
    CompanyContactResponse,
    GetCompanyContactListResponse,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';
import {
    ContactBackFilter,
    ContactEmail,
    ContactPhone,
} from '../state/interface/contract-inteface';
import {
    TableBodyActionsContract,
    TableHeadActionContract,
    TableToolBarActionActionsContract,
} from 'src/app/core/model/contact';
import { DropdownItem } from '../../shared/model/card-table-data.model';
import { CardRows } from '../../shared/model/cardData';

// data for cards
import { DisplayContactsConfiguration } from '../contacts-card-data';
import { DataForCardsAndTables } from '../../shared/model/table-components/all-tables.modal';

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
    public selectedTab: string = ConstantStringTableComponentsEnum.ACTIVE;
    public activeViewMode: string = ConstantStringTableComponentsEnum.LIST;
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

    public cardTitle: string = DisplayContactsConfiguration.cardTitle;

    // Page
    public page: string = DisplayContactsConfiguration.page;

    //  Number of rows in card
    public rows: number = DisplayContactsConfiguration.rows;

    public sendDataToCardsFront: CardRows[] =
        DisplayContactsConfiguration.displayRowsFrontConctacts;
    public sendDataToCardsBack: CardRows[] =
        DisplayContactsConfiguration.displayRowsBackConctacts;

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

        this.contractResetColumns();

        this.contractResize();

        this.contractCurrentToaggleColumn();

        this.contractCurrentSearchTableData();

        this.contractCurrentActionAnimation();

        this.contractCurrentDeleteSelectedRows();
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
                        if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.API
                        ) {
                            this.contactBackFilter(searchEvent.query);
                        } else if (
                            searchEvent.action ===
                            ConstantStringTableComponentsEnum.STORE
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
                if (res?.animation === ConstantStringTableComponentsEnum.ADD) {
                    this.viewData.push(this.mapContactData(res.data));

                    this.viewData = this.viewData.map(
                        (contact: CompanyContactResponse) => {
                            // TODO this gives error when uncomented
                            // if (contact.id === res.id) {
                            //     contact.actionAnimation =
                            //         ConstantStringTableComponentsEnum.ADD;
                            // }

                            return contact;
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
                // Update Contact
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.UPDATE
                ) {
                    const updatedContact = this.mapContactData(res.data, true);

                    this.viewData = this.viewData.map(
                        (contact: CompanyContactResponse) => {
                            // TODO this gives error when uncomented
                            // if (contact.id === res.id) {
                            //     contact = updatedContact;
                            //     contact.actionAnimation =
                            //         ConstantStringTableComponentsEnum.UPDATE;
                            // }

                            return contact;
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
                // Delete Contact
                else if (
                    res?.animation === ConstantStringTableComponentsEnum.DELETE
                ) {
                    let contactIndex: number;

                    this.viewData = this.viewData.map(
                        (contact: CompanyContactResponse, index: number) => {
                            // TODO this gives error when uncomented
                            // if (contact.id === res.id) {
                            //     contact.actionAnimation =
                            //         ConstantStringTableComponentsEnum.DELETE;
                            //     contactIndex = index;
                            // }

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
    }

    private contractCurrentDeleteSelectedRows(): void {
        this.tableService.currentDeleteSelectedRows
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.length) {
                    this.contactService
                        .deleteAccountList(response)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(() => {
                            this.viewData = this.viewData.map(
                                (contact: CompanyContactResponse) => {
                                    response.map((res) => {
                                        //     TODO this gives error when uncomented
                                        //     if (contact.id === res.id) {
                                        //         contact.actionAnimation =
                                        //         ConstantStringTableComponentsEnum.DELETE_MULTIPLE;
                                        //     }
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

        this.resizeObserver?.observe(
            document.querySelector(
                ConstantStringTableComponentsEnum.TABLE_CONTAINER
            )
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

    // Send Contact Data
    sendContactData() {
        const tableView = JSON.parse(
            localStorage.getItem(ContractComponentEnum.CONTACT_TABLE_VIEW)
        );

        if (tableView) {
            this.selectedTab = tableView.tabSelected;
            this.activeViewMode = tableView.viewMode;
        }

        this.mapingIndex = 0;

        this.initTableOptions();

        const contactCount = JSON.parse(
            localStorage.getItem(ContractComponentEnum.CONTACT_TABLE_COUNT)
        );

        const contactData = this.getTabData();
        this.tableData = [
            {
                title: ContractComponentEnum.CONTACTS,
                field: ConstantStringTableComponentsEnum.ACTIVE,
                length: contactCount.contact,
                data: contactData,
                extended: false,
                gridNameTitle: ContractComponentEnum.CONTACT_2,
                stateName: ContractComponentEnum.CONTACTS_2,
                tableConfiguration: ContractComponentEnum.CONTACT,
                isActive: true,
                gridColumns: this.getGridColumns(ContractComponentEnum.CONTACT),
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
            localStorage.getItem(ContractComponentEnum.CONTACT_TABLE_COUNT)
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
                content: this.getDropdownContactContent(),
            },
        };
    }
    public getDropdownContactContent(): DropdownItem[] {
        return TableContacts.DROPDOWN_CONTACTS_CONTENT;
    }
    // Get Avatar Color
    public getAvatarColors(): { background: string; color: string } {
        const textColors: string[] = TableContacts.TEXT_COLORS;

        const backgroundColors: string[] = TableContacts.BACKGROUND_COLORS;

        this.mapingIndex = this.mapingIndex <= 11 ? this.mapingIndex : 0;

        return {
            background: backgroundColors[this.mapingIndex],
            color: textColors[this.mapingIndex],
        };
    }

    // Contact Back Filter
    public contactBackFilter(
        filter: ContactBackFilter,
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

    public createContactPhones(element: ContactPhone) {
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

    public createContactEmails(element: ContactEmail) {
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
        if (event.action === ConstantStringTableComponentsEnum.OPEN_MODAL) {
            this.modalService.openModal(ContactModalComponent, {
                size: ConstantStringTableComponentsEnum.SMALL,
            });
        } else if (
            event.action === ConstantStringTableComponentsEnum.TAB_SELECTED
        ) {
            this.mapingIndex = 0;

            this.selectedTab = event.tabData.field;

            this.backFilterQuery.pageIndex = 1;

            this.setContactData(event.tabData);
        } else if (
            event.action === ConstantStringTableComponentsEnum.VIEW_MODE
        ) {
            this.mapingIndex = 0;

            this.activeViewMode = event.mode;
        }
    }

    // On Head Actions
    public onTableHeadActions(event: TableHeadActionContract) {
        if (event.action === ConstantStringTableComponentsEnum.SORT) {
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
        if (event.type === ConstantStringTableComponentsEnum.SHOW_MORE) {
            this.backFilterQuery.pageIndex++;
            this.contactBackFilter(this.backFilterQuery, true);
        } else if (event.type === ContractComponentEnum.EDIT_CONTACT) {
            this.modalService.openModal(
                ContactModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    type: ConstantStringTableComponentsEnum.EDIT,
                }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.DELTETE_CONTACT
        ) {
            this.contactService
                .deleteCompanyContactById(event.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        } else if (
            event.type === ConstantStringTableComponentsEnum.UPDATE_LABEL
        ) {
            this.saveContractLabel(event.data);
        } else if (
            event.type === ConstantStringTableComponentsEnum.UPDATE_LABEL
        ) {
            this.updateCompanyContactLabel(event);
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
