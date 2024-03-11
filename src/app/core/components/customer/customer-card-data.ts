import { CardRows } from '../shared/model/card-data.model';
export class DisplayCustomerConfiguration {
    static rows: number = 4;

    static page: string = 'Customer';

    static cardTitle: string = 'businessName';

    // Data for broker
    static displayRowsFrontBroker: CardRows[] = [
        {
            title: 'Phone',
            endpoint: 'phone',
        },
        {
            title: 'Email',
            endpoint: 'email',
        },
        {
            title: 'Available Credit',
            endpoint: 'availableCredit',
        },
        {
            title: 'Unpaid Inv. Ageing',
            endpoint: 'no-endpoint',
        },
    ];

    // Data for broker
    static displayRowsBackBroker: CardRows[] = [
        {
            title: 'Contact',
            endpoint: 'brokerContacts.department.name',
        },
        {
            title: 'Rating & Review',
            endpoint: 'tableRaiting.likeCount',
            secondEndpoint: 'tableRaiting.dislikeCount',
            hasLiked: 'hasLiked',
            hasDislike: 'hasDislike',
        },
        {
            title: 'Loads',
            endpoint: 'referenceNumber',
        },
        {
            title: 'Revenue',
            endpoint: 'revenue',
        },
    ];

    // Data for shipper
    static displayRowsFrontShipper: CardRows[] = [
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
    static displayRowsBackShipper: CardRows[] = [
        {
            title: 'Shipping Hours',
            endpoint: 'tableAvailableHoursShipping',
        },
        {
            title: 'Receiving Hours',
            endpoint: 'tableAvailableHoursReceiving',
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
