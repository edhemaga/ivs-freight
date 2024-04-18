import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

export class AccountCardsModalConfig {
    static rows: number = 4;

    static page: string = 'Account';

    static displayRowsFront: CardRows[] = [
        {
            title: 'URL',
            key: 'url',
        },
        {
            title: 'Username',
            key: 'username',
        },
        {
            title: 'Password',
            key: 'password',
        },
        {
            title: 'Label',
            key: 'companyAccountLabel.name',
        },
        null,
        null,
    ];

    static displayRowsBack: CardRows[] = [null, null, null, null, null, null];
}
