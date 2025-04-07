import { ICardValueData } from '@shared/interfaces';

export class MilesCardDataConfig {
    static FRONT_SIDE_DATA: ICardValueData[] = [
        {
            title: 'Stops • Count',
            key: 'stopsCount',
            template: 'textWithTitle',
            format: 'number',
        },
        {
            title: 'Miles • Empty',
            key: 'milesEmpty',
            template: 'textWithTitle',
            format: 'number',
        },
        {
            title: 'Miles • Loaded',
            key: 'milesLoaded',
            template: 'textWithTitle',
            format: 'number',
        },
        {
            title: 'Miles • Total',
            key: 'milesTotal',
            template: 'textWithTitle',
            format: 'number',
        },
    ];

    static BACK_SIDE_DATA: ICardValueData[] = [
        {
            title: 'Load',
            key: 'loadCount',
            template: 'textWithTitle',
            format: 'number',
        },
        {
            title: 'Stops • Pickup',
            key: 'stopsPickup.count',
            percentKey: 'stopsPickup.percent',
            template: 'doubleTextPercent',
            format: 'number',
        },
        {
            title: 'Stops • Delivery',
            key: 'stopsDelivery.count',
            percentKey: 'stopsDelivery.percent',
            template: 'doubleTextPercent',
            format: 'number',
        },
        {
            title: 'Revenue',
            key: 'revenue',
            template: 'textWithTitle',
            format: 'currency',
        },
    ];

    static CARD_ALL_DATA: ICardValueData[] = [
        {
            title: 'Type',
            key: 'truckType.name',
            image: 'truckType.logoName',
            template: 'textWithImage',
            format: 'text',
        },
        {
            isDropdown: true,
            title: 'Stops',
            values: [
                {
                    title: 'Stops • Count',
                    secondTitle: 'Count',
                    key: 'stopsCount',
                    template: 'textWithTitle',
                    format: 'number',
                },
                {
                    title: 'Stops • Pickup',
                    secondTitle: 'Pickup',
                    key: 'stopsPickup.count',
                    percentKey: 'stopsPickup.percent',
                    template: 'doubleTextPercent',
                    format: 'number',
                },
                {
                    title: 'Stops • Delivery',
                    secondTitle: 'Delivery',
                    key: 'stopsDelivery.count',
                    percentKey: 'stopsDelivery.percent',
                    template: 'doubleTextPercent',
                    format: 'number',
                },
                {
                    title: 'Stops • Fuel',
                    secondTitle: 'Fuel',
                    key: 'fuelCount?.count',
                    percentKey: 'fuelCount.percent',
                    template: 'doubleTextPercent',
                    format: 'number',
                },
                {
                    title: 'Stops • Parking',
                    secondTitle: 'Parking',
                    key: 'parkingCount?.count',
                    percentKey: 'parkingCount.percent',
                    template: 'doubleTextPercent',
                    format: 'number',
                },
                {
                    title: 'Stops • Deadhead',
                    secondTitle: 'Deadhead',
                    key: 'deadHeadCount?.count',
                    percentKey: 'deadHeadCount.percent',
                    template: 'doubleTextPercent',
                    format: 'number',
                },
                {
                    title: 'Stops • Repair',
                    secondTitle: 'Repair',
                    key: 'repairCount?.count',
                    percentKey: 'repairCount.percent',
                    template: 'doubleTextPercent',
                    format: 'number',
                },
                {
                    title: 'Stops • Towing',
                    secondTitle: 'Towing',
                    key: 'towingCount?.count',
                    percentKey: 'towingCount.percent',
                    template: 'doubleTextPercent',
                    format: 'number',
                },
            ],
        },
        {
            title: 'Load',
            key: 'loadCount',
            template: 'textWithTitle',
            format: 'number',
        },
        {
            isDropdown: true,
            title: 'Fuel',
            values: [
                {
                    title: 'Fuel • Gallon',
                    secondTitle: 'Gallon',
                    key: 'fuelGalons',
                    template: 'textWithTitle',
                    format: 'number',
                },
                {
                    title: 'Fuel • Cost',
                    secondTitle: 'Cost',
                    key: 'fuelCost',
                    template: 'textWithTitle',
                    format: 'currency',
                },
                {
                    title: 'Fuel • MPG',
                    secondTitle: 'MPG',
                    key: 'fuelMpg',
                    template: 'fuelMpg',
                    format: 'number',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Miles',
            values: [
                {
                    title: 'Miles • Loaded',
                    secondTitle: 'Loaded',
                    key: 'milesLoaded',
                    template: 'textWithTitle',
                    format: 'number',
                },
                {
                    title: 'Miles • Empty',
                    secondTitle: 'Empty',
                    key: 'milesEmpty',
                    template: 'textWithTitle',
                    format: 'number',
                },
                {
                    title: 'Miles • Total',
                    secondTitle: 'Total',
                    key: 'milesTotal',
                    template: 'textWithTitle',
                    format: 'number',
                },
            ],
        },
        {
            title: 'Revenue',
            key: 'revenue',
            template: 'textWithTitle',
            format: 'currency',
        },
    ];
}
