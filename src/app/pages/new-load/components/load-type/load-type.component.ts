import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { eColor, ePosition } from 'ca-components';

// Models
import { LoadType } from 'appcoretruckassist';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-load-type',
    standalone: true,
    imports: [
        CommonModule,
        NgbTooltip,
        // Components
        SvgIconComponent,
        TaAppTooltipV2Component,
    ],
    templateUrl: './load-type.component.html',
    styleUrl: './load-type.component.scss',
})
export class LoadTypeComponent {
    @Input() loadType: LoadType;
    @Input() isTextVisible: boolean;

    // svg-routes
    public sharedSvgRoutes = SharedSvgRoutes;

    public ePosition = ePosition;
    public eColor = eColor;

    public loadTypeIcons: Record<LoadType, string> = {
        FTL: SharedSvgRoutes.LOAD_FILLED,
        LTL: SharedSvgRoutes.LTL_FILLED,
        Combo: SharedSvgRoutes.LTLC_FILLED,
    };
}
