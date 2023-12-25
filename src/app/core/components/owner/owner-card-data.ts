import { CardRows } from '../shared/model/cardData';
export class DisplayOwnerConfiguration {
    static rows: number = 4;

    static page: string = 'Owner';

    static cardTitle: string = 'name';

    // Data for active front
    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'SSN',
            endpoint: 'ssnEin',
        },
        {
            title: 'Phone',
            endpoint: 'phone',
        },
        {
            title: 'Email',
            endpoint: 'email',
        },
        {
            title: 'Fleet',
            endpoint: '',
        },
    ];

    // Data for active back
    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Fuel Stop',
            endpoint: 'brokerContacts.department.name',
        },
        {
            title: 'Location',
            endpoint: 'tableRaiting.likeCount',
            secondEndpoint: 'tableRaiting.dislikeCount',
            hasLiked: 'hasLiked',
            hasDislike: 'hasDislike',
        },
        {
            title: 'Driver',
            endpoint: 'referenceNumber',
        },
        {
            title: 'Fuel Card No.',
            endpoint: 'revenue',
        },
    ];

    // Data for inactive front
    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Type',
            endpoint: 'phone',
        },
        {
            title: 'SSN',
            endpoint: 'email',
        },
        {
            title: 'Phone',
            endpoint: 'address.address',
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
            title: 'Fleet',
            endpoint: '',
        },
    ];

    // Data for inactive back
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
