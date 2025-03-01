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

const truckType: ITableColumn = {
    key: 'truckType',
    label: 'Type',
    width: 64, 
};

const stopsCount: ITableColumn = {
    key: 'stopsCount',
    label: 'Count',
    width: 62, 
};

const stopsPickup: ITableColumn = {
    key: 'stopsPickup',
    label: 'PICKUP',
    width: 90, 
};

const stopsDelivery: ITableColumn = {
    key: 'stopsDelivery',
    label: 'DELIVERY',
    width: 90,
};

// Adding the new columns
const fuel: ITableColumn = {
    key: 'fuelCount',
    label: 'FUEL',
    width: 90,
};

const parking: ITableColumn = {
    key: 'parkingCount',
    label: 'PARKING',
    width: 90,
};

const deadHead: ITableColumn = {
    key: 'deadHeadCount',
    label: 'DEAD HEAD',
    width: 90,
};

const repair: ITableColumn = {
    key: 'repairCount',
    label: 'REPAIR',
    width: 90,
};

const towing: ITableColumn = {
    key: 'towingCount',
    label: 'TOWING',
    width: 90,
};

const loadCount: ITableColumn = {
    key: 'loadCount',
    label: 'LOAD',
    width: 62,
};

const fuelGalons: ITableColumn = {
    key: 'fuelGalons',
    label: 'GAL',
    width: 62,
};

const fuelCost: ITableColumn = {
    key: 'fuelCost',
    label: 'Cost',
    width: 101,
};

const fuelMpg: ITableColumn = {
    key: 'fuelMpg',
    label: 'MPG',
    width: 64,
};

const milesLoaded: ITableColumn = {
    key: 'milesLoaded',
    label: 'LOADED',
    width: 78,
};

const milesEmpty: ITableColumn = {
    key: 'milesEmpty',
    label: 'EMPTY',
    width: 78,
};

const milesTotal: ITableColumn = {
    key: 'milesTotal',
    label: 'TOTAL',
    width: 78,
};

const revenue: ITableColumn = {
    key: 'revenue',
    label: 'revenue',
    width: 78,
};

export const MilesTableColumns: ITableColumn[] = [
    checkbox,
    unit,
    truckType,
    stopsCount,
    stopsPickup,
    stopsDelivery,
    fuel,
    parking,
    deadHead,
    repair,
    towing,
    loadCount,
    fuelGalons,
    fuelCost,
    fuelMpg,
    milesLoaded,
    milesEmpty,
    milesTotal,
    revenue
];
