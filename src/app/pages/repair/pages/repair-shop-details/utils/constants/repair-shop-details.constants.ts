import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';
import { SortColumn } from 'ca-components';

export class RepairShopDetailsConstants {
    static MULTIPLE_SELECT_DETAILS_DROPDOWN: MultipleSelectDetailsDropdownItem[] =
        [
            {
                id: 1,
                title: 'Contact',
                length: null,
                isActive: true,
            },
            {
                id: 2,
                title: 'Review',
                length: null,
                isActive: false,
            },
        ];

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
