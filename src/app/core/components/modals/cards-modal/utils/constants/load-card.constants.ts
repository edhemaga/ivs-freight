import { CardRows } from '../../../../shared/model/card-data.model';

export class LoadCardsModuleData {
    static frontDataLoad: CardRows[] = [
        {
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
            id: 1,

            title: 'Comodity',
            endpoint: 'generalCommodity.name',
        },
        {
            id: 2,
            title: 'Broker',
            endpoint: 'broker.businessName',
        },
        {
            id: 3,
            title: 'Contact Name',
            endpoint: 'brokerContact.contactName',
        },
        {
            id: 4,
            title: 'Contact Phone',
            endpoint: 'brokerContact.phone',
            secondEndpoint: 'brokerContact.extensionPhone',
        },

        {
            id: 5,
            title: 'Pickup',
            endpoint: 'loadPickup.count',
            secondEndpoint: 'loadPickup.location',
            thirdEndpoint: 'loadPickup.date',
        },
        {
            id: 6,
            title: 'Rate',
            endpoint: 'loadTotal.total',
            secondEndpoint: 'loadTotal.subTotal',
        },

        { id: 7, title: 'Dispatcher', endpoint: 'dispatcher.fullName' },
        { id: 8, title: 'Ref. Number', endpoint: 'referenceNumber' },
        { id: 9, title: 'Total Miles', endpoint: 'totalMiles' },

        { id: 10, title: 'Driver', endpoint: 'dispatcher.fullName' },
        { id: 11, title: 'Truck', endpoint: 'broker.businessName' },
        { id: 12, title: 'Trailer', endpoint: 'referenceNumber' },

        { id: 13, title: 'Status', endpoint: 'loadStatus.status' },
        { id: 14, title: 'Paid', endpoint: 'totalPaid' },
        { id: 15, title: 'Due', endpoint: 'no-endpoint' },
        {
            id: 16,
            title: 'Delivery',
            endpoint: 'loadDelivery.count',
            secondEndpoint: 'loadDelivery.location',
            thirdEndpoint: 'loadDelivery.date',
        },
        { id: 17, title: 'Age', endpoint: 'no-ednpoint' },
    ];
}
