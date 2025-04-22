import { Injectable } from '@angular/core';

// interfaces
import { ICardValueData } from '@shared/interfaces';

@Injectable({
    providedIn: 'root',
})
export class CardDefaultValuesHelper {
    static extractCardValuesByTitles(
        data: ICardValueData[],
        targetTitles: string[]
    ): ICardValueData[] {
        const result: ICardValueData[] = [];

        for (const item of data) {
            if (item.isDropdown && item.values) {
                const matchingChildren =
                    CardDefaultValuesHelper.extractCardValuesByTitles(
                        item.values,
                        targetTitles
                    );
                result.push(...matchingChildren);
            } else if (targetTitles.includes(item.title)) {
                result.push(item);
            }
        }

        return result;
    }
}
