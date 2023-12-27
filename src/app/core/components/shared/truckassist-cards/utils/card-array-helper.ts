import { Injectable } from '@angular/core';

// Enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

// Models
import { CardDetails } from '../../model/cardTableData';

@Injectable({
    providedIn: 'root',
})
export class CardArrayHelper {
    static getValueByStringPath(obj: CardDetails, ObjKey: string): string {
        if (ObjKey === ConstantStringTableComponentsEnum.NO_ENDPOINT)
            return ConstantStringTableComponentsEnum.NO_ENDPOINT_2;

        // Value is obj key
        const value = obj[ObjKey];

        const isValueOfKey = !ObjKey.split(
            ConstantStringTableComponentsEnum.DOT_1
        ).reduce((acc, part) => acc && acc[part], obj);

        const isNotZeroValueOfKey =
            ObjKey.split(ConstantStringTableComponentsEnum.DOT_1).reduce(
                (acc, part) => acc && acc[part],
                obj
            ) !== 0;

        //Check if value is null return / and if it is 0 return expired
        if (isValueOfKey && isNotZeroValueOfKey)
            return ConstantStringTableComponentsEnum.SLASH;

        // Transform number to descimal with $ and transform date

        return ObjKey.split(ConstantStringTableComponentsEnum.DOT_1).reduce(
            (acc, part) => acc && acc[part],
            obj
        );
    }

    static objectsWithDropDown(obj: CardDetails, ObjKey: string): string {
        if (ObjKey === 'items') {
            const objWithItems = ObjKey.split(
                ConstantStringTableComponentsEnum.DOT_1
            ).reduce((acc, part) => acc && acc[part], obj);

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
