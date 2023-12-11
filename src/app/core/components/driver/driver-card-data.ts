import { CardRows } from '../shared/model/cardData';

export class DisplayDriverConfiguration {
    static rows: number = 4;

    static page: string = 'Customer';

    static cardTitle: string = 'fullName';

    // Data for applicants
    static displayRowsBackApplicants: CardRows[] = [
        {
            title: 'Shipping Hours',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Receiving Hours',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Avg. Pickup Time',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Avg. Delivery Time',
            endpoint: 'no-endpoint',
        },
    ];

    // Data for active front
    static displayRowsActiveFront: CardRows[] = [
        {
            title: 'Phone No.',
            endpoint: 'phone',
        },
        {
            title: 'SSN No.',
            endpoint: 'ssn',
        },
        {
            title: 'CDL No.',
            endpoint: 'cdlNumber',
        },
        {
            title: 'Pay Type',
            endpoint: 'payType.name',
        },
    ];
    // Data for active back
    static displayRowsActiveBack: CardRows[] = [
        {
            title: 'Phone',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Email',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Address',
            endpoint: 'no-endpoint',
        },
        {
            title: 'Rating & Review',
            endpoint: 'no-endpoint',
        },
    ];
}
