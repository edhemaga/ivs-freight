import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-ta-details-page-title',
    templateUrl: './ta-details-page-title.component.html',
    styleUrl: './ta-details-page-title.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        SvgIconComponent,
    ],
})
export class TaDetailsPageTitleComponent {
    @Input() title!: string;
    @Input() routeLink!: string;
    @Input() rightSide?: TemplateRef<any>;

    public backIcon = SharedSvgRoutes.DETAILS_BACK_BUTTON;
}
