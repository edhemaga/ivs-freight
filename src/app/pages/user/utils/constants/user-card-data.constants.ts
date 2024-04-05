import { CardRows } from 'src/app/shared/models/card-data.model';

export class DisplayUserConfiguration {
    static rows: number = 4;

    static page: string = 'User';

    static cardTitle: string = 'tableAvatar.name';

    static displayRowsFront: CardRows[] = [
        {
            title: 'Department',
            key: 'department.name',
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
            title: 'Activity',
            key: 'no key',
        },
    ];

    static displayRowsBack: CardRows[] = [
        {
            title: 'Status',
            key: 'status',
        },
        {
            title: 'Pay Type',
            key: 'paymentType',
        },
        {
            title: 'Commission',
            key: 'commission',
        },
        {
            title: 'Salary',
            key: 'salary',
        },
    ];
}
