// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { BrokerDetailsStringEnum } from '@pages/customer/pages/broker-details/enums';

// Svg Routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/';

// Models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';

export class BrokerLoadDropdownActionsConstants {
    static loadDropdownActions: DropdownItem[] = [
        {
            title: TableStringEnum.EDIT_2,
            name: TableStringEnum.EDIT,
            svg: BrokerDetailsSvgRoutes.editIcon,
            show: true,
            iconName: TableStringEnum.EDIT,
        },
        {
            title: TableStringEnum.BORDER,
        },
        {
            title: TableStringEnum.VIEW_DETAILS_2,
            name: TableStringEnum.VIEW_DETAILS,
            svg: BrokerDetailsSvgRoutes.hazardousInfoIcon,
            iconName: TableStringEnum.VIEW_DETAILS,
            show: true,
        },
        {
            title: TableStringEnum.BORDER,
        },
        {
            title: TableStringEnum.SHARE_2,
            name: TableStringEnum.SHARE,
            svg: BrokerDetailsSvgRoutes.shareIcon,
            iconName: TableStringEnum.SHARE,
            show: true,
        },
        {
            title: TableStringEnum.PRINT_2,
            name: TableStringEnum.PRINT,
            svg: BrokerDetailsSvgRoutes.printIcon,
            iconName: TableStringEnum.PRINT,
            show: true,
        },
        {
            title: TableStringEnum.BORDER,
        },
        {
            title: TableStringEnum.DELETE_2,
            name: TableStringEnum.DELETE_ITEM,
            type: TableStringEnum.DRIVER,
            text: BrokerDetailsStringEnum.DELETE_DRIVER_TEXT,
            svg: BrokerDetailsSvgRoutes.deleteIcon,
            iconName: TableStringEnum.DELETE,
            danger: true,
            show: true,
            redIcon: true,
        },
    ];
}
