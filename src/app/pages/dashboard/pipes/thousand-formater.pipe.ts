import { Pipe, PipeTransform } from '@angular/core';

// enums
import { DashboardChartStringEnum } from '@pages/dashboard/enums/dashboard-chart-string.enum';
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';

@Pipe({
    name: 'addThousandSign',
    standalone: true,
})
export class ThousandFormatterPipe implements PipeTransform {
    transform(value: number): string {
        if (+value) {
            if (value > 1000) {
                return (
                    (value / 1000).toFixed(1) +
                    DashboardChartStringEnum.THOUSAND_SIGN
                );
            } else {
                return value.toString();
            }
        } else {
            return DashboardStringEnum.ZERO_STRING;
        }
    }
}
