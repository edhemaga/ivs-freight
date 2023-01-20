import { Pipe, PipeTransform } from '@angular/core';
import * as CurrencyFormatter from 'currency-formatter';

@Pipe({
    name: 'priceCalculationArray',
})
export class PriceCalculationArraysPipe implements PipeTransform {
    transform(
        array: { id?: number; value?: number; reorderingNumber?: number }[],
        args?: any
    ): number {
        const options = { currency: 'USD' };

        return CurrencyFormatter.format(
            array.reduce((accumulator, item: any) => {
                return accumulator + parseFloat(item.value ? item.value : 0);
            }, 0),
            options
        );
    }
}
