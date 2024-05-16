import { CardRows } from '@shared/models/card-models/card-rows.model';

export class CustomerCardsModalConfig {
    static rows: number = 4;

    static page: string = 'customer';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Date Issued',
            key: 'tableIssued',
        },
        {
            title: 'Unit Detail • Number',
            key: 'tableUnit',
        },
        {
            title: 'Item Detail • Description',
            key: 'items',
        },
        {
            title: 'Item Detail • Cost',
            key: 'total',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Shop Detail • Name',
            key: 'repairShop',
            secondKey: 'name'
        },
        {
            title: 'Shop Detail • Address',
            key: 'repairShop',
            secondKey: 'address',
            thirdKey: 'address',
        },
        {
            title: 'Unit Detail • Type',
            key: 'unitType.name',
        },
        {
            title: 'Unit Detail • Odometer',
            key: 'odometer',
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
