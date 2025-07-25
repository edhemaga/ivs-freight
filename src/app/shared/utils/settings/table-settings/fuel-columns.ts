export function getFuelTransactionColumnDefinition(isEfsFilterActive: boolean) {
    // leave this as any since we will implement new table
    let result: any[] = [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            hidden: false,
            width: 40,
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
            title: 'Invoice No',
            field: 'invoice',
            name: 'Invoice No.',
            sortName: 'invoiceNumber',
            hidden: false,
            width: 140,
            minWidth: 140,
            filter: '',
            isNumeric: false,
            index: 1,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: true,
            export: true,
            resizable: true,
            link: {
                doesNotHaveRout: true,
            },
        },
        {
            ngTemplate: 'text',
            title: 'Date & Time',
            field: 'tableTransactionDate',
            name: 'Date & Time',
            sortName: 'transactionDate',
            hidden: false,
            width: 140,
            minWidth: 140,
            filter: '',
            isNumeric: true,
            isDate: true,
            index: 2,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
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
            title: 'Truck',
            field: 'tableTruckNumber',
            name: 'Truck No.',
            sortName: 'truckNumber',
            hidden: false,
            width: 120,
            minWidth: 120,
            filter: '',
            isNumeric: false,
            index: 3,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text-assigned',
            title: 'Trailer',
            field: 'tableTrailer',
            isPined: false,
            name: 'Trailer No.',
            sortName: 'trailerNumber',
            hidden: true,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
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
            linkField: null,
        },
        {
            ngTemplate: 'avatar',
            title: 'Driver',
            field: 'tableDriverName',
            name: 'Driver',
            sortName: 'driverName',
            hidden: false,
            isPined: false,
            width: 234,
            minWidth: 234,
            filter: '',
            isNumeric: false,
            index: 5,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: {
                src: 'additionalData.avatar.src',
            },
            link: {
                routerLinkStart: '/list/driver/',
                routerLinkEnd: '/details',
            },
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'overflow-unset',
        },
    ];

    if (!isEfsFilterActive) {
        const cardDetails = [
            {
                ngTemplate: 'middle-ellipsis',
                title: 'NUMBER',
                field: 'tableFuelCardNumber',
                name: 'Card No.',
                tableHeadTitle: 'Card Number',
                sortName: 'FuelCardNumber',
                groupName: 'Card Detail ',
                hidden: false,
                width: 120,
                minWidth: 120,
                filter: '',
                isNumeric: false,
                index: 6,
                sortable: true,
                isActionColumn: false,
                isSelectColumn: false,
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
                title: 'Type',
                field: 'tableType',
                name: 'Type',
                sortName: 'FuelCardType',
                groupName: 'Card Detail ',
                hidden: false,
                width: 88,
                minWidth: 88,
                filter: '',
                isNumeric: false,
                index: 7,
                sortable: true,
                isActionColumn: false,
                isSelectColumn: false,
                progress: null,
                hoverTemplate: null,
                filterable: true,
                disabled: false,
                export: true,
                resizable: true,
                class: 'custom-font',
            },
            {
                ngTemplate: 'password-account',
                title: 'Account',
                field: 'tableAccount',
                name: 'Account No.',
                groupName: 'Card Detail ',
                hidden: false,
                isPined: false,
                width: 138,
                minWidth: 138,
                filter: '',
                isNumeric: false,
                index: 8,
                sortable: false,
                isActionColumn: false,
                isSelectColumn: false,
                progress: null,
                hoverTemplate: null,
                filterable: true,
                disabled: false,
                export: true,
                resizable: true,
            },
        ];

        result = [...result, ...cardDetails];
    }

    result = [
        ...result,
        {
            ngTemplate: 'text',
            title: 'NAME',
            field: 'tableFuelStopName',
            name: 'Name',
            sortName: 'FuelStopName',
            groupName: 'Fuel Stop Detail ',
            hidden: false,
            width: 146,
            minWidth: 146,
            filter: '',
            isNumeric: false,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text-mask',
            title: 'Phone',
            field: 'phone',
            name: 'Phone',
            sortName: 'phone',
            groupName: 'Fuel Stop Detail ',
            isPined: false,
            hidden: true,
            width: 128,
            minWidth: 128,
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
            class: 'custom-font',
            mask: '(000) 000-0000',
        },
        {
            ngTemplate: 'text-mask',
            title: 'Fax',
            field: 'fax',
            name: 'Fax',
            sortName: 'fax',
            groupName: 'Fuel Stop Detail ',
            isPined: false,
            hidden: true,
            width: 128,
            minWidth: 128,
            filter: '',
            isNumeric: true,
            index: 11,
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
            mask: '(000) 000-0000',
        },
        {
            ngTemplate: 'text',
            title: 'Location',
            field: 'tableLocation',
            name: 'Location',
            sortName: 'location',
            groupName: 'Fuel Stop Detail ',
            hidden: false,
            width: 215,
            minWidth: 215,
            filter: '',
            isNumeric: false,
            index: 12,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
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
            field: 'tableAddress',
            name: 'Address',
            sortName: 'FuelStopAddress',
            groupName: 'Fuel Stop Detail ',
            hidden: true,
            width: 400,
            minWidth: 400,
            filter: '',
            isNumeric: false,
            index: 13,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'custom-font',
        },
        {
            ngTemplate: 'description',
            title: 'Description',
            field: 'tableDescription',
            name: 'Description',
            sortName: 'itemDescription',
            groupName: 'Item Detail ',
            isPined: false,
            hidden: false,
            width: 238,
            minWidth: 238,
            filter: '',
            isNumeric: false,
            index: 14,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: true,
            export: true,
            resizable: false,
            objectIn: true,
            isGroupItemDisabled: true,
        },
        {
            ngTemplate: 'gallon',
            title: 'Gal',
            field: 'tableGallon',
            name: 'Gallon',
            sortName: 'Gallon',
            groupName: 'Item Detail ',
            hidden: false,
            width: 64,
            minWidth: 64,
            filter: '',
            isNumeric: false,
            index: 15,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            isJustifyEnd: true,
            isGroupItemDisabled: true,
        },
        {
            ngTemplate: 'ppg',
            title: 'Ppg',
            field: 'tablePPG',
            name: 'Price per Gal.',
            sortName: 'ppg',
            groupName: 'Item Detail ',
            hidden: false,
            width: 80,
            minWidth: 80,
            filter: '',
            isNumeric: false,
            index: 16,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            isJustifyEnd: true,
            isGroupItemDisabled: true,
        },
        {
            ngTemplate: 'total',
            title: 'Total',
            field: 'tableCost',
            name: 'Total Cost',
            sortName: 'total',
            groupName: 'Item Detail ',
            hidden: false,
            width: 100,
            minWidth: 100,
            filter: '',
            isNumeric: false,
            index: 17,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            isJustifyEnd: true,
            isGroupItemDisabled: true,
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
            index: 18,
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
            isNumeric: false,
            index: 19,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'text',
            title: 'Added',
            field: 'dateAdded',
            name: 'Date Added',
            sortName: 'dateAdded',
            isPined: false,
            hidden: true,
            width: 90,
            minWidth: 90,
            filter: '',
            isNumeric: true,
            index: 20,
            sortable: true,
            isDate: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            linkField: null,
        },
        {
            ngTemplate: 'text',
            title: 'Edited',
            field: 'dateEdited',
            name: 'Date Edited',
            sortName: 'dateEdited',
            isPined: false,
            hidden: true,
            width: 90,
            minWidth: 90,
            filter: '',
            isNumeric: true,
            index: 21,
            sortable: true,
            isDate: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            linkField: null,
        },
    ];

    return result;
}

export function getFuelStopColumnDefinition() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            hidden: false,
            width: 40,
            filter: '',
            isNumeric: false,
            index: 0,
            isActionColumn: true,
            isSelectColumn: true,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isPined: true,
        },
        {
            ngTemplate: 'nameLink',
            title: 'Name ',
            field: 'tableName',
            name: 'Name',
            sortName: 'name',
            isPined: true,
            hidden: false,
            width: 145,
            minWidth: 145,
            filter: '',
            isNumeric: false,
            index: 1,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            link: {
                routerLinkStart: '/list/fuel/',
                routerLinkEnd: '/details',
            },
        },
        {
            ngTemplate: 'text-mask',
            title: 'Phone',
            field: 'phone',
            name: 'Phone',
            sortName: 'phone',
            hidden: false,
            width: 127,
            minWidth: 127,
            filter: '',
            isNumeric: true,
            isDate: true,
            index: 2,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'custom-font',
            mask: '(000) 000-0000',
        },
        {
            ngTemplate: 'text-mask',
            title: 'Fax',
            field: 'fax',
            name: 'Fax',
            sortName: 'fax',
            hidden: false,
            width: 120,
            minWidth: 120,
            filter: '',
            isNumeric: false,
            index: 3,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            mask: '(000) 000-0000',
        },
        {
            ngTemplate: 'text',
            title: 'Location',
            field: 'tableLocation',
            name: 'Location',
            sortName: 'location',
            hidden: true,
            width: 215,
            minWidth: 215,
            filter: '',
            isNumeric: false,
            index: 4,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
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
            field: 'tableAddress',
            name: 'Address',
            sortName: 'address',
            hidden: false,
            width: 400,
            minWidth: 400,
            filter: '',
            isNumeric: false,
            index: 5,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
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
            title: 'Used',
            field: 'tableUsed',
            name: 'Times Used',
            sortName: 'used',
            hidden: false,
            width: 91,
            minWidth: 91,
            filter: '',
            isNumeric: false,
            index: 6,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'progress-range',
            title: 'Last',
            field: 'tableLast',
            name: 'Last Price',
            sortName: 'price',
            hidden: false,
            width: 90,
            minWidth: 90,
            filter: '',
            isNumeric: false,
            index: 7,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Last Visit',
            field: 'tableLastVisit',
            name: 'Last Visit',
            sortName: 'lastVisit',
            hidden: false,
            width: 115,
            minWidth: 115,
            filter: '',
            isNumeric: false,
            index: 8,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Expense',
            field: 'tableCost',
            name: 'Expense',
            sortName: 'expense',
            hidden: false,
            width: 92,
            minWidth: 92,
            filter: '',
            isNumeric: false,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            isTextBold: true,
            resizable: true,
            isJustifyEnd: true,
        },
        {
            ngTemplate: 'favorite',
            title: 'Favorite',
            field: 'isFavorite',
            name: '',
            hidden: false,
            width: 25,
            minWidth: 25,
            filter: '',
            isNumeric: false,
            index: 10,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: false,
            isAction: {
                width: 45,
                height: 45,
                imgPath: '',
            },
        },
        {
            ngTemplate: 'note',
            title: 'Note',
            field: 'note',
            name: '',
            hidden: false,
            width: 35,
            minWidth: 35,
            filter: '',
            isNumeric: false,
            index: 11,
            sortable: true,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: false,
            isAction: true,
            headIconStyle: {
                width: 16,
                height: 16,
                imgPath: 'assets/svg/truckassist-table/note/Note.svg',
            },
        },
        {
            ngTemplate: 'actions',
            title: 'Actions',
            field: 'action',
            name: '',
            hidden: false,
            width: 30,
            minWidth: 30,
            filter: '',
            isNumeric: false,
            index: 12,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'text',
            title: 'Deactivated',
            field: 'deactivatedAt',
            name: 'Date Deactivated',
            sortName: 'dateDeactivated',
            isPined: false,
            hidden: true,
            width: 120,
            minWidth: 120,
            filter: '',
            isNumeric: true,
            index: 13,
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
            linkField: null,
        },
        {
            ngTemplate: 'text',
            title: 'Added',
            field: 'tableAdded',
            name: 'Date Added',
            sortName: 'dateAdded',
            isPined: false,
            hidden: true,
            width: 120,
            minWidth: 120,
            filter: '',
            isNumeric: true,
            index: 14,
            sortable: true,
            isDate: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            linkField: null,
        },
        {
            ngTemplate: 'text',
            title: 'Edited',
            field: 'tableEdited',
            name: 'Date Edited',
            sortName: 'dateEdited',
            isPined: false,
            hidden: true,
            width: 120,
            minWidth: 120,
            filter: '',
            isNumeric: true,
            index: 15,
            sortable: true,
            isDate: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            linkField: null,
        },
    ];
}
