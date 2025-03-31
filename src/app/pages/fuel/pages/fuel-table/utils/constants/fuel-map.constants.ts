import { SortColumn } from 'ca-components';

export class FuelMapConstants {
    static FUEL_STOP_MAP_LIST_SORT_COLUMNS: SortColumn[] = [
        {
            name: 'Business Name',
            sortName: 'name',
        },
        {
            name: 'Location',
            sortName: 'location',
            isDisabled: true,
        },
        {
            name: 'Fuel Price',
            sortName: 'fuelPrice',
        },
        {
            name: 'Last Used Date',
            sortName: 'lastUsed',
        },
        {
            name: 'Purchase Count',
            sortName: 'transaction',
        },
        {
            name: 'Total Expense',
            sortName: 'totalCost',
        },
    ];
}
