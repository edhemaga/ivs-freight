import { DropdownListItem } from '../models/dropdown-list-item.model';
import { TopRatedDropdownItem } from '../models/top-rated-dropdown-item.model';
import { DashboardTab } from '../models/dashboard-tab.model';

export class DashboardTopRatedConstants {
    static TOP_RATED_DROPDOWN_DATA: TopRatedDropdownItem[] = [
        {
            name: 'Dispatcher',
            isActive: false,
            tab1: 'Load',
            tab2: 'Revenue',
        },
        {
            name: 'Driver',
            isActive: true,
            tab1: 'Mileage',
            tab2: 'Revenue',
        },
        {
            name: 'Truck',
            isActive: false,
            tab1: 'Mileage',
            tab2: 'Revenue',
        },
        {
            name: 'Broker',
            isActive: false,
            tab1: 'Load',
            tab2: 'Revenue',
        },
        {
            name: 'Shipper',
            isActive: false,
            tab1: null,
            tab2: null,
        },
        {
            name: 'Owner',
            isActive: false,
            tab1: 'Load',
            tab2: 'Revenue',
        },
        {
            name: 'Repair Shop',
            isActive: false,
            tab1: 'Visit',
            tab2: 'Cost',
        },
        {
            name: 'Fuel Stop',
            isActive: false,
            tab1: 'Visit',
            tab2: 'Cost',
        },
    ];

    static TOP_RATED_TABS: DashboardTab[] = [
        {
            name: 'Mileage',
            checked: true,
        },
        {
            name: 'Revenue',
            checked: false,
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
            name: 'Quartal-to-Date',
        },
        {
            id: 5,
            name: 'Year-to-Date',
        },
        {
            id: 6,
            name: 'All Time',
        },
        {
            id: 7,
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
