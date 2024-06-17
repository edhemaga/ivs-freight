import { CardRows } from '@shared/models/card-models/card-rows.model';

export class DriverCardsModalConfig {
    static rows: number = 4;

    static page: string = 'driver';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'SSN No.',
            key: 'ssn',
        },

        {
            title: 'CDL No.',
            key: 'tableCdlDetailNumber',
        },

        {
            title: 'Pay Type',
            key: 'tablePayrollDetailType',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Hired',
            key: 'tabelHired',
        },

        {
            title: 'CDL Exp.',
            key: 'tableCdlDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },

        {
            title: 'Medical Exp.',
            key: 'tableMedicalData',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },

        {
            title: 'MVR Exp.',
            key: 'tableMvrDetailsExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },

        {
            title: 'SSN No.',
            key: 'ssn',
        },

        {
            title: 'CDL No.',
            key: 'tableCdlDetailNumber',
        },

        {
            title: 'Pay Type',
            key: 'tablePayrollDetailType',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Hired',
            key: 'tabelHired',
        },
        {
            title: 'CDL Exp.',
            key: 'tableCdlDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'Medical Exp.',
            key: 'tableMedicalData',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'MVR Exp.',
            key: 'tableMvrDetailsExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        null,
        null,
    ];

    static displayRowsFrontApplicant: CardRows[] = [
        {
            title: 'Status',
            key: 'tableRev',
            secondKey: 'title',
        },
        {
            title: 'Application Process',
            key: 'tableApplicantProgress',
        },
        {
            title: 'CDL Detail • Expiration',
            key: 'tableCdlDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'Medical Exp.',
            key: 'tableMedicalData',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        null,
        null,
    ];

    static displayRowsBackApplicant: CardRows[] = [
        {
            title: 'Date of Birth',
            key: 'tableDOB',
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
            title: 'Date Added',
            key: 'tableAdded',
        },
        null,
        null,
    ];
}
