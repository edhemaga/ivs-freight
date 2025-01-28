import { CardRows } from '@shared/models/card-models/card-rows.model';

export class AccountCardData {
    static DISPLAY_ROWS_FRONT_ACTIVE: CardRows[] = [
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
            key: 'colorLabels',
        },
    ];
}
