import { ICardValueData } from '@shared/interfaces';

export class AccountCardDataConfig {
    static FRONT_SIDE_DATA: ICardValueData[] = [
        {
            title: 'URL',
            key: 'url',
            template: 'textWithTitle',
        },
        {
            title: 'Username',
            key: 'username',
            template: 'textWithTitle',
        },
        {
            title: 'Password',
            key: 'password',
            template: 'password',
        },
        {
            title: 'Label',
            key: 'lable',
            template: 'textWithTitle',
        },
    ];

    static BACK_SIDE_DATA: ICardValueData[] = [];

    static CARD_ALL_DATA: ICardValueData[] = [
        {
            title: 'URL',
            key: 'url',
            template: 'textWithTitle',
        },
        {
            title: 'Username',
            key: 'username',
            template: 'textWithTitle',
        },
        {
            title: 'Password',
            key: 'password',
            template: 'password',
        },
        {
            title: 'Label',
            key: 'lable',
            template: 'textWithTitle',
        },
    ];
}
