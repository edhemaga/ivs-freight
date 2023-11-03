import { ConstantStringEnum } from '../enums/constant-string.enum';

export class DashboardUtils {
    static ConvertMainPeriod(mainPeriod: string) {
        switch (mainPeriod) {
            case ConstantStringEnum.WEEK_TO_DATE:
                return ConstantStringEnum.WTD;
            case ConstantStringEnum.MONTH_TO_DATE:
                return ConstantStringEnum.MTD;
            case ConstantStringEnum.QUARTAL_TO_DATE:
                return ConstantStringEnum.QTD;
            case ConstantStringEnum.YEAR_TO_DATE:
                return ConstantStringEnum.YTD;
            case ConstantStringEnum.ALL_TIME:
                return ConstantStringEnum.ALT;
            default:
                return mainPeriod;
        }
    }

    static ConvertSubPeriod(subPeriod: string) {
        switch (subPeriod) {
            case ConstantStringEnum.THREE_HOURS:
                return ConstantStringEnum.THS;
            case ConstantStringEnum.SIX_HOURS:
                return ConstantStringEnum.SHS;
            case ConstantStringEnum.SEMI_DAILY:
                return ConstantStringEnum.SMD;
            case ConstantStringEnum.SEMI_MONTHLY:
                return ConstantStringEnum.SML;
            case ConstantStringEnum.BI_WEEKLY:
                return ConstantStringEnum.BWL;
            default:
                return subPeriod;
        }
    }
}
