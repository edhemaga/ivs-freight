// Load Modal Column Definition
export function getLoadModalColumnDefinition() {
    return [
        {
            ngTemplate: 'num-count',
            title: '#',
            field: 'tableNumber',
            sortName: '',
            hidden: false,
            isPined: true,
            width: 25,
            sortable: true,
            isAction: false
        },
        {
            ngTemplate: 'text',
            title: 'Description',
            field: 'tableDescription',
            sortName: '',
            hidden: false,
            isPined: true,
            width: 200,
            sortable: true,
            isAction: false
        },
        {
            ngTemplate: 'text',
            title: 'Quantity',
            field: 'tableQuantity',
            sortName: '',
            hidden: false,
            isPined: false,
            width: 200,
            sortable: true,
            isAction: false
        },
        {
            ngTemplate: 'text',
            title: 'Bol No.',
            field: 'tableBolNo',
            sortName: '',
            hidden: false,
            isPined: false,
            width: 200,
            sortable: true,
            isAction: false
        },
        {
            ngTemplate: 'text',
            title: 'Weight',
            field: 'tableWeight',
            sortName: '',
            hidden: false,
            isPined: false,
            width: 200,
            sortable: true,
            isAction: false
        },
        {
            ngTemplate: 'action',
            field: 'tableAction',
            width: 34,
            isAction: true
        },
    ];
}