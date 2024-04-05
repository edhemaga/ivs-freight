import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'moneyFilter',
    standalone: true,
})
export class MoneyFilterPipe implements PipeTransform {
    transform(input: number) {
        if (input >= 1000000) {
            return '$' + (input / 1000000).toFixed(2) + 'M';
        } else if (input >= 100000) {
            return '$' + (input / 1000).toFixed(2) + 'K';
        } else {
            return (
                '$' +
                input.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
            );
        }
    }
}
