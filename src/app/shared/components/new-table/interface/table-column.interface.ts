import { MilesStopSortBy, SortOrder } from 'appcoretruckassist';

export interface ITableColumn {
    id?: number;
    // This key is used to display data on frontend,
    // It will look for value on this key and show it
    key: string;
    // Width of column heading
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    // Text for column heading
    label: string;
    pinned?: 'left' | 'right';
    hasSort?: boolean;
    direction?: SortOrder | null;
    isPinEnabled?: boolean;
    isResizable?: boolean;
    columns?: ITableColumn[];
    sortName?: MilesStopSortBy;
}
