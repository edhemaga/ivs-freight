import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

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
    public fuelPriceColors: any[] = [
        '#4DB6A2',
        '#81C784',
        '#FFD54F',
        '#FFB74D',
        '#E57373',
        '#919191',
    ];
}
