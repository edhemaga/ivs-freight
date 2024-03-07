import { CardRows } from '../../../shared/model/cardData';

export class DisplayRepairConfiguration {
    static rows: number = 4;

    static page: string = 'Repair';

    // Data for Truck front
    static displayRowsFrontTruck: CardRows[] = [
        {
            title: 'Issued',
            endpoint: 'tableIssued',
        },

        {
            title: 'Unit No.',
            endpoint: 'tableUnit',
        },

        {
            title: 'Item',
            endpoint: 'items',
        },

        {
            title: 'Repair Shop',
            endpoint: 'repairShop.name',
        },
    ];

    // Data for Truck back
    static displayRowsBackTruck: CardRows[] = [
        {
            title: 'Repair Shop',
            endpoint: 'repairShop.name',
        },

        {
            title: 'Shop Address',
            endpoint: 'address',
        },

        {
            title: 'Unit Type',
            endpoint: 'unitType.name',
        },

        {
            title: 'Odometer',
            endpoint: 'odometer',
        },
    ];

    // Data for Trailer front
    static displayRowsFrontTrailer: CardRows[] = [
        {
            title: 'Issued',
            endpoint: 'tableIssued',
        },

        {
            title: 'Unit No.',
            endpoint: 'tableUnit',
        },

        {
            title: 'Item',
            endpoint: 'items',
        },

        {
            title: 'Repair Shop',
            endpoint: 'repairShop.name',
        },
    ];

    // Data for Trailer back
    static displayRowsBackTrailer: CardRows[] = [
        {
            title: 'Repair Shop',
            endpoint: 'repairShop.name',
        },

        {
            title: 'Shop Address',
            endpoint: 'tableShopAdress',
        },

        {
            title: 'Unit Type',
            endpoint: 'unitType.name',
        },

        {
            title: 'Odometer',
            endpoint: 'odometer',
        },
    ];

    // Data for repair-shop front
    static displayRowsFrontRepairShop: CardRows[] = [
        {
            title: 'Phone',
            endpoint: 'phone',
        },

        {
            title: 'Email',
            endpoint: 'email',
        },

        {
            title: 'Address',
            endpoint: 'address',
        },

        {
            title: 'Services',
            endpoint: 'serviceTypes',
        },
    ];

    // Data for repair-shop back
    static displayRowsBackRepairShop: CardRows[] = [
        {
            title: 'Bill',
            endpoint: 'tableRepairCountBill',
        },

        {
            title: 'Expense',
            endpoint: 'tableExpense',
        },

        {
            title: 'Contact',
            endpoint: 'contacts',
        },

        {
            title: 'Rating & Review',
            endpoint: 'tableRaiting.likeCount',
            secondEndpoint: 'tableRaiting.dislikeCount',
            hasLiked: 'hasLiked',
            hasDislike: 'hasDislike',
        },
    ];
}
