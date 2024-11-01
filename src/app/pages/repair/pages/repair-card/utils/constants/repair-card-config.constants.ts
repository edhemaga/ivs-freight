import { CardRows } from '@shared/models/card-models/card-rows.model';

export class RepairCardConfigConstants {
    static rows: number = 4;

    static page: string = 'Repair';

    // Data for Truck front
    static displayRowsFrontTruck: CardRows[] = [
        {
            title: 'Issued',
            key: 'tableIssued',
        },

        {
            title: 'Unit No.',
            key: 'tableUnit',
        },

        {
            title: 'Item',
            key: 'items',
        },

        {
            title: 'Repair Shop',
            key: 'repairShop',
            secondKey: 'name'
        },
    ];

    // Data for Truck back
    static displayRowsBackTruck: CardRows[] = [
        {
            title: 'Repair Shop',
            key: 'repairShop',
            secondKey: 'name'
        },

        {
            title: 'Shop Address',
            key: 'address',
        },

        {
            title: 'Unit Type',
            key: 'unitType.name',
        },

        {
            title: 'Odometer',
            key: 'odometer',
        },
    ];

    // Data for Trailer front
    static displayRowsFrontTrailer: CardRows[] = [
        {
            title: 'Issued',
            key: 'tableIssued',
        },

        {
            title: 'Unit No.',
            key: 'tableUnit',
        },

        {
            title: 'Item',
            key: 'items',
        },

        {
            title: 'Repair Shop',
            key: 'repairShop',
            secondKey: 'name'
        },
    ];

    // Data for Trailer back
    static displayRowsBackTrailer: CardRows[] = [
        {
            title: 'Repair Shop',
            key: 'repairShop',
            secondKey: 'name'
        },

        {
            title: 'Shop Address',
            key: 'tableShopAdress',
        },

        {
            title: 'Unit Type',
            key: 'unitType.name',
        },

        {
            title: 'Odometer',
            key: 'odometer',
        },
    ];

    // Data for repair-shop front
    static displayRowsFrontRepairShop: CardRows[] = [
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
        },

        {
            title: 'Services',
            key: 'serviceTypes',
        },
    ];

    // Data for repair-shop back
    static displayRowsBackRepairShop: CardRows[] = [
        {
            title: 'Bill',
            key: 'bill',
        },

        {
            title: 'Expense',
            key: 'tableExpense',
        },

        {
            title: 'Contact',
            key: 'contacts',
        },

        {
            title: 'Rating & Review',
            key: 'tableRaiting.likeCount',
            secondKey: 'tableRaiting.dislikeCount',
            hasLiked: 'hasLiked',
            hasDislike: 'hasDislike',
        },
    ];
}
