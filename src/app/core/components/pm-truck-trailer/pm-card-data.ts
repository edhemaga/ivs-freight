import { CardRows } from '../shared/model/card-data.model';
export class DisplayPMConfiguration {
    static ROWS: number = 4;

    static PAGE: string = 'PM';

    static CARD_TITLE: string = 'textUnit';

    // Data for active front
    static DISPLAY_ROWS_FRONT_ACTIVE: CardRows[] = [
        {
            title: 'Oil & Filter',
            endpoint: 'oilFilter.expirationDaysText',
            secondEndpoint: 'oilFilter.percentage',
        },
        {
            title: 'Air Filter',
            endpoint: 'airFilter.expirationDaysText',
            secondEndpoint: 'airFilter.percentage',
        },
        {
            title: 'Trans. Fluid',
            endpoint: 'transFluid.percentage',
            secondEndpoint: 'transFluid.percentage',
        },
        {
            title: 'Belts',
            endpoint: 'belts.expirationDaysText',
            secondEndpoint: 'belts.percentage',
        },
    ];

    // Data for active back
    static DISPLAY_ROWS_BACK_ACTIVE: CardRows[] = [
        {
            title: 'Make',
            endpoint: 'ruMake',
        },
        {
            title: 'Odometer',
            endpoint: 'textOdometer',
        },
        {
            title: 'Last Service',
            endpoint: 'lastService',
        },
        {
            title: 'Repair Shop',
            endpoint: 'repairShop',
        },
    ];

    // Data for inactive front
    static DISPLAY_ROWS_FRONT_INACTIVE: CardRows[] = [
        {
            title: 'General',
            endpoint: 'general.expirationDaysText',
            secondEndpoint: 'general.percentage',
        },
        {
            title: 'Alignment',
            endpoint: 'alignment.expirationDaysText',
            secondEndpoint: 'alignment.percentage',
        },
        {
            title: 'Reefer Unit',
            endpoint: 'reeferUnit.expirationDaysText',
            secondEndpoint: 'reeferUnit.percentage',
        },
        {
            title: 'PTO Pump',
            endpoint: 'ptoNumber.expirationDaysText',
            secondEndpoint: 'ptoNumber.percentage',
        },
    ];

    // Data for inactive back
    static DISPLAY_ROWS_BACK_INACTIVE: CardRows[] = [
        {
            title: 'Make',
            endpoint: 'ruMake',
        },
        {
            title: 'Odometer',
            endpoint: 'textOdometer',
        },
        {
            title: 'Last Service',
            endpoint: 'lastService',
        },
        {
            title: 'Repair Shop',
            endpoint: 'repairShop',
        },
    ];
}
