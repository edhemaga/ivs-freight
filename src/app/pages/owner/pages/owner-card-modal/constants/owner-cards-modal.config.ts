import { CardRows } from '@shared/models/card-models/card-rows.model';

export class OwnerCardsModalConfig {
    static rows: number = 4;

    static page: string = 'Owner';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'EIN / SSN',
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
            key: 'trucks',
            secondKey: 'trailers',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Owner Type',
            key: 'ownerType.name',
        },
        {
            title: 'Bank Detail • Name',
            key: 'bankName',
        },
        {
            title: 'Bank Detail • Routing',
            key: 'routingNumber',
        },
        {
            title: 'Bank Detail • Expiration',
            key: 'accountNumber',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'EIN / SSN',
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
            key: 'trucks',
            secondKey: 'trailers',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Owner Type',
            key: 'ownerType.name',
        },
        {
            title: 'Bank Detail • Name',
            key: 'bankName',
        },
        {
            title: 'Bank Detail • Routing',
            key: 'routingNumber',
        },
        {
            title: 'Bank Detail • Expiration',
            key: 'accountNumber',
        },
        null,
        null,
    ];
}
