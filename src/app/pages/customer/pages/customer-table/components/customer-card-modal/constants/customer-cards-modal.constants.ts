import { CardRows } from '@shared/models/card-models/card-rows.model';

export class CustomerCardsModalData {
    static rowValues: number[] = [3, 4, 5, 6];

    static frontDataBroker: CardRows[] = [
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
            title: 'Billing Detail • Available Credit',
            secondTitle: 'Available Credit',
            key: 'availableCredit',
            selected: true,
        },
        {
            title: 'Billing Detail • Unpaid Invoice Ageing',
            secondTitle: 'Unpaid Invoice Ageing',
            key: 'brokerUnpaidInvoiceAgeing',
            secondKey: 'totalDebt',
            selected: true,
        },
        null,
        null,
    ];
    static backDataBroker: CardRows[] = [
        {
            title: 'Contacts',
            key: 'brokerContacts',
            selected: true,
        },
        {
            title: 'Price per Mile',
            key: 'pricePerMile',
            selected: true,
        },
        {
            title: 'Load Count',
            key: 'loadCount',
            selected: true,
        },
        {
            title: 'Revenue',
            key: 'revenue',
            selected: true,
        },
        null,
        null,
    ];

    static frontDataShipper: CardRows[] = [
        {
            id: 1,
            title: 'Phone',
            key: 'phone',
            selected: true,
        },
        {
            id: 2,
            title: 'Email',
            key: 'email',
            selected: true,
        },
        {
            id: 3,
            title: 'Address',
            key: 'address',
            secondKey: 'address',
            selected: true,
        },
        {
            id: 4,
            title: 'Load Count',
            key: 'loadCount',
            selected: true,
        },
        null,
        null,
    ];

    static backDataShipper: CardRows[] = [
        {
            id: 7,
            title: 'Work Hours • Shipping',
            secondTitle: 'Shipping',
            key: 'shippingFrom',
            selected: true,
        },
        {
            id: 8,
            title: 'Work Hours • Receiving',
            secondTitle: 'Receiving',
            key: 'receivingFrom',
            selected: true,
        },
        {
            id: 5,
            title: 'Avg. Wait Time • Pickup',
            secondTitle: 'Pickup',
            key: 'avgPickupTimeInMin',
            selected: true,
        },
        {
            id: 6,
            title: 'Avg. Wait Time • Delivery',
            secondTitle: 'Delivery',
            key: 'avgDeliveryTimeInMin',
            selected: true,
        },
        null,
        null,
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

    static allDataLoadBroker: CardRows[] = [
        {
            title: 'DBA Name',
            key: 'dbaName',
        },
        {
            title: 'EIN',
            key: 'ein',
        },
        {
            title: 'MC/FF',
            key: 'mcNumber',
        },
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Address',
            isDropdown: true,
            values: [
                {
                    id: 5,
                    title: 'Address • Physical',
                    secondTitle: 'Physical',
                    key: 'mainAddress',
                    secondKey: 'address',
                },
                {
                    id: 5,
                    title: 'Address • Billing',
                    secondTitle: 'Billing',
                    key: 'billingAddress',
                    secondKey: 'address',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Billing Detail',
            values: [
                {
                    title: 'Billing Detail • Credit Limit',
                    secondTitle: 'Credit Limit',
                    key: 'creditLimit',
                },
                {
                    title: 'Billing Detail • Pay Term',
                    secondTitle: 'Pay Term',
                    key: 'payTerm',
                },
                {
                    title: 'Billing Detail • Available Credit',
                    secondTitle: 'Available Credit',
                    key: 'availableCredit',
                },
                {
                    title: 'Billing Detail • Unpaid Invoice Ageing',
                    secondTitle: 'Unpaid Invoice Ageing',
                    key: 'brokerUnpaidInvoiceAgeing',
                    secondKey: 'totalDebt',
                },
                {
                    title: 'Billing Detail • Paid Invoice Ageing',
                    secondTitle: 'Paid Invoice Ageing',
                    key: 'brokerPaidInvoiceAgeing',
                    secondKey: 'totalPaid',
                },
            ],
        },
        {
            title: 'Load Count',
            key: 'loadCount',
        },
        {
            title: 'Miles',
            key: 'miles',
        },
        {
            title: 'Price per Mile',
            key: 'pricePerMile',
        },
        {
            title: 'Contacts',
            key: 'brokerContacts',
        },
        {
            title: 'Revenue',
            key: 'revenue',
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
