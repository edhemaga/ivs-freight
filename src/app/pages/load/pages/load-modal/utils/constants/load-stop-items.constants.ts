// enums
import { LoadModalStopItemsStringEnum } from '@pages/load/enums/load-modal-stop-items-string.enum';

// models
import { LoadItemStop } from '@pages/load/pages/load-modal/models/load-item-stop.model';

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

    static PAYMENT_TYPES = [
        {
            "name": "Factoring",
            "id": 1
        },
        {
            "name": "Wire Transfer",
            "id": 2
        },
        {
            "name": "ACH",
            "id": 3
        },
        {
            "name": "Cash",
            "id": 4
        },
        {
            "name": "Check",
            "id": 5
        },
        {
            "name": "Money Code",
            "id": 6
        },
        {
            "name": "Quick pay (Zelle)",
            "id": 7
        },
        {
            "name": "Quick pay (Venmo)",
            "id": 8
        },
        {
            "name": "Quick pay (Cashapp)",
            "id": 9
        },
        {
            "name": "Quick pay (PayPal)",
            "id": 10
        }
    ];
}
