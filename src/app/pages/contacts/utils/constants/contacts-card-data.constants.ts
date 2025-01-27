import { CardRows } from '@shared/models/card-models/card-rows.model';

export class ContactsCardData {
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
