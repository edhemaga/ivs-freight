import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// routes
import { LoadDetailsCardSvgRoutes } from '@pages/load/pages/load-details/components/load-details-card/utils/svg-routes/load-details-card-svg-routes';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

// enums
import { LoadStatusEnum } from '@shared/enums/load-status.enum';

// models
import {
    LoadMinimalResponse,
    LoadResponse,
    LoadStatusHistoryResponse,
    LoadStopResponse,
} from 'appcoretruckassist';
import { StatusOrder } from '@pages/load/models/status-order.model';

@Component({
    selector: 'app-load-details-title-card',
    templateUrl: './load-details-title-card.component.html',
    styleUrls: ['./load-details-title-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaDetailsHeaderCardComponent,
        LoadStatusStringComponent,
        TaAppTooltipV2Component,

        // pipes
        FormatDatePipe,
        LoadStatusColorPipe,
    ],
})
export class LoadDetailsTitleCardComponent implements OnChanges {
    @Input() cardData: LoadResponse;
    @Input() loadCurrentIndex: number;
    @Input() loadsDropdownList: LoadResponse[];

    @Output() cardValuesEmitter = new EventEmitter<{
        event: LoadMinimalResponse;
        type: string;
    }>();

    public loadDetailsCardSvgRoutes = LoadDetailsCardSvgRoutes;
    public loadStatusEnum = LoadStatusEnum;

    public statusId: number;

    public statusOrder: StatusOrder;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cardData?.currentValue) {
            this.handleStatusIdChange(
                changes.cardData?.currentValue.status?.statusValue?.id
            );

            this.handleStatusOrderChange(
                changes.cardData?.currentValue?.stops,
                changes.cardData?.currentValue?.lastStatus
            );
        }
    }

    private handleStatusIdChange(statusId: number): void {
        this.statusId = null;

        this.statusId = statusId;
    }

    private handleStatusOrderChange(
        stops: LoadStopResponse[],
        lastStatus: LoadStatusHistoryResponse
    ): void {
        this.statusOrder = null;

        const selectedStopType = stops?.find(
            (stop) => stop?.stopOrder === lastStatus?.stopOrder
        )?.stopType?.name;

        this.statusOrder = {
            type: selectedStopType,
            stopOrder: lastStatus?.stopOrder,
        };
    }

    public handleCardChanges(event: LoadMinimalResponse, type: string): void {
        this.cardValuesEmitter.emit({ event, type });
    }
}
