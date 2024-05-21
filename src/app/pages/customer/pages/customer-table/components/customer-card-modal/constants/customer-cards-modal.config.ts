import { CardRows } from '@shared/models/card-models/card-rows.model';

export class CustomerCardsModalConfig {
    static rows: number = 4;

    static page: string = 'customer';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Billing Detail • Available Credit',
            key: 'availableCredit',
        },
        {
            title: 'Billing Detail • Unpaid Invoice Ageing',
            key: 'total',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Contacts',
            key: 'brokerContacts',
        },
        {
            title: 'Price per Mile',
            key: 'pricePerMile',
        },
        {
            title: 'Load Count',
            key: 'loadCount',
        },
        {
            title: 'Revenue',
            key: 'revenue',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Address',
            key: 'address',
            secondKey: 'address'
        },
        {
            title: 'Load Count',
            key: 'loadCount',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Work Hours • Shipping',
            key: 'repairShop',
            secondKey: 'name'
        },
        {
            title: 'Work Hours • Receiving',
            key: 'repairShop',
            secondKey: 'address',
            thirdKey: 'address',
        },
        {
            title: 'Avg. Wait Time • Pickup',
            key: 'unitType.name',
        },
        {
            title: 'Avg. Wait Time • Delivery',
            key: 'odometer',
        },
        null,
        null,
    ];
}
