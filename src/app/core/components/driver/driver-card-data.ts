import { CardRows } from '../shared/model/cardData';

export class DisplayDriverConfiguration {
    static rows: number = 4;

    static page: string = 'Driver';

    static cardTitle: string = 'fullName';

    // Data for applicants front
    static displayRowsFrontApplicants: CardRows[] = [
        {
            title: 'Status',
            endpoint: 'no-endpoint',
        },

        {
            title: 'Application Process',
            endpoint: 'tableApplicantProgress',
        },

        {
            title: 'CDL Expiration',
            endpoint: 'tableCdl.expirationDays',
            secondEndpoint: 'tableCdl.percentage',
        },

        {
            title: 'Medical Expiration',
            endpoint: 'tableMedical.expirationDays',
            secondEndpoint: 'tableMedical.percentage',
        },
    ];

    // Data for applicants back
    static displayRowsBackApplicants: CardRows[] = [
        {
            title: 'Date of Birth',
            endpoint: 'no-endpoint',
        },

        {
            title: 'Phone',
            endpoint: 'phone',
        },

        {
            title: 'Email',
            endpoint: 'email',
        },

        {
            title: 'Date Accepted',
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
