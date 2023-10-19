import { TopRatedListItem } from '../models/top-rated-list-item.model';

export class ArrayHelper {
    static sorPartOfArray(arr: TopRatedListItem[]) {
        // Slice the array into two parts: selected and not selected
        const beforeStart = arr.filter((item) => item.isSelected);
        const toSort = arr.filter((item) => !item.isSelected);

        // Sort the toSort portion of the array
        toSort.sort((a: TopRatedListItem, b: TopRatedListItem) => a.id - b.id);

        // Concatenate the sorted portion back
        const sortedArray = beforeStart.concat(toSort);

        return sortedArray;
    }
}
