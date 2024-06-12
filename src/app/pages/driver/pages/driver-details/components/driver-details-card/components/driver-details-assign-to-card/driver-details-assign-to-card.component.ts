import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// models
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-details-assign-to-card',
    templateUrl: './driver-details-assign-to-card.component.html',
    styleUrls: ['./driver-details-assign-to-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
    ],
})
export class DriverDetailsAssignToCardComponent {
    @Input() cardData: DriverResponse;

    constructor() {}
}
