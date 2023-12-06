import { CardRows } from '../shared/model/cardData';

export class rows {
    static property = [4];
}

export const page: string = 'Load';

export const cardTitle: string = 'loadInvoice.invoice';

export const displayRowsFront: CardRows[] = [
    {
        title: 'Status',
        endpoint: 'loadStatus.status',
    },
    {
        title: 'Pickup',
        endpoint: 'loadPickup.count',
        seccondEndpoint: 'loadPickup.location',
        thirdEndpoint: 'loadPickup.date',
    },
    {
        title: 'Delivery',
        endpoint: 'loadDelivery.count',
        seccondEndpoint: 'loadDelivery.location',
        thirdEndpoint: 'loadDelivery.date',
    },
    {
        title: 'Rate',
        endpoint: 'textBase',
    },
];

export const displayRowsBack: CardRows[] = [
    {
        title: 'Dispatcher',
        endpoint: 'dispatcher.fullName',
    },
    {
        title: 'Broker',
        endpoint: 'broker.businessName',
    },
    {
        title: 'Ref. Number',
        endpoint: 'referenceNumber',
    },
    {
        title: 'Total Miles',
        endpoint: 'totalMiles',
    },
];
