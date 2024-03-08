import { CardRows } from '../shared/model/card-data.model';

export class DisplayContactsConfiguration {
    static rows: number = 4;

    static page: string = 'Contact';

    static cardTitle: string = 'name';

    // Data for applicants front
    static displayRowsFrontConctacts: CardRows[] = [
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

    static displayRowsBackConctacts: CardRows[] = [
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
