import { DispatchHistoryModalStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-history-modal-string.enum';

export class DispatchHistoryModalConstants {
    static DISPATCH_HISTORY_HEADER_ITEMS: string[] = [
        'DISPATCH BOARD',
        'TRUCK',
        'TRAILER',
        'DRIVER',
        'START',
        'END',
        'TOTAL',
    ];

    static DISPATCH_HISTORY_GROUP_HEADER_ITEMS: string[] = [
        'STATUS',
        'START',
        'END',
        'TOTAL',
    ];

    static IS_INPUT_HOVER_ROW_DISPATCH: boolean[] = [
        false,
        false,
        false,
        false,
    ];

    static GROUP_ITEM_CONTROL_NAMES: string[] = [
        DispatchHistoryModalStringEnum.DATE_START,
        DispatchHistoryModalStringEnum.TIME_START,
        DispatchHistoryModalStringEnum.DATE_END,
        DispatchHistoryModalStringEnum.TIME_END,
    ];
}
