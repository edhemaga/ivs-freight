import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Enums
import { eColor } from '@shared/enums';

@Component({
    selector: 'app-load-details-stops',
    templateUrl: './load-details-stops.component.html',
    styleUrl: './load-details-stops.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbModule,

        // Components
        TaAppTooltipV2Component,
        AngularSvgIconModule,
    ],
})
export class LoadDetailsStopsComponent {
    public sharedSvgRoutes = SharedSvgRoutes;
    public eColor = eColor;

    constructor(protected loadStoreService: LoadStoreService) {}

    public toggleMap(): void {
        this.loadStoreService.toggleMap();
    }
}
