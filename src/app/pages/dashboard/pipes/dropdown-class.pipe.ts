import { Pipe, PipeTransform } from '@angular/core';

//enum
import { DropdownMainPeriodEnum } from '../enums';

//constants
import { DashboardConstants } from '../utils/constants';

@Pipe({
    name: 'dropdownMainPeriodClass',
    standalone: true,
})
export class DropdownClassPipe implements PipeTransform {
    transform(periodName: string): string {
        //TODO: Bogdan - implement this pipe also on topRated
        const classMapping: Record<DropdownMainPeriodEnum, string> = {
            [DropdownMainPeriodEnum.TODAY]: DashboardConstants.TODAY,
            [DropdownMainPeriodEnum.WEEK_TO_DATE]: DashboardConstants.WEEK_TO_DATE,
            [DropdownMainPeriodEnum.MONTH_TO_DATE]: DashboardConstants.MONTH_TO_DATE,
            [DropdownMainPeriodEnum.QUARTAL_TO_DATE]: DashboardConstants.QUARTAL_TO_DATE,
            [DropdownMainPeriodEnum.YEAR_TO_DATE]: DashboardConstants.YEAR_TO_DATE,
            [DropdownMainPeriodEnum.ALL_TIME]: DashboardConstants.ALL_TIME,
            [DropdownMainPeriodEnum.CUSTOM]: DashboardConstants.CUSTOM,
        };

        return classMapping[periodName];
    }
}