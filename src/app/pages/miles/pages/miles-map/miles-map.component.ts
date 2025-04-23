import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// components
import { MilesMapUnitListComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-list/miles-map-unit-list.component';
import { MilesMapUnitTotalComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-total/miles-map-unit-total.component';
import { CaMapComponent } from 'ca-components';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

@Component({
    selector: 'app-miles-map',
    templateUrl: './miles-map.component.html',
    styleUrl: './miles-map.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MilesMapUnitListComponent,
        MilesMapUnitTotalComponent,
        CaMapComponent,
    ],
})
export class MilesMapComponent {
    constructor(public milesStoreService: MilesStoreService) {}

    public handleRoutingMarkerClick(stopId: number): void {
        this.milesStoreService.dispatchGetMapStopData(stopId);
    }
}
