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

// enums
import { eFuelStopDetails } from '@pages/fuel/pages/fuel-stop-details/enums';
import { eStringPlaceholder } from '@shared/enums';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes';
import { LastFuelPriceCardTitlePipe } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/pipes';

// models
import { FuelStopResponse } from 'appcoretruckassist';
import { ExtendedFuelStopResponse } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/models';

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

        // pipes
        ThousandSeparatorPipe,
        LastFuelPriceCardTitlePipe,
    ],
    providers: [ThousandSeparatorPipe],
})
export class FuelStopDetailsLastFuelPriceCardComponent {
    @Input() set cardData(data: FuelStopResponse) {
        this.createLastFuelPriceCardData(data);
    }

    public _cardData: ExtendedFuelStopResponse;

    // svg routes
    public fuelStopDetailsSvgRoutes = FuelStopDetailsSvgRoutes;

    // enums
    public eStringPlaceholder = eStringPlaceholder;

    public isLastFuelPriceCardOpen: boolean = true;

    public lastFuelPriceColors: string[] = [];

    constructor() {}

    ngOnInit(): void {
        this.getConstantData();
    }

    private getConstantData(): void {
        this.lastFuelPriceColors =
            FuelStopDetailsCardConstants.LAST_FUEL_PRICE_COLORS;
    }

    private createLastFuelPriceCardData(data: FuelStopResponse): void {
        const {
            pricePerGallon,
            lowestPricePerGallon,
            highestPricePerGallon,
            defPrice,
            defLowestPrice,
            defHighestPrice,
        } = data;

        const lastFuelPriceConfig = [
            {
                title: eFuelStopDetails.DIESEL,
                totalValue: pricePerGallon,
                minValue: lowestPricePerGallon,
                maxValue: highestPricePerGallon,
            },
            {
                title: eFuelStopDetails.DEF,
                totalValue: defPrice,
                minValue: defLowestPrice,
                maxValue: defHighestPrice,
            },
        ];

        this._cardData = {
            ...data,
            lastFuelPriceConfig,
        };
    }

    public handleLastFuelPriceCardOpen(isOpen: boolean): void {
        this.isLastFuelPriceCardOpen = isOpen;
    }

    //////////////////////////  TO COMPONENT

    public getSvgClassFromValue(
        minValue: number,
        maxValue: number,
        totalValue: number
    ): string {
        // calculate percentage of cost in relation to min and max values
        const percentage =
            ((totalValue - minValue) / (maxValue - minValue)) * 100;

        // ensure percentage is within the range [0, 100]
        const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

        // find the section based on percentage (0-20, 21-40, etc.)
        const colorSection = Math.floor(clampedPercentage / 20); // 5 color sections

        // adjust logic: if the progress is close to the end of a section, use the current section's color
        if (percentage === 100) return `fuel-color-5`; // if it's exactly 100%, it's the last color

        // return the appropriate class based on the section
        return `fuel-color-${colorSection + 1}`;
    }

    public calculateSvgPosition(
        minValue: number,
        maxValue: number,
        totalValue: number
    ): { svgPosition: number; svgClass: string } {
        // calculate percentage of cost in relation to min and max values
        const percentage =
            ((totalValue - minValue) / (maxValue - minValue)) * 100;

        // calculate the position based on the 5 equal sections (20% per section)
        const svgPosition = (percentage / 100) * 100; // Percentage of progress

        // use the utility function to get the appropriate class for the SVG based on the value range
        const svgClass = this.getSvgClassFromValue(
            minValue,
            maxValue,
            totalValue
        );

        return { svgPosition, svgClass };
    }

    get svgData() {
        const minValue = 3.23; // Example min value
        const maxValue = 4.18; // Example max value
        const totalValue = 3.359; // Example cost (current value)

        return this.calculateSvgPosition(minValue, maxValue, totalValue);
    }
}
