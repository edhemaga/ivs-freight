import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';

// models
import { DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-bank-info-card',
    templateUrl: './driver-bank-info-card.component.html',
    styleUrls: ['./driver-bank-info-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
        TaPasswordAccountHiddenCharactersComponent,
    ],
})
export class DriverBankInfoCardComponent {
    @Input() cardData: DriverResponse;

    constructor() {}
}
