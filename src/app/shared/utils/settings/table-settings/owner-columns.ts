export function getOwnerColumnDefinition() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            isComputed: true,
            isPined: true,
            hidden: false,
            width: 32,
            filter: '',
            isNumeric: false,
            index: 0,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: true,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
        },
        {
            ngTemplate: 'nameLink',
            title: 'Name',
            field: 'name',
            name: 'Name',
            sortName: 'name',
            isComputed: true,
            isPined: true,
            hidden: false,
            width: 129,
            minWidth: 129,
            filter: '',
            isNumeric: false,
            index: 1,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            avatar: false,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            link: {
                doesNotHaveRout: true,
                routerLinkStart: '/list/owner/',
                routerLinkEnd: '/details',
            },
        },
        {
            ngTemplate: 'fleet',
            title: 'Fleet',
            field: 'fleet',
            name: 'Fleet',
            isComputed: false,
            hidden: false,
            isPined: false,
            width: 108,
            minWidth: 108,
            filter: '',
            isNumeric: true,
            index: 2,
            sortable: false,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: false,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            imageHover: null,
            showLabel: true,
        },
        {
            ngTemplate: 'text',
            title: 'Type',
            field: 'textType',
            name: 'Type',
            sortName: 'ownerType',
            isComputed: true,
            isPined: false,
            hidden: false,
            width: 92,
            minWidth: 92,
            filter: '',
            isNumeric: true,
            index: 3,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'EIN/SSN',
            field: 'ssnEin',
            name: 'EIN/SSN',
            sortName: 'einSsn',
            isComputed: true,
            isPined: false,
            hidden: false,
            width: 110,
            minWidth: 110,
            filter: '',
            isNumeric: false,
            index: 4,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'custom-font',
        },
        {
            ngTemplate: 'text',
            title: 'Phone',
            field: 'textPhone',
            name: 'Phone',
            sortName: 'phone',
            isComputed: true,
            isPined: false,
            hidden: false,
            width: 127,
            minWidth: 127,
            filter: '',
            isNumeric: true,
            index: 5,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'custom-font',
        },
        {
            ngTemplate: 'text',
            title: 'Email',
            field: 'email',
            name: 'Email',
            sortName: 'email',
            isComputed: false,
            isPined: false,
            hidden: false,
            width: 151,
            minWidth: 151,
            filter: '',
            isNumeric: true,
            index: 6,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Address',
            field: 'textAddress',
            name: 'Address',
            sortName: 'address',
            isComputed: false,
            isPined: false,
            hidden: false,
            width: 215,
            minWidth: 215,
            filter: '',
            isNumeric: true,
            index: 7,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Bank Name',
            field: 'textBankName',
            name: 'Bank Name',
            sortName: 'bankName',
            isComputed: false,
            isPined: false,
            hidden: true,
            width: 132,
            minWidth: 132,
            filter: '',
            isNumeric: true,
            index: 8,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Routing',
            field: 'routingNumber',
            name: 'Routing',
            sortName: 'routingNumber',
            isComputed: false,
            isPined: false,
            hidden: true,
            width: 99,
            minWidth: 99,
            filter: '',
            isNumeric: true,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Account',
            field: 'accountNumber',
            name: 'Account',
            sortName: 'accountNumber',
            isComputed: false,
            isPined: false,
            hidden: true,
            width: 85,
            minWidth: 85,
            filter: '',
            isNumeric: true,
            index: 10,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'attachments',
            title: 'Attachments',
            field: 'tableAttachments',
            moveRight: true,
            name: '',
            hidden: false,
            width: 46,
            minWidth: 46,
            filter: '',
            isNumeric: false,
            index: 11,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'note',
            title: 'Note',
            field: 'note',
            name: '',
            hidden: false,
            width: 26,
            minWidth: 26,
            headIconStyle: {
                width: 14,
                height: 14,
                imgPath: 'assets/svg/truckassist-table/note/Note.svg',
            },
            filter: '',
            isNumeric: false,
            index: 12,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: true,
            export: true,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'actions',
            title: 'Actions',
            field: 'action',
            name: '',
            hidden: false,
            width: 26,
            minWidth: 26,
            headIconStyle: {
                width: 22,
                height: 6,
                imgPath: '',
            },
            filter: '',
            isNumeric: true,
            index: 13,
            sortable: true,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            isAction: true,
        },
    ];
}
