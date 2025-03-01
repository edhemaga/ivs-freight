import { ITableColumn } from "@shared/models";

const checkbox: ITableColumn = {
    key: 'select',
    label: '',
    width: 26,
    pinned: 'left',
};

const unit: ITableColumn = {
    key: 'unit',
    label: 'Unit',
    width: 80, 
};


export const MilesTableColumns: ITableColumn[] = [
    checkbox,
    unit,
];
