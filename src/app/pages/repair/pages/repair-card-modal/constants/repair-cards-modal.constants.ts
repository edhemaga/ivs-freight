import { CardRows } from '@shared/models/card-models/card-rows.model';

export class RepairCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Date Issued',
            key: 'tableIssued',
            selected: true,
        },
        {
            title: 'Unit Detail • Number',
            key: 'tableUnit',
            selected: true,
        },
        {
            title: 'Item Detail • Description',
            key: 'items',
            selected: true,
        },
        {
            title: 'Item Detail • Cost',
            key: 'total',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Shop Detail • Name',
            key: 'repairShop',
            secondKey: 'name',
            selected: true,
        },
        {
            title: 'Shop Detail • Address',
            key: 'repairShop',
            secondKey: 'address',
            thirdKey: 'address',
            selected: true,
        },
        {
            title: 'Unit Detail • Type',
            key: 'unitType.name',
            selected: true,
        },
        {
            title: 'Unit Detail • Odometer',
            key: 'odometer',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            id: 1,
            title: 'Date Issued',
            key: 'tableIssued',
        },
        {
            id: 2,
            title: 'Date Paid',
            key: 'datePaid',
        },
        {
            id: 3,
            title: 'Pay Type',
            key: 'payType',
        },
        {
            isDropdown: true,
            title: 'Unit Detail',
            values: [
                {
                    id: 4,
                    title: 'Unit Detail • Number',
                    secondTitle: 'Number',
                    key: 'tableUnit',
                },
                {
                    id: 12,
                    title: 'Unit Detail • Type',
                    secondTitle: 'Type',
                    key: 'unitType.name',
                },
                {
                    id: 5,
                    title: 'Unit Detail • Make',
                    secondTitle: 'Make',
                    key: 'trailer',
                    secondKey: 'trailerMakeName',
                },
                {
                    id: 6,
                    title: 'Unit Detail • Model',
                    secondTitle: 'Model',
                    key: 'trailer',
                    secondKey: 'model',
                },
                {
                    id: 7,
                    title: 'Unit Detail • Year',
                    secondTitle: 'Year',
                    key: 'trailer',
                    secondKey: 'year',
                },
                {
                    id: 13,
                    title: 'Unit Detail • Odometer',
                    secondTitle: 'Odometer',
                    key: 'odometer',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Shop Detail',
            values: [
                {
                    id: 10,
                    title: 'Shop Detail • Name',
                    secondTitle: 'Name',
                    key: 'repairShop',
                    secondKey: 'name',
                },
                {
                    id: 11,
                    title: 'Shop Detail • Address',
                    secondTitle: 'Address',
                    key: 'repairShop',
                    secondKey: 'address',
                    thirdKey: 'address',
                },
            ],
        },
        {
            id: 16,
            title: 'Services',
            key: 'services',
        },
        {
            isDropdown: true,
            title: 'Item Detail',
            values: [
                {
                    id: 8,
                    title: 'Item Detail • Description',
                    secondTitle: 'Description',
                    key: 'items',
                },
                {
                    id: 9,
                    title: 'Item Detail • Cost',
                    secondTitle: 'Cost',
                    key: 'total',
                },
            ],
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
