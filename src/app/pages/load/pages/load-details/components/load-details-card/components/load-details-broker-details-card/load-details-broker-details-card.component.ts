import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// routes
import { LoadDetailsCardSvgRoutes } from '@pages/load/pages/load-details/components/load-details-card/utils/svg-routes/load-details-card-svg-routes';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// models
import { LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-broker-details-card',
    templateUrl: './load-details-broker-details-card.component.html',
    styleUrls: ['./load-details-broker-details-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaCustomCardComponent,
    ],
})
export class LoadDetailsBrokerDetailsCardComponent {
    @Input() cardData: LoadResponse;

    public loadDetailsCardSvgRoutes = LoadDetailsCardSvgRoutes;

    constructor() {}
}
