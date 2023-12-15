import { CardRows } from '../shared/model/cardData';

export class DisplayRepairConfiguration {
    static rows: number = 4;

    static page: string = 'Repair';

    static cardTitle: string = 'truck.truckNumber';

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
            title: 'Phone No.',
            endpoint: 'phone',
        },

        {
            title: 'SSN No.',
            endpoint: 'ssn',
        },

        {
            title: 'CDL No.',
            endpoint: 'cdlNumber',
        },

        {
            title: 'Pay Type',
            endpoint: 'payType.name',
        },
    ];
}
