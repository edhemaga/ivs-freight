import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { MilesMapUnitListComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-list/miles-map-unit-list.component';
import { MilesMapUnitTotalComponent } from '@pages/miles/pages/miles-map/components/miles-map-unit-total/miles-map-unit-total.component';

@Component({
    selector: 'app-miles-map',
    templateUrl: './miles-map.component.html',
    styleUrl: './miles-map.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MilesMapUnitListComponent,
        MilesMapUnitTotalComponent,
    ],
})
export class MilesMapComponent {}
