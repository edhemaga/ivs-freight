import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// routes
import { LoadDetailsCardSvgRoutes } from '@pages/load/pages/load-details/components/load-details-card/utils/svg-routes/load-details-card-svg-routes';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// models
import { LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-assigned-to-card',
    templateUrl: './load-details-assigned-to-card.component.html',
    styleUrls: ['./load-details-assigned-to-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaCustomCardComponent,
        TaAppTooltipV2Component,
    ],
})
export class LoadDetailsAssignedToCardComponent {
    @Input() cardData: LoadResponse;

    public loadDetailsCardSvgRoutes = LoadDetailsCardSvgRoutes;

    constructor() { }
}
