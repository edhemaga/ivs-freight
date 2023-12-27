import { CardRows } from '../shared/model/cardData';
export class DisplayOwnerConfiguration {
    static rows: number = 4;

    static page: string = 'Owner';

    static cardTitle: string = 'name';

    // Data for active front
    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'SSN',
            endpoint: 'ssnEin',
        },
        {
            title: 'Phone',
            endpoint: 'phone',
        },
        {
            title: 'Email',
            endpoint: 'email',
        },
        {
            title: 'Fleet',
            endpoint: '',
        },
    ];

    // Data for active back
    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Type',
            endpoint: 'textType',
        },
        {
            title: 'Bank Name',
            endpoint: 'textBankName',
        },
        {
            title: 'Routing',
            endpoint: 'routingNumber',
        },
        {
            title: 'Bank Account',
            endpoint: 'accountNumber',
        },
    ];

    // Data for inactive front
    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Type',
            endpoint: 'phone',
        },
        {
            title: 'SSN',
            endpoint: 'email',
        },
        {
            title: 'Phone',
            endpoint: 'address.address',
        },
        {
            title: 'Email',
            endpoint: 'email',
        },
        {
            title: 'Address',
            endpoint: 'address',
        },
        {
            title: 'Fleet',
            endpoint: '',
        },
    ];

    // Data for inactive back
    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Type',
            endpoint: 'textType',
        },
        {
            title: 'Bank Name',
            endpoint: 'textBankName',
        },
        {
            title: 'Routing',
            endpoint: 'routingNumber',
        },
        {
            title: 'Bank Account',
            endpoint: 'accountNumber',
        },
    ];
}
