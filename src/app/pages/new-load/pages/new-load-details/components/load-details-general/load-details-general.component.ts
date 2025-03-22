import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eSharedString } from '@shared/enums';

// SVG routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// Components
import { CaSkeletonComponent } from '@shared/components/ca-skeleton/ca-skeleton.component';
import { SvgIconComponent } from 'angular-svg-icon';
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
        TaAppTooltipV2Component,
    ],
})
export class LoadDetailsGeneralComponent {
    public sharedIcons = SharedSvgRoutes;
    public types = eSharedString;

    constructor(
        protected loadStoreService: LoadStoreService,
        private router: Router
    ) {}

    public handleViewDetailsClick(type: eSharedString, id: number): void {
        if (type === eSharedString.TRUCK) {
            this.router.navigate([`/list/truck/${id}/details`]);
        } else if (type === eSharedString.TRAILER) {
            this.router.navigate([`/list/trailer/${id}/details`]);
        } else {
            this.router.navigate([`/list/driver/${id}/details`]);
        }
    }
}
