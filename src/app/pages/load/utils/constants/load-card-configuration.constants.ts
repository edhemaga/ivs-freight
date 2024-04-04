import { CardRows } from "src/app/core/components/shared/model/card-data.model";

export class LoadCardConfiguration {
    static rows: number = 4;

    static page: string = 'Load';

    static displayRowsFrontTemplate: CardRows[] = [
        {
            title: 'Comodity',
            key: 'generalCommodity.name',
        },
        {
            title: 'Broker',
            key: 'broker.businessName',
        },
        {
            title: 'Contact Name',
            key: 'brokerContact.contactName',
        },
        {
            title: 'Contact Phone',
            key: 'brokerContact.phone',
            secondKey: 'brokerContact.extensionPhone',
        },
        null,
        null,
    ];

    static displayRowsBackTemplate: CardRows[] = [
        {
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
        },
        {
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
        },
        {
            title: 'Total Miles',
            key: 'totalMiles',
        },
        {
            title: 'Rate',
            key: 'textBase',
        },
        null,
        null,
    ];

    static displayRowsFrontPending: CardRows[] = [
        {
            title: 'Status',
            key: 'loadStatus.status',
        },
        {
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
        },
        {
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
        },
        {
            title: 'Rate',
            key: 'loadTotal.total',
            secondKey: 'loadTotal.subTotal',
        },
        null,
        null,
    ];

    static displayRowsBackPending: CardRows[] = [
        {
            title: 'Dispatcher',
            key: 'dispatcher.fullName',
        },
        {
            title: 'Broker',
            key: 'broker.businessName',
        },
        {
            title: 'Ref. Number',
            key: 'referenceNumber',
        },
        {
            title: 'Total Miles',
            key: 'totalMiles',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Driver',
            key: 'dispatcher.fullName',
        },
        {
            title: 'Truck',
            key: 'broker.businessName',
        },
        {
            title: 'Trailer',
            key: 'referenceNumber',
        },
        {
            title: 'Total Miles',
            key: 'totalMiles',
        },
        null,
        null,
    ];

    static displayRowsFrontClosed: CardRows[] = [
        {
            title: 'Status',
            key: 'loadStatus.status',
        },
        {
            title: 'Rate',
            key: 'loadTotal.total',
            secondKey: 'loadTotal.subTotal',
        },
        {
            title: 'Paid',
            key: 'totalPaid',
        },
        {
            title: 'Due',
            key: 'no-key',
        },
        null,
        null,
    ];

    static displayRowsBackClosed: CardRows[] = [
        {
            title: 'Broker',
            key: 'broker.businessName',
        },
        {
            title: 'Pickup',
            key: 'loadPickup.count',
            secondKey: 'loadPickup.location',
            thirdKey: 'loadPickup.date',
        },
        {
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
        },
        {
            title: 'Age',
            key: 'no-ednpoint',
        },
        null,
        null,
    ];
}
