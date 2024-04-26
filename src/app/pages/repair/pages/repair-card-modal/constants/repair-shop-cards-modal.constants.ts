import { CardRows } from '@shared/models/card-models/card-rows.model';

export class RepairShopCardsModalData {
    static frontDataLoad: CardRows[] = [
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
            title: 'Address',
            key: 'address',
            selected: true,
        },
        {
            title: 'Length',
            key: 'length',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Bill',
            key: 'bill',
            selected: true,
        },
        {
            title: 'Expense',
            key: 'expense',
            selected: true,
        },
        {
            title: 'Contact',
            key: 'contact',
            selected: true,
        },
        {
            title: 'Rating & Review',
            key: 'rating',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            id: 1,
            title: 'Phone',
            key: 'phone',
        },
        {
            id: 2,
            title: 'Email',
            key: 'email',
        },
        {
            id: 3,
            title: 'Address',
            key: 'address',
        },
        {
            id: 4,
            title: 'Length',
            key: 'length',
        },
        {
            id: 5,
            title: 'Bill',
            key: 'bill',
        },
        {
            id: 6,
            title: 'Expense',
            key: 'expense',
        },
        {
            id: 7,
            title: 'Contact',
            key: 'contact',
        },
        {
            id: 8,
            title: 'Rating & Review',
            key: 'rating',
        },
        {
            id: 14,
            title: 'Date Added',
            key: 'createdAt',
        },
        {
            id: 15,
            title: 'Date Edited',
            key: 'updatedAt',
        },
    ];
}
