import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Component({
    selector: 'app-load-details-stops',
    templateUrl: './load-details-stops.component.html',
    styleUrl: './load-details-stops.component.scss',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
})
export class LoadDetailsStopsComponent {
    public sharedSvgRoutes = SharedSvgRoutes;

    constructor(protected loadStoreService: LoadStoreService) {}

    public toggleMap(): void {
        this.loadStoreService.toggleMap();
    }
}
