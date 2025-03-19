import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    MilesByUnitPaginatedStopsResponse,
    MilesService,
} from 'appcoretruckassist';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { MilesIconPipe } from '@pages/miles/pipes/miles-icon.pipe';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

@Component({
    selector: 'app-miles-map-unit-total',
    standalone: true,
    imports: [
        CommonModule,

        // Pipes
        ThousandSeparatorPipe,
        MilesIconPipe,

        // Components
        SvgIconComponent,
        TaCustomCardComponent,
    ],
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
