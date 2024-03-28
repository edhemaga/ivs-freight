import { ByStateListItem } from '../../models/dashboard-by-state-models/by-state-list-item.model';
import { DashboardTab } from '../../models/dashboard-tab.model';
import { DropdownItem } from '../../models/dropdown-item.model';

export class DashboardByStateConstants {
    static BY_STATE_DROPDOWN_DATA: DropdownItem[] = [
        {
            name: 'Pickup',
            isActive: true,
            tab1: 'Count',
            tab2: 'Revenue',
        },
        {
            name: 'Delivery',
            isActive: false,
            tab1: 'Count',
            tab2: 'Revenue',
        },
        {
            name: 'Roadside',
            isActive: false,
            tab1: 'Count',
            tab2: 'SW',
        },
        {
            name: 'Violation',
            isActive: false,
            tab1: 'Count',
            tab2: 'SW',
        },
        {
            name: 'Accident',
            isActive: false,
            tab1: 'Count',
            tab2: 'SW',
        },
        {
            name: 'Repair',
            isActive: false,
            tab1: 'Count',
            tab2: 'Cost',
        },
        {
            name: 'Fuel',
            isActive: false,
            tab1: 'Gallon',
            tab2: 'Cost',
        },
    ];

    static BY_STATE_TABS: DashboardTab[] = [
        {
            name: 'Count',
            checked: true,
        },
        {
            name: 'Revenue',
            checked: false,
        },
    ];

    static BY_STATE_LIST: ByStateListItem[] = [];
}
