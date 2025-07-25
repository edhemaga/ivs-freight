// Customer Broker COLUMN DEFINITION
export function getBrokerColumnDefinition() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            isPined: true,
            hidden: false,
            width: 32,
            minWidth: 32,
            filter: '',
            isNumeric: false,
            index: 0,
            sortable: false,
            isActionColumn: false,
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
            title: 'Business Name',
            field: 'businessName',
            name: 'Business Name',
            sortName: 'businessname',
            isPined: true,
            hidden: false,
            width: 220,
            minWidth: 220,
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
                routerLinkStart: '/list/customer/',
                routerLinkEnd: '/broker-details',
            },
        },
        {
            ngTemplate: 'text',
            title: 'DBA Name',
            field: 'dbaName',
            name: 'DBA Name',
            sortName: 'dbaname',
            hidden: true,
            isPined: false,
            width: 238,
            minWidth: 238,
            filter: '',
            isNumeric: false,
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
        },
        {
            ngTemplate: 'text',
            title: 'EIN',
            field: 'ein',
            name: 'EIN',
            sortName: 'ein',
            isPined: false,
            hidden: true,
            width: 128,
            minWidth: 128,
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
            ngTemplate: 'text',
            title: 'MC/FF',
            field: 'mcNumber',
            name: 'MC/FF',
            sortName: 'mc',
            isPined: false,
            hidden: true,
            width: 72,
            minWidth: 72,
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
            title: 'Phone',
            field: 'phone',
            name: 'Phone',
            sortName: 'phone',
            hidden: false,
            isPined: false,
            width: 128,
            minWidth: 128,
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
            isPined: false,
            sortName: 'email',
            hidden: false,
            width: 228,
            minWidth: 228,
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
            ngTemplate: 'text',
            title: 'Physical',
            field: 'tableAddressPhysical',
            name: 'Physical',
            sortName: 'address',
            groupName: 'Address ',
            hidden: false,
            isPined: false,
            width: 320,
            minWidth: 320,
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
            title: 'Billing',
            field: 'tableAddressBilling',
            name: 'Billing',
            sortName: 'billingAddress',
            groupName: 'Address ',
            hidden: true,
            isPined: false,
            width: 320,
            minWidth: 320,
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
            title: 'Credit Limit',
            field: 'tablePaymentDetailCreditLimit',
            name: 'Credit Limit',
            groupName: 'Billing ',
            sortName: 'tablePaymentDetailCreditLimit',
            hidden: true,
            isPined: false,
            width: 101,
            minWidth: 101,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            linkField: null,
        },
        {
            ngTemplate: 'text',
            title: 'Term',
            field: 'tablePaymentDetailTerm',
            name: 'Pay Term',
            groupName: 'Billing ',
            sortName: 'term',
            hidden: true,
            isPined: false,
            width: 68,
            minWidth: 68,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 10,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            linkField: null,
        },
        {
            ngTemplate: 'progressCredit',
            title: 'Available Credit',
            field: 'tablePaymentDetailAvailCredit',
            name: 'Available Credit',
            sortName: 'licenseExpDate',
            groupName: 'Billing ',
            hidden: true,
            isPined: false,
            width: 150,
            minWidth: 150,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 11,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            linkField: null,
        },
        {
            ngTemplate: 'inv-aging',
            title: 'Unpaid Aging',
            field: 'tableUnpaidInvAging',
            name: 'Unpaid Invoice Aging',
            sortName: 'invAgeing',
            groupName: 'Billing ',
            hidden: true,
            isPined: false,
            width: 280,
            minWidth: 280,
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
            ngTemplate: 'inv-aging',
            title: 'Paid Aging',
            field: 'tablePaidInvAging',
            name: 'Paid Invoice Aging',
            sortName: 'invAgeing',
            groupName: 'Billing ',
            hidden: true,
            isPined: false,
            width: 280,
            minWidth: 280,
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
            title: 'Load',
            field: 'tableLoads',
            name: 'Load Count',
            sortName: 'load',
            isPined: false,
            hidden: false,
            width: 62,
            minWidth: 62,
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
        },
        {
            ngTemplate: 'text',
            title: 'Miles',
            field: 'tableMiles',
            name: 'Miles',
            sortName: 'miles',
            isPined: false,
            hidden: true,
            width: 78,
            minWidth: 78,
            filter: '',
            isNumeric: false,
            index: 14,
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
            title: 'PPM',
            field: 'tablePPM',
            name: 'Price per Mile',
            sortName: 'ppm',
            isPined: false,
            hidden: true,
            width: 80,
            minWidth: 80,
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
        },
        {
            ngTemplate: 'rating',
            title: 'Rating & Review',
            field: 'tableRaiting',
            name: 'Rating & Review',
            sortName: 'rating',
            hidden: false,
            isPined: false,
            width: 150,
            minWidth: 150,
            filter: '',
            isNumeric: false,
            index: 16,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            svg: true,
            showPin: false,
            class: 'overflow-unset',
        },
        {
            ngTemplate: 'contact',
            title: 'Contact',
            field: 'tableContactData',
            name: 'Contacts',
            sortName: 'contact',
            hidden: false,
            isPined: false,
            width: 56,
            minWidth: 56,
            headIconStyle: {
                width: 14,
                height: 14,
                imgPath:
                    'assets/svg/truckassist-table/customer/contact-column-avatar-select-row.svg',
            },
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
        },
        {
            ngTemplate: 'text',
            title: 'Revenue',
            field: 'tableRevenue',
            name: 'Revenue',
            sortName: 'revenue',
            isPined: false,
            hidden: false,
            width: 101,
            minWidth: 101,
            filter: '',
            isNumeric: false,
            index: 18,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            isTextBold: true,
        },
        {
            ngTemplate: 'text',
            title: 'Added',
            field: 'tableAdded',
            name: 'Date Added',
            sortName: 'added',
            hidden: true,
            isPined: false,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 19,
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
            title: 'Edited',
            field: 'tableEdited',
            name: 'Date Edited',
            sortName: 'edited',
            hidden: true,
            isPined: false,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 20,
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
            title: 'Moved',
            field: 'tableMoved',
            name: 'Date Moved',
            sortName: 'moved',
            hidden: true,
            isPined: false,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 21,
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
            index: 22,
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
            index: 23,
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
            index: 24,
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
    ];
}

// Customer Shipper COLUMN DEFINITION
export function getShipperColumnDefinition() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            hidden: false,
            isPined: true,
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
            title: 'Business Name',
            field: 'businessName',
            name: 'Business Name',
            sortName: 'name',
            hidden: false,
            isPined: true,
            width: 220,
            minWidth: 220,
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
                routerLinkStart: '/list/customer/',
                routerLinkEnd: '/shipper-details',
            },
        },
        {
            ngTemplate: 'text',
            title: 'Phone',
            field: 'phone',
            name: 'Phone',
            sortName: 'phone',
            hidden: false,
            isPined: false,
            width: 128,
            minWidth: 128,
            filter: '',
            isNumeric: true,
            index: 2,
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
            hidden: false,
            isPined: false,
            width: 228,
            minWidth: 228,
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
            ngTemplate: 'text',
            title: 'Address',
            field: 'tableAddress',
            name: 'Address',
            sortName: 'address',
            hidden: false,
            isPined: false,
            width: 320,
            minWidth: 320,
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
            ngTemplate: 'shipper-load',
            title: 'Load',
            field: 'tableLoads',
            name: 'Load Count',
            sortName: 'load',
            hidden: false,
            isPined: false,
            width: 188,
            minWidth: 188,
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
        },
        {
            ngTemplate: 'text',
            title: 'Pickup',
            field: 'tableAverageWatingTimePickup',
            name: 'Pickup',
            sortName: 'pickups',
            groupName: 'Avg. Wait Time ',
            hidden: true,
            isPined: false,
            width: 96,
            minWidth: 96,
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
            ngTemplate: 'text',
            title: 'Delivery',
            field: 'tableAverageWatingTimeDelivery',
            name: 'Delivery',
            sortName: 'deliveries',
            groupName: 'Avg. Wait Time ',
            hidden: true,
            isPined: false,
            width: 96,
            minWidth: 96,
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
            ngTemplate: 'work-hour',
            title: 'Shipping',
            field: 'tableAvailableHoursShipping',
            name: 'Shipping',
            sortName: 'shipWorkHour',
            groupName: 'Working Hours ',
            hidden: true,
            isPined: false,
            width: 186,
            minWidth: 186,
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
            specialColumn: true,
            grossColumn: true,
        },
        {
            ngTemplate: 'work-hour',
            title: 'Receiving',
            field: 'tableAvailableHoursReceiving',
            name: 'Receiving',
            sortName: 'receWorkHour',
            groupName: 'Working Hours ',
            hidden: true,
            isPined: false,
            width: 186,
            minWidth: 186,
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
            specialColumn: true,
            grossColumn: true,
        },
        {
            ngTemplate: 'rating',
            title: 'Rating & Review',
            field: 'tableRaiting',
            name: 'Rating & Review',
            sortName: 'rating',
            hidden: false,
            isPined: false,
            width: 150,
            minWidth: 150,
            filter: '',
            isNumeric: false,
            index: 10,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            svg: true,
            showPin: false,
            class: 'overflow-unset',
        },
        {
            ngTemplate: 'contact',
            title: 'Contact',
            field: 'tableContactData',
            name: 'Contact',
            sortName: 'contact',
            hidden: false,
            isPined: false,
            width: 56,
            minWidth: 56,
            headIconStyle: {
                width: 14,
                height: 14,
                imgPath:
                    'assets/svg/truckassist-table/customer/contact-column-avatar-select-row.svg',
            },
            filter: '',
            isNumeric: false,
            index: 11,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            specialColumn: true,
            grossColumn: true,
        },
        {
            ngTemplate: 'text',
            title: 'Added',
            field: 'tableAdded',
            name: 'Date Added',
            sortName: 'added',
            hidden: true,
            isPined: false,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 12,
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
            title: 'Edited',
            field: 'tableEdited',
            name: 'Date Edited',
            sortName: 'edited',
            hidden: true,
            isPined: false,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
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
            title: 'Moved',
            field: 'tableMoved',
            name: 'Date Moved',
            sortName: 'moved',
            hidden: true,
            isPined: false,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 14,
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
            index: 15,
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
            index: 16,
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
            index: 17,
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
    ];
}
