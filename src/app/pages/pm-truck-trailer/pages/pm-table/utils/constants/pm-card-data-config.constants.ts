import { CardRows } from '@shared/models/card-models/card-rows.model';

export class PmCardDataConfigConstants {
    static DISPLAY_ROWS_FRONT_ACTIVE: CardRows[] = [
        {
            title: 'Oil & Filter',
            field: 'oilFilter',
            key: 'oilFilter.expirationMiles',
            secondKey: 'oilFilter.percentage',
        },
        {
            title: 'Air Filter',
            field: 'airFilter',
            key: 'airFilter.expirationMiles',
            secondKey: 'airFilter.percentage',
        },
        {
            title: 'Trans. Fluid',
            field: 'transFluid',
            key: 'transFluid.expirationMiles',
            secondKey: 'transFluid.percentage',
        },
        {
            title: 'Belts',
            field: 'belts',
            key: 'belts.expirationMiles',
            secondKey: 'belts.percentage',
        },
    ];

    static DISPLAY_ROWS_BACK_ACTIVE: CardRows[] = [
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
            title: 'Repair Shop',
            key: 'textRepairShop',
        },
    ];

    static DISPLAY_ROWS_FRONT_INACTIVE: CardRows[] = [
        {
            title: 'General',
            field: 'general',
            key: 'general.expirationDaysText',
            secondKey: 'general.percentage',
        },
        {
            title: 'Alignment',
            field: 'alignment',
            key: 'alignment.expirationDaysText',
            secondKey: 'alignment.percentage',
        },
        {
            title: 'Reefer Unit',
            field: 'reeferUnit',
            key: 'reeferUnit.expirationDaysText',
            secondKey: 'reeferUnit.percentage',
        },
        {
            title: 'PTO Pump',
            field: 'ptoPump',
            key: 'ptoPump.expirationDaysText',
            secondKey: 'ptoPump.percentage',
        },
    ];

    static DISPLAY_ROWS_BACK_INACTIVE: CardRows[] = [
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
            title: 'Repair Shop',
            key: 'repairShop',
        },
    ];
}
