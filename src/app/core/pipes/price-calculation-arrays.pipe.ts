import { Pipe, PipeTransform } from '@angular/core';
import { convertNumberWithCurrencyFormatterToBackend } from '../utils/methods.calculations';

@Pipe({
    name: 'priceCalculationArray',
})
export class PriceCalculationArraysPipe implements PipeTransform {
    transform(
        array:
            | { id?: number; value?: number; reorderingNumber?: number }[]
            | any
    ): number {
        if (array.length) {
            array = array.map((item) =>
                isNaN(item.value) || !item.value ? 0 : item.value
            );
            const formatted = convertNumberWithCurrencyFormatterToBackend(
                array.reduce((accumulator, item) => {
                    return accumulator + item;
                }, 0)
            );

            return formatted ? parseFloat(formatted) : 0;
        } else {
            const number = convertNumberWithCurrencyFormatterToBackend(array);
            return isNaN(array) || !array ? 0 : parseFloat(number);
        }
    }
}
