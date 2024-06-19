import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// routes
import { LoadDetailsCardSvgRoutes } from '@pages/load/pages/load-details/components/load-details-card/utils/svg-routes/load-details-card-svg-routes';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { LoadStatusColorPipe } from '@pages/load/pages/load-details/components/load-details-card/pipes/load-status-color.pipe';

// enums
import { LoadStatusEnum } from '@pages/load/enums/load-status.enum';

// models
import { LoadMinimalResponse, LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-title-card',
    templateUrl: './load-details-title-card.component.html',
    styleUrls: ['./load-details-title-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaDetailsHeaderCardComponent,

        // pipes
        FormatDatePipe,
        LoadStatusColorPipe,
    ],
})
export class LoadDetailsTitleCardComponent {
    @Input() cardData: LoadResponse;
    @Input() loadCurrentIndex: number;
    @Input() loadsDropdownList: LoadResponse[];

    @Output() cardValuesEmitter = new EventEmitter<{
        event: LoadMinimalResponse;
        type: string;
    }>();

    public loadDetailsCardSvgRoutes = LoadDetailsCardSvgRoutes;
    public loadStatusEnum = LoadStatusEnum;

    constructor() {}

    public handleCardChanges(event: LoadMinimalResponse, type: string): void {
        this.cardValuesEmitter.emit({ event, type });
    }
}
