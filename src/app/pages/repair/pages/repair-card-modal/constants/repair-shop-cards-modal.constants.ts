import { CardRows } from '@shared/models/card-models/card-rows.model';

export class RepairShopCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Address',
            key: 'address',
            secondKey: 'address',
        },
        {
            title: 'Services',
            key: 'serviceTypes',
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Bill',
            key: 'bill',
        },
        {
            title: 'Expense',
            key: 'expense',
        },
        {
            title: 'Contact',
            key: 'contacts',
        },
        {
            title: 'Rating & Review',
            key: 'rating',
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Address',
            key: 'address',
            secondKey: 'address',
        },
        {
            title: 'Service Type',
            key: 'shopServiceType',
            secondKey: 'name',
        },
        {
            title: 'Services',
            key: 'serviceTypes',
        },
        {
            title: 'Open Hours',
            key: 'tableOpenHours',
        },
        {
            title: 'Bill',
            key: 'bill',
        },
        {
            title: 'Order',
            key: 'order',
        },
        {
            isDropdown: true,
            title: 'Bank Detail',
            values: [
                {
                    title: 'Bank • Name',
                    secondTitle: 'Name',
                    key: 'tableBankDetailsBankName',
                },
                {
                    title: 'Bank • Routing',
                    secondTitle: 'Routing',
                    key: 'tableBankDetailsRouting',
                },
                {
                    title: 'Bank • Account',
                    secondTitle: 'Account',
                    key: 'tableBankDetailsAccount',
                },
            ],
        },
        {
            title: 'Rating & Review',
            key: 'rating',
        },
        {
            title: 'Contact',
            key: 'contacts',
        },
        {
            title: 'Expense',
            key: 'tableExpense',
        },
        {
            title: 'Last Used',
            key: 'tableLastUsed',
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
