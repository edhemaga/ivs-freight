import { RepairShopResponse } from 'appcoretruckassist';

export class RepairShopDetailsCardHelper {
    static sortByPinnedAndFavorite(
        repairShopDropdownList: RepairShopResponse[]
    ): RepairShopResponse[] {
        const sortedList = repairShopDropdownList.sort(
            (currentItem, nextItem) => {
                // move items with `status = 0` to the end, regardless of `pinned`
                if (!currentItem.status && nextItem.status) return 1;
                if (!nextItem.status && currentItem.status) return -1;

                // wthin items that do not have `status = 0`, prioritize `pinned` items
                if (nextItem.pinned !== currentItem.pinned)
                    return Number(nextItem.pinned) - Number(currentItem.pinned);

                // keep original order for items with the same `pinned` and `status`
                return 0;
            }
        );

        return sortedList;
    }
}
