import { ITableColumn } from '@shared/components/new-table/interface';

const checkbox: ITableColumn = {
    key: 'select',
    label: '',
    width: 26,
    pinned: 'left',
};

const unit: ITableColumn = {
    key: 'unit',
    label: 'Unit',
    labelToolbar: 'Unit No',
    width: 80,
    isDisabled: true,
};

const truckType: ITableColumn = {
    key: 'truckType',
    label: 'Type',
    labelToolbar: 'Type',
    width: 64,
    isChecked: true,
};

const stopsCount: ITableColumn = {
    key: 'stopsCount',
    label: 'Count',
    labelToolbar: 'Count',
    width: 62,
    isChecked: true,
};

const stopsPickup: ITableColumn = {
    key: 'stopsPickup',
    label: 'PICKUP',
    labelToolbar: 'Pickup',
    width: 90,
    isChecked: true,
};

const stopsDelivery: ITableColumn = {
    key: 'stopsDelivery',
    label: 'DELIVERY',
    labelToolbar: 'Delivery',
    width: 90,
    isChecked: true,
};

// Adding the new columns
const fuel: ITableColumn = {
    key: 'fuelCount',
    label: 'FUEL',
    labelToolbar: 'Fuel',
    width: 90,
    isChecked: true,
};

const parking: ITableColumn = {
    key: 'parkingCount',
    label: 'PARKING',
    labelToolbar: 'Parking',
    width: 90,
    isChecked: true,
};

const deadHead: ITableColumn = {
    key: 'deadHeadCount',
    label: 'D-HEAD',
    labelToolbar: 'Deadhead',
    width: 90,
    isChecked: true,
};

const repair: ITableColumn = {
    key: 'repairCount',
    label: 'REPAIR',
    labelToolbar: 'Repair',
    width: 90,
    isChecked: true,
};

const towing: ITableColumn = {
    key: 'towingCount',
    label: 'TOWING',
    labelToolbar: 'Towing',
    width: 90,
    isChecked: true,
};

const loadCount: ITableColumn = {
    key: 'loadCount',
    label: 'LOAD',
    labelToolbar: 'Load',
    width: 62,
    isChecked: true,
};

const fuelGalons: ITableColumn = {
    key: 'fuelGalons',
    label: 'GAL',
    labelToolbar: 'Gallon',
    width: 62,
    isChecked: true,
};

const fuelCost: ITableColumn = {
    key: 'fuelCost',
    label: 'Cost',
    labelToolbar: 'Cost',
    width: 101,
    isChecked: false,
};

const fuelMpg: ITableColumn = {
    key: 'fuelMpg',
    label: 'MPG',
    labelToolbar: 'MPG',
    width: 64,
    isChecked: true,
};

const fuelGroup = {
    key: 'fuel',
    label: 'Fuel',
    labelToolbar: 'Fuel',
    columns: [fuelGalons, fuelCost, fuelMpg],
};

const milesLoaded: ITableColumn = {
    key: 'milesLoaded',
    label: 'LOADED',
    labelToolbar: 'Loaded',
    width: 78,
    isChecked: true,
};

const milesEmpty: ITableColumn = {
    key: 'milesEmpty',
    label: 'EMPTY',
    labelToolbar: 'Empty',
    width: 78,
    isChecked: true,
};

const milesTotal: ITableColumn = {
    key: 'milesTotal',
    label: 'TOTAL',
    labelToolbar: 'Total',
    width: 78,
    isChecked: true,
};

const revenue: ITableColumn = {
    key: 'revenue',
    label: 'revenue',
    labelToolbar: 'Revenue',
    width: 78,
    isChecked: false,
};

const dateDeactivated: ITableColumn = {
    key: 'dateDeactivated',
    label: 'Date Deactivated',
    labelToolbar: 'Date Deactivated',
    isChecked: false,
};

const milesGroup = {
    key: 'miles',
    label: 'Miles',
    labelToolbar: 'Miles',
    columns: [milesLoaded, milesEmpty, milesTotal],
};

const stops = {
    key: 'stops',
    label: 'Stop',
    labelToolbar: 'Stops',
    columns: [
        stopsCount,
        stopsPickup,
        stopsDelivery,
        fuel,
        parking,
        deadHead,
        repair,
        towing,
    ],
};

const loadGroup = {
    key: 'load',
    label: '',
    columns: [loadCount],
};

const revenueGroup = {
    key: 'revenueGroup',
    label: '',
    columns: [revenue],
};

export const MilesTableColumns: ITableColumn[] = [
    checkbox,
    unit,
    truckType,
    stops,
    loadGroup,
    fuelGroup,
    milesGroup,
    revenueGroup,
];

export const MilesTableToolbarColumns: ITableColumn[] = [
    unit,
    truckType,
    stops,
    loadCount,
    fuelGroup,
    milesGroup,
    revenue,
    dateDeactivated,
];
