import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// moment
import moment from 'moment';

// svg routes
import { LoadDetailsItemSvgRoutes } from '@pages/load/pages/load-details/components/load-details-item/utils/svg-routes/load-details-item-svg.routes';

// enums
import { LoadDetailsItemStringEnum } from '@pages/load/pages/load-details/components/load-details-item/enums/load-details-item-string.enum';

// pipes
import { FormatTimePipe } from '@shared/pipes/format-time.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// models
import {
    ActiveLoadProgressBarResponse,
    ClosedLoadProgressBarResponse,
    LoadResponse,
    PendingLoadProgressBarResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-item-stops-progress-bar',
    templateUrl: './load-details-item-stops-progress-bar.component.html',
    styleUrls: ['./load-details-item-stops-progress-bar.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // pipes
        FormatTimePipe,
        FormatDatePipe,
    ],
})
export class LoadDetailsItemStopsProgressBarComponent implements OnChanges {
    @Input() progressData: LoadResponse;

    public loadDetailsItemSvgRoutes = LoadDetailsItemSvgRoutes;

    public pendingData: PendingLoadProgressBarResponse;
    public closedData: ClosedLoadProgressBarResponse;
    public activeData: ActiveLoadProgressBarResponse;

    public isToday: boolean = false;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.progressData?.currentValue) {
            this.getPositionToDisplayData(changes?.progressData?.currentValue);

            this.checkIfToday(changes?.progressData?.currentValue);
        }
    }

    public trackByIdentity = (index: number): number => index;

    private checkIfToday(progressData: LoadResponse): void {
        const { loadProgress } = progressData;

        this.isToday = moment(
            loadProgress?.pendingLoadProgressBar?.plannedTimeFrom
        ).isSame(moment(), LoadDetailsItemStringEnum.DAY);
    }

    private getPositionToDisplayData(progressData: LoadResponse): void {
        console.log('progressData', progressData);
        const { statusType, loadProgress } = progressData;

        // pending
        if (progressData?.statusType?.name === 'Pending') {
            /*  this.pendingData =  */
        }
    }
}
