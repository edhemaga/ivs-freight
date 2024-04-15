import { Pipe, PipeTransform } from '@angular/core';

// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';

// constants
import { DashboardPerformanceConstants } from '@pages/dashboard/pages/dashboard-performance/utils/constants/dashboard-performance.constants';

@Pipe({
    name: 'setTrendIcon',
    standalone: true,
})
export class SetTrendIconPipe implements PipeTransform {
    transform(value: number, dataTitle: string): string {
        if (value > 0) {
            if (DashboardPerformanceConstants.TREND_LIST.includes(dataTitle)) {
                return DashboardStringEnum.TREND_UP_IMG;
            }

            if (
                DashboardPerformanceConstants.TREND_LIST_2.includes(dataTitle)
            ) {
                return DashboardStringEnum.TREND_UP_IMG_2;
            }
        }

        if (value < 0) {
            if (DashboardPerformanceConstants.TREND_LIST.includes(dataTitle)) {
                return DashboardStringEnum.TREND_DOWN_IMG;
            }

            if (
                DashboardPerformanceConstants.TREND_LIST_2.includes(dataTitle)
            ) {
                return DashboardStringEnum.TREND_DOWN_IMG_2;
            }
        }
    }
}
