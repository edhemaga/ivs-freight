import { ConstantStringEnum } from '../../enums/constant-string.enum';

export class DashboardSubperiodConstants {
    static TODAY_ID_LIST: number[] = [1, 2, 3];
    static WTD_ID_LIST: number[] = [3, 4, 5];
    static MTD_ID_LIST: number[] = [5, 6, 7];
    static QTD_ID_LIST: number[] = [5, 6, 8];
    static YTD_ID_LIST: number[] = [6, 8, 9];

    static CUSTOM_PERIOD_ID_LIST_1: number[] = [1, 2, 3];
    static CUSTOM_PERIOD_ID_LIST_2: number[] = [3, 4, 5, 6];
    static CUSTOM_PERIOD_ID_LIST_3: number[] = [5, 6, 7];
    static CUSTOM_PERIOD_ID_LIST_4: number[] = [6, 8, 9, 10];
    static CUSTOM_PERIOD_ID_LIST_5: number[] = [8, 9, 10, 11];
    static CUSTOM_PERIOD_ID_LIST_6: number[] = [9, 10, 11];

    static CUSTOM_SUBPERIOD_LABEL_LIST: string[] = [
        ConstantStringEnum.HOURLY,
        ConstantStringEnum.THS,
        ConstantStringEnum.SHS,
        ConstantStringEnum.SMD,
    ];

    static CUSTOM_SUBPERIOD_LABEL_LIST_2: string[] = [
        ConstantStringEnum.DAILY,
        ConstantStringEnum.WEEKLY,
        ConstantStringEnum.BWL,
        ConstantStringEnum.SML,
        ConstantStringEnum.QUARTERLY,
    ];
}
