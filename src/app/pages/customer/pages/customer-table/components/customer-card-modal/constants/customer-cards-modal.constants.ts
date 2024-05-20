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
                    secondKey: 'totalDebt'
                },
                {
                    title: 'Billing Detail • Paid Invoice Ageing',
                    secondTitle: 'Paid Invoice Ageing',
                    key: 'brokerPaidInvoiceAgeing',
                    secondKey: 'totalPaid'
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
