import { Pipe, PipeTransform } from '@angular/core';

// enums
import { ConstantStringEnum } from '../../enums/constant-string.enum';

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
                case ConstantStringEnum.TODAY:
                    return ConstantStringEnum.YESTERDAY;
                case ConstantStringEnum.WTD:
                    return ConstantStringEnum.LAST_WEEK;
                case ConstantStringEnum.MTD:
                    return ConstantStringEnum.LAST_MONTH;
                case ConstantStringEnum.QTD:
                    return ConstantStringEnum.LAST_QUARTAL;
                case ConstantStringEnum.YTD:
                    return ConstantStringEnum.LAST_PERIOD;
                default:
                    return subperiodToUpperCase + ConstantStringEnum.AVERAGE;
            }
        }

        if (isHovered) {
            switch (value) {
                case ConstantStringEnum.TODAY:
                    return ConstantStringEnum.DAILY_AVERAGE;
                case ConstantStringEnum.WTD:
                    return ConstantStringEnum.WEEKLY_AVERAGE;
                case ConstantStringEnum.MTD:
                    return ConstantStringEnum.MONTHLY_AVERAGE;
                case ConstantStringEnum.QTD:
                    return ConstantStringEnum.QUARTERLY_AVERAGE;
                case ConstantStringEnum.YTD:
                    return ConstantStringEnum.PERIOD_AVERAGE;
                default:
                    return subperiodToUpperCase + ConstantStringEnum.AVERAGE;
            }
        }
    }
}
