// enums
import { ConstantStringEnum } from '../../enums/constant-string.enum';

// models
import { DropdownListItem } from '../../models/dropdown-list-item.model';

export class LoadModalConstants {
    static STOP_ITEM_HEADERS: string[] = [
        ConstantStringEnum.HASH,
        ConstantStringEnum.DESCRIPTION,
        ConstantStringEnum.QUANTITY,
        ConstantStringEnum.TMP,
        ConstantStringEnum.WEIGHT,
        ConstantStringEnum.LENGTH,
        ConstantStringEnum.HEIGHT,
        ConstantStringEnum.TARP,
        ConstantStringEnum.STACK,
        ConstantStringEnum.SECURE,
        ConstantStringEnum.BOL_NO,
        ConstantStringEnum.PICKUP_NO,
        ConstantStringEnum.SEAL_NO,
        ConstantStringEnum.CODE,
    ];

    static QUANTITY_DROPDOWN_LIST: DropdownListItem[] = [
        {
            id: 1,
            name: ConstantStringEnum.BAG,
        },
        {
            id: 2,
            name: ConstantStringEnum.BALE,
        },
        {
            id: 3,
            name: ConstantStringEnum.BARREL,
        },
        {
            id: 4,
            name: ConstantStringEnum.BOX,
        },
        {
            id: 5,
            name: ConstantStringEnum.BULK,
        },
        {
            id: 6,
            name: ConstantStringEnum.CASE,
        },
        {
            id: 7,
            name: ConstantStringEnum.PALLET,
        },
        {
            id: 8,
            name: ConstantStringEnum.PIECE,
        },
    ];

    static STACK_DROPDOWN_LIST: DropdownListItem[] = [
        {
            id: 1,
            name: ConstantStringEnum.YES,
        },
        {
            id: 2,
            name: ConstantStringEnum.NO,
        },
    ];

    static SECURE_DROPDOWN_LIST: DropdownListItem[] = [
        {
            id: 1,
            name: ConstantStringEnum.STRAP,
        },
        {
            id: 2,
            name: ConstantStringEnum.CHAIN,
        },
    ];

    static IS_INPUT_HOVER_ROW: boolean[] = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ];
}
