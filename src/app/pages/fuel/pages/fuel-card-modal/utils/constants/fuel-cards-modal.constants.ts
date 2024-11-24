import { CardRows } from '@shared/models/card-models/card-rows.model';

export class FuelCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Department',
            key: 'tableTableDept',
            selected: true,
        },
        {
            title: 'Employee • Phone',
            key: 'phone',
            selected: true,
        },

        {
            title: 'Employee • Email',
            key: 'email',
            selected: true,
        },
        {
            title: 'Activity',
            key: 'tableActivity',
            selected: true,
        },
    ];
    static backDataLoad: CardRows[] = [
        {
            title: 'Status',
            key: 'fuelType',
            secondKey: 'name',
            selected: true,
        },
        {
            title: 'Payroll • Pay Type',
            secondTitle: 'Pay Type',
            key: 'paymentType',
            secondKey: 'name',
            selected: true,
        },
        {
            title: 'Payroll • Commission',
            key: 'commission',
            sufix: '%',
            selected: true,
        },
        {
            title: 'Payroll • Salary',
            key: 'salary',
            type: 'money',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            title: 'Department',
            key: 'tableTableDept',
        },
        {
            isDropdown: true,
            title: 'Employee Detail',
            values: [
                {
                    title: 'Employee • Office',
                    secondTitle: 'Office',
                    key: 'tableTableOffice',
                },
                {
                    title: 'Employee • Phone',
                    secondTitle: 'Phone',
                    key: 'phone',
                },
                {
                    title: 'Employee • Email',
                    secondTitle: 'Email',
                    key: 'email',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Personal Detail',
            values: [
                {
                    title: 'Personal • Phone',
                    secondTitle: 'Phone',
                    key: 'personalPhone',
                },
                {
                    title: 'Personal • Email',
                    secondTitle: 'Email',
                    key: 'personalEmail',
                },
                {
                    title: 'Personal • Address',
                    secondTitle: 'Address',
                    key: 'address',
                    secondKey: 'address',
                },
            ],
        },
        {
            title: 'Status',
            key: 'fuelType',
            secondKey: 'name',
        },
        {
            title: 'Activity',
            key: 'tableActivity',
        },
        {
            isDropdown: true,
            title: 'Bank Detail',
            values: [
                {
                    title: 'Bank • Name',
                    secondTitle: 'Name',
                    key: 'bank',
                    secondKey: 'name',
                },
                {
                    title: 'Bank • Routing',
                    secondTitle: 'Routing',
                    key: 'routingNumber',
                },
                {
                    title: 'Bank • Account',
                    secondTitle: 'Account',
                    key: 'accountNumber',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Payroll Detail',
            values: [
                {
                    title: 'Payroll • Pay Type',
                    secondTitle: 'Pay Type',
                    key: 'paymentType',
                    secondKey: 'name',
                },
                {
                    title: 'Payroll • Form',
                    secondTitle: 'Form',
                    key: 'is1099',
                },
                {
                    title: 'Payroll • Commission',
                    secondTitle: 'Commission',
                    key: 'commission',
                    sufix: '%',
                },
                {
                    title: 'Payroll • Salary',
                    secondTitle: 'Salary',
                    key: 'salary',
                    type: 'money',
                },
            ],
        },
        {
            title: 'Date Hired',
            key: 'tableTableHired',
        },
        {
            title: 'Date Deactivated',
            key: 'tableDeactivated',
        },
        {
            title: 'Date Added',
            key: 'tableAdded',
        },
        {
            title: 'Date Edited',
            key: 'tableEdited',
        },
    ];
}
