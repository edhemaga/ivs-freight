import { MilesStopSortBy, SortOrder } from 'appcoretruckassist';

export interface ITableConfig {
    isTableLocked: boolean;
    sortKey: MilesStopSortBy;
    sortDirection: SortOrder;
}
