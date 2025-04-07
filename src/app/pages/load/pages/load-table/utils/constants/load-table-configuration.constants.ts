// interface
import { ITableColumn } from '@shared/components/new-table/interface';

// models
import { MilesStopSortBy } from 'appcoretruckassist';

const checkbox: ITableColumn = {
    key: 'select',
    label: '',
    pinned: 'left',
    labelToolbar: 'Load No.',
    width: 80,
    minWidth: 80,
    maxWidth: 200,
    isResizable: true,
    isDisabled: true,
    isChecked: true,
    hasSort: true,
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

const refNumber: ITableColumn = {
    key: 'referenceNumber',
    label: 'REF NO',
    labelToolbar: 'REF NO',
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const dispatcher: ITableColumn = {
    key: 'dispatcher',
    label: 'Dispatcher',
    labelToolbar: 'Dispatcher',
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const businessName = {
    key: 'loadBroker',
    label: 'businessName',
    labelToolbar: 'businessName',
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const brokerGroup: ITableColumn = {
    key: 'broker',
    label: 'Broker',
    hasSort: false,
    columns: [businessName],
};

const driver = {
    key: 'tableDriver',
    label: 'Driver',
    width: 238,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const truck = {
    key: 'tableAssignedUnitTruck',
    label: 'Truck',
    labelToolbar: 'Truck',
    width: 238,
    minWidth: 238,
    maxWidth: 238,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const trailer = {
    key: 'tableAssignedUnitTrailer',
    label: 'Trailer',
    width: 238,
    labelToolbar: 'Trailer',
    minWidth: 238,
    maxWidth: 238,
    isResizable: true,
    isChecked: true,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const assignedGroup: ITableColumn = {
    key: 'brokerGroup',
    label: 'business name',
    labelToolbar: 'business namne',
    hasSort: false,
    columns: [truck, trailer, driver],
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
    checkbox,
    loadNumber,
    refNumber,
    dispatcher,
    brokerGroup,
    assignedGroup,
    status,
];
