import { CardRows } from '../shared/model/card-data.model';
export class DisplayOwnerConfiguration {
    static rows: number = 4;

    static page: string = 'Owner';

    static cardTitle: string = 'name';

    // Data for active front
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

    // Data for active back
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
