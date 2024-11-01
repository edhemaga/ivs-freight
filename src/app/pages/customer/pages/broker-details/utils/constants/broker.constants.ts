// Models
import { LoadsSortDropdownModel } from '@pages/customer/models/loads-sort-dropdown.model';
import { MultipleSelectDetailsDropdownItem } from '@pages/load/pages/load-details/components/load-details-item/models/multiple-select-details-dropdown-item.model';

export class BrokerConstants {

    static MULTIPLE_SELECT_DETAILS_DROPDOWN: MultipleSelectDetailsDropdownItem[] =
        [
            {
                id: 4,
                title: 'All Load',
                length: null,
                isActive: true,
            },
            {
                id: 1,
                title: 'Pending',
                length: null,
                isActive: false,
                hideCount: true,
            },
            {
                id: 2,
                title: 'Active',
                length: null,
                isActive: false,
                hideCount: true,
            },
            {
                id: 3,
                title: 'Closed',
                length: null,
                isActive: false,
                hideCount: true,
            },
        ];

    static BROKER_LOADS_SORT_DROPDOWN: LoadsSortDropdownModel[] = [
        {
            id: 1,
            name: 'Load No.',
            sortName: 'loadNumber',
            active: true,
        },
        {
            id: 2,
            name: 'Ref #',
            sortName: 'referenceNumber',
        },
        {
            id: 3,
            name: 'Truck',
            sortName: 'truck',
        },
        {
            id: 4,
            name: 'Trailer',
            sortName: 'trailer',
        },
        {
            id: 5,
            name: 'Driver',
            sortName: 'driver',
        },
        {
            id: 6,
            name: 'Dispatcher',
            sortName: 'dispatcher',
        },
        {
            id: 7,
            name: 'Total Rate',
            sortName: 'totalRate',
        },
        {
            id: 8,
            name: 'Total Miles',
            sortName: 'totalMiles',
        },
    ];
}
