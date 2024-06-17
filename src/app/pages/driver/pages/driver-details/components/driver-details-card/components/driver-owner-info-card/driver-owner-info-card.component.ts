import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// models
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-owner-info-card',
    templateUrl: './driver-owner-info-card.component.html',
    styleUrls: ['./driver-owner-info-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaCustomCardComponent,
    ],
})
export class DriverOwnerInfoCardComponent {
    @Input() cardData: DriverResponse;

    public isOwnerInfoCardOpen: boolean = true;

    constructor() {}

    public handleOwnerInfoCardOpen(isOpen: boolean): void {
        this.isOwnerInfoCardOpen = isOpen;
    }
}
