import { CardRows } from '@shared/models/card-models/card-rows.model';

export class DriverTableConfiguration {
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
