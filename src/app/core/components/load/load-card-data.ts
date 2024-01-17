import { CardRows } from '../shared/model/cardData';

export class DisplayLoadConfiguration {
    static rows: number = 4;

    static page: string = 'Load';

    static displayRowsFrontTemplate: CardRows[] = [
        {
            title: 'Comodity',
            endpoint: 'generalCommodity.name',
        },
        {
            title: 'Broker',
            endpoint: 'broker.count',
        },
        {
            title: 'Contact Name',
            endpoint: 'brokerContact.contactName',
        },
        {
            title: 'Contact Phone',
            endpoint: 'brokerContact.phone',
        },
    ];

    static displayRowsBackTemplate: CardRows[] = [
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

    static displayRowsFront: CardRows[] = [
        {
            title: 'Status',
            endpoint: 'loadStatus.status',
        },
        {
            title: 'Pickup',
            endpoint: 'loadPickup.count',
            secondEndpoint: 'loadPickup.location',
            thirdEndpoint: 'loadPickup.date',
        },
        {
            title: 'Delivery',
            endpoint: 'loadDelivery.count',
            secondEndpoint: 'loadDelivery.location',
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
