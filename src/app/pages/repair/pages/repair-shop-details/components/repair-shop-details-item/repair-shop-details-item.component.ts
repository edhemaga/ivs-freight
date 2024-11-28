import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// components
import { RepairShopDetailsCard } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/repair-shop-details-card.component';
import { RepairShopDetailsItemRepairComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repair/repair-shop-details-item-repair.component';
import { RepairShopDetailsItemRepairedVehicleComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repaired-vehicle/repair-shop-details-item-repaired-vehicle.component';
import { RepairShopDetailsItemReviewComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-review/repair-shop-details-item-review.component';
import { RepairShopDetailsItemContactComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-contact/repair-shop-details-item-contact.component';

// models
import { DetailsConfig } from '@shared/models/details-config.model';

@Component({
    selector: 'app-repair-shop-details-item',
    templateUrl: './repair-shop-details-item.component.html',
    styleUrls: ['./repair-shop-details-item.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        RepairShopDetailsCard,
        RepairShopDetailsItemRepairComponent,
        RepairShopDetailsItemRepairedVehicleComponent,
        RepairShopDetailsItemContactComponent,
        RepairShopDetailsItemReviewComponent,
    ],
})
export class RepairShopDetailsItemComponent {
    @Input() detailsConfig: DetailsConfig;
    @Input() searchConfig: boolean[];

    constructor() {}

    public trackByIdentity(_: number, item: DetailsConfig): number {
        return item.id;
    }
}
