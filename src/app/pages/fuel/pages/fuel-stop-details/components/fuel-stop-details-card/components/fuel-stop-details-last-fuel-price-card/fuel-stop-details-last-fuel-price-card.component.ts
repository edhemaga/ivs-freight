import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// constants
import { FuelStopDetailsCardConstants } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/utils/constants';

// svg routes
import { FuelStopDetailsSvgRoutes } from '@pages/fuel/pages/fuel-stop-details/utils/svg-routes';

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
        AngularSvgIconModule,

        // components
        TaCustomCardComponent,
    ],
})
export class FuelStopDetailsLastFuelPriceCardComponent {
    @Input() set cardData(data: FuelStopResponse) {
        this.createLastFuelPriceCardData(data);
    }

    public _cardData: FuelStopResponse;

    // dummy w8 for back
    public fuelPriceConfig = [
        {
            title: 'Diesel',
            totalValue: 3.358,
            minValue: 3.23,
            maxValue: 4.18,
        },
        {
            title: 'DEF',
            totalValue: 2.358,
            minValue: 2.13,
            maxValue: 5.18,
        },
    ];

    public isLastFuelPriceCardOpen: boolean = true;

    public lastFuelPriceColors: string[] = [];

    // svg routes
    public fuelStopDetailsSvgRoutes = FuelStopDetailsSvgRoutes;

    constructor() {}

    ngOnInit(): void {
        this.getConstantData();
    }

    private getConstantData(): void {
        this.lastFuelPriceColors =
            FuelStopDetailsCardConstants.lastFuelPriceColors;
    }

    private createLastFuelPriceCardData(data: FuelStopResponse): void {
        this._cardData = data;
    }

    public handleLastFuelPriceCardOpen(isOpen: boolean): void {
        this.isLastFuelPriceCardOpen = isOpen;
    }
}
