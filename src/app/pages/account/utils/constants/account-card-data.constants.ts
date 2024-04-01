import { CardRows } from 'src/app/core/components/shared/model/card-data.model';

export class DisplayAccountConfiguration {
    static ROWS: number = 4;

    static PAGE: string = 'Account';

    static CARD_TITLE: string = 'name';

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
