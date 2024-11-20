import { CardRows } from '@shared/models/card-models/card-rows.model';

export class FuelCardsModalConfig {
    static rows: number = 4;

    static page: string = 'fuel';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Date & Time',
            key: 'tableTransactionDate',
        },
        {
            title: 'Truck No.',
            key: 'tableTruckNumber',
        },
        {
            title: 'Item Detail • Description',
            key: 'descriptionItems',
        },
        {
            title: 'Item Detail • Total Cost',
            key: 'tabelDescriptionDropTotal',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Status',
            key: 'fuelType',
            secondKey: 'name',
        },

        {
            title: 'Payroll • Pay Type',
            secondTitle: 'Pay Type',
            key: 'paymentType',
            secondKey: 'name',
        },

        {
            title: 'Payroll • Commission',
            key: 'commission',
            sufix: '%',
        },

        {
            title: 'Payroll • Salary',
            key: 'salary',
            type: 'money',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Department',
            key: 'tableTableDept',
        },
        {
            title: 'Employee • Phone',
            key: 'phone',
        },

        {
            title: 'Employee • Email',
            key: 'email',
        },

        {
            title: 'Activity',
            key: 'tableActivity',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Status',
            key: 'fuelType',
            secondKey: 'name',
        },

        {
            title: 'Payroll • Pay Type',
            secondTitle: 'Pay Type',
            key: 'paymentType',
            secondKey: 'name',
        },

        {
            title: 'Payroll • Commission',
            key: 'commission',
            sufix: '%',
        },

        {
            title: 'Payroll • Salary',
            key: 'salary',
            type: 'money',
        },
        null,
        null,
    ];
}
