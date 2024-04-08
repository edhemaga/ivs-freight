import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

export class CustomerCardDataConfigConstants {
    static rows: number = 4;

    static page: string = 'Customer';

    static cardTitle: string = 'businessName';

    // Data for broker
    static displayRowsFrontBroker: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Available Credit',
            key: 'availableCredit',
        },
        {
            title: 'Unpaid Inv. Ageing',
            key: 'no-key',
        },
    ];

    // Data for broker
    static displayRowsBackBroker: CardRows[] = [
        {
            title: 'Contact',
            key: 'brokerContacts.department.name',
        },
        {
            title: 'Rating & Review',
            key: 'tableRaiting.likeCount',
            secondKey: 'tableRaiting.dislikeCount',
            hasLiked: 'hasLiked',
            hasDislike: 'hasDislike',
        },
        {
            title: 'Loads',
            key: 'referenceNumber',
        },
        {
            title: 'Revenue',
            key: 'revenue',
        },
    ];

    // Data for shipper
    static displayRowsFrontShipper: CardRows[] = [
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
            key: 'address.address',
        },
        {
            title: 'Rating & Review',
            key: 'tableRaiting.likeCount',
            secondKey: 'tableRaiting.dislikeCount',
            hasLiked: 'hasLiked',
            hasDislike: 'hasDislike',
        },
    ];

    // Data for shipper
    static displayRowsBackShipper: CardRows[] = [
        {
            title: 'Shipping Hours',
            key: 'tableAvailableHoursShipping',
        },
        {
            title: 'Receiving Hours',
            key: 'tableAvailableHoursReceiving',
        },
        {
            title: 'Avg. Pickup Time',
            key: 'no-key',
        },
        {
            title: 'Avg. Delivery Time',
            key: 'no-key',
        },
    ];
}
