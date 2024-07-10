import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'tableLoadStatusPipe',
})
export class TableLoadStatusPipe implements PipeTransform {
    transform(text: string, search: string): string {
        if (search === 'main') {
            if (
                text === 'Tonu' ||
                text === 'TonuShortPaid' ||
                text === 'TonuPaid'
            ) {
                console.log(text);
                return '#DF3C3C';
            } else {
                return '#424242';
            }
        } else if (search === 'main') {
            if (
                text === 'Invoiced' ||
                text === 'ShortPaid' ||
                text === 'Paid'
            ) {
                return '#9E47EC';
            } else {
                return '#919191';
            }
        } else if (search === 'decoration') {
            if (
                text === 'Tonu' ||
                text === 'TonuShortPaid' ||
                text === 'TonuPaid'
            ) {
                return 'line through';
            } else {
                return 'default';
            }
        }
    }
}
