import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    MilesByUnitPaginatedStopsResponse,
    MilesService,
} from 'appcoretruckassist';

// Components
import { SvgIconComponent } from 'angular-svg-icon';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
@Component({
    selector: 'app-miles-map-unit-total',
    standalone: true,
    imports: [CommonModule, SvgIconComponent],
    templateUrl: './miles-map-unit-total.component.html',
    styleUrl: './miles-map-unit-total.component.scss',
})
export class MilesMapUnitTotalComponent {
    public sharedSvgRoutes = SharedSvgRoutes;
    total: MilesByUnitPaginatedStopsResponse;
    constructor(public milesService: MilesService) {
        this.milesService.apiMilesUnitGet(null, null, 13).subscribe((data) => {
            this.total = data;
            console.log(data);
        });
    }
}
