import { ITableColumn } from '@shared/models';

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
    isDisabled: true,
};

const truckType: ITableColumn = {
    key: 'truckType',
    label: 'Type',
    width: 64,
    isChecked: true,
};

const stopsCount: ITableColumn = {
    key: 'stopsCount',
    label: 'Count',
    width: 62,
    isChecked: true,
};

const stopsPickup: ITableColumn = {
    key: 'stopsPickup',
    label: 'PICKUP',
    width: 90,
    isChecked: true,
};

const stopsDelivery: ITableColumn = {
    key: 'stopsDelivery',
    label: 'DELIVERY',
    width: 90,
    isChecked: true,
};

// Adding the new columns
const fuel: ITableColumn = {
    key: 'fuelCount',
    label: 'FUEL',
    width: 90,
    isChecked: true,
};

const parking: ITableColumn = {
    key: 'parkingCount',
    label: 'PARKING',
    width: 90,
    isChecked: true,
};

const deadHead: ITableColumn = {
    key: 'deadHeadCount',
    label: 'D-HEAD',
    width: 90,
    isChecked: true,
};

const repair: ITableColumn = {
    key: 'repairCount',
    label: 'REPAIR',
    width: 90,
    isChecked: true,
};

const towing: ITableColumn = {
    key: 'towingCount',
    label: 'TOWING',
    width: 90,
    isChecked: true,
};

const loadCount: ITableColumn = {
    key: 'loadCount',
    label: 'LOAD',
    width: 62,
    isChecked: true,
};

const fuelGalons: ITableColumn = {
    key: 'fuelGalons',
    label: 'GAL',
    width: 62,
    isChecked: true,
};

const fuelCost: ITableColumn = {
    key: 'fuelCost',
    label: 'Cost',
    width: 101,
    isChecked: false,
};

const fuelMpg: ITableColumn = {
    key: 'fuelMpg',
    label: 'MPG',
    width: 64,
    isChecked: true,
};

const fuelGroup = {
    key: 'fuel',
    label: 'Fuel',
    columns: [fuelGalons, fuelCost, fuelMpg],
};

const milesLoaded: ITableColumn = {
    key: 'milesLoaded',
    label: 'LOADED',
    width: 78,
    isChecked: true,
};

const milesEmpty: ITableColumn = {
    key: 'milesEmpty',
    label: 'EMPTY',
    width: 78,
    isChecked: true,
};

const milesTotal: ITableColumn = {
    key: 'milesTotal',
    label: 'TOTAL',
    width: 78,
    isChecked: true,
};

const revenue: ITableColumn = {
    key: 'revenue',
    label: 'revenue',
    width: 78,
    isChecked: false,
};

const milesGroup = {
    key: 'miles',
    label: 'Miles',
    columns: [milesLoaded, milesEmpty, milesTotal],
};

const stops = {
    key: 'stops',
    label: 'Stop',
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
