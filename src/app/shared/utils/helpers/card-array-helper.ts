import { Injectable } from '@angular/core';

// enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

// models
import { CardDetails } from '../../models/card-models/card-table-data.model';

@Injectable({
    providedIn: 'root',
})
export class CardArrayHelper {
    static objectsWithDropDown(obj: CardDetails, ObjKey: string): string {
        if (ObjKey === 'items') {
            const objWithItems = ObjKey.split(TableStringEnum.DOT_1).reduce(
                (acc, part) => acc && acc[part],
                obj
            );

            if (Array.isArray(objWithItems)) {
                const itemsHTML = objWithItems
                    .map((item, index) => {
                        item.description;
                        return index !== objWithItems.length - 1
                            ? `${item.description} • `
                            : `${item.description}`;
                    })
                    .join('');

                return itemsHTML;
            }
        }
        return '';
    }
}
