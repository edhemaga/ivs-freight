//Models
import { DropdownItem } from '../components/shared/model/card-table-data.model';

//Enums
import { ConstantStringTableComponentsEnum } from '../utils/enums/table-components.enum';

export function getDropdownShipperContent(data): DropdownItem[] {
    return [
        {
            title: ConstantStringTableComponentsEnum.EDIT_2,
            name: 'edit-cutomer-or-shipper',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
        },

        {
            title: ConstantStringTableComponentsEnum.VIEW_DETAILS_2,
            name: ConstantStringTableComponentsEnum.VIEW_DETAILS,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: ConstantStringTableComponentsEnum.ADD_CONTRACT_2,
            name: ConstantStringTableComponentsEnum.ADD_CONTRACT,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: ConstantStringTableComponentsEnum.WRITE_REVIEW_2,
            name: ConstantStringTableComponentsEnum.WRITE_REVIEW,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            hasBorder: true,
        },
        {
            title:
                data.status === 1
                    ? ConstantStringTableComponentsEnum.CLOSE_BUSINESS_2
                    : ConstantStringTableComponentsEnum.OPEN_BUSINESS,
            name: ConstantStringTableComponentsEnum.CLOSE_BUSINESS,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: ConstantStringTableComponentsEnum.DELETE,
        },

        {
            title: ConstantStringTableComponentsEnum.DELETE_2,
            name: ConstantStringTableComponentsEnum.DELETE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.DELETE,
        },
    ];
}

export function getDropdownBrokerContent(data): DropdownItem[] {
    return [
        {
            title: ConstantStringTableComponentsEnum.EDIT_2,
            name: 'edit-cutomer-or-shipper',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
        },

        {
            title: ConstantStringTableComponentsEnum.VIEW_DETAILS_2,
            name: ConstantStringTableComponentsEnum.VIEW_DETAILS,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: ConstantStringTableComponentsEnum.CREATE_LOAD_2,
            name: ConstantStringTableComponentsEnum.CREATE_LOAD,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: ConstantStringTableComponentsEnum.ADD_CONTRACT_2,
            name: ConstantStringTableComponentsEnum.ADD_CONTRACT,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: ConstantStringTableComponentsEnum.WRITE_REVIEW_2,
            name: ConstantStringTableComponentsEnum.WRITE_REVIEW,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: !data.ban
                ? ConstantStringTableComponentsEnum.MOVE_TO_BAN_LIST_2
                : ConstantStringTableComponentsEnum.REMOVE_FROM_BAN_LIST,
            name: ConstantStringTableComponentsEnum.MOVE_TO_BAN_LIST,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: !data.dnu
                ? ConstantStringTableComponentsEnum.MOVE_TO_DNU_LIST_2
                : ConstantStringTableComponentsEnum.REMOVE_FROM_DNU_LIST,
            name: ConstantStringTableComponentsEnum.MOVE_TO_DNU_LIST,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            hasBorder: true,
        },

        {
            title: ConstantStringTableComponentsEnum.SHARE_2,
            name: ConstantStringTableComponentsEnum.SHARE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: ConstantStringTableComponentsEnum.PRINT_2,
            name: ConstantStringTableComponentsEnum.PRINT,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            hasBorder: true,
        },

        {
            title:
                data.status === 1
                    ? ConstantStringTableComponentsEnum.CLOSE_BUSINESS_2
                    : ConstantStringTableComponentsEnum.OPEN_BUSINESS,
            name: ConstantStringTableComponentsEnum.CLOSE_BUSINESS,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: ConstantStringTableComponentsEnum.DELETE,
        },

        {
            title: ConstantStringTableComponentsEnum.DELETE_2,
            name: ConstantStringTableComponentsEnum.DELETE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: ConstantStringTableComponentsEnum.DELETE,
        },
    ];
}

export function getDropdownOwnerContent(data): DropdownItem[] {
    return [
        {
            title: ConstantStringTableComponentsEnum.EDIT_2,
            name: ConstantStringTableComponentsEnum.EDIT,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
        },
        {
            title: ConstantStringTableComponentsEnum.VIEW_DETAILS_2,
            name: ConstantStringTableComponentsEnum.VIEW_DETAILS,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Add Truck',
            name: 'add-truck',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Add Trailer',
            name: 'add-trailer',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            hasBorder: true,
        },
        {
            title: ConstantStringTableComponentsEnum.SHARE_2,
            name: ConstantStringTableComponentsEnum.SHARE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: ConstantStringTableComponentsEnum.PRINT_2,
            name: ConstantStringTableComponentsEnum.PRINT,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.REGULAR,
            hasBorder: true,
        },
        {
            title:
                data === ConstantStringTableComponentsEnum.ACTIVE
                    ? ConstantStringTableComponentsEnum.DEACTIVATE_2
                    : ConstantStringTableComponentsEnum.ACTIVATE_2,
            name: ConstantStringTableComponentsEnum.ACTIVATE_ITEM,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass:
                data === ConstantStringTableComponentsEnum.ACTIVE
                    ? ConstantStringTableComponentsEnum.DEACTIVATE
                    : ConstantStringTableComponentsEnum.ACTIVATE,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: ConstantStringTableComponentsEnum.DELETE_2,
            name: ConstantStringTableComponentsEnum.DELETE_ITEM,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: ConstantStringTableComponentsEnum.DELETE,
        },
    ];
}
