import { CardRows } from '@shared/models/card-models/card-rows.model';

export class CustomerCardsModalData {
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
    static backDataLoad: CardRows[] = [
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
            secondKey: 'address',
        },
        {
            id: 4,
            title: 'Load Count',
            key: 'loadCount',
        },
        {
            isDropdown: true,
            title: 'Avg. Wait Time',
            values: [
                {
                    id: 5,
                    title: 'Avg. Wait Time • Pickup',
                    secondTitle: 'Pickup',
                    key: 'avgPickupTimeInMin',
                },
                {
                    id: 6,
                    title: 'Avg. Wait Time • Delivery',
                    secondTitle: 'Delivery',
                    key: 'avgDeliveryTimeInMin',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Work Hours',
            values: [
                {
                    id: 7,
                    title: 'Work Hours • Shipping',
                    secondTitle: 'Shipping',
                    key: 'shippingFrom',
                },
                {
                    id: 8,
                    title: 'Work Hours • Receiving',
                    secondTitle: 'Receiving',
                    key: 'receivingFrom',
                },
            ],
        },
        {
            id: 9,
            title: 'Contacts',
            key: 'shipperContacts',
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
        {
            id: 12,
            title: 'Date Moved',
            key: 'updatedAt',
        },
    ];
}
