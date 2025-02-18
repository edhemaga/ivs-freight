import { SortBy } from '@shared/types';
import { SortOrder } from 'appcoretruckassist';

export function getOrderAndSort(sortString: string): {
    sortBy: SortBy;
    order: SortOrder;
} {
    const order = sortString?.endsWith('Asc')
        ? SortOrder.Ascending
        : SortOrder.Descending;
    const sortBy = sortString?.replace(/(Asc|Desc)$/, '') as SortBy;
    return { sortBy, order };
}
