import { TopRatedListItem } from '../../models/dashboard-top-rated-models/top-rated-list-item.model';

export class DashboardArrayHelper {
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

    static findLargestNumberInArrayOfArrays(arr: number[][]) {
        let largestNumber = 0;

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j] > largestNumber) {
                    largestNumber = arr[i][j];
                }
            }
        }

        return largestNumber;
    }
}
