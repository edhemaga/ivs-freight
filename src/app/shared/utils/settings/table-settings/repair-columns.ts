import { RepairShopSortBy } from 'appcoretruckassist/model/repairShopSortBy';
import { RepairSortBy } from 'appcoretruckassist/model/repairSortBy';

export function getRepairTruckAndTrailerColumnDefinition() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            hidden: false,
            isPined: true,
            width: 28,
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
            field: 'tableUnit',
            name: 'Invoice Number',
            sortName: RepairSortBy.InvoiceNumber,
            hidden: false,
            isPined: true,
            width: 154,
            minWidth: 154,
            pdfWidth: 10,
            filter: '',
            isNumeric: false,
            index: 1,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
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
            title: 'Issued',
            field: 'tableIssued',
            name: 'Date Issued',
            sortName: RepairSortBy.IssuedAdded,
            isPined: false,
            hidden: false,
            width: 88,
            minWidth: 88,
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
            title: 'Paid',
            field: 'tablePaid',
            name: 'Date Paid',
            sortName: RepairSortBy.PaidDate,
            isPined: false,
            hidden: true,
            width: 88,
            minWidth: 88,
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
            title: 'Pay Type',
            field: 'tablePayType',
            name: 'Pay Type',
            sortName: RepairSortBy.PayType,
            isPined: false,
            hidden: true,
            width: 108,
            minWidth: 108,
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
            title: 'Number   ',
            field: 'tableNumber',
            name: 'Number',
            groupName: 'Unit ',
            sortName: RepairSortBy.UnitNumber,
            isPined: false,
            hidden: false,
            width: 78,
            minWidth: 78,
            filter: '',
            isNumeric: true,
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
            ngTemplate: 'svg',
            title: 'Type',
            field: 'tableVehicleType',
            name: 'Type',
            sortName: RepairSortBy.UnitType,
            groupName: 'Unit ',
            isPined: false,
            hidden: false,
            width: 64,
            minWidth: 64,
            filter: '',
            isNumeric: true,
            index: 6,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            tooltipColor: 'vehicleTooltipColor',
            tooltipTitle: 'vehicleTooltipTitle',
            progress: null,
            hoverTemplate: false,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            headAlign: 'center',
            svgUrl: 'assets/svg/common/',
            classField: 'vehicleTypeClass',
            svgDimensions: {
                width: 42,
                height: 18,
            },
            class: 'type-icon',
        },
        {
            ngTemplate: 'text',
            title: 'Make',
            field: 'tableMake',
            name: 'Make',
            groupName: 'Unit ',
            sortName: RepairSortBy.UnitMake,
            isPined: false,
            hidden: true,
            width: 138,
            minWidth: 138,
            filter: '',
            isNumeric: true,
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
            title: 'Model',
            field: 'tableModel',
            name: 'Model',
            groupName: 'Unit ',
            sortName: RepairSortBy.UnitModel,
            isPined: false,
            hidden: true,
            width: 148,
            minWidth: 148,
            filter: '',
            isNumeric: true,
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
            title: 'Year',
            field: 'tableYear',
            name: 'Year',
            groupName: 'Unit ',
            sortName: RepairSortBy.UnitYear,
            isPined: false,
            hidden: true,
            width: 58,
            minWidth: 58,
            filter: '',
            isNumeric: true,
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
            ngTemplate: 'text',
            title: 'Odo',
            field: 'tableOdometer',
            name: 'Odometer',
            groupName: 'Unit ',
            sortName: RepairSortBy.Odometer,
            isPined: false,
            hidden: false,
            width: 78,
            minWidth: 78,
            filter: '',
            isNumeric: true,
            index: 10,
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
            ngTemplate: 'avatar-assign',
            title: 'Driver',
            field: 'tableDriver',
            name: 'Driver',
            sortName: RepairSortBy.DriverName,
            groupName: 'Unit ',
            hidden: true,
            isPined: false,
            width: 208,
            minWidth: 208,
            filter: '',
            isNumeric: false,
            index: 11,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: {
                src: 'additionalData.avatar.src',
            },
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'overflow-unset',
        },
        {
            ngTemplate: 'text',
            title: 'Name   ',
            field: 'tableShopName',
            name: 'Name',
            groupName: 'Shop Detail ',
            sortName: RepairSortBy.RepairShopName,
            hidden: false,
            isPined: false,
            width: 238,
            minWidth: 238,
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
            title: 'Adress',
            field: 'tableShopAdress',
            name: 'Adress',
            groupName: 'Shop Detail ',
            sortName: RepairSortBy.RepairShopAddress,
            hidden: true,
            isPined: false,
            width: 320,
            minWidth: 320,
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
            title: 'Service Type',
            field: 'tableServiceType',
            name: 'Service Type',
            sortName: RepairSortBy.ServiceType,
            hidden: true,
            isPined: false,
            width: 108,
            minWidth: 108,
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
            ngTemplate: 'service',
            title: 'Services',
            field: 'tableServices',
            name: 'Services',
            sortName: '',
            hidden: true,
            isPined: false,
            width: 258,
            minWidth: 258,
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
            ngTemplate: 'description',
            title: 'Description',
            field: 'tableDescription',
            name: 'Description',
            sortName: RepairSortBy.ItemDescription,
            groupName: 'Item Detail ',
            isPined: false,
            hidden: false,
            width: 708,
            minWidth: 708,
            filter: '',
            isNumeric: false,
            index: 16,
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
            ngTemplate: 'total',
            title: 'Cost',
            field: 'tableCost',
            name: 'Cost',
            sortName: RepairSortBy.ItemCost,
            groupName: 'Item Detail ',
            isPined: false,
            hidden: false,
            width: 105,
            minWidth: 105,
            filter: '',
            isNumeric: true,
            index: 17,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: true,
            export: true,
            resizable: false,
            specialColumn: true,
            isJustifyEnd: true,
            isGroupItemDisabled: true,
        },
        {
            ngTemplate: 'text',
            title: 'Added',
            field: 'tableAdded',
            name: 'Date Added',
            sortName: RepairSortBy.DateAdded,
            isPined: false,
            hidden: true,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 18,
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
            sortName: RepairSortBy.DateEdited,
            isPined: false,
            hidden: true,
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
            ngTemplate: 'attachments',
            title: 'Attachments',
            field: 'tableAttachments',
            name: '',
            moveRight: true,
            hidden: false,
            width: 46,
            minWidth: 46,
            filter: '',
            isNumeric: false,
            index: 20,
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
            index: 21,
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
    ];
}

export function getRepairShopColumnDefinition() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            hidden: false,
            isPined: true,
            width: 28,
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
            name: 'Shop Name',
            sortName: RepairShopSortBy.Name,
            hidden: false,
            isPined: true,
            width: 220,
            minWidth: 220,
            pdfWidth: 10,
            filter: '',
            isNumeric: false,
            index: 1,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: true,
            export: true,
            resizable: true,
            link: {
                routerLinkStart: '/list/repair/',
                routerLinkEnd: '/details',
            },
        },
        {
            ngTemplate: 'text',
            title: 'Phone',
            field: 'phone',
            name: 'Phone',
            sortName: RepairShopSortBy.Phone,
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
            sortName: RepairShopSortBy.Email,
            isPined: false,
            hidden: true,
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
            sortName: RepairShopSortBy.Address,
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
            ngTemplate: 'text',
            title: 'Service Type',
            field: 'tableShopServiceType',
            name: 'Service Type',
            sortName: RepairShopSortBy.ServiceType,
            hidden: true,
            isPined: false,
            width: 108,
            minWidth: 108,
            filter: '',
            isNumeric: false,
            index: 5,
            sortable: true,
            headAlign: 'center',
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
            showPin: true,
        },
        {
            ngTemplate: 'service',
            title: 'Services',
            field: 'tableShopServices',
            name: 'Services',
            hidden: false,
            isPined: false,
            width: 258,
            minWidth: 258,
            filter: '',
            isNumeric: false,
            index: 6,
            sortable: true,
            headAlign: 'center',
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
            showPin: true,
        },
        {
            ngTemplate: 'open-hours',
            title: 'Status',
            field: 'tableOpenHours',
            name: 'Status',
            sortName: RepairShopSortBy.Status,
            hidden: true,
            isPined: false,
            width: 132,
            minWidth: 132,
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
            title: 'Bill',
            field: 'tableRepairCountBill',
            name: 'Bill',
            sortName: RepairShopSortBy.Bill,
            hidden: false,
            isPined: false,
            width: 62,
            minWidth: 62,
            filter: '',
            isNumeric: true,
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
            title: 'Order',
            field: 'tableRepairCountOrder',
            name: 'Order',
            sortName: RepairShopSortBy.Order,
            isPined: false,
            hidden: true,
            width: 62,
            minWidth: 62,
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
            ngTemplate: 'text',
            title: 'Name ',
            field: 'tableBankDetailsBankName',
            name: 'Name',
            groupName: 'Bank Detail ',
            sortName: RepairShopSortBy.Bank,
            hidden: true,
            isPined: false,
            width: 148,
            minWidth: 148,
            filter: '',
            isNumeric: false,
            index: 10,
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
            title: 'Routing',
            field: 'tableBankDetailsRouting',
            name: 'Routing',
            groupName: 'Bank Detail ',
            sortName: 'routing',
            hidden: true,
            isPined: false,
            width: 76,
            minWidth: 76,
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
        },
        {
            ngTemplate: 'password-account',
            title: 'Account',
            field: 'tableBankDetailsAccount',
            name: 'Account',
            groupName: 'Bank Detail ',
            hidden: true,
            isPined: false,
            width: 138,
            minWidth: 138,
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
            ngTemplate: 'rating',
            title: 'Rating & Review',
            field: 'tableRaiting',
            name: 'Rating & Review',
            sortName: RepairShopSortBy.Rating,
            hidden: false,
            isPined: false,
            width: 150,
            minWidth: 150,
            filter: '',
            isNumeric: false,
            index: 13,
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
            showPin: true,
            class: 'overflow-unset',
        },
        {
            ngTemplate: 'contact',
            title: 'Contact',
            field: 'tableContactData',
            name: 'Contacts',
            sortName: RepairShopSortBy.Contact,
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
            title: 'Expense',
            field: 'tableExpense',
            name: 'Expense',
            sortName: RepairShopSortBy.Expenses,
            hidden: false,
            isPined: false,
            width: 101,
            minWidth: 101,
            filter: '',
            isNumeric: true,
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
            isTextBold: true,
            isJustifyEnd: true,
        },
        {
            ngTemplate: 'text',
            title: 'Used',
            field: 'tableLastUsed',
            name: 'Last Used',
            sortName: RepairShopSortBy.UsedDate,
            hidden: true,
            isPined: false,
            width: 88,
            minWidth: 88,
            filter: '',
            isNumeric: true,
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
        },
        {
            ngTemplate: 'text',
            title: 'Deact',
            field: 'tableDeactivated',
            name: 'Date Deactivated',
            sortName: RepairShopSortBy.DeactivatedDate,
            isPined: false,
            hidden: true,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 17,
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
            sortName: RepairShopSortBy.AddedDate,
            isPined: false,
            hidden: true,
            width: 88,
            minWidth: 88,
            pdfWidth: 15,
            filter: '',
            isNumeric: true,
            index: 18,
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
            sortName: RepairShopSortBy.EditedDate,
            isPined: false,
            hidden: true,
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
            ngTemplate: 'attachments',
            title: 'Attachments',
            field: 'tableAttachments',
            name: '',
            moveRight: true,
            hidden: false,
            width: 46,
            minWidth: 46,
            filter: '',
            isNumeric: false,
            index: 20,
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
            ngTemplate: 'favorite',
            title: 'Favorite',
            field: 'isFavorite',
            name: '',
            sortName: 'favorites',
            hidden: false,
            width: 26,
            minWidth: 26,
            filter: '',
            isNumeric: false,
            index: 21,
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
            index: 22,
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
            index: 23,
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
