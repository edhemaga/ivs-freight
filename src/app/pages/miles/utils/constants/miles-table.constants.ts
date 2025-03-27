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
    width: 80,
    sort: true,
};

const truckType: ITableColumn = {
    key: 'truckType',
    label: 'Type',
    width: 64,
    sort: true,
};

const stopsCount: ITableColumn = {
    key: 'stopsCount',
    label: 'Count',
    width: 62,
    sort: true,
};

const stopsPickup: ITableColumn = {
    key: 'stopsPickup',
    label: 'PICKUP',
    width: 90,
    sort: true,
};

const stopsDelivery: ITableColumn = {
    key: 'stopsDelivery',
    label: 'DELIVERY',
    width: 90,
    sort: true,
};

// Adding the new columns
const fuel: ITableColumn = {
    key: 'fuelCount',
    label: 'FUEL',
    width: 90,
    sort: true,
};

const parking: ITableColumn = {
    key: 'parkingCount',
    label: 'PARKING',
    width: 90,
    sort: true,
};

const deadHead: ITableColumn = {
    key: 'deadHeadCount',
    label: 'D-HEAD',
    width: 90,
    sort: true,
};

const repair: ITableColumn = {
    key: 'repairCount',
    label: 'REPAIR',
    width: 90,
    sort: true,
};

const towing: ITableColumn = {
    key: 'towingCount',
    label: 'TOWING',
    width: 90,
    sort: true,
};

const loadCount: ITableColumn = {
    key: 'loadCount',
    label: 'LOAD',
    width: 62,
    sort: true,
};

const fuelGalons: ITableColumn = {
    key: 'fuelGalons',
    label: 'GAL',
    width: 62,
    sort: true,
};

const fuelCost: ITableColumn = {
    key: 'fuelCost',
    label: 'Cost',
    width: 101,
    sort: true,
};

const fuelMpg: ITableColumn = {
    key: 'fuelMpg',
    label: 'MPG',
    width: 64,
    sort: true,
};

const fuelGroup = {
    key: 'fuel',
    label: 'Fuel',
    sort: false,
    columns: [fuelGalons, fuelCost, fuelMpg],
};

const milesLoaded: ITableColumn = {
    key: 'milesLoaded',
    label: 'LOADED',
    width: 78,
    sort: false,
};

const milesEmpty: ITableColumn = {
    key: 'milesEmpty',
    label: 'EMPTY',
    width: 78,
    sort: false,
};

const milesTotal: ITableColumn = {
    key: 'milesTotal',
    label: 'TOTAL',
    width: 78,
    sort: false,
};

const revenue: ITableColumn = {
    key: 'revenue',
    label: 'revenue',
    width: 78,
    sort: false,
};

const milesGroup = {
    key: 'miles',
    label: 'Miles',
    sort: false,
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
