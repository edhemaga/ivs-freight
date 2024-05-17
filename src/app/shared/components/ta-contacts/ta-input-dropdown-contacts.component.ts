import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Models
import {
    BrokerContactResponse,
    ShipperContactResponse,
} from 'appcoretruckassist';
import { ContactDepartmentData } from '@shared/components/ta-contacts/models/contact-department-data.model';
import { ContactData } from './models/contact-data.model';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import {
    NgbTooltip,
    NgbModule,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ta-input-dropdown-contacts',
    templateUrl: './ta-input-dropdown-contacts.component.html',
    styleUrls: ['./ta-input-dropdown-contacts.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbModule, NgbPopoverModule],
})
export class TaContactsComponent implements OnInit {
    public _contactsData: ContactData[] = [];

    @Input() set contactsData(value) {
        this._contactsData = this.mapContactsData(value);

        this.mapContactPopoverData();
    }
    public contactDepartments: ContactDepartmentData[] = [];

    public tooltip: NgbTooltip;
    public dropDownActive: number;

    constructor() {}

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
                const departmentIndex = departmentsList.findIndex(
                    (department) => {
                        department.id === contact.department.id;
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
    }

    public toggleDropdownContacts(tooltip: NgbTooltip): void {
        this.tooltip = tooltip;

        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open();
        }

        this.dropDownActive = tooltip.isOpen() ? 1 : -1;
    }

    // Functionality not added yet
    public filterContacts(event: KeyboardEvent): void {}
}
