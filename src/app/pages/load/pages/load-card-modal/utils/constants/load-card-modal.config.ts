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

    static displayRowsFrontInactive: CardRows[] = [
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

    static displayRowsBackInactive: CardRows[] = [
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
}
