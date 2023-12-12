import { CardRows } from '../shared/model/cardData';
export class DisplayTruckConfiguration {
    static rows: number = 4;

    static page: string = 'Truck';

    static cardTitle: string = 'truckNumber';

    // Data for active trucks front
    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'VIN No.',
            endpoint: 'tableVin.regularText',
            secondEndpoint: 'tableVin.boldText',
        },
        {
            title: 'Make',
            endpoint: 'truckMake.name',
        },
        {
            title: 'Model',
            endpoint: 'model',
        },
        {
            title: 'Mileage',
            endpoint: 'mileage',
        },
    ];

    // Data for active trucks back
    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Owner',
            endpoint: 'owner.name',
        },
        {
            title: 'Commission',
            endpoint: 'tabelOwnerDetailsComm',
        },
        {
            title: 'Licence Exp.',
            endpoint: 'tableLicencePlateDetailExpiration.expirationDaysText',
            secondEndpoint: 'tableLicencePlateDetailExpiration.percentage',
        },
        {
            title: 'FHWA Exp.',
            endpoint: 'tableFhwaInspectionExpiration.expirationDaysText',
            secondEndpoint: 'tableFhwaInspectionExpiration.percentage',
        },
    ];

    // Data for inactive trucks
    static displayRowsFrontInactive: CardRows[] = [
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
            endpoint: 'address.address',
        },
        {
            title: 'Rating & Review',
            endpoint: 'tableRaiting.likeCount',
            secondEndpoint: 'tableRaiting.dislikeCount',
            hasLiked: 'hasLiked',
            hasDislike: 'hasDislike',
        },
    ];

    // Data for shipper
    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Shipping Hours',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Receiving Hours',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Avg. Pickup Time',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Avg. Delivery Time',
            endpoint: 'no-endpoint',
        },
    ];
}
