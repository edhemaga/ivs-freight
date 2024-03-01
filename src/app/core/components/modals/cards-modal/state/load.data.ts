import { CardRows } from '../../../shared/model/cardData';

export class loadCardsModuleData {
    static frontDataLoad: CardRows[] = [
        {
            id: 1,
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
            selected: true,
        },
        { id: 2, title: 'Broker', key: 'broker.businessName', selected: true },
        {
            id: 3,
            title: 'Contact Name',
            key: 'brokerContact.contactName',
            selected: true,
        },
        {
            id: 4,
            title: 'Contact Phone',
            key: 'brokerContact.phone',
            secondKey: 'brokerContact.extensionPhone',
            selected: true,
        },

        {
            id: 5,
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
            selected: true,
        },
        {
            id: 6,
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
            selected: true,
        },
        { id: 7, title: 'Total Miles', key: 'totalMiles', selected: true },
        { id: 8, title: 'Rate', key: 'textBase', selected: true },

        { id: 9, title: 'Status', key: 'loadStatus.status', selected: false },
        {
            id: 10,
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
            selected: false,
        },
        {
            id: 11,
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
            selected: false,
        },
        {
            id: 12,
            title: 'Rate',
            key: 'loadTotal.total',
            secondKey: 'loadTotal.subTotal',
            selected: false,
        },

        {
            id: 13,
            title: 'Dispatcher',
            key: 'dispatcher.fullName',
            selected: false,
        },
        {
            id: 14,
            title: 'Broker',
            key: 'broker.businessName',
            selected: false,
        },
        {
            id: 15,
            title: 'Ref. Number',
            key: 'referenceNumber',
            selected: false,
        },
        { id: 16, title: 'Total Miles', key: 'totalMiles', selected: false },

        {
            id: 17,
            title: 'Driver',
            key: 'dispatcher.fullName',
            selected: false,
        },
        { id: 18, title: 'Truck', key: 'broker.businessName', selected: false },
        { id: 19, title: 'Trailer', key: 'referenceNumber', selected: false },
        { id: 20, title: 'Total Miles', key: 'totalMiles', selected: false },

        { id: 21, title: 'Status', key: 'loadStatus.status', selected: false },
        {
            id: 22,
            title: 'Rate',
            key: 'loadTotal.total',
            secondKey: 'loadTotal.subTotal',
            selected: false,
        },
        { id: 23, title: 'Paid', key: 'totalPaid', selected: false },
        { id: 24, title: 'Due', key: 'no-key', selected: false },

        {
            id: 25,
            title: 'Broker',
            key: 'broker.businessName',
            selected: false,
        },
        {
            id: 26,
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
            selected: false,
        },
        {
            id: 27,
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
            selected: false,
        },
        { id: 28, title: 'Age', key: 'no-ednpoint', selected: false },
    ];
}
