import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eSharedString, eColor, eStringPlaceholder } from '@shared/enums';

// SVG routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// Components
import { CaSkeletonComponent } from '@shared/components/ca-skeleton/ca-skeleton.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { CaUnitInfoBoxComponent } from '@shared/components/ca-unit-info-box/ca-unit-info-box.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaLoadStatusComponent, LoadStatusColorsPipe } from 'ca-components';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

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
        LoadStatusColorsPipe,

        // Components
        CaSkeletonComponent,
        SvgIconComponent,
        CaUnitInfoBoxComponent,
        TaAppTooltipV2Component,
        CaLoadStatusComponent,
        TaCustomCardComponent,
    ],
})
export class LoadDetailsGeneralComponent {
    // assets
    public sharedIcons = SharedSvgRoutes;

    // enums
    public eStringPlaceholder = eStringPlaceholder;
    public eSharedString = eSharedString;
    public eColor = eColor;

    public isBillingExpanded: boolean = false;
    public isPaymentExpanded: boolean = false;

    constructor(protected loadStoreService: LoadStoreService) {}

    public toggleBilling(): void {
        this.isBillingExpanded = !this.isBillingExpanded;
    }

    public togglePayment(): void {
        this.isPaymentExpanded = !this.isPaymentExpanded;
    }
}
