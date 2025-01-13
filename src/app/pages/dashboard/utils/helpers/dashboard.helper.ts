// constants
import { DashboardTopRatedConstants } from '@pages/dashboard/pages/dashboard-top-rated/utils/constants/dashboard-top-rated.constants';
import { DashboardSubperiodConstants } from '@pages/dashboard/utils/constants/dashboard-subperiod.constants';
import { DashboardColors } from '@pages/dashboard/utils/constants/dashboard-colors.constants';

// helpers
import { DashboardStringHelper } from '@pages/dashboard/utils/helpers/dashboard-string.helper';

// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';
import { CurrencyValuesEnum } from '@pages/dashboard/enums';

// models
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { FilteredSubperiod } from '@pages/dashboard/models/filtered-subperiod.model';
import { ByStateListItem } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-list-item.model';

export class DashboardHelper {
    static ConvertMainPeriod(mainPeriod: string) {
        switch (mainPeriod) {
            case DashboardStringEnum.WEEK_TO_DATE:
                return DashboardStringEnum.WTD;
            case DashboardStringEnum.MONTH_TO_DATE:
                return DashboardStringEnum.MTD;
            case DashboardStringEnum.QUARTAL_TO_DATE:
                return DashboardStringEnum.QTD;
            case DashboardStringEnum.YEAR_TO_DATE:
                return DashboardStringEnum.YTD;
            case DashboardStringEnum.ALL_TIME:
                return DashboardStringEnum.ALT;
            default:
                return mainPeriod;
        }
    }

    static ConvertSubPeriod(subPeriod: string) {
        switch (subPeriod) {
            case DashboardStringEnum.THREE_HOURS:
                return DashboardStringEnum.THS;
            case DashboardStringEnum.SIX_HOURS:
                return DashboardStringEnum.SHS;
            case DashboardStringEnum.SEMI_DAILY:
                return DashboardStringEnum.SMD;
            case DashboardStringEnum.SEMI_MONTHLY:
                return DashboardStringEnum.SML;
            case DashboardStringEnum.BI_WEEKLY:
                return DashboardStringEnum.BWL;
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

        if (selectedDaysRange >= 0 && selectedDaysRange <= 2) {
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

        if (selectedDaysRange > 60 && selectedDaysRange <= 366) {
            matchingIdList =
                DashboardSubperiodConstants.CUSTOM_PERIOD_ID_LIST_4;
        }

        if (selectedDaysRange > 366 && selectedDaysRange <= 730) {
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

    static createBarChartEmptyLabels(
        barChartLabels: string[] | string[][]
    ): (string | string[])[] {
        let emptyLabelsArray: (string | string[])[] = [];

        for (let i = 0; i < barChartLabels.length; i++) {
            if (Array.isArray(barChartLabels[i])) {
                emptyLabelsArray = [...emptyLabelsArray, ['', '']];
            } else {
                emptyLabelsArray = [...emptyLabelsArray, ''];
            }
        }

        return emptyLabelsArray;
    }

    static setChartDateTitle(
        startText: string,
        endText: string
    ): { chartTitle: string } {
        const titleStart =
            DashboardStringHelper.capitalizeFirstLetter(startText);
        const titleEnd = DashboardStringHelper.capitalizeFirstLetter(endText);

        const chartTitle = `${titleStart} - ${titleEnd}`;

        return { chartTitle };
    }

    static highlightPartOfString(
        text: string,
        searchValue: string,
        isSelected: boolean
    ): string {
        if (isSelected || !text || !searchValue) {
            return text;
        }

        const regex = new RegExp(searchValue, DashboardStringEnum.REGEX_GI);

        return text.replace(
            regex,
            (match) => `<span class="highlight">${match}</span>`
        );
    }

    static setByStateListColorRange(byStateList: ByStateListItem[]): void {
        const colors = DashboardColors.BY_STATE_COLORS_PALLETE;

        const customBoundaryNumber = 10;
        const customStatesLength =
            byStateList.length > customBoundaryNumber
                ? customBoundaryNumber
                : byStateList.length;

        const byStateMeanValue = Math.floor(customStatesLength / colors.length);
        const byStateResidue = customStatesLength % colors.length;

        let byStateListCounter = 0;

        for (let i = 0; i < colors.length; i++) {
            if (byStateListCounter === customBoundaryNumber) break;

            let colorCounter = byStateMeanValue;

            if (i < byStateResidue) colorCounter += 1;

            for (let j = 0; j < colorCounter; j++) {
                byStateList[byStateListCounter++].selectedColor =
                    colors[i].code;
            }
        }

        if (byStateList.length > customBoundaryNumber) {
            for (let i = customBoundaryNumber; i < byStateList.length; i++) {
                byStateList[i].selectedColor = colors[colors.length - 1].code;
            }
        }
    }

    static isCurrency(key: string): boolean {
        return Object.values(CurrencyValuesEnum).includes(key.toUpperCase() as CurrencyValuesEnum);
    }
}
