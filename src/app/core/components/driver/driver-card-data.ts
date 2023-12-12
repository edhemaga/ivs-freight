import { CardRows } from '../shared/model/cardData';

export class DisplayDriverConfiguration {
    static rows: number = 4;

    static page: string = 'Driver';

    static cardTitle: string = 'fullName';

    // Data for applicants
    static displayRowsBackApplicants: CardRows[] = [
        {
            title: 'Shipping Hours',
            endpoint: 'no-endpoint',
        },

        {
            title: 'Receiving Hours',
            endpoint: 'no-endpoint',
        },

        {
            title: 'Avg. Pickup Time',
            endpoint: 'no-endpoint',
        },

        {
            title: 'Avg. Delivery Time',
            endpoint: 'no-endpoint',
        },
    ];

    // Data for active front
    static displayRowsActiveFront: CardRows[] = [
        {
            title: 'Phone No.',
            endpoint: 'phone',
        },

        {
            title: 'SSN No.',
            endpoint: 'ssn',
        },

        {
            title: 'CDL No.',
            endpoint: 'cdlNumber',
        },

        {
            title: 'Pay Type',
            endpoint: 'payType.name',
        },
    ];
    // Data for active back
    static displayRowsActiveBack: CardRows[] = [
        {
            title: 'Hired',
            endpoint: 'hired',
        },

        {
            title: 'CDL Exp.',
            endpoint: 'tableCdlDetailExpiration.expirationDaysText',
            secondEndpoint: 'tableCdlDetailExpiration.percentage',
        },

        {
            title: 'Medical Exp.',
            endpoint: 'tableMedicalData.expirationDaysText',
            secondEndpoint: 'tableMedicalData.percentage',
        },

        {
            title: 'MVR Exp.',
            endpoint: 'tableMvrDetailsExpiration.expirationDaysText',
            secondEndpoint: 'tableMvrDetailsExpiration.percentage',
        },
    ];
}
