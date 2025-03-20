import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

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
    constructor(public milesStoreService: MilesStoreService) {}
}
