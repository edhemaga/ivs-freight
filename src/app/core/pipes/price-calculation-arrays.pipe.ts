import { Pipe, PipeTransform } from '@angular/core';
import { convertNumberWithCurrencyFormatterToBackend } from '../utils/methods.calculations';

@Pipe({
    name: 'priceCalculationArray',
    standalone: true
})
export class PriceCalculationArraysPipe implements PipeTransform {
    transform(
        array: { id?: number; value?: number; reorderingNumber?: number }[]
    ): string {
        return convertNumberWithCurrencyFormatterToBackend(
            array.reduce((accumulator, item: any) => {
                return accumulator + parseFloat(item.value ? item.value : 0);
            }, 0),
            true
        );
    }
}
