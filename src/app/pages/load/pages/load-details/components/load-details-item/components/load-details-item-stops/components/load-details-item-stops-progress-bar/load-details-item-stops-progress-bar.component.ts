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
    LoadStopProgressBarResponse,
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
    public checkedInActiveData: LoadStopProgressBarResponse;
    public nextStopActiveData: LoadStopProgressBarResponse;

    public statusType: string;

    public dotHoveringIndex: number = -1;

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
        const { statusType, loadProgress } = progressData;

        this.statusType = statusType?.name;

        this.pendingData = null;
        this.activeData = null;
        this.closedData = null;

        this.checkedInActiveData = null;
        this.nextStopActiveData = null;

        switch (statusType?.name) {
            case LoadDetailsItemStringEnum.PENDING:
                this.pendingData = loadProgress?.pendingLoadProgressBar;

                break;
            case LoadDetailsItemStringEnum.ACTIVE:
                this.activeData = loadProgress?.activeLoadProgressBar;

                this.checkedInActiveData = this.activeData?.loadStops?.find(
                    (stop) => stop.isCheckedIn
                );

                this.nextStopActiveData = this.activeData?.loadStops?.find(
                    (stop) => stop.isNextStop
                );

                break;
            default:
                this.closedData = loadProgress?.closedLoadProgressBar;
        }
    }
}
