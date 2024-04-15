import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatCurrency',
    standalone: true,
})
export class FormatCurrencyPipe implements PipeTransform {
    transform(currency: any) {
        if (currency) {
            return (
                '$' +
                currency.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
            );
        } else {
            return '$' + 0;
        }
    }
}
