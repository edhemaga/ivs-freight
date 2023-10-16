import { TopRatedListItem } from '../models/top-rated-list-item.model';

export class ArrayHelper {
    static sortArrayFromIndex(arr: TopRatedListItem[], startIndex: number) {
        // Handle invalid startIndex
        if (startIndex < 0 || startIndex >= arr.length) {
            return arr;
        }

        // Create a sub-array starting from the desired index
        const subArray = arr.slice(startIndex);

        // Sort the sub-array
        subArray.sort(
            (a: TopRatedListItem, b: TopRatedListItem) => a.id - b.id
        );

        // Replace the sorted sub-array in the original array
        for (let i = startIndex, j = 0; i < arr.length; i++, j++) {
            arr[i] = subArray[j];
        }

        return arr;
    }
}
