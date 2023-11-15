import { Pipe, PipeTransform } from '@angular/core';
import { ConstantChartStringEnum } from '../../enums/constant-chart-string.enum';

@Pipe({
    name: 'thousandPipe',
    standalone: true,
})
export class ThousandPipe implements PipeTransform {
    transform(value: number): string {
        if (value && !isNaN(value)) {
            if (value > 100000) {
                return (
                    (value / 1000).toFixed(1) +
                    ConstantChartStringEnum.THOUSAND_SIGN
                );
            } else {
                return value.toString();
            }
        } else {
            return '';
        }
    }
}
