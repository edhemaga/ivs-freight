import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Pipes
import { FormatDatePipe, FormatTimePipe } from '@shared/pipes';

// COmponents
import {
    CaMapComponent,
    ICaMapProps,
    MapOptionsConstants,
} from 'ca-components';

@Component({
    selector: 'app-load-details-stops',
    templateUrl: './load-details-stops.component.html',
    styleUrl: './load-details-stops.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Pipes
        FormatDatePipe,
        FormatTimePipe,

        // Components
        AngularSvgIconModule,
        CaMapComponent,
    ],
})
export class LoadDetailsStopsComponent {
    public sharedSvgRoutes = SharedSvgRoutes;
    public mapData: ICaMapProps = MapOptionsConstants.DEFAULT_MAP_CONFIG;
    public openStopIndex: number = -1;

    constructor(protected loadStoreService: LoadStoreService) {}

    public toggleMap(): void {
        this.loadStoreService.toggleMap();
    }

    public toggleStopDetails(newIndex: number): void {
        this.openStopIndex = this.openStopIndex === newIndex ? -1 : newIndex;
    }
}
