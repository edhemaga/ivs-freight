import { CardRows } from 'src/app/core/components/shared/model/card-data.model';

export class PmCardDataConfigConstants {
    static ROWS: number = 4;

    static PAGE: string = 'PM';

    static CARD_TITLE: string = 'textUnit';

    // Data for active front
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

    // Data for active back
    static DISPLAY_ROWS_BACK_ACTIVE: CardRows[] = [
        {
            title: 'Make',
            key: 'ruMake',
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

    // Data for inactive front
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

    // Data for inactive back
    static DISPLAY_ROWS_BACK_INACTIVE: CardRows[] = [
        {
            title: 'Make',
            key: 'ruMake',
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
