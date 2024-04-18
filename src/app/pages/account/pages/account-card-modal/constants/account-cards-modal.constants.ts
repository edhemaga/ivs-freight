import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

export class AccountCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'URL',
            key: 'url',
            selected: true,
        },
        {
            title: 'Username',
            key: 'username',
            selected: true,
        },
        {
            title: 'Password',
            key: 'password',
            selected: true,
        },
        {
            title: 'Label',
            key: 'companyAccountLabel.name',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [];
    static allDataLoad: CardRows[] = [
        {
            id: 1,
            title: 'URL',
            key: 'url',
        },
        {
            id: 2,
            title: 'Username',
            key: 'username',
        },
        {
            id: 3,
            title: 'Password',
            key: 'password',
        },
        {
            id: 4,
            title: 'Label',
            key: 'companyAccountLabel.name',
        },
        {
            id: 5,
            title: 'Date Added',
            key: 'createdAt',
        },
        {
            id: 6,
            title: 'Date Edited',
            key: 'updatedAt',
        },
    ];
}
