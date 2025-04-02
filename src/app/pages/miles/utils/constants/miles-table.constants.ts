// interface
import { ITableColumn } from '@shared/components/new-table/interface';

// models
import { MilesStopSortBy } from 'appcoretruckassist';

const checkbox: ITableColumn = {
    id: 1,
    key: 'select',
    label: '',
    width: 26,
    pinned: 'left',
};

const unit: ITableColumn = {
    id: 2,
    key: 'unit',
    label: 'Unit',
    width: 80,
    minWidth: 80,
    maxWidth: 200,
    hasSort: true,
    isResizable: true,
    sortName: MilesStopSortBy.UnitNumber,
};

const truckType: ITableColumn = {
    id: 3,
    key: 'truckType',
    label: 'Type',
    width: 64,
    minWidth: 64,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.UnitType,
};

const stopsCount: ITableColumn = {
    id: 4,
    key: 'stopsCount',
    label: 'Count',
    width: 62,
    minWidth: 62,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Count,
};

const stopsPickup: ITableColumn = {
    id: 5,
    key: 'stopsPickup',
    label: 'PICKUP',
    width: 90,
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Pickup,
};

const stopsDelivery: ITableColumn = {
    id: 6,
    key: 'stopsDelivery',
    label: 'DELIVERY',
    width: 90,
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Delivery,
};

const fuel: ITableColumn = {
    id: 7,
    key: 'fuelCount',
    label: 'FUEL',
    width: 90,
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Fuel,
};

const parking: ITableColumn = {
    id: 8,
    key: 'parkingCount',
    label: 'PARKING',
    width: 90,
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Parking,
};

const deadHead: ITableColumn = {
    id: 9,
    key: 'deadHeadCount',
    label: 'D-HEAD',
    width: 90,
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Deadhead,
};

const repair: ITableColumn = {
    id: 10,
    key: 'repairCount',
    label: 'REPAIR',
    width: 90,
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Repair,
};

const towing: ITableColumn = {
    id: 11,
    key: 'towingCount',
    label: 'TOWING',
    width: 90,
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Towing,
};

const loadCount: ITableColumn = {
    id: 12,
    key: 'loadCount',
    label: 'LOAD',
    width: 62,
    minWidth: 62,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.Load,
};

const fuelGalons: ITableColumn = {
    id: 13,
    key: 'fuelGalons',
    label: 'GAL',
    width: 62,
    minWidth: 62,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.FuelGallons,
};

const fuelCost: ITableColumn = {
    id: 14,
    key: 'fuelCost',
    label: 'Cost',
    width: 101,
    minWidth: 101,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.FuelCost,
};

const fuelMpg: ITableColumn = {
    id: 15,
    key: 'fuelMpg',
    label: 'MPG',
    width: 64,
    minWidth: 64,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
};

const fuelGroup = {
    key: 'fuel',
    label: 'Fuel',
    sort: false,
    columns: [fuelGalons, fuelCost, fuelMpg],
};

const milesLoaded: ITableColumn = {
    id: 16,
    key: 'milesLoaded',
    label: 'LOADED',
    width: 78,
    minWidth: 78,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.LoadedMiles,
};

const milesEmpty: ITableColumn = {
    id: 17,
    key: 'milesEmpty',
    label: 'EMPTY',
    width: 78,
    minWidth: 78,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.EmptyMiles,
};

const milesTotal: ITableColumn = {
    id: 18,
    key: 'milesTotal',
    label: 'TOTAL',
    width: 78,
    minWidth: 78,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
    sortName: MilesStopSortBy.TotalMiles,
};

const revenue: ITableColumn = {
    id: 19,
    key: 'revenue',
    label: 'revenue',
    width: 78,
    minWidth: 78,
    maxWidth: 200,
    isResizable: true,
    hasSort: true,
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
