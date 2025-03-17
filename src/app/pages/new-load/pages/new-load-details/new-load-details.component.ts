import { Component, OnInit } from '@angular/core';

// Components
import { LoadDetailsAdditionalComponent } from '@pages/new-load/pages/new-load-details/components/load-details-additional/load-details-additional.component';
import { LoadDetailsGeneralComponent } from '@pages/new-load/pages/new-load-details/components/load-details-general/load-details-general.component';
import { LoadDetailsStopsComponent } from '@pages/new-load/pages/new-load-details/components/load-details-stops/load-details-stops.component';

@Component({
    selector: 'app-new-load-details',
    templateUrl: './new-load-details.component.html',
    styleUrls: ['./new-load-details.component.scss'],
    standalone: true,
    imports: [
        LoadDetailsGeneralComponent,
        LoadDetailsStopsComponent,
        LoadDetailsAdditionalComponent,
    ],
})
export class NewLoadDetailsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
