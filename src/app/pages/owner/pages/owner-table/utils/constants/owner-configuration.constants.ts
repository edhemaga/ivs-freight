import { CardRows } from '@shared/models/card-models/card-rows.model';
export class OwnerConfiguration {
    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'SSN',
            key: 'ssnEin',
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
            title: 'Fleet',
            key: '',
        },
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Type',
            key: 'textType',
        },
        {
            title: 'Bank Name',
            key: 'textBankName',
        },
        {
            title: 'Routing',
            key: 'routingNumber',
        },
        {
            title: 'Bank Account',
            key: 'accountNumber',
        },
    ];

    // Data for inactive front
    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Type',
            key: 'phone',
        },
        {
            title: 'SSN',
            key: 'email',
        },
        {
            title: 'Phone',
            key: 'address.address',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Address',
            key: 'address',
        },
        {
            title: 'Fleet',
            key: '',
        },
    ];

    // Data for inactive back
    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Type',
            key: 'textType',
        },
        {
            title: 'Bank Name',
            key: 'textBankName',
        },
        {
            title: 'Routing',
            key: 'routingNumber',
        },
        {
            title: 'Bank Account',
            key: 'accountNumber',
        },
    ];
}
