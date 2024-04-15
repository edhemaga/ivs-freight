import { Pipe, PipeTransform } from '@angular/core';

import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

@Pipe({
    name: 'priceCalculationArray',
    standalone: true,
})
export class PriceCalculationArrayPipe implements PipeTransform {
    transform(
        array: { id?: number; value?: number; reorderingNumber?: number }[]
    ): string {
        return MethodsCalculationsHelper.convertNumberWithCurrencyFormatterToBackend(
            array.reduce((accumulator, item: any) => {
                return accumulator + parseFloat(item.value ? item.value : 0);
            }, 0),
            true
        );
    }
}
