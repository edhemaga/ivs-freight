import { CardRows } from '@shared/models/card-models/card-rows.model';

export class PMCardsModalConfig {
    static rows: number = 4;

    static page: string = 'PM';

    static card_title: string = 'textUnit';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Engine Oil & Filter',
            field: 'oilFilter',
            key: 'oilFilter.expirationMiles',
            secondKey: 'oilFilter.percentage',
            type: 'progress',
        },
        {
            title: 'Air Filter',
            field: 'airFilter',
            key: 'airFilter.expirationMiles',
            secondKey: 'airFilter.percentage',
            type: 'progress',
        },
        {
            title: 'Transmission Fluid',
            field: 'transFluid',
            key: 'transFluid.expirationMiles',
            secondKey: 'transFluid.percentage',
            type: 'progress',
        },
        {
            title: 'Belts',
            field: 'belts',
            key: 'belts.expirationMiles',
            secondKey: 'belts.percentage',
            type: 'progress',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Make',
            key: 'textMake',
        },
        {
            title: 'Odometer',
            key: 'textOdometer',
        },
        {
            title: 'Last Service',
            key: 'lastService',
        },
        {
            title: 'Shop Detail • Name',
            secondTitle: 'Name',
            key: 'textRepairShop',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'General',
            field: 'general',
            key: 'general.expirationDaysText',
            secondKey: 'general.percentage',
            type: 'progress',
        },
        {
            title: 'Alignment',
            field: 'alignment',
            key: 'alignment.expirationDaysText',
            secondKey: 'alignment.percentage',
            type: 'progress',
        },
        {
            title: 'Reefer Unit',
            field: 'reeferUnit',
            key: 'reeferUnit.expirationDaysText',
            secondKey: 'reeferUnit.percentage',
            type: 'progress',
        },
        {
            title: 'PTO Pump',
            field: 'ptoPump',
            key: 'ptoPump.expirationDaysText',
            secondKey: 'ptoPump.percentage',
            type: 'progress',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Make',
            key: 'textMake',
        },
        {
            title: 'Odometer',
            key: 'textOdometer',
        },
        {
            title: 'Last Service',
            key: 'lastService',
        },
        {
            title: 'Shop Detail • Name',
            secondTitle: 'Name',
            key: 'textRepairShop',
        },
        null,
        null,
    ];
}
