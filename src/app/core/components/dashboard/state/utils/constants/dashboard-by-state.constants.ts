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
            tab1: 'Price',
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

    static BY_STATE_LIST: ByStateListItem[] = [
        {
            id: 1,
            state: 'IL',
            value: '52',
            percent: '8.53',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 2,
            state: 'IN',
            value: '50',
            percent: '8.50',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 3,
            state: 'KY',
            value: '48',
            percent: '8.12',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 4,
            state: 'MO',
            value: '45',
            percent: '6.87',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 5,
            state: 'IA',
            value: '43',
            percent: '6.52',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 6,
            state: 'WI',
            value: '35',
            percent: '5.52',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 7,
            state: 'OH',
            value: '32',
            percent: '4.07',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 8,
            state: 'TN',
            value: '26',
            percent: '3.52',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 9,
            state: 'VA',
            value: '18',
            percent: '2.72',
            isSelected: false,
            selectedColor: null,
        },
        {
            id: 10,
            state: 'OK',
            value: '10',
            percent: '2.02',
            isSelected: false,
            selectedColor: null,
        } /* ,
        {
            id: 11,
            state: 'OK',
            value: '10',
            percent: '2.02',
            isSelected: false,
            selectedColor: null,
        }, */,
    ];
}
