import { Pipe, PipeTransform } from '@angular/core';

import { LastFuelPriceProgressHelper } from 'ca-components';

@Pipe({
    name: 'lastFuelPriceRangeClassColor',
    standalone: true,
})
export class LastFuelPriceRangeClassColorPipe implements PipeTransform {
    transform(lastFuelPriceData: {
        minValue: number;
        maxValue: number;
        totalValue: number;
        isOutdated?: boolean;
    }): string {
        const { minValue, maxValue, totalValue, isOutdated } =
            lastFuelPriceData;

        return LastFuelPriceProgressHelper.getSvgClassFromValue(
            minValue,
            maxValue,
            totalValue
            /*  isOutdated */
        );
    }
}
