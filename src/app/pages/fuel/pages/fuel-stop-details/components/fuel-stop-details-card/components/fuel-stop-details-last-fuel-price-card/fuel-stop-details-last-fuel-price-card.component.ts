import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { CaLastFuelPriceProgressComponent } from 'ca-components';

// pipes
import { LastFuelPriceCardTitlePipe } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/pipes';

// models
import { FuelStopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-stop-details-last-fuel-price-card',
    templateUrl: './fuel-stop-details-last-fuel-price-card.component.html',
    styleUrl: './fuel-stop-details-last-fuel-price-card.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
        CaLastFuelPriceProgressComponent,

        // pipes
        LastFuelPriceCardTitlePipe,
    ],
})
export class FuelStopDetailsLastFuelPriceCardComponent {
    @Input() set cardData(data: FuelStopResponse) {
        this._cardData = data;
    }

    public _cardData: FuelStopResponse;

    public isLastFuelPriceCardOpen: boolean = true;

    constructor() {}

    public handleLastFuelPriceCardOpen(isOpen: boolean): void {
        this.isLastFuelPriceCardOpen = isOpen;
    }
}
