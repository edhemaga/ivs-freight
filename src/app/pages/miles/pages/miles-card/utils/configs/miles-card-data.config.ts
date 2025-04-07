import { ICardValueData } from '@shared/interfaces';

export class MilesCardDataConfig {
    static FRONT_SIDE_DATA: ICardValueData[] = [
        {
            title: 'Stops • Count',
            key: 'stopsCount',
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
            image: 'truckType.logo',
            template: 'textWithImage',
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
                },
                {
                    title: 'Stops • Pickup',
                    secondTitle: 'Pickup',
                    key: 'stopsPickup.count',
                    percentKey: 'stopsPickup.percent',
                    template: 'doubleTextPercent',
                },
                {
                    title: 'Stops • Delivery',
                    secondTitle: 'Delivery',
                    key: 'stopsDelivery.count',
                    percentKey: 'stopsDelivery.percent',
                    template: 'doubleTextPercent',
                },
                {
                    title: 'Stops • Fuel',
                    secondTitle: 'Fuel',
                    key: 'fuelCount?.count',
                    percentKey: 'fuelCount.percent',
                    template: 'doubleTextPercent',
                },
                {
                    title: 'Stops • Parking',
                    secondTitle: 'Parking',
                    key: 'parkingCount?.count',
                    percentKey: 'parkingCount.percent',
                    template: 'doubleTextPercent',
                },
                {
                    title: 'Stops • Deadhead',
                    secondTitle: 'Deadhead',
                    key: 'deadHeadCount?.count',
                    percentKey: 'deadHeadCount.percent',
                    template: 'doubleTextPercent',
                },
                {
                    title: 'Stops • Repair',
                    secondTitle: 'Repair',
                    key: 'repairCount?.count',
                    percentKey: 'repairCount.percent',
                    template: 'doubleTextPercent',
                },
                {
                    title: 'Stops • Towing',
                    secondTitle: 'Towing',
                    key: 'towingCount?.count',
                    percentKey: 'towingCount.percent',
                    template: 'doubleTextPercent',
                },
            ],
        },
        {
            title: 'Load',
            key: 'loadCount',
            template: 'textWithTitle',
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
                },
                {
                    title: 'Miles • Empty',
                    secondTitle: 'Empty',
                    key: 'milesEmpty',
                    template: 'textWithTitle',
                },
                {
                    title: 'Miles • Total',
                    secondTitle: 'Total',
                    key: 'milesTotal',
                    template: 'textWithTitle',
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
