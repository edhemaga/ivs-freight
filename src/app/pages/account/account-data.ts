import { CardRows } from '../shared/model/card-data.model';

export class DisplayAccountConfiguration {
    static ROWS: number = 4;

    static PAGE: string = 'Account';

    static CARD_TITLE: string = 'name';

    // Data for active front
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
