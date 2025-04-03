// interface
import { ITableColumn } from '@shared/components/new-table/interface';

// models
import { MilesStopSortBy } from 'appcoretruckassist';

const checkbox: ITableColumn = {
    key: 'select',
    label: '',
    width: 26,
    pinned: 'left',
};

const loadNumber: ITableColumn = {
    key: 'loadNumber',
    label: 'Load No.',
    width: 120,
    pinned: 'left',
};

const refNumber: ITableColumn = {
    key: 'referenceNumber',
    label: 'REF NO',
    width: 108,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const dispatcher: ITableColumn = {
    key: 'dispatcher',
    label: 'Dispatcher',
    width: 208,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const businessName = {
    key: 'loadBroker',
    label: 'businessName',
    width: 238,
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
    width: 238,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const trailer = {
    key: 'tableAssignedUnitTrailer',
    label: 'Trailer',
    width: 238,
    hasSort: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const assignedGroup: ITableColumn = {
    key: 'brokerGroup',
    label: 'business name',
    hasSort: false,
    columns: [truck, trailer, driver],
};

const status = {
    key: 'loadStatus',
    label: 'Status',
    width: 238,
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
