// enums
import { ConstantStringEnum } from '../../enums/load-modal-stop-items.enum';

// models
import { LoadItemStop } from '../../models/load-item-stop.model';

export class LoadStopItemsConstants {
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

    static IS_CREATED_NEW_STOP_ITEMS_ROW: LoadItemStop = {
        pickup: false,
        delivery: false,
        extraStops: [],
    };
}
