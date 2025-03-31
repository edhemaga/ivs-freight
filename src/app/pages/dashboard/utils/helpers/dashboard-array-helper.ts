export class DashboardArrayHelper {
    static sortPartOfArray<T extends { isSelected: boolean; id: number }>(
        arr: T[]
    ): T[] {
        // Slice the array into two parts: selected and not selected
        const beforeStart = arr.filter((item) => item.isSelected);
        const toSort = arr.filter((item) => !item.isSelected);

        // Sort the toSort portion of the array
        toSort.sort((a, b) => a.id - b.id);

        // Concatenate the sorted portion back
        const sortedArray = beforeStart.concat(toSort);

        return sortedArray;
    }

    static findLargestNumberInArrayOfArrays(arr: number[][]): number {
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
