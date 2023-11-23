import { Pipe, PipeTransform } from '@angular/core';

// enums
import { ConstantChartStringEnum } from '../../enums/constant-chart-string.enum';
import { ConstantStringEnum } from '../../enums/constant-string.enum';

@Pipe({
    name: 'addThousandSign',
    standalone: true,
})
export class FormatNumberToThousandDecimal implements PipeTransform {
    transform(value: number): string {
        if (+value) {
            if (value > 100000) {
                return (
                    (value / 1000).toFixed(1) +
                    ConstantChartStringEnum.THOUSAND_SIGN
                );
            } else {
                return value.toString();
            }
        } else {
            return ConstantStringEnum.ZERO_STRING;
        }
    }
}
