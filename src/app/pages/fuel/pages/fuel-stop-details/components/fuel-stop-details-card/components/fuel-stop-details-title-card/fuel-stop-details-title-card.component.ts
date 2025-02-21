import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// pipes
import { FormatDatePipe } from '@shared/pipes';

@Component({
    selector: 'app-fuel-stop-details-title-card',
    templateUrl: './fuel-stop-details-title-card.component.html',
    styleUrl: './fuel-stop-details-title-card.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaDetailsHeaderCardComponent,
        TaCopyComponent,
        TaAppTooltipV2Component,

        // pipes
        FormatDatePipe,
    ],
})
export class FuelStopDetailsTitleCardComponent implements OnInit {
    public fuelDropdown: any;
    public storeDropdown: any;

    constructor() {}

    ngOnInit(): void {
        this.fuelDropDown();
        this.storeDropDown();
    }

    public fuelDropDown() {
        let fuelNames = [
            { id: 1, name: 'PILOT TRAVEL STOP 1' },
            { id: 2, name: 'PILOT TRAVEL STOP 2' },
        ];

        this.fuelDropdown = fuelNames.map((item) => {
            return {
                id: item.id,
                name: item.name,
                active: item.id,
            };
        });
    }

    public storeDropDown() {
        let storeNames = [
            { id: 1, name: 'Store 424', pinned: true },
            { id: 2, name: 'Store 555', pinned: null },
        ];

        this.storeDropdown = storeNames.map((item) => {
            return {
                id: item.id,
                name: item.name,
                svg: item.pinned ? 'ic_star.svg' : null,
                folder: 'common',
                active: item.id,
            };
        });
    }
}
