import { Pipe, PipeTransform } from '@angular/core';

// enums
import { ConstantStringEnum } from '../../enums/constant-string.enum';

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
            case ConstantStringEnum.HOURLY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_1;
            case ConstantStringEnum.THREE_HOURS:
            case ConstantStringEnum.SIX_HOURS:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_2;
            case ConstantStringEnum.SEMI_DAILY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_3;
            case ConstantStringEnum.DAILY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_4;
            case ConstantStringEnum.WEEKLY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_5;
            case ConstantStringEnum.BI_WEEKLY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_6;
            case ConstantStringEnum.SEMI_MONTHLY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_7;
            case ConstantStringEnum.MONTHLY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_8;
            case ConstantStringEnum.QUARTERLY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_9;
            case ConstantStringEnum.YEARLY:
                return ConstantStringEnum.DROPDOWN_CLASS_WIDTH_10;
            default:
                return;
        }
    }
}
