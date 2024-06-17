import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// models
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-notification-card',
    templateUrl: './driver-notification-card.component.html',
    styleUrls: ['./driver-notification-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
    ],
})
export class DriverNotificationCardComponent {
    @Input() cardData: DriverResponse;

    constructor() {}
}
