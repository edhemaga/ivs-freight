import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// SVG routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// Components
import { CaSkeletonComponent } from '@shared/components/ca-skeleton/ca-skeleton.component';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
    selector: 'app-load-details-general',
    templateUrl: './load-details-general.component.html',
    styleUrl: './load-details-general.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Pipes
        FormatDatePipe,

        // Components
        CaSkeletonComponent,
        SvgIconComponent,
    ],
})
export class LoadDetailsGeneralComponent {
    public sharedIcons = SharedSvgRoutes;
    constructor(protected loadStoreService: LoadStoreService) {}
}
