import { CardRows } from '../../../shared/model/cardData';
import { ModalModelData } from '../models/modal-input.model';

export class compareObjectsModal {
    static areArraysOfObjectsEqual(
        arr1: CardRows[],
        arr2: CardRows[]
    ): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (!this.areObjectsEqual(arr1[i], arr2[i])) return false;
        }

        return true;
    }

    static areObjectsEqual(obj1: CardRows, obj2: CardRows): boolean {
        if (!obj1 && !obj2) return true; // Both null, consider them equal

        if (!obj1 || !obj2) return false; // One is null, the other is not, they are not equal

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) if (obj1[key] !== obj2[key]) return false;

        return true;
    }

    static filterOutOBjects(
        obj: ModalModelData,
        filterType: string
    ): CardRows[] {
        const backKeys = Object.keys(obj).filter((key) =>
            key.startsWith(filterType)
        );

        return backKeys.map((key) => obj[key]);
    }
}
