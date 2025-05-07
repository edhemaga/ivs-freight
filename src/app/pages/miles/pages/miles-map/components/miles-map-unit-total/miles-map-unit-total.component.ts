import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Pipes
import { MilesIconPipe } from '@pages/miles/pipes/miles-icon.pipe';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// enums
import { eThousandSeparatorFormat } from '@shared/enums';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

@Component({
    selector: 'app-miles-map-unit-total',
    templateUrl: './miles-map-unit-total.component.html',
    styleUrl: './miles-map-unit-total.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Pipes
        MilesIconPipe,

        // Components
        SvgIconComponent,
        TaCustomCardComponent,
    ],
})
export class MilesMapUnitTotalComponent {
    public sharedSvgRoutes = SharedSvgRoutes;

    public eThousandSeparatorFormat = eThousandSeparatorFormat;

    constructor(public milesStoreService: MilesStoreService) {}
}
