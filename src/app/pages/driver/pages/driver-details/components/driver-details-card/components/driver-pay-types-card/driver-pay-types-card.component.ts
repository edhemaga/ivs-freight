import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// pipes
import { DriverPayTypesCardNamePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-card-name.pipe';
import { DriverPayTypesCardSubtextPipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-card-subtext.pipe';
import { DriverPayTypesBoxTitlePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-title.pipe';
import { DriverPayTypesBoxSecondTitlePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-second-title.pipe';
import { DriverPayTypesBoxValuePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-value.pipe';
import { DriverPayTypesBoxSecondValuePipe } from '@pages/driver/pages/driver-details/components/driver-details-card/pipes/driver-pay-types-box-second-value.pipe';

// models
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-pay-types-card',
    templateUrl: './driver-pay-types-card.component.html',
    styleUrls: ['./driver-pay-types-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,

        // pipes
        DriverPayTypesCardNamePipe,
        DriverPayTypesCardSubtextPipe,
        DriverPayTypesBoxTitlePipe,
        DriverPayTypesBoxSecondTitlePipe,
        DriverPayTypesBoxValuePipe,
        DriverPayTypesBoxSecondValuePipe,
    ],
})
export class DriverPayTypesCardComponent {
    @Input() cardData: DriverResponse;

    public isPayTypesCardOpen: boolean = true;

    constructor() {}

    public handlePayTypesCardOpen(isOpen: boolean): void {
        this.isPayTypesCardOpen = isOpen;
    }
}
