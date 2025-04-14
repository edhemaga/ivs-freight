// interface
import { ITableColumn } from '@shared/components/new-table/interface';

// models
import { MilesStopSortBy } from 'appcoretruckassist';

//  for testing only !!!!!
const select: ITableColumn = {
    key: 'select',
    label: 'Select',
    labelToolbar: 'Select.',
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    pinned: 'left',
};

//  for testing only !!!!!
const edit: ITableColumn = {
    key: 'edit',
    label: 'Edit.',
    labelToolbar: 'Edit.',
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    pinned: 'left',
};

const loadNumber: ITableColumn = {
    key: 'loadNumber',
    label: 'Load No.',
    labelToolbar: 'Load No.',
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    pinned: 'left',
};

const status = {
    key: 'loadStatus',
    label: 'Status',
    width: 238,
    labelToolbar: 'Status',
    minWidth: 238,
    maxWidth: 238,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

export const LoadTableColumns: ITableColumn[] = [
    select,
    edit,
    loadNumber,
    status,
];
