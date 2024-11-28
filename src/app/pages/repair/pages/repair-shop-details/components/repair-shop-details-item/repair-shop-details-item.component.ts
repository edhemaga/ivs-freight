import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

// components
import { RepairShopDetailsCard } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/repair-shop-details-card.component';
import { RepairShopDetailsItemRepairComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repair/repair-shop-details-item-repair.component';
import { RepairShopDetailsItemRepairedVehicleComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repaired-vehicle/repair-shop-details-item-repaired-vehicle.component';
import { TaContactsCardComponent } from '@shared/components/ta-contacts-card/ta-contacts-card.component';
import { RepairShopDetailsItemReviewComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-review/repair-shop-details-item-review.component';

// models
import { DetailsConfig } from '@shared/models/details-config.model';
import { DepartmentContacts } from '@shared/models/department-contacts.model';
import { RepairShopContactResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-item',
    templateUrl: './repair-shop-details-item.component.html',
    styleUrls: ['./repair-shop-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        RepairShopDetailsCard,
        RepairShopDetailsItemRepairComponent,
        RepairShopDetailsItemRepairedVehicleComponent,
        TaContactsCardComponent,
        RepairShopDetailsItemReviewComponent,
    ],
})
export class RepairShopDetailsItemComponent {
    @Input() set detailsConfig(data: DetailsConfig) {
        this._detailsConfig = data;

        this.orderContacts(this._detailsConfig[3]?.data.contacts);
    }
    @Input() searchConfig: boolean[];

    public _detailsConfig: DetailsConfig;

    public departmentContacts: DepartmentContacts[];

    /////////////////////////////////////////////
    @Input() customClass: string | any = '';

    constructor() {}

    public trackByIdentity(_: number, item: DetailsConfig): number {
        return item.id;
    }

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
}
