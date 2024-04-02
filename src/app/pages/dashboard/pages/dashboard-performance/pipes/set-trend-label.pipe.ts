import { Pipe, PipeTransform } from '@angular/core';

// enums
import { DashboardStringEnum } from '../../../enums/dashboard-string.enum';

@Pipe({
    name: 'setTrendLabel',
    standalone: true,
})
export class SetTrendLabelPipe implements PipeTransform {
    transform(
        value: string,
        isHovered: boolean,
        selectedSubPeriod: string
    ): string {
        const subperiodToUpperCase = selectedSubPeriod.toUpperCase();

        if (!isHovered) {
            switch (value) {
                case DashboardStringEnum.TODAY:
                    return DashboardStringEnum.YESTERDAY;
                case DashboardStringEnum.WTD:
                    return DashboardStringEnum.LAST_WEEK;
                case DashboardStringEnum.MTD:
                    return DashboardStringEnum.LAST_MONTH;
                case DashboardStringEnum.QTD:
                    return DashboardStringEnum.LAST_QUARTAL;
                case DashboardStringEnum.YTD:
                    return DashboardStringEnum.LAST_PERIOD;
                default:
                    return subperiodToUpperCase + DashboardStringEnum.AVERAGE;
            }
        }

        if (isHovered) {
            switch (value) {
                case DashboardStringEnum.TODAY:
                    return DashboardStringEnum.DAILY_AVERAGE;
                case DashboardStringEnum.WTD:
                    return DashboardStringEnum.WEEKLY_AVERAGE;
                case DashboardStringEnum.MTD:
                    return DashboardStringEnum.MONTHLY_AVERAGE;
                case DashboardStringEnum.QTD:
                    return DashboardStringEnum.QUARTERLY_AVERAGE;
                case DashboardStringEnum.YTD:
                    return DashboardStringEnum.PERIOD_AVERAGE;
                default:
                    return subperiodToUpperCase + DashboardStringEnum.AVERAGE;
            }
        }
    }
}
