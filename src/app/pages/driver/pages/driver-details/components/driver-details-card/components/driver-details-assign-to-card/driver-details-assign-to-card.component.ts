import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { SvgIconComponent } from 'angular-svg-icon';

// models
import { DriverResponse } from 'appcoretruckassist';

// Const
import { FilterIconRoutes } from '@shared/components/ta-filter/utils/constants/filter-icons-routes.constants';

@Component({
    selector: 'app-driver-details-assign-to-card',
    templateUrl: './driver-details-assign-to-card.component.html',
    styleUrls: ['./driver-details-assign-to-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbModule,

        // components
        TaCustomCardComponent,
        TaAppTooltipV2Component,
        SvgIconComponent,
    ],
})
export class DriverDetailsAssignToCardComponent {
    @Input() cardData: DriverResponse;

    public svgRoutes = FilterIconRoutes;

    constructor() {}
}
