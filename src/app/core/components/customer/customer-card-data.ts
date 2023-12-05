import { CardRows } from '../shared/model/cardData';

export const rows: number = 4;

export const page: string = 'Customer';

export const cardTitle: string = 'businessName';
// Data for broker
export const displayRowsFrontBroker: CardRows[] = [
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
export const displayRowsBackBroker: CardRows[] = [
    {
        title: 'Contact',
        endpoint: 'brokerContacts.department.name',
    },
    {
        title: 'Rating & Review',
        endpoint: 'tableRaiting.likeCount',
        seccondEndpoint: 'tableRaiting.dislikeCount',
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
export const displayRowsFrontShipper: CardRows[] = [
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
        seccondEndpoint: 'tableRaiting.dislikeCount',
        hasLiked: 'hasLiked',
        hasDislike: 'hasDislike',
    },
];
// Data for shipper
export const displayRowsBackShipper: CardRows[] = [
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
