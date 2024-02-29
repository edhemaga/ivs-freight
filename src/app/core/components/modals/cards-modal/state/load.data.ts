import { CardRows } from '../../../shared/model/cardData';

export class loadCardsModuleData {
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

        {
            title: 'Status',
            key: 'loadStatus.status',
            selected: false,
        },
        {
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
            selected: false,
        },
        {
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
            selected: false,
        },
        {
            title: 'Rate',
            key: 'loadTotal.total',
            secondKey: 'loadTotal.subTotal',
            selected: false,
        },

        {
            title: 'Dispatcher',
            key: 'dispatcher.fullName',
            selected: false,
        },
        {
            title: 'Broker',
            key: 'broker.businessName',
            selected: false,
        },
        {
            title: 'Ref. Number',
            key: 'referenceNumber',
            selected: false,
        },
        {
            title: 'Total Miles',
            key: 'totalMiles',
            selected: false,
        },

        {
            title: 'Driver',
            key: 'dispatcher.fullName',
            selected: false,
        },
        {
            title: 'Truck',
            key: 'broker.businessName',
            selected: false,
        },
        {
            title: 'Trailer',
            key: 'referenceNumber',
            selected: false,
        },
        {
            title: 'Total Miles',
            key: 'totalMiles',
            selected: false,
        },

        {
            title: 'Status',
            key: 'loadStatus.status',
            selected: false,
        },
        {
            title: 'Rate',
            key: 'loadTotal.total',
            secondKey: 'loadTotal.subTotal',
            selected: false,
        },
        {
            title: 'Paid',
            key: 'totalPaid',
            selected: false,
        },
        {
            title: 'Due',
            key: 'no-key',
            selected: false,
        },

        {
            title: 'Broker',
            key: 'broker.businessName',
            selected: false,
        },
        {
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
            selected: false,
        },
        {
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
            selected: false,
        },
        {
            title: 'Age',
            key: 'no-ednpoint',
            selected: false,
        },
    ];
}
