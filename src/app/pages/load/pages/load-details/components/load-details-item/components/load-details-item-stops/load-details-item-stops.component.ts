import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { LoadDetailsItemStopsProgressBarComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-details-item-stops-progress-bar/load-details-item-stops-progress-bar.component';
import { LoadDetailsItemStopsMainComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-details-item-stops-main/load-details-item-stops-main.component';

// models
import { LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-item-stops',
    templateUrl: './load-details-item-stops.component.html',
    styleUrls: ['./load-details-item-stops.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        LoadDetailsItemStopsProgressBarComponent,
        LoadDetailsItemStopsMainComponent,
    ],
})
export class LoadDetailsItemStopsComponent {
    @Input() load: LoadResponse;
    @Input() isMapDisplayed: boolean;

    constructor() {}
}
