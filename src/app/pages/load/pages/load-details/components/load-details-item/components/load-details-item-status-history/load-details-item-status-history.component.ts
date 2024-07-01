import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// constants
import { LoadDetailsItemConstants } from '@pages/load/pages/load-details/components/load-details-item/utils/constants/load-details-item.constants';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { LoadDetailsItemHelper } from '@pages/load/pages/load-details/components/load-details-item/utils/helpers/load-details-item.helper';

// pipes
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

// enums
import { LoadStatusEnum } from '@shared/enums/load-status.enum';
import { LoadDetailsItemStringEnum } from '@pages/load/pages/load-details/components/load-details-item/enums/load-details-item-string.enum';

// models
import { LoadResponse } from 'appcoretruckassist';
import { LoadStatusData } from '@pages/load/pages/load-details/components/load-details-item/models/load-status-data.model';

@Component({
    selector: 'app-load-details-item-status-history',
    templateUrl: './load-details-item-status-history.component.html',
    styleUrls: ['./load-details-item-status-history.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // pipes
        LoadStatusColorPipe,
    ],
})
export class LoadDetailsItemStatusHistoryComponent
    implements OnInit, OnChanges
{
    @Input() load: LoadResponse;

    public statusHistoryHeaderItems: string[];
    public statusHistoryData: LoadStatusData[];

    public loadStatusEnum = LoadStatusEnum;

    constructor() {}

    ngOnInit(): void {
        this.getConstantData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.load?.currentValue)
            this.createStatusHistoryData(changes?.load?.currentValue);
    }

    public trackByIdentity = (index: number): number => index;

    private getConstantData(): void {
        this.statusHistoryHeaderItems =
            LoadDetailsItemConstants.STATUS_HISTORY_HEADER_ITEMS;
    }

    private createStatusHistoryData(load: LoadResponse): void {
        const { statusHistory } = load;

        this.statusHistoryData = statusHistory.map((historyItem) => {
            return {
                id: historyItem.status.id,
                status: LoadDetailsItemHelper.removeNumbersFromStatusString(
                    historyItem.statusString
                ).toUpperCase(),
                statusStopOrder: historyItem.stopOrder,
                statusOrderColor: LoadDetailsItemHelper.checkStopOrderOrder(
                    historyItem.status.id
                ),
                statusDate: MethodsCalculationsHelper.convertDateFromBackend(
                    historyItem.dateTimeFrom
                ),
                statusTime:
                    MethodsCalculationsHelper.convertDateToTimeFromBackend(
                        historyItem.dateTimeFrom,
                        true
                    ),
                statusLength: !historyItem?.dateTimeTo
                    ? LoadDetailsItemStringEnum.ON_GOING
                    : `${
                          historyItem.wait?.days
                              ? historyItem.wait?.days +
                                LoadDetailsItemStringEnum.DAYS
                              : ''
                      } ${
                          historyItem.wait?.hours
                              ? historyItem.wait?.hours +
                                LoadDetailsItemStringEnum.HOURS
                              : ''
                      } ${
                          historyItem.wait?.minutes
                              ? historyItem.wait?.minutes +
                                LoadDetailsItemStringEnum.MINUTES
                              : ''
                      }`,
            };
        });
    }
}
