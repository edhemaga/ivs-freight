import { SortColumn } from 'ca-components';

export class FuelStopDetailsConstants {
    static VEHICLE_SORT_COLUMNS: SortColumn[] = [
        {
            name: 'Unit No.',
            sortName: 'unitNumber',
        },
        {
            name: 'Type',
            sortName: 'unitType',
        },
        {
            name: 'Count',
            sortName: 'repairs',
        },
        {
            name: 'Cost',
            sortName: 'cost',
        },
    ];
}
