import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    SecurityContext,
    Output,
    EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    NgbTooltip,
    NgbModule,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';

// Models
import {
    BrokerContactResponse,
    ShipperContactResponse,
} from 'appcoretruckassist';
import { ContactDepartmentData } from '@shared/components/ta-input-dropdown-contacts/models/contact-department-data.model';
import { ContactData } from '@shared/components/ta-input-dropdown-contacts/models/contact-data.model';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Sanitizer
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-ta-input-dropdown-contacts',
    templateUrl: './ta-input-dropdown-contacts.component.html',
    styleUrls: [
        './ta-input-dropdown-contacts.component.scss',
        '../ta-input-dropdown-table/ta-input-dropdown-table.component.scss',
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        // Modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,

        // Components
        TaCustomCardComponent,
        TaCopyComponent,
        TaAppTooltipV2Component,
    ],
})
export class TaContactsComponent implements OnInit {
    public _contactsData: ContactData[] = [];

    @Input() set contactsData(value) {
        this._contactsData = this.mapContactsData(value);

        this.mapContactPopoverData();
    }

    @Output() onAddButton = new EventEmitter<boolean>();
    @Output() onEditButton = new EventEmitter<boolean>();
    @Output() onDeleteButton = new EventEmitter<boolean>();

    public contactDepartments: ContactDepartmentData[] = [];
    public contactsDataBeforeSearch: ContactDepartmentData[];

    public tooltip: NgbTooltip;
    public dropDownActive: number;

    public isContactCardOpenArray: boolean[] = [];
    public contactsOpenIds: number[] = [];

    public higlightTextTimeout = null;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit(): void {}

    public mapContactsData(
        contactsData: ShipperContactResponse[] | BrokerContactResponse[]
    ): ContactData[] {
        const contactsList: ContactData[] = contactsData.map((contact) => {
            let contactData: ContactData = {
                id: contact.id,
                name: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                email: contact.email,
                phone: contact.phone,
                phoneExt: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                department: contact.department,
            };

            this.isContactCardOpenArray = [
                ...this.isContactCardOpenArray,
                false,
            ];

            if (contact.fullName) {
                contactData.name = contact.fullName;
            } else if (contact.contactName) {
                contactData.name = contact.contactName;
            }

            if (contact.phoneExt) {
                contactData.phoneExt = contact.phoneExt;
            } else if (contact.extensionPhone) {
                contactData.phoneExt = contact.extensionPhone;
            }

            return contactData;
        });

        return contactsList;
    }

    public mapContactPopoverData(): void {
        const departmentsList: ContactDepartmentData[] = [];

        this._contactsData.forEach((contact: ContactData) => {
            if (contact.department) {
                const departmentIndex = [...departmentsList].findIndex(
                    (department) => {
                        return department.id === contact.department.id;
                    }
                );

                if (departmentIndex === -1) {
                    const departmentContact: ContactData[] = [
                        {
                            ...contact,
                        },
                    ];

                    const newDepartment = {
                        ...contact.department,
                        contacts: [...departmentContact],
                    };

                    departmentsList.push(newDepartment);
                } else {
                    departmentsList[departmentIndex].contacts.push(contact);
                }
            }
        });

        this.contactDepartments = departmentsList;
        this.contactsDataBeforeSearch = [...this.contactDepartments];
    }

    public toggleDropdownContacts(tooltip: NgbTooltip): void {
        this.tooltip = tooltip;

        tooltip.isOpen() ? tooltip.close() : tooltip.open();

        this.dropDownActive = tooltip.isOpen() ? 1 : -1;
    }

    public filterContacts(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement) {
            const searchTerm = event.target.value.trim().toLowerCase();
            const results: ContactDepartmentData[] = [];

            // handle search
            this.contactsDataBeforeSearch.forEach((department, index) => {
                const filteredUsers = department.contacts.filter((user) =>
                    user.name.toLowerCase().includes(searchTerm)
                );

                const filteredDepartment = {
                    ...department,
                    contacts: filteredUsers,
                };

                results.push(filteredDepartment);

                if (filteredUsers.length)
                    this.isContactCardOpenArray[index] = true;
            });

            this.contactDepartments = [...results];

            if (!searchTerm) {
                this.contactDepartments = this.contactsDataBeforeSearch;

                this.isContactCardOpenArray = this.isContactCardOpenArray.map(
                    () => false
                );
            }

            this.highlightSearchedText(searchTerm);
        }
    }

    public openCloseContact(id: number): void {
        if (this.contactsOpenIds.includes(id))
            this.contactsOpenIds.splice(this.contactsOpenIds.indexOf(id), 1);
        else this.contactsOpenIds.push(id);
    }

    public highlightSearchedText(searchText: string): void {
        clearTimeout(this.higlightTextTimeout);

        this.higlightTextTimeout = setTimeout(() => {
            document
                .querySelectorAll<HTMLElement>('.contact-item p')
                .forEach((title: HTMLElement) => {
                    const text = title.textContent;

                    const regex = new RegExp(searchText, 'gi');
                    const newText = text.replace(regex, (match: string) => {
                        if (match.length >= 3) {
                            return `<mark class='highlighted-text'>${match}</mark>`;
                        } else {
                            return match;
                        }
                    });

                    const sanitzed = this.sanitizer.sanitize(
                        SecurityContext.HTML,
                        newText
                    );

                    title.innerHTML = sanitzed;
                });
        }, 1000);
    }

    public addButtonAction(): void {
        this.onAddButton.emit();

        this.toggleDropdownContacts(this.tooltip);
    }

    public editButtonAction(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.onEditButton.emit();

        this.toggleDropdownContacts(this.tooltip);
    }

    public deleteButtonAction(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.onDeleteButton.emit();

        this.toggleDropdownContacts(this.tooltip);
    }
}
