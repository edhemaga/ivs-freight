import { CardRows } from '../shared/model/cardData';
export class DisplayPMConfiguration {
    static rows: number = 4;

    static page: string = 'PM';

    static cardTitle: string = 'textUnit';

    // Data for active front
    static displayRowsFrontActive: CardRows[] = [
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
    static displayRowsBackActive: CardRows[] = [
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
    static displayRowsFrontInactive: CardRows[] = [
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
    static displayRowsBackInactive: CardRows[] = [
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
