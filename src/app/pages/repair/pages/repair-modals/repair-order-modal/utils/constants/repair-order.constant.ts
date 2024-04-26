import { RepairTypes } from '@pages/repair/pages/repair-modals/repair-order-modal/models/repair-types.model';
import { Tabs } from '@shared/models/tabs.model';

export class RepairOrderConstants {
    static REPAIR_TYPES: RepairTypes[] = [
        {
            id: 1,
            name: 'Fixed',
            url: 'assets/svg/common/repair-services/ic_shop.svg',
        },
        {
            id: 2,
            name: 'Mobile',
            url: 'assets/svg/truckassist-table/repair/shop-type-active/ic_mobile_table.svg',
        },
        {
            id: 3,
            name: 'Fixed & Mobile',
            url: '',
        },
    ];

    static HEADER_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Bill',
            checked: true,
        },
        {
            id: 2,
            name: 'Order',
            checked: false,
        },
    ];

    static TYPE_OF_REPAIR_TABS: Tabs[] = [
        {
            id: 1,
            name: 'Truck',
            checked: true,
        },
        {
            id: 2,
            name: 'Trailer',
            checked: false,
        },
    ];

    static SERVICE_TABS: Tabs[] = [
        {
            id: 1,
            name: 'IN STORE',
            checked: false,
        },
        {
            id: 2,
            name: 'AT LOCATION',
            checked: false,
        },
        {
            id: 3,
            name: 'COMBINED',
            checked: false,
        },
    ];
}
