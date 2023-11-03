// constants
import { DashboardTopRatedConstants } from './constants/dashboard-top-rated.constants';
import { DashboardSubperiodConstants } from './constants/dashboard-subperiod.constants';

// enums
import { ConstantStringEnum } from '../enums/constant-string.enum';

// models
import { DropdownListItem } from '../models/dropdown-list-item.model';
import { FilteredSubperiod } from '../models/filtered-subperiod.model';

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

    static setSubPeriodList(subPeriodIdList: number[]): FilteredSubperiod {
        let selectedSubPeriod: DropdownListItem;

        const filteredSubPeriodDropdownList =
            DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                (period) => {
                    if (period.id === subPeriodIdList[0]) {
                        selectedSubPeriod = period;
                    }

                    return subPeriodIdList.includes(period.id);
                }
            );

        return {
            filteredSubPeriodDropdownList,
            selectedSubPeriod,
        };
    }

    static setCustomSubPeriodList(
        selectedDaysRange: number
    ): FilteredSubperiod {
        let matchingIdList: number[] = [];

        if (selectedDaysRange >= 1 && selectedDaysRange <= 2) {
            matchingIdList =
                DashboardSubperiodConstants.CUSTOM_PERIOD_ID_LIST_1;
        }

        if (selectedDaysRange > 2 && selectedDaysRange <= 14) {
            matchingIdList =
                DashboardSubperiodConstants.CUSTOM_PERIOD_ID_LIST_2;
        }

        if (selectedDaysRange > 14 && selectedDaysRange <= 60) {
            matchingIdList =
                DashboardSubperiodConstants.CUSTOM_PERIOD_ID_LIST_3;
        }

        if (selectedDaysRange > 60 && selectedDaysRange <= 365) {
            matchingIdList =
                DashboardSubperiodConstants.CUSTOM_PERIOD_ID_LIST_4;
        }

        if (selectedDaysRange > 365 && selectedDaysRange <= 730) {
            matchingIdList =
                DashboardSubperiodConstants.CUSTOM_PERIOD_ID_LIST_5;
        }

        if (selectedDaysRange > 730) {
            matchingIdList =
                DashboardSubperiodConstants.CUSTOM_PERIOD_ID_LIST_6;
        }

        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            this.setSubPeriodList(matchingIdList);

        return {
            filteredSubPeriodDropdownList,
            selectedSubPeriod,
        };
    }
}
