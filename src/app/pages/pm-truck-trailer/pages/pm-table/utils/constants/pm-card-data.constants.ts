import { CardRows } from 'src/app/core/components/shared/model/card-data.model';

export class DisplayPMConfiguration {
    static ROWS: number = 4;

    static PAGE: string = 'PM';

    static CARD_TITLE: string = 'textUnit';

    // Data for active front
    static DISPLAY_ROWS_FRONT_ACTIVE: CardRows[] = [
        {
            title: 'Oil & Filter',
            key: 'oilFilter.expirationDaysText',
            secondKey: 'oilFilter.percentage',
        },
        {
            title: 'Air Filter',
            key: 'airFilter.expirationDaysText',
            secondKey: 'airFilter.percentage',
        },
        {
            title: 'Trans. Fluid',
            key: 'transFluid.percentage',
            secondKey: 'transFluid.percentage',
        },
        {
            title: 'Belts',
            key: 'belts.expirationDaysText',
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
            key: 'general.expirationDaysText',
            secondKey: 'general.percentage',
        },
        {
            title: 'Alignment',
            key: 'alignment.expirationDaysText',
            secondKey: 'alignment.percentage',
        },
        {
            title: 'Reefer Unit',
            key: 'reeferUnit.expirationDaysText',
            secondKey: 'reeferUnit.percentage',
        },
        {
            title: 'PTO Pump',
            key: 'ptoNumber.expirationDaysText',
            secondKey: 'ptoNumber.percentage',
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
