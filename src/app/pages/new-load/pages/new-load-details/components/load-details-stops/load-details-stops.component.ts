import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    NgbModule,
    NgbPopover,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Enums
import { eColor } from '@shared/enums';

// Pipes
import { FormatDatePipe, FormatTimePipe } from '@shared/pipes';
import { StopStatusPipe } from '@pages/new-load/pages/new-load-details/components/load-details-stops/pipes/stop-status.pipe';
import { FormatDurationPipe } from '@shared/pipes/format-duration.pipe';
import { PendingLoadProgressPipe } from './pipes/pending-load-progress.pipe';

// Components
import {
    CaMapComponent,
    ICaMapProps,
    MapOptionsConstants,
    LoadStatusBackgroundColorPipe,
    CaLoadStatusComponent,
} from 'ca-components';

@Component({
    selector: 'app-load-details-stops',
    templateUrl: './load-details-stops.component.html',
    styleUrl: './load-details-stops.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,

        // Pipes
        FormatDatePipe,
        FormatTimePipe,
        FormatDurationPipe,
        StopStatusPipe,
        LoadStatusBackgroundColorPipe,
        PendingLoadProgressPipe,

        // Components
        CaMapComponent,
        CaLoadStatusComponent,
        TaAppTooltipV2Component,
        AngularSvgIconModule,
    ],
})
export class LoadDetailsStopsComponent {
    public openStopIndex: number = -1;
    public mapData: ICaMapProps = MapOptionsConstants.DEFAULT_MAP_CONFIG;
    public hoveredIndex: number | null = null;

    // Svg routes
    public sharedSvgRoutes = SharedSvgRoutes;

    // Enums
    public eColor = eColor;

    constructor(protected loadStoreService: LoadStoreService) {}

    public toggleMap(): void {
        this.loadStoreService.toggleMap();
    }

    public toggleStopDetails(newIndex: number): void {
        this.openStopIndex = this.openStopIndex === newIndex ? -1 : newIndex;
    }

    // Status hover
    public toggleHoverStatus(index: number | null, popover: NgbPopover): void {
        this.hoveredIndex = index;

        this.hoveredIndex !== null ? popover.open() : popover.close();
    }
}
