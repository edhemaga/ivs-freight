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
        let cardValue = '/';

        if (value[cardRow.key]) {
            if (cardRow.thirdKey)
                cardValue =
                    value[cardRow.key][cardRow.secondKey]?.[cardRow.thirdKey] ||
                    '/';
            else if (cardRow.secondKey)
                cardValue = value[cardRow.key][cardRow.secondKey] || '/';
            else cardValue = value[cardRow.key] || '/';
        }

        if (cardValue !== '/' && cardValue) {
            if (cardRow.prefix)
                cardValue = `${cardRow.prefix}${cardValue}`;
            if (cardRow.sufix)
                cardValue = `${cardValue}${cardRow.sufix}`;
        }

        return cardValue;
    }
}
