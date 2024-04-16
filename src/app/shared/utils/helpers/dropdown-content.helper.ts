// models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export class DropdownContentHelper {
    static getDropdownShipperContent(data): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: 'edit-cutomer-or-shipper',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },

            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: TableStringEnum.ADD_CONTRACT_2,
                name: TableStringEnum.ADD_CONTRACT,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: TableStringEnum.WRITE_REVIEW_2,
                name: TableStringEnum.WRITE_REVIEW,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            {
                title:
                    data.status === 1
                        ? TableStringEnum.CLOSE_BUSINESS_2
                        : TableStringEnum.OPEN_BUSINESS,
                name: TableStringEnum.CLOSE_BUSINESS,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.DELETE,
            },

            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    static getDropdownBrokerContent(data): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: 'edit-cutomer-or-shipper',
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },

            {
                title: TableStringEnum.VIEW_DETAILS_2,
                name: TableStringEnum.VIEW_DETAILS,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: TableStringEnum.CREATE_LOAD_2,
                name: TableStringEnum.CREATE_LOAD,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: TableStringEnum.ADD_CONTRACT_2,
                name: TableStringEnum.ADD_CONTRACT,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: TableStringEnum.WRITE_REVIEW_2,
                name: TableStringEnum.WRITE_REVIEW,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: !data.ban
                    ? TableStringEnum.MOVE_TO_BAN_LIST_2
                    : TableStringEnum.REMOVE_FROM_BAN_LIST,
                name: TableStringEnum.MOVE_TO_BAN_LIST,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: !data.dnu
                    ? TableStringEnum.MOVE_TO_DNU_LIST_2
                    : TableStringEnum.REMOVE_FROM_DNU_LIST,
                name: TableStringEnum.MOVE_TO_DNU_LIST,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },

            {
                title: TableStringEnum.SHARE_2,
                name: TableStringEnum.SHARE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: TableStringEnum.PRINT_2,
                name: TableStringEnum.PRINT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },

                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },

            {
                title:
                    data.status === 1
                        ? TableStringEnum.CLOSE_BUSINESS_2
                        : TableStringEnum.OPEN_BUSINESS,
                name: TableStringEnum.CLOSE_BUSINESS,
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.DELETE,
            },

            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }

    static getDropdownOwnerContent(): DropdownItem[] {
        return [
            {
                title: TableStringEnum.EDIT_2,
                name: TableStringEnum.EDIT,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                svgClass: TableStringEnum.REGULAR,
            },
            // {
            //     title: TableStringEnum.VIEW_DETAILS_2,
            //     name: TableStringEnum.VIEW_DETAILS,
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            //     tableListDropdownContentStyle: {
            //         'margin-bottom.px': 4,
            //     },
            // },
            //leave this commented for now
            {
                title: 'Add Truck',
                name: 'add-truck',
                svgUrl: '',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.REGULAR,
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
                svgClass: TableStringEnum.REGULAR,
                hasBorder: true,
            },
            // {
            //     title: TableStringEnum.SHARE_2,
            //     name: TableStringEnum.SHARE,
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            //     tableListDropdownContentStyle: {
            //         'margin-bottom.px': 4,
            //     },
            // },
            // {
            //     title: TableStringEnum.PRINT_2,
            //     name: TableStringEnum.PRINT,
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            //     hasBorder: true,
            // },
            //leave this commented for now
            // {
            //     title:
            //         data === TableStringEnum.ACTIVE
            //             ? TableStringEnum.DEACTIVATE_2
            //             : TableStringEnum.ACTIVATE_2,
            //     name: TableStringEnum.ACTIVATE_ITEM,
            //     svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Deactivate.svg',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass:
            //         data === TableStringEnum.ACTIVE
            //             ? TableStringEnum.DEACTIVATE
            //             : TableStringEnum.ACTIVATE,
            //     tableListDropdownContentStyle: {
            //         'margin-bottom.px': 4,
            //     },
            // },
            //leave this commented for now
            {
                title: TableStringEnum.DELETE_2,
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];
    }
}
