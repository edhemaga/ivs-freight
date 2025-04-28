import { SortOrder } from 'appcoretruckassist';

export interface ITableConfig {
    isTableLocked: boolean;
    sortKey: string;
    sortDirection: SortOrder;
    label: string;
}
