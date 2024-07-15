import { CardRows } from '@shared/models/card-models/card-rows.model';

export class LoadCardModalConfig {
    static rows: number = 4;

    static page: string = 'load';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Status',
            key: 'status',
            secondKey: 'statusString',
        },
        {
            title: 'Pickup',
            key: 'pickup',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Delivery',
            key: 'delivery',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Billing • Rate',
            key: 'billing',
            secondKey: 'rate',
            type: 'money',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Assigned • Driver',
            key: 'driver',
            secondKey: 'avatarFile',
        },
        {
            title: 'Assigned • Truck',
            key: 'driver',
            secondKey: 'truckNumber',
        },
        {
            title: 'Assigned • Trailer',
            key: 'driver',
            secondKey: 'trailerNumber',
        },
        {
            title: 'Miles • Total',
            key: 'miles',
            secondKey: 'total',
            type: 'miles',
        },
        null,
        null,
    ];

    static displayRowsFrontPending: CardRows[] = [
        {
            title: 'Status',
            key: 'status',
            secondKey: 'statusString',
        },
        {
            title: 'Pickup',
            key: 'pickup',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Delivery',
            key: 'delivery',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Billing • Rate',
            key: 'billing',
            secondKey: 'rate',
            type: 'money',
        },
        null,
        null,
    ];

    static displayRowsBackPending: CardRows[] = [
        {
            title: 'Assigned • Driver',
            key: 'driver',
            secondKey: 'avatarFile',
        },
        {
            title: 'Assigned • Truck',
            key: 'driver',
            secondKey: 'truckNumber',
        },
        {
            title: 'Assigned • Trailer',
            key: 'driver',
            secondKey: 'trailerNumber',
        },
        {
            title: 'Miles • Total',
            key: 'miles',
            secondKey: 'total',
            type: 'miles',
        },
        null,
        null,
    ];

    static displayRowsFrontTemplate: CardRows[] = [
        {
            title: 'Commodity',
            key: 'loadDetails',
            secondKey: 'generalCommodityName',
        },
        {
            title: 'Broker Detail • Business Name',
            secondTitle: 'Business Name',
            key: 'broker',
            secondKey: 'businessName',
        },
        {
            title: 'Broker Detail • Contact',
            secondTitle: 'Contact',
            key: 'broker',
            secondKey: 'contact',
        },
        {
            title: 'Broker Detail • Phone',
            secondTitle: 'Phone',
            key: 'broker',
            secondKey: 'phone',
            type: 'phone',
        },
        null,
        null,
    ];

    static displayRowsBackTemplate: CardRows[] = [
        {
            title: 'Pickup',
            key: 'pickup',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Delivery',
            key: 'delivery',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Miles • Total',
            key: 'miles',
            secondKey: 'total',
            type: 'miles',
        },
        {
            title: 'Billing • Rate',
            secondTitle: 'Rate',
            key: 'billing',
            secondKey: 'rate',
            type: 'money',
        },
        null,
        null,
    ];

    static displayRowsFrontClosed: CardRows[] = [
        {
            title: 'Status',
            key: 'status',
            secondKey: 'statusString',
        },
        {
            title: 'Billing • Rate',
            secondTitle: 'Rate',
            key: 'billing',
            secondKey: 'rate',
            type: 'money',
        },
        {
            title: 'Billing • Paid',
            secondTitle: 'Paid',
            key: 'billing',
            secondKey: 'paid',
            type: 'money',
        },
        {
            title: 'Billing • Due',
            secondTitle: 'Due',
            key: 'billing',
            secondKey: 'due',
            type: 'money',
        },
        null,
        null,
    ];

    static displayRowsBackClosed: CardRows[] = [
        {
            title: 'Broker Detail • Business Name',
            secondTitle: 'Business Name',
            key: 'broker',
            secondKey: 'businessName',
        },
        {
            title: 'Pickup',
            key: 'pickup',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Delivery',
            key: 'delivery',
            secondKey: 'count',
            thirdKey: 'location',
        },
        {
            title: 'Billing • Age - Unpaid',
            secondTitle: 'Age - Unpaid',
            key: 'billing',
            secondKey: 'ageUnpaid',
        },
        null,
        null,
    ];
}
