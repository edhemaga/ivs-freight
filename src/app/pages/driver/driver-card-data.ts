import { CardRows } from '../shared/model/card-data.model';

export class DisplayDriverConfiguration {
    static rows: number = 4;

    static page: string = 'Driver';

    static cardTitle: string = 'fullName';

    // Data for applicants front
    static displayRowsFrontApplicants: CardRows[] = [
        {
            title: 'Status',
            key: 'no-key',
        },

        {
            title: 'Application Process',
            key: 'tableApplicantProgress',
        },

        {
            title: 'CDL Expiration',
            key: 'tableCdl.expirationDays',
            secondKey: 'tableCdl.percentage',
        },

        {
            title: 'Medical Expiration',
            key: 'tableMedical.expirationDays',
            secondKey: 'tableMedical.percentage',
        },
    ];

    // Data for applicants back
    static displayRowsBackApplicants: CardRows[] = [
        {
            title: 'Date of Birth',
            key: 'no-key',
        },

        {
            title: 'Phone',
            key: 'phone',
        },

        {
            title: 'Email',
            key: 'email',
        },

        {
            title: 'Date Accepted',
            key: 'no-key',
        },
    ];

    // Data for active front
    static displayRowsActiveFront: CardRows[] = [
        {
            title: 'Phone No.',
            key: 'phone',
        },

        {
            title: 'SSN No.',
            key: 'ssn',
        },

        {
            title: 'CDL No.',
            key: 'cdlNumber',
        },

        {
            title: 'Pay Type',
            key: 'payType.name',
        },
    ];
    // Data for active back
    static displayRowsActiveBack: CardRows[] = [
        {
            title: 'Hired',
            key: 'hired',
        },

        {
            title: 'CDL Exp.',
            key: 'tableCdlDetailExpiration.expirationDaysText',
            secondKey: 'tableCdlDetailExpiration.percentage',
        },

        {
            title: 'Medical Exp.',
            key: 'tableMedicalData.expirationDaysText',
            secondKey: 'tableMedicalData.percentage',
        },

        {
            title: 'MVR Exp.',
            key: 'tableMvrDetailsExpiration.expirationDaysText',
            secondKey: 'tableMvrDetailsExpiration.percentage',
        },
    ];
}
