import { DropdownListItem } from '../models/dropdown-list-item.model';
import { TopRatedDropdownItem } from '../models/top-rated-dropdown-item.model';
import { TopRatedTab } from '../models/top-rated-tab.model';

export class DashboardTopRatedConstants {
    static TOP_RATED_DROPDOWN_DATA: TopRatedDropdownItem[] = [
        {
            name: 'DISPATCHER',
            tab1: 'Load',
            tab2: 'Revenue',
        },
        {
            name: 'DRIVER',
            active: true,
            tab1: 'Mileage',
            tab2: 'Revenue',
        },
        {
            name: 'TRUCK',
            tab1: 'Mileage',
            tab2: 'Revenue',
        },
        {
            name: 'BROKER',
            tab1: 'Load',
            tab2: 'Revenue',
        },
        {
            name: 'SHIPPER',
            tab1: 'Load',
            tab2: 'Revenue',
        },
        {
            name: 'OWNER',
            tab1: 'Load',
            tab2: 'Revenue',
        },
        {
            name: 'REPAIR SHOP',
            tab1: 'Visit',
            tab2: 'Cost',
        },
        {
            name: 'FUEL STOP',
            tab1: 'Visit',
            tab2: 'Cost',
        },
    ];

    static TOP_RATED_TABS: TopRatedTab[] = [
        {
            name: 'Mileage',
        },
        {
            name: 'Revenue',
            checked: true,
        },
    ];

    static MAIN_PERIOD_DROPDOWN_DATA: DropdownListItem[] = [
        {
            id: 1,
            name: 'Today',
        },
        {
            id: 2,
            name: 'Week-to-Date',
        },
        {
            id: 3,
            name: 'Month-to-Date',
        },
        {
            id: 4,
            name: 'Year-to-Date',
        },
        {
            id: 5,
            name: 'All Time',
        },
        {
            id: 6,
            name: 'Custom',
        },
    ];

    static SUB_PERIOD_DROPDOWN_DATA: DropdownListItem[] = [
        {
            id: 1,
            name: 'Hourly',
        },
        {
            id: 2,
            name: '3 Hours',
        },
        {
            id: 3,
            name: '6 Hours',
        },
        {
            id: 4,
            name: 'Semi-Daily',
        },
        {
            id: 5,
            name: 'Daily',
        },
        {
            id: 6,
            name: 'Weekly',
        },
        {
            id: 7,
            name: 'Bi-Weekly',
        },
        {
            id: 8,
            name: 'Semi-Monthly',
        },
        {
            id: 9,
            name: 'Monthly',
        },
        {
            id: 10,
            name: 'Quarterly',
        },
        {
            id: 11,
            name: 'Yearly',
        },
    ];
}
