import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    MilesByUnitPaginatedStopsResponse,
    MilesService,
} from 'appcoretruckassist';

// Pipes
import { ThousandSeparatorPipe } from '@shared/pipes';

@Component({
    selector: 'app-miles-map-unit-list',
    templateUrl: './miles-map-unit-list.component.html',
    styleUrl: './miles-map-unit-list.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        // Pipes
        ThousandSeparatorPipe,
    ],
})
export class MilesMapUnitListComponent {
    public isStopListExpanded: boolean = false;

    total: MilesByUnitPaginatedStopsResponse;
    constructor(public milesService: MilesService) {
        this.milesService.apiMilesUnitGet(null, null, 13).subscribe((data) => {
            this.total = data;
            console.log(data);
        });
    }
    public toogleStopList(): void {
        this.isStopListExpanded = !this.isStopListExpanded;
    }
}
