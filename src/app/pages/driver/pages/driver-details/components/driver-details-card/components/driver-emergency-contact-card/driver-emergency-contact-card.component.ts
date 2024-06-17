import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';

// models
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-emergency-contact-card',
    templateUrl: './driver-emergency-contact-card.component.html',
    styleUrls: ['./driver-emergency-contact-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
        TaCopyComponent,
    ],
})
export class DriverEmergencyContactCardComponent {
    @Input() cardData: DriverResponse;

    constructor() {}
}
