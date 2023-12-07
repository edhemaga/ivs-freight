import { CardRows } from '../shared/model/cardData';

export class DisplayLoadConfiguration {
    static rows = {
        property: [4],
    };

    static page: string = 'Load';
    static cardTitle: string = 'loadInvoice.invoice';

    static displayRowsFront: CardRows[] = [
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

    static displayRowsBack: CardRows[] = [
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
}
