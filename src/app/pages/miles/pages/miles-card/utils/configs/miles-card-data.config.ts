import { ICardValueData } from '@shared/interfaces';

export class MilesCardDataConfig {
    static FRONT_SIDE_DATA: ICardValueData[] = [
        {
            title: 'Stops • Count',
            key: 'fuelCount?.count',
            template: 'textWithTitle',
        },
        {
            title: 'Miles • Empty',
            key: 'milesEmpty',
            template: 'textWithTitle',
        },
        {
            title: 'Miles • Loaded',
            key: 'milesLoaded',
            template: 'textWithTitle',
        },
        {
            title: 'Miles • Total',
            key: 'milesTotal',
            template: 'textWithTitle',
        },
    ];

    static BACK_SIDE_DATA: ICardValueData[] = [
        {
            title: 'Load',
            key: 'loadCount',
            template: 'textWithTitle',
        },
        {
            title: 'Stops • Pickup',
            key: 'stopsPickup.count',
            percentKey: 'stopsPickup.percent',
            template: 'doubleTextPercent',
        },
        {
            title: 'Stops • Delivery',
            key: 'stopsDelivery.count',
            percentKey: 'stopsDelivery.percent',
            template: 'doubleTextPercent',
        },
        {
            title: 'Miles • Revenue',
            key: 'revenue',
            template: 'textWithTitle',
            format: 'currency',
        },
    ];
}
