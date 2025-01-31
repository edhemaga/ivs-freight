import { CardRows } from '@shared/models/card-models/card-rows.model';

export class UserTableConfiguration {
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
