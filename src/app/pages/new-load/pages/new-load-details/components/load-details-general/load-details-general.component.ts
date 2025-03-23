import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eSharedString, eColor } from '@shared/enums';

// SVG routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// Components
import { CaSkeletonComponent } from '@shared/components/ca-skeleton/ca-skeleton.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { CaUnitInfoBoxComponent } from '@shared/components/ca-unit-info-box/ca-unit-info-box.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-load-details-general',
    templateUrl: './load-details-general.component.html',
    styleUrl: './load-details-general.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbModule,

        // Pipes
        FormatDatePipe,

        // Components
        CaSkeletonComponent,
        SvgIconComponent,
        CaUnitInfoBoxComponent,
        TaAppTooltipV2Component,
    ],
})
export class LoadDetailsGeneralComponent {
    public sharedIcons = SharedSvgRoutes;
    public eSharedString = eSharedString;
    public eColor = eColor;

    constructor(protected loadStoreService: LoadStoreService) {}
}
