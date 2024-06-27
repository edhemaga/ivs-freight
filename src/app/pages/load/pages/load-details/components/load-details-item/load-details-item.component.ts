import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { LoadDetailsCardComponent } from '@pages/load/pages/load-details/components/load-details-card/load-details-card.component';
import { LoadDetailsItemStopsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/load-details-item-stops.component';
import { LoadDetailsItemCommentsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-comments/load-details-item-comments.component';
import { LoadDetailsItemStatusHistoryComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-status-history/load-details-item-status-history.component';

// models
import { DetailsConfig } from '@shared/models/details-config.model';

@Component({
    selector: 'app-load-details-item',
    templateUrl: './load-details-item.component.html',
    styleUrls: ['./load-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,

        LoadDetailsCardComponent,
        LoadDetailsItemStopsComponent,
        LoadDetailsItemCommentsComponent,
        LoadDetailsItemStatusHistoryComponent,
    ],
})
export class LoadDetailsItemComponent {
    @Input() detailsConfig: DetailsConfig;
    @Input() isAddNewComment: boolean;
    @Input() isSearchComment: boolean;

    constructor() {}

    public trackByIdentity(_: number, item: DetailsConfig): number {
        return item.id;
    }
}
