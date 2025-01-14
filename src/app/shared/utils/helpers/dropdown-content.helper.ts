// models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { LoadListDto } from 'appcoretruckassist';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { LoadModel } from '@pages/load/pages/load-table/models/load.model';

// Helpers
import { LoadDetailsHelper } from '@pages/load/pages/load-details/utils/helpers/load-details.helper';

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
                mutedStyle: !data.status,
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
                svgUrl: 'assets/svg/common/ic_broker-user.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                hasBorder: true,
                mutedStyle: !data.status,
                svgClass: TableStringEnum.REGULAR,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            // {
            //     title: TableStringEnum.WRITE_REVIEW_2,
            //     name: TableStringEnum.WRITE_REVIEW,
            //     svgUrl: '',
            //     svgStyle: {
            //         width: 18,
            //         height: 18,
            //     },
            //     svgClass: TableStringEnum.REGULAR,
            //     hasBorder: true,
            // this is not going into first sprint },
            {
                title: data.status
                    ? TableStringEnum.CLOSE_BUSINESS_2
                    : TableStringEnum.OPEN_BUSINESS,
                name: TableStringEnum.CLOSE_BUSINESS,
                svgUrl:
                    data.status == 1
                        ? 'assets/svg/common/ic_closed_broker.svg'
                        : 'assets/svg/common/ic_verify-check.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass:
                    data.status == 1
                        ? TableStringEnum.DELETE
                        : TableStringEnum.CHECK,
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
                name: TableStringEnum.EDIT_CUSTOMER_OR_SHIPPER,
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
                svgUrl: 'assets/svg/common/ic_plus.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.FAVOURITE,
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },

            {
                title: TableStringEnum.ADD_CONTRACT_2,
                name: TableStringEnum.ADD_CONTRACT,
                svgUrl: 'assets/svg/truckassist-table/customer/contact-column-avatar.svg',
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
                svgUrl: 'assets/svg/common/review-pen.svg',
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
                svgUrl: 'assets/svg/common/ic_banned_broker.svg',
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
                svgUrl: 'assets/svg/common/ic_dnu_broker.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
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
                title: data.status
                    ? TableStringEnum.CLOSE_BUSINESS_2
                    : TableStringEnum.OPEN_BUSINESS,
                name: TableStringEnum.CLOSE_BUSINESS,
                svgUrl: data.status
                    ? 'assets/svg/common/ic_closed_broker.svg'
                    : 'assets/svg/common/ic_open_bussiness.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                svgClass: data.status
                    ? TableStringEnum.DELETE
                    : TableStringEnum.OPEN_BUSINESS_2,
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

    static getDropdownLoadContent(
        data: LoadModel | LoadListDto,
        tab: string
    ): DropdownItem[] {
        return [
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
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: data.status ? 'Create Template' : 'Create Load',
                name: data.status
                    ? TableStringEnum.CONVERT_TO_TEMPLATE
                    : TableStringEnum.CONVERT_TO_LOAD,
                svgUrl: `assets/svg/truckassist-table/new-list-dropdown/${
                    data.status ? 'slider' : 'plus'
                }.svg`,
                svgStyle: {
                    width: 18,
                    height: 18,
                },
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
                mutedStyle: LoadDetailsHelper.enableDeleteButton(tab),
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
