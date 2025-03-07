import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// components
import { FuelStopDetailsItemTransactionComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/components/fuel-stop-details-item-transaction/fuel-stop-details-item-transaction.component';
import { FuelStopDetailsItemFuelledVehicleComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/components/fuel-stop-details-item-fuelled-vehicle/fuel-stop-details-item-fuelled-vehicle.component';
import { FuelStopDetailsCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/fuel-stop-details-card.component';

// models
import { DetailsConfig } from '@shared/models';

@Component({
    selector: 'app-fuel-stop-details-item',
    templateUrl: './fuel-stop-details-item.component.html',
    styleUrls: ['./fuel-stop-details-item.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        FuelStopDetailsCardComponent,
        FuelStopDetailsItemTransactionComponent,
        FuelStopDetailsItemFuelledVehicleComponent,
    ],
})
export class FuelStopDetailsItemComponent {
    @Input() detailsConfig: DetailsConfig[];
    @Input() searchConfig: boolean[];
    @Input() searchValue?: string;

    constructor() {}
}
