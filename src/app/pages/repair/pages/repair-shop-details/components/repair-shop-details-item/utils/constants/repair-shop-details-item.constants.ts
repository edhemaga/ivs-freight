// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

// models
import { RepairActionItem } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/models';

export class RepairShopDetailsItemConstants {
    static REPAIR_HEADER_ITEMS: string[] = [
        'INVOICE',
        'DATE',
        'UNIT',
        'DESCRIPTION',
        'COST',
    ];

    static REPAIR_DROPDOWN_HEADER_ITEMS: string[] = [
        '#',
        'ITEM',
        'QTY',
        'PRICE',
        'TOTAL',
    ];

    static REPAIR_ACTION_COLUMNS: RepairActionItem[] = [
        {
            title: RepairShopDetailsStringEnum.DOCUMENT,
            iconRoute: 'assets/svg/common/ic_attachment.svg',
        },
        {
            title: RepairShopDetailsStringEnum.NOTE,
            iconRoute: 'assets/svg/truckassist-table/note/Note.svg',
        },
        {
            title: RepairShopDetailsStringEnum.MORE,
            iconRoute: 'assets/svg/truckassist-table/dropdown/dropdown.svg',
        },
    ];
}
