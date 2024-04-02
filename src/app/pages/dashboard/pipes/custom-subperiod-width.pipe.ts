import { Pipe, PipeTransform } from '@angular/core';

// enums
import { DashboardStringEnum } from '../enums/dashboard-string.enum';

@Pipe({
    name: 'setCustomSubperiodWidth',
    standalone: true,
})
export class CustomSubperiodWidthPipe implements PipeTransform {
    transform(
        selectedSubPeriod: string,
        selectedDropdownWidthSubPeriod: string
    ): string {
        switch (selectedSubPeriod || selectedDropdownWidthSubPeriod) {
            case DashboardStringEnum.HOURLY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_1;
            case DashboardStringEnum.THREE_HOURS:
            case DashboardStringEnum.SIX_HOURS:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_2;
            case DashboardStringEnum.SEMI_DAILY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_3;
            case DashboardStringEnum.DAILY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_4;
            case DashboardStringEnum.WEEKLY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_5;
            case DashboardStringEnum.BI_WEEKLY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_6;
            case DashboardStringEnum.SEMI_MONTHLY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_7;
            case DashboardStringEnum.MONTHLY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_8;
            case DashboardStringEnum.QUARTERLY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_9;
            case DashboardStringEnum.YEARLY:
                return DashboardStringEnum.DROPDOWN_CLASS_WIDTH_10;
            default:
                return;
        }
    }
}
