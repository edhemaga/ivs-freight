import { LoadSortBy, RepairShopSortBy, RepairSortBy, SortOrder } from "appcoretruckassist";
type SortBy = RepairSortBy | LoadSortBy | RepairShopSortBy;
export function getOrderAndSort(sortString: string): {
    sortBy: SortBy;
    order: SortOrder;
} {
    let order = null;
    let sortBy = null;
    if (sortString?.endsWith('Asc')) {
        order = SortOrder.Ascending;
        sortBy = sortString.replace(/Asc$/, '');
    } else {
        order = SortOrder.Descending;
        sortBy = sortString?.replace(/Desc$/, '');
    }
    return { sortBy: sortBy, order };
}