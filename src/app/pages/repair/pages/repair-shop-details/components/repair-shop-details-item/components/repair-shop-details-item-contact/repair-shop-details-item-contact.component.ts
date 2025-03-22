import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaContactsCardComponent } from '@shared/components/ta-contacts-card/ta-contacts-card.component';
import { CaSearchMultipleStatesComponent } from 'ca-components';

// services
import { DetailsSearchService } from '@shared/services';

// enums
import { eRepairShopDetailsSearchIndex } from '@pages/repair/pages/repair-shop-details/enums';

// models
import {
    RepairShopContactResponse,
    RepairShopResponse,
} from 'appcoretruckassist';
import { DepartmentContacts } from '@shared/models/department-contacts.model';

@Component({
    selector: 'app-repair-shop-details-item-contact',
    templateUrl: './repair-shop-details-item-contact.component.html',
    styleUrls: ['./repair-shop-details-item-contact.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaContactsCardComponent,
        CaSearchMultipleStatesComponent,
    ],
})
export class RepairShopDetailsItemContactComponent {
    @Input() set viewData(data: RepairShopResponse) {
        this._viewData = data;

        this.orderContacts(this._viewData?.contacts);
    }
    @Input() searchConfig: boolean[];
    @Input() searchValue?: string;

    public _viewData: RepairShopResponse;

    public departmentContacts: DepartmentContacts[];

    // enums
    public eRepairShopDetailsSearchIndex = eRepairShopDetailsSearchIndex;

    constructor(private detailsSearchService: DetailsSearchService) {}

    private orderContacts(contacts: RepairShopContactResponse[]): void {
        this.departmentContacts = [];

        contacts.forEach((contact) => {
            const departmentName = contact.department.name;

            let department = this.departmentContacts.find(
                (dep) => dep.name === departmentName
            );

            if (!department) {
                department = { name: departmentName, contacts: [] };

                this.departmentContacts.push(department);
            }

            department.contacts.push(contact);
        });
    }

    public handleCloseSearchEmit(): void {
        this.detailsSearchService.setCloseSearchStatus(
            eRepairShopDetailsSearchIndex.CONTACT_INDEX
        );
    }
}
