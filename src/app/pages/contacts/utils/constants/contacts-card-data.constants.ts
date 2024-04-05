import { CardRows } from 'src/app/shared/models/card-data.model';

export class ContactsCardData {
    static rows: number = 4;

    static page: string = 'Contact';

    static cardTitle: string = 'name';

    static displayRowsFrontContacts: CardRows[] = [
        {
            title: 'Company',
            endpoint: 'companyName',
        },

        {
            title: 'Primary Phone',
            endpoint: 'contactPhones',
        },

        {
            title: 'Primary Email',
            endpoint: 'contactEmails',
        },

        {
            title: 'Label',
            endpoint: 'no-endpoint',
        },
    ];

    static displayRowsBackContacts: CardRows[] = [
        {
            title: 'Second Phone',
            endpoint: 'contactPhonesFirst',
        },

        {
            title: 'Third Phone',
            endpoint: 'contactPhonesSecc',
        },

        {
            title: 'Second Email',
            endpoint: 'contactEmails',
        },

        {
            title: 'Shared With',
            endpoint: 'no-endpoint',
        },
    ];
}
