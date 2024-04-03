// enums
import { LoadModalStopItemsStringEnum } from "../../../../enums/load-modal-stop-items-string.enum";

// models
import { LoadItemStop } from '../../models/load-item-stop.model';

export class LoadStopItems {
    static STOP_ITEM_HEADERS: string[] = [
        LoadModalStopItemsStringEnum.HASH,
        LoadModalStopItemsStringEnum.DESCRIPTION,
        LoadModalStopItemsStringEnum.QUANTITY,
        LoadModalStopItemsStringEnum.TMP,
        LoadModalStopItemsStringEnum.WEIGHT,
        LoadModalStopItemsStringEnum.LENGTH,
        LoadModalStopItemsStringEnum.HEIGHT,
        LoadModalStopItemsStringEnum.TARP,
        LoadModalStopItemsStringEnum.STACK,
        LoadModalStopItemsStringEnum.SECURE,
        LoadModalStopItemsStringEnum.BOL_NO,
        LoadModalStopItemsStringEnum.PICKUP_NO,
        LoadModalStopItemsStringEnum.SEAL_NO,
        LoadModalStopItemsStringEnum.CODE,
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
