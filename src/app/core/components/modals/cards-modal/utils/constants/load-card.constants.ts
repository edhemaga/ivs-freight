import { CardRows } from '../../../../shared/model/card-data.model';

export class LoadCardsModuleData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Comodity',
            key: 'generalCommodity.name',
            selected: true,
        },
        {
            title: 'Broker',
            key: 'broker.businessName',
            selected: true,
        },
        {
            title: 'Contact Name',
            key: 'brokerContact.contactName',
            selected: true,
        },
        {
            title: 'Contact Phone',
            key: 'brokerContact.phone',
            secondKey: 'brokerContact.extensionPhone',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
            selected: true,
        },
        {
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
            selected: true,
        },
        {
            title: 'Total Miles',
            key: 'totalMiles',
            selected: true,
        },
        {
            title: 'Rate',
            key: 'textBase',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            id: 1,

            title: 'Comodity',
            key: 'generalCommodity.name',
        },
        {
            id: 2,
            title: 'Broker',
            key: 'broker.businessName',
        },
        {
            id: 3,
            title: 'Contact Name',
            key: 'brokerContact.contactName',
        },
        {
            id: 4,
            title: 'Contact Phone',
            key: 'brokerContact.phone',
            secondKey: 'brokerContact.extensionPhone',
        },

        {
            id: 5,
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
        },
        {
            id: 6,
            title: 'Rate',
            key: 'loadTotal.total',
            secondKey: 'loadTotal.subTotal',
        },

        { id: 7, title: 'Dispatcher', key: 'dispatcher.fullName' },
        { id: 8, title: 'Ref. Number', key: 'referenceNumber' },
        { id: 9, title: 'Total Miles', key: 'totalMiles' },

        { id: 10, title: 'Driver', key: 'dispatcher.fullName' },
        { id: 11, title: 'Truck', key: 'broker.businessName' },
        { id: 12, title: 'Trailer', key: 'referenceNumber' },

        { id: 13, title: 'Status', key: 'loadStatus.status' },
        { id: 14, title: 'Paid', key: 'totalPaid' },
        { id: 15, title: 'Due', key: 'no-key' },
        {
            id: 16,
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
        },
        { id: 17, title: 'Age', key: 'no-ednpoint' },
    ];
}
