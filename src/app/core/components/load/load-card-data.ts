import { CardRows } from '../shared/model/card-data.model';

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
            endpoint: 'broker.businessName',
        },
        {
            title: 'Contact Name',
            endpoint: 'brokerContact.contactName',
        },
        {
            title: 'Contact Phone',
            endpoint: 'brokerContact.phone',
            secondEndpoint: 'brokerContact.extensionPhone',
        },
        null,
        null,
    ];

    static displayRowsBackTemplate: CardRows[] = [
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
            title: 'Total Miles',
            endpoint: 'totalMiles',
        },
        {
            title: 'Rate',
            endpoint: 'textBase',
        },
        null,
        null,
    ];

    static displayRowsFrontPending: CardRows[] = [
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
            endpoint: 'loadTotal.total',
            secondEndpoint: 'loadTotal.subTotal',
        },
        null,
        null,
    ];

    static displayRowsBackPending: CardRows[] = [
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
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Driver',
            endpoint: 'dispatcher.fullName',
        },
        {
            title: 'Truck',
            endpoint: 'broker.businessName',
        },
        {
            title: 'Trailer',
            endpoint: 'referenceNumber',
        },
        {
            title: 'Total Miles',
            endpoint: 'totalMiles',
        },
        null,
        null,
    ];

    static displayRowsFrontClosed: CardRows[] = [
        {
            title: 'Status',
            endpoint: 'loadStatus.status',
        },
        {
            title: 'Rate',
            endpoint: 'loadTotal.total',
            secondEndpoint: 'loadTotal.subTotal',
        },
        {
            title: 'Paid',
            endpoint: 'totalPaid',
        },
        {
            title: 'Due',
            endpoint: 'no-endpoint',
        },
        null,
        null,
    ];

    static displayRowsBackClosed: CardRows[] = [
        {
            title: 'Broker',
            endpoint: 'broker.businessName',
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
            title: 'Age',
            endpoint: 'no-ednpoint',
        },
        null,
        null,
    ];
}
