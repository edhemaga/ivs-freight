import { TableStringEnum } from '@shared/enums/table-string.enum';

// models
import { RepairDropdownTableModel } from '@pages/repair/pages/repair-table/models/repair-dropdown-table-model';

export class RepairTableHelper {
    // repair
    static getRepairTableDropdownContent(
        tabSelected: string,
        repairType: string
    ): RepairDropdownTableModel[] {
        const commonDropdownContent: RepairDropdownTableModel[] = [
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
            {
                title:
                    repairType === TableStringEnum.ORDER
                        ? TableStringEnum.ALL_ORDERS
                        : TableStringEnum.ALL_BILS,
                name:
                    repairType === TableStringEnum.ORDER
                        ? TableStringEnum.ALL_ORDERS_2
                        : TableStringEnum.ALL_BILS_2,
                svgUrl:
                    tabSelected === TableStringEnum.ACTIVE
                        ? 'assets/svg/common/ic_truck.svg'
                        : 'assets/svg/common/ic_trailer.svg',

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

        const orderDropdownContent: RepairDropdownTableModel = {
            title: TableStringEnum.FINISH_ORDER_3,
            name: TableStringEnum.FINISH_ORDER,
            svgUrl: 'assets/svg/common/ic_note_order.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: TableStringEnum.ACTIVATE,
        };

        if (repairType === TableStringEnum.ORDER)
            commonDropdownContent.splice(1, 0, orderDropdownContent);

        return commonDropdownContent;
    }

    // repair shop
    static getRepairShopTableDropdownContent(
        status: number,
        isPinned: boolean,
        isCompanyOwned: boolean
    ): RepairDropdownTableModel[] {
        return [
            {
                title: 'Edit',
                name: 'edit',
                svgUrl: '/assets/svg/common/load/ic_load-pen.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
                mutedStyle: !status,
            },
            {
                title: 'View Details',
                name: 'view-details',
                svgUrl: '/assets/svg/common/confirmation/ic_confirmation_info.svg',
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
                title: 'Add Bill',
                name: 'add-bill',
                svgUrl: '/assets/svg/common/ic_plus.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'favourite',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !status,
            },
            {
                title: isPinned ? 'Unmark Favorite' : 'Mark as Favorite',
                name: 'favorite',
                svgUrl: '/assets/svg/common/ic_star.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: isPinned ? 'regular' : 'favourite',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
                mutedStyle: !status || isCompanyOwned,
            },
            {
                title: 'Write Review',
                name: 'write-review',
                svgUrl: '/assets/svg/common/review-pen.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
                mutedStyle: !status,
            },
            // not in this version
            /*  {
                title: 'Share',
                name: 'share',
                svgUrl: '/assets/svg/common/share-icon.svg',
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
                svgUrl: '/assets/svg/common/ic_print.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'regular',
                hasBorder: true,
            }, */
            {
                title: !status ? 'Open Business' : 'Close Business',
                name: 'close-business',
                svgUrl: !status
                    ? '/assets/svg/common/confirm-circle_white.svg'
                    : '/assets/svg/common/load/ic_load-broker-closed-business.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: !status ? 'open-business' : 'delete',
                tableListDropdownContentStyle: {
                    'margin-bottom.px': 4,
                },
            },
            {
                title: 'Delete',
                name: 'delete',
                svgUrl: '/assets/svg/common/ic_trash_updated.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: 'delete',
            },
        ];
    }
}
