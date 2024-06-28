import { CardRows } from '@shared/models/card-models/card-rows.model';

export class LoadCardModalData {
    static rowValues: number[] = [3, 4, 5, 6];

    static frontDataLoad: CardRows[] = [
        {
            title: 'Status',
            key: 'status',
            secondKey: 'statusString',
            selected: true,
        },
        {
            title: 'Pickup',
            key: 'pickup',
            secondKey: 'count',
            thirdKey: 'location',
            selected: true,
        },
        {
            title: 'Delivery',
            key: 'delivery',
            secondKey: 'count',
            thirdKey: 'location',
            selected: true,
        },
        {
            title: 'Billing • Rate',
            key: 'billing',
            secondKey: 'rate',
            type: 'money',
            selected: true,
        },
    ];
    static backDataLoad: CardRows[] = [
        {
            title: 'Assigned • Driver',
            key: 'driver',
            secondKey: 'avatarFile',
            selected: true,
        },
        {
            title: 'Assigned • Truck',
            key: 'driver',
            secondKey: 'truckNumber',
            selected: true,
        },
        {
            title: 'Assigned • Trailer',
            key: 'driver',
            secondKey: 'trailerNumber',
            selected: true,
        },
        {
            title: 'Miles • Total',
            key: 'miles',
            secondKey: 'total',
            type: 'miles',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            id: 1,
            title: 'Dispatcher',
            key: 'dispatcher',
            secondKey: 'avatarFile',
        },
        {
            isDropdown: true,
            title: 'Broker Detail',
            values: [
                {
                    id: 5,
                    title: 'Broker Detail • Business Name',
                    secondTitle: 'Business Name',
                    key: 'broker',
                    secondKey: 'businessName',
                },
                {
                    id: 5,
                    title: 'Broker Detail • Contact',
                    secondTitle: 'Contact',
                    key: 'broker',
                    secondKey: 'contact',
                },
                {
                    id: 6,
                    title: 'Broker Detail • Phone',
                    secondTitle: 'Phone',
                    key: 'broker',
                    secondKey: 'phone',
                    type: 'phone',
                },
            ],
        },
        {
            id: 2,
            title: 'Ref Number',
            key: 'loadDetails',
            secondKey: 'referenceNumber',
        },
        {
            id: 3,
            title: 'Commodity',
            key: 'loadDetails',
            secondKey: 'generalCommodityName',
        },
        {
            id: 4,
            title: 'Weight',
            key: 'loadDetails',
            secondKey: 'weight',
        },
        {
            isDropdown: true,
            title: 'Assigned',
            values: [
                {
                    id: 7,
                    title: 'Assigned • Driver',
                    secondTitle: 'Driver',
                    key: 'shippingFrom',
                },
                {
                    id: 8,
                    title: 'Assigned • Truck',
                    secondTitle: 'Truck',
                    key: 'receivingFrom',
                },
                {
                    id: 8,
                    title: 'Assigned • Trailer',
                    secondTitle: 'Trailer',
                    key: 'receivingFrom',
                },
            ],
        },
        {
            id: 9,
            title: 'Status',
            key: 'shipperContacts',
        },
        {
            id: 9,
            title: 'Pickup',
        },
        {
            id: 9,
            title: 'Delivery',
        },
        {
            isDropdown: true,
            title: 'Requirement',
            values: [
                {
                    id: 7,
                    title: 'Requirement • Truck Type',
                    secondTitle: 'Truck Type',
                    key: 'loadRequirements',
                },
                {
                    id: 8,
                    title: 'Requirement • Trailer Type',
                    secondTitle: 'Trailer Type',
                    key: 'loadRequirements',
                },
                {
                    id: 8,
                    title: 'Requirement • Length',
                    secondTitle: 'Length',
                    key: 'loadRequirements',
                    secondKey: 'trailerLength',
                    thirdKey: 'name',
                },
                {
                    id: 8,
                    title: 'Requirement • Door Type',
                    secondTitle: 'Door Type',
                    key: 'loadRequirements',
                    secondKey: 'doorType',
                    thirdKey: 'name',
                },
                {
                    id: 8,
                    title: 'Requirement • Suspension',
                    secondTitle: 'Suspension',
                    key: 'loadRequirements',
                    secondKey: 'suspension',
                    thirdKey: 'name',
                },
                {
                    id: 8,
                    title: 'Requirement • Year',
                    secondTitle: 'Year',
                    key: 'loadRequirements',
                    secondKey: 'year',
                },
                {
                    id: 8,
                    title: 'Requirement • Liftgate',
                    secondTitle: 'Liftgate',
                    key: 'loadRequirements',
                    secondKey: 'liftgate',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Miles',
            values: [
                {
                    id: 7,
                    title: 'Miles • Loaded',
                    secondTitle: 'Loaded',
                    key: 'miles',
                    type: 'miles',
                    secondKey: 'loaded',
                },
                {
                    id: 8,
                    title: 'Miles • Empty',
                    secondTitle: 'Empty',
                    key: 'miles',
                    type: 'miles',
                    secondKey: 'emptyMiles',
                },
                {
                    id: 8,
                    title: 'Miles • Total',
                    secondTitle: 'Total',
                    key: 'miles',
                    type: 'miles',
                    secondKey: 'totalMiles',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Billing',
            values: [
                {
                    id: 7,
                    title: 'Billing • Pay Term',
                    secondTitle: 'Pay Term',
                    key: 'billing',
                    secondKey: 'payTermName',
                },
                {
                    id: 8,
                    title: 'Billing • Age - Unpaid',
                    secondTitle: 'Age - Unpaid',
                    key: 'billing',
                    secondKey: 'ageUnpaid',
                },
                {
                    id: 8,
                    title: 'Billing • Age - Paid',
                    secondTitle: 'Age - Paid',
                    key: 'billing',
                    secondKey: 'agePaid',
                },
                {
                    id: 7,
                    title: 'Billing • Rate',
                    secondTitle: 'Rate',
                    key: 'billing',
                    secondKey: 'rate',
                    type: 'money',
                },
                {
                    id: 8,
                    title: 'Billing • Paid',
                    secondTitle: 'Paid',
                    key: 'billing',
                    secondKey: 'paid',
                    type: 'money',
                },
                {
                    id: 8,
                    title: 'Billing • Due',
                    secondTitle: 'Due',
                    key: 'billing',
                    secondKey: 'due',
                    type: 'money',
                },
            ],
        },
        {
            id: 10,
            title: 'Invoice Date',
            key: 'createdAt',
            type: 'date',
        },
        {
            id: 10,
            title: 'Paid Date',
            key: 'createdAt',
            type: 'date',
        },
        {
            id: 10,
            title: 'Date Added',
            key: 'createdAt',
            type: 'date',
        },
        {
            id: 11,
            title: 'Date Edited',
            key: 'updatedAt',
            type: 'date',
        },
    ];
}
