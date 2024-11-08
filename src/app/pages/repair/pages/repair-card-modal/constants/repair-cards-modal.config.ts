import { CardRows } from '@shared/models/card-models/card-rows.model';

export class RepairCardsModalConfig {
    static rows: number = 4;

    static page: string = 'repair';

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

    static displayRowsBackInactive: CardRows[] = [
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

    static displayRowsFrontShop: CardRows[] = [
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
            secondKey: 'address',
        },
        {
            title: 'Services',
            key: 'serviceTypes',
        },
        null,
        null,
    ];

    static displayRowsBackShop: CardRows[] = [
        {
            title: 'Bill',
            key: 'bill',
        },
        {
            title: 'Expense',
            key: 'expense',
        },
        {
            title: 'Contact',
            key: 'contacts',
        },
        {
            title: 'Rating & Review',
            key: 'rating',
        },
        null,
        null,
    ];
}
