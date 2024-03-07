import { CardRows } from '../../../shared/model/cardData';

export class loadCardsModuleData {
    static frontDataLoad: CardRows[] = [
        {
            id: 1,
            title: 'Comodity',
            endpoint: 'generalCommodity.name',
            selected: true,
        },
        {
            title: 'Broker',
            endpoint: 'broker.businessName',
            selected: true,
        },
        {
            title: 'Contact Name',
            endpoint: 'brokerContact.contactName',
            selected: true,
        },
        {
            title: 'Contact Phone',
            endpoint: 'brokerContact.phone',
            secondEndpoint: 'brokerContact.extensionPhone',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Pickup',
            endpoint: 'loadPickup.count',
            secondEndpoint: 'loadPickup.location',
            thirdEndpoint: 'loadPickup.date',
            selected: true,
        },
        {
            title: 'Delivery',
            endpoint: 'loadDelivery.count',
            secondEndpoint: 'loadDelivery.location',
            thirdEndpoint: 'loadDelivery.date',
            selected: true,
        },
        {
            title: 'Total Miles',
            endpoint: 'totalMiles',
            selected: true,
        },
        {
            title: 'Rate',
            endpoint: 'textBase',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
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

        {
            title: 'Pickup',
            endpoint: 'loadPickup.count',
            secondEndpoint: 'loadPickup.location',
            thirdEndpoint: 'loadPickup.date',
        },
        {
            title: 'Rate',
            endpoint: 'loadTotal.total',
            secondEndpoint: 'loadTotal.subTotal',
        },

        {
            title: 'Dispatcher',
            endpoint: 'dispatcher.fullName',
        },
        {
            title: 'Ref. Number',
            endpoint: 'referenceNumber',
        },
        {
            title: 'Total Miles',
            endpoint: 'totalMiles',
        },

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
            title: 'Status',
            endpoint: 'loadStatus.status',
        },
        { title: 'Paid', endpoint: 'totalPaid' },
        { title: 'Due', endpoint: 'no-endpoint' },
        {
            title: 'Delivery',
            endpoint: 'loadDelivery.count',
            secondEndpoint: 'loadDelivery.location',
            thirdEndpoint: 'loadDelivery.date',
        },
        { title: 'Age', endpoint: 'no-ednpoint' },
    ];
}
