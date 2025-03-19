import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Components
import { LoadDetailsAdditionalComponent } from '@pages/new-load/pages/new-load-details/components/load-details-additional/load-details-additional.component';
import { LoadDetailsGeneralComponent } from '@pages/new-load/pages/new-load-details/components/load-details-general/load-details-general.component';
import { LoadDetailsStopsComponent } from '@pages/new-load/pages/new-load-details/components/load-details-stops/load-details-stops.component';
import { TaDetailsPageTitleComponent } from '@shared/components/ta-details-page-title/ta-details-page-title.component';

// Pipes
import { StatusClassPipe } from '@pages/new-load/pages/new-load-details/pipes/status-class.pipe';

// Models
import { DetailsDropdownOptions } from '@shared/models';

// Enums
import { eLoadRouting } from '@pages/new-load/enums';

@Component({
    selector: 'app-new-load-details',
    templateUrl: './new-load-details.component.html',
    styleUrls: ['./new-load-details.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        LoadDetailsGeneralComponent,
        LoadDetailsStopsComponent,
        LoadDetailsAdditionalComponent,
        TaDetailsPageTitleComponent,

        // Pipes
        StatusClassPipe,
    ],
})
export class NewLoadDetailsComponent implements OnInit {
    public detailsDropdownOptions!: DetailsDropdownOptions;
    public eLoadRouting = eLoadRouting;

    constructor(protected loadStoreService: LoadStoreService) {}

    ngOnInit(): void {}
}
