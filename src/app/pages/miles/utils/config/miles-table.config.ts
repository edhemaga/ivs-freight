import { ITableColumn } from '@shared/components/new-table/interface';

export class MilesTableColumnsConfig {
    static columnsConfig: ITableColumn[] = [
        {
            key: 'select',
            label: '',
            width: 26,
            pinned: 'left',
            isChecked: true,
        },
        {
            key: 'unit',
            label: 'Unit',
            labelToolbar: 'Unit No',
            width: 80,
            isDisabled: true,
            isChecked: true,
        },
        {
            key: 'truckType',
            label: 'Type',
            labelToolbar: 'Type',
            width: 64,
            isChecked: true,
        },
        {
            key: 'stops',
            label: 'Stop',
            labelToolbar: 'Stops',
            columns: [
                {
                    key: 'stopsCount',
                    label: 'Count',
                    labelToolbar: 'Count',
                    width: 62,
                    isChecked: true,
                },
                {
                    key: 'stopsPickup',
                    label: 'PICKUP',
                    labelToolbar: 'Pickup',
                    width: 90,
                    isChecked: true,
                },
                {
                    key: 'stopsDelivery',
                    label: 'DELIVERY',
                    labelToolbar: 'Delivery',
                    width: 90,
                    isChecked: true,
                },
                {
                    key: 'fuelCount',
                    label: 'FUEL',
                    labelToolbar: 'Fuel',
                    width: 90,
                    isChecked: true,
                },
                {
                    key: 'parkingCount',
                    label: 'PARKING',
                    labelToolbar: 'Parking',
                    width: 90,
                    isChecked: true,
                },
                {
                    key: 'deadHeadCount',
                    label: 'D-HEAD',
                    labelToolbar: 'Deadhead',
                    width: 90,
                    isChecked: true,
                },
                {
                    key: 'repairCount',
                    label: 'REPAIR',
                    labelToolbar: 'Repair',
                    width: 90,
                    isChecked: true,
                },
                {
                    key: 'towingCount',
                    label: 'TOWING',
                    labelToolbar: 'Towing',
                    width: 90,
                    isChecked: true,
                },
            ],
        },
        {
            key: 'load',
            label: '',
            columns: [
                {
                    key: 'loadCount',
                    label: 'LOAD',
                    labelToolbar: 'Load',
                    width: 62,
                    isChecked: true,
                },
            ],
        },
        {
            key: 'fuel',
            label: 'Fuel',
            labelToolbar: 'Fuel',
            columns: [
                {
                    key: 'fuelGalons',
                    label: 'GAL',
                    labelToolbar: 'Gallon',
                    width: 62,
                    isChecked: true,
                },
                {
                    key: 'fuelCost',
                    label: 'Cost',
                    labelToolbar: 'Cost',
                    width: 101,
                    isChecked: false,
                },
                {
                    key: 'fuelMpg',
                    label: 'MPG',
                    labelToolbar: 'MPG',
                    width: 64,
                    isChecked: true,
                },
            ],
        },
        {
            key: 'miles',
            label: 'Miles',
            labelToolbar: 'Miles',
            columns: [
                {
                    key: 'milesLoaded',
                    label: 'LOADED',
                    labelToolbar: 'Loaded',
                    width: 78,
                    isChecked: true,
                },
                {
                    key: 'milesEmpty',
                    label: 'EMPTY',
                    labelToolbar: 'Empty',
                    width: 78,
                    isChecked: true,
                },
                {
                    key: 'milesTotal',
                    label: 'TOTAL',
                    labelToolbar: 'Total',
                    width: 78,
                    isChecked: true,
                },
            ],
        },
        {
            key: 'revenueGroup',
            label: '',
            columns: [
                {
                    key: 'revenue',
                    label: 'revenue',
                    labelToolbar: 'Revenue',
                    width: 78,
                    isChecked: false,
                },
            ],
        },
    ];
}
