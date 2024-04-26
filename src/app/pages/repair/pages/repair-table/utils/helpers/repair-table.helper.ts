import { TableStringEnum } from '@shared/enums/table-string.enum';

//models
import { RepairDropdownTableModel } from '../../models/repair-dropdown-table-model';

export class RepairTableHelper {
    static dropdownTableContent(
        tabSelected: string,
        repairType
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
                name: TableStringEnum.DELETE_ITEM,
                svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
                svgStyle: {
                    width: 18,
                    height: 18,
                },
                svgClass: TableStringEnum.DELETE,
            },
        ];

        const orderDropdownContent: RepairDropdownTableModel = {
            title: TableStringEnum.FINISH_ORDER_2,
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

        if (repairType === TableStringEnum.ORDER) {
            commonDropdownContent.splice(2, 0, orderDropdownContent);
        }

        return commonDropdownContent;
    }
}
