import { RepairTypes } from '../../models/repair-types.model';
import { RepairData } from '../../models/repair-data.model';

export class RepairOrder {
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

    static HEADER_TABS: RepairData[] = [
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

    static TYPE_OF_REPAIR: RepairData[] = [
        {
            id: 3,
            name: 'Truck',
            checked: true,
        },
        {
            id: 4,
            name: 'Trailer',
            checked: false,
        },
    ];

    static PAID: { id: number; name: string }[] = [
        {
            id: 0,
            name: 'Wire Transfer',
        },
        {
            id: 1,
            name: 'Cash',
        },
        {
            id: 2,
            name: 'Check',
        },
        {
            id: 3,
            name: 'Money Code',
        },
        {
            id: 4,
            name: 'Q. pay (Zelle)',
        },
        {
            id: 5,
            name: 'Q. pay (Venmo)',
        },
        {
            id: 6,
            name: 'Q. pay (Cashapp',
        },
        {
            id: 7,
            name: 'Q. pay (PayPal)',
        },
    ];
}
