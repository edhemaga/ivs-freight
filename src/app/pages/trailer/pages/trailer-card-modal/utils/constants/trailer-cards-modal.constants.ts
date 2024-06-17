import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TrailerCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'VIN',
            key: 'tableVin',
            secondKey: 'regularText',
            thirdKey: 'boldText',
            selected: true,
        },
        {
            title: 'Make',
            key: 'trailerMake',
            secondKey: 'name',
            selected: true,
        },
        {
            title: 'Model',
            key: 'tableModel',
            selected: true,
        },
        {
            title: 'Lenght',
            key: 'trailerLength',
            secondKey: 'name',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Year',
            key: 'year',
            selected: true,
        },
        {
            title: 'Color',
            key: 'color',
            secondKey: 'code',
            thirdKey: 'name',
            selected: true,
        },
        {
            title: 'Licence Exp.',
            key: 'tableLicencePlateDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },
        {
            title: 'FHWA Exp.',
            key: 'tableFHWAInspectionExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            title: 'Type',
        },
        {
            title: 'VIN',
            key: 'tableVin',
            secondKey: 'regularText',
            thirdKey: 'boldText',
        },
        {
            title: 'Make',
            key: 'trailerMake',
            secondKey: 'name',
        },
        {
            title: 'Model',
            key: 'tableModel',
        },
        {
            title: 'Year',
            key: 'year',
        },
        {
            title: 'Color',
            key: 'color',
            secondKey: 'code',
            thirdKey: 'name',
        },
        {
            title: 'Lenght',
            key: 'trailerLength',
            secondKey: 'name',
        },
        {
            title: 'Owner',
            key: 'owner',
            secondKey: 'name',
        },
        {
            isDropdown: true,
            title: 'Weight',
            values: [
                {
                    id: 4,
                    title: 'Weight • Empty',
                    secondTitle: 'Empty',
                    key: 'emptyWeight',
                },
                {
                    id: 12,
                    title: 'Weight • Volume',
                    secondTitle: 'Volume',
                    key: 'volume',
                },
            ],
        },
        {
            title: 'Axie',
            key: 'axles',
        },
        {
            title: 'Suspension',
            key: 'suspension',
            secondKey: 'name',
        },
        {
            title: 'Tire Size',
            key: 'tireSize',
            secondKey: 'name',
        },
        {
            title: 'Reefer Unit',
            key: 'reeferUnit',
            secondKey: 'name',
        },
        {
            title: 'Door Type',
            key: 'doorType',
            secondKey: 'name',
        },
        {
            title: 'Ins. Policy',
            key: 'insurancePolicy',
        },
        {
            title: 'Mileage',
            key: 'mileage',
        },
        {
            isDropdown: true,
            title: 'Purchase Detail',
            values: [
                {
                    id: 4,
                    title: 'Purchase Detail • Date',
                    secondTitle: 'Date',
                    key: 'purchaseDate',
                },
                {
                    id: 12,
                    title: 'Purchase Detail • Price',
                    secondTitle: 'Price',
                    key: 'purchasePrice',
                },
            ],
        },
        {
            title: 'Licence Exp.',
            key: 'tableLicencePlateDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'FHWA Exp.',
            key: 'tableFHWAInspectionExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
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
