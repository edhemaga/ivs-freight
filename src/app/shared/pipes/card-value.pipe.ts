import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cardValue',
    standalone: true,
})
export class CardValuePipe implements PipeTransform {
    transform(value: any, cardRow: any): string {
        //leave this as any becasus it's different model for each card
        if (!value || !cardRow) return '/';
        if (!value[cardRow.key]) return '/';
        else if (cardRow.thirdKey)
            return (
                value[cardRow.key][cardRow.secondKey]?.[cardRow.thirdKey] || '/'
            );
        else if (cardRow.secondKey)
            return value[cardRow.key][cardRow.secondKey] || '/';
        else if (value[cardRow.key]) return value[cardRow.key] || '/';
        else return '/';
    }
}
