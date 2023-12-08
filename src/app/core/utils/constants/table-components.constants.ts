import { DropdownItem } from '../../components/shared/model/cardTableData';

// LOAD PAGE
export class TableDropdownLoadComponentConstants {
    static DROPDOWN_DATA: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Delete',
            name: 'delete',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}

// CUSTOMER PAGE
export class TableDropdownCustomerComponentConstants {
    static DROPDOWN_BROKER: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit-cutomer-or-shipper',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },
        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Create Load',
            name: 'create-load',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Add Contact',
            name: 'add-contact',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Write Review',
            name: 'write-review',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Move to Ban List',
            name: 'move-to-ban-list',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Move to DNU List',
            name: 'move-to-dnu-list',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Close Business',
            name: 'close-business',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },
        {
            title: 'delete',
            name: 'delete',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },
    ];
    static DROPDOWN_SHIPPER: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit-cutomer-or-shipper',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },
        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Add Contact',
            name: 'add-contact',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Write Review',
            name: 'write-review',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Close Business',
            name: 'close-business',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },
        {
            title: 'delete',
            name: 'delete',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}

// DRIVER PAGE
export class TableDropdownDriverComponentConstants {
    static DROPDOWN_APPLICANT: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },

        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Hire Applicant',
            name: 'hire-applicant',
            mutedStyle: true,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'regular',
        },
        {
            title: 'Review',
            name: 'review',
            mutedStyle: true,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'regular',
        },
        {
            title: 'Move to Favourites',
            name: 'add-to-favourites',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgUrl: '',
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Resend Invitation',
            name: 'resend-invitation',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Move to Archive',
            name: 'move-to-archive',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },
        {
            title: 'Delete',
            name: 'delete-applicant',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}

export class TableDriverColorsConstants {
    static TEXT_COLORS: string[] = [
        '#6D82C7',
        '#4DB6A2',
        '#E57373',
        '#E3B00F',
        '#BA68C8',
        '#BEAB80',
        '#81C784',
        '#FF8A65',
        '#64B5F6',
        '#F26EC2',
        '#A1887F',
        '#919191',
    ];

    static BACKGROUND_COLORS: string[] = [
        '#DAE0F1',
        '#D2EDE8',
        '#F9DCDC',
        '#F8EBC2',
        '#EED9F1',
        '#EFEADF',
        '#DFF1E0',
        '#FFE2D8',
        '#D8ECFD',
        '#FCDAF0',
        '#E7E1DF',
        '#E3E3E3',
    ];
}
