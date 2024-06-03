import { Pipe, PipeTransform } from '@angular/core';

//Models
import { CardDataRow } from '@shared/models/card-models/card-data-row.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';

@Pipe({
    name: 'cardValue',
    standalone: true,
})
export class CardValuePipe implements PipeTransform {
    transform(value: CardRows, cardRow: CardDataRow): string {
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
