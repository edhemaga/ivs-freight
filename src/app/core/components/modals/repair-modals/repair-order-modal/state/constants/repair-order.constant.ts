import { RepairData } from '../models/repair.model';

export class RepairOrder {
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

    static PAID: { name: string }[] = [
        {
            name: 'Wire Transfer',
        },
        {
            name: 'Cash',
        },
        {
            name: 'Check',
        },
        {
            name: 'Money Code',
        },
        {
            name: 'Q. pay (Zelle)',
        },
        {
            name: 'Q. pay (Venmo)',
        },
        {
            name: 'Q. pay (Cashapp',
        },
        {
            name: 'Q. pay (PayPal)',
        },
    ];
}
