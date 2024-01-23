import { CardRows } from '../shared/model/cardData';

export class DisplayUserConfiguration {
    static rows: number = 4;

    static page: string = 'User';

    static cardTitle: string = 'tableAvatar.name';

    static displayRowsFront: CardRows[] = [
        {
            title: 'Department',
            endpoint: 'department.name',
        },
        {
            title: 'Phone',
            endpoint: 'phone',
        },
        {
            title: 'Email',
            endpoint: 'email',
        },
        {
            title: 'Activity',
            endpoint: 'no endpoint',
        },
    ];

    static displayRowsBack: CardRows[] = [
        {
            title: 'Status',
            endpoint: 'status',
        },
        {
            title: 'Pay Type',
            endpoint: 'paymentType',
        },
        {
            title: 'Commission',
            endpoint: 'commission',
        },
        {
            title: 'Salary',
            endpoint: 'salary',
        },
    ];
}
