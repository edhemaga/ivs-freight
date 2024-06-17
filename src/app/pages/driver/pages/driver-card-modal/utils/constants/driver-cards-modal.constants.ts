import { CardRows } from '@shared/models/card-models/card-rows.model';

export class DriverCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
            selected: true,
        },
        {
            title: 'SSN No.',
            key: 'ssn',
            selected: true,
        },

        {
            title: 'CDL No.',
            key: 'tableCdlDetailNumber',
            selected: true,
        },

        {
            title: 'Pay Type',
            key: 'tablePayrollDetailType',
            selected: true,
        },
    ];
    static backDataLoad: CardRows[] = [
        {
            title: 'Hired',
            key: 'tabelHired',
            selected: true,
        },

        {
            title: 'CDL Exp.',
            key: 'tableCdlDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },

        {
            title: 'Medical Exp.',
            key: 'tableMedicalData',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },

        {
            title: 'MVR Exp.',
            key: 'tableMvrDetailsExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
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
        {
            title: 'Date Added',
            key: 'createdAt',
        },
        {
            title: 'Date Edited',
            key: 'updatedAt',
        },
    ];
}
