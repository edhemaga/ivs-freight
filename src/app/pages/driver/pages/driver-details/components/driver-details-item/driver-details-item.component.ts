import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// decorators
import { Titles } from '@core/decorators/titles.decorator';

// components
import { DriverDetailsCardComponent } from '@pages/driver/pages/driver-details/components/driver-details-card/driver-details-card.component';
import { DriverDetailsItemCdlComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-cdl/driver-details-item-cdl.component';
import { DriverDetailsItemTestComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-test/driver-details-item-test.component';
import { DriverDetailsItemMedicalComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-medical/driver-details-item-medical.component';
import { DriverDetailsItemMvrComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/components/driver-details-item-mvr/driver-details-item-mvr.component';

// models
import { DetailsConfig } from '@shared/models/details-config.model';

@Titles()
@Component({
    selector: 'app-driver-details-item',
    templateUrl: './driver-details-item.component.html',
    styleUrls: ['./driver-details-item.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        DriverDetailsCardComponent,
        DriverDetailsItemCdlComponent,
        DriverDetailsItemTestComponent,
        DriverDetailsItemMedicalComponent,
        DriverDetailsItemMvrComponent,
    ],
})
export class DriverDetailsItemComponent {
    @Input() detailsConfig: DetailsConfig[];

    constructor() {}
}
