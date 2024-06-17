import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// models
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-off-duty-location-card',
    templateUrl: './driver-off-duty-location-card.component.html',
    styleUrls: ['./driver-off-duty-location-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
    ],
})
export class DriverOffDutyLocationCardComponent {
    @Input() cardData: DriverResponse;

    constructor() {}

    public trackByIdentity(index: number): number {
        return index;
    }
}
