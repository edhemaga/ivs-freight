import { ITableColumn } from '@shared/components/new-table/interface';
import { MilesStopSortBy } from 'appcoretruckassist';

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
    sortName: MilesStopSortBy.UnitNumber,
};

const truckType: ITableColumn = {
    key: 'truckType',
    label: 'Type',
    width: 64,
    sort: true,
    sortName: MilesStopSortBy.UnitType,
};

const stopsCount: ITableColumn = {
    key: 'stopsCount',
    label: 'Count',
    width: 62,
    sort: true,
    sortName: MilesStopSortBy.Count,
};

const stopsPickup: ITableColumn = {
    key: 'stopsPickup',
    label: 'PICKUP',
    width: 90,
    sort: true,
    sortName: MilesStopSortBy.Pickup,
};

const stopsDelivery: ITableColumn = {
    key: 'stopsDelivery',
    label: 'DELIVERY',
    width: 90,
    sort: true,
    sortName: MilesStopSortBy.Delivery,
};

const fuel: ITableColumn = {
    key: 'fuelCount',
    label: 'FUEL',
    width: 90,
    sort: true,
    sortName: MilesStopSortBy.Fuel,
};

const parking: ITableColumn = {
    key: 'parkingCount',
    label: 'PARKING',
    width: 90,
    sort: true,
    sortName: MilesStopSortBy.Parking,
};

const deadHead: ITableColumn = {
    key: 'deadHeadCount',
    label: 'D-HEAD',
    width: 90,
    sort: true,
    sortName: MilesStopSortBy.Deadhead,
};

const repair: ITableColumn = {
    key: 'repairCount',
    label: 'REPAIR',
    width: 90,
    sort: true,
    sortName: MilesStopSortBy.Repair,
};

const towing: ITableColumn = {
    key: 'towingCount',
    label: 'TOWING',
    width: 90,
    sort: true,
    sortName: MilesStopSortBy.Towing,
};

const loadCount: ITableColumn = {
    key: 'loadCount',
    label: 'LOAD',
    width: 62,
    sort: true,
    sortName: MilesStopSortBy.Load,
};

const fuelGalons: ITableColumn = {
    key: 'fuelGalons',
    label: 'GAL',
    width: 62,
    sort: true,
    sortName: MilesStopSortBy.FuelGallons,
};

const fuelCost: ITableColumn = {
    key: 'fuelCost',
    label: 'Cost',
    width: 101,
    sort: true,
    sortName: MilesStopSortBy.FuelCost,
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
    sort: true,
    sortName: MilesStopSortBy.LoadedMiles,
};

const milesEmpty: ITableColumn = {
    key: 'milesEmpty',
    label: 'EMPTY',
    width: 78,
    sort: true,
    sortName: MilesStopSortBy.EmptyMiles,
};

const milesTotal: ITableColumn = {
    key: 'milesTotal',
    label: 'TOTAL',
    width: 78,
    sort: true,
    sortName: MilesStopSortBy.TotalMiles,
};

const revenue: ITableColumn = {
    key: 'revenue',
    label: 'revenue',
    width: 78,
    sort: true,
    sortName: MilesStopSortBy.Revenue,
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
