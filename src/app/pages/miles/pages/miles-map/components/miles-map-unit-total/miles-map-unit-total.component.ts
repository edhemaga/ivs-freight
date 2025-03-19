import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    MilesByUnitPaginatedStopsResponse,
    MilesService,
} from 'appcoretruckassist';

@Component({
    selector: 'app-miles-map-unit-total',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './miles-map-unit-total.component.html',
    styleUrl: './miles-map-unit-total.component.scss',
})
export class MilesMapUnitTotalComponent {
    total: MilesByUnitPaginatedStopsResponse;
    constructor(public milesService: MilesService) {
        this.milesService
            .apiMilesUnitGet(null, null, 4)
            .subscribe((data) => (this.total = data));
    }
}
