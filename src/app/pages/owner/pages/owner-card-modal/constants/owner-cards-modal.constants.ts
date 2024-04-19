import { CardRows } from '@shared/models/card-models/card-rows.model';

export class OwnerCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'EIN / SSN',
            key: 'ssnEin',
            selected: true,
        },
        {
            title: 'Phone',
            key: 'phone',
            selected: true,
        },
        {
            title: 'Email',
            key: 'email',
            selected: true,
        },
        {
            title: 'Fleet',
            key: 'trucks',
            secondKey: 'trailers',
            selected: true,
        },
    ];
    static backDataLoad: CardRows[] = [
        {
            title: 'Owner Type',
            key: 'ownerType.name',
            selected: true,
        },
        {
            title: 'Bank Detail • Name',
            key: 'bankName',
            selected: true,
        },
        {
            title: 'Bank Detail • Routing',
            key: 'routingNumber',
            selected: true,
        },
        {
            title: 'Bank Detail • Expiration',
            key: 'accountNumber',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            id: 1,
            title: 'EIN / SSN',
            key: 'ssnEin',
        },
        {
            id: 2,
            title: 'Phone',
            key: 'phone',
        },
        {
            id: 3,
            title: 'Email',
            key: 'email',
        },
        {
            id: 4,
            title: 'Fleet',
            key: 'trucks',
            secondKey: 'trailers',
        },
        {
            id: 5,
            title: 'Owner Type',
            key: 'ownerType.name',
        },
        {
            id: 6,
            title: 'Bank Detail • Name',
            key: 'bankName',
        },
        {
            id: 7,
            title: 'Bank Detail • Routing',
            key: 'routingNumber',
        },
        {
            id: 8,
            title: 'Bank Detail • Expiration',
            key: 'accountNumber',
        },
        {
            id: 9,
            title: 'Address',
            key: 'address',
        },
        {
            id: 10,
            title: 'Date Added',
            key: 'createdAt',
        },
        {
            id: 11,
            title: 'Date Edited',
            key: 'updatedAt',
        },
    ];
}
