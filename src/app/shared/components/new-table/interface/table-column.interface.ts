import { SortOrder } from 'appcoretruckassist';

export interface ITableColumn {
    // This key is used to display data on frontend,
    // It will look for value on this key and show it
    key: string;
    // Width of column heading
    width?: number;
    // Text for column heading
    label: string;
    pinned?: 'left' | 'right';
    sort?: string;
    direction?: SortOrder | null;
    isPinEnabled?: boolean;
    columns?: ITableColumn[];
    isDisabled?: boolean;
    isChecked?: boolean;
    labelToolbar?: string;
}
