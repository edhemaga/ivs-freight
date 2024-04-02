// constants
import { DashboardTopRatedConstants } from '../../pages/dashboard-top-rated/utils/constants/dashboard-top-rated.constants';
import { DashboardSubperiodConstants } from '../constants/dashboard-subperiod.constants';
import { DashboardColors } from '../constants/dashboard-colors.constants';

// helpers
import { DashboardStringHelper } from './dashboard-string.helper';

// enums
import { DashboardStringEnum } from '../../enums/dashboard-string.enum';

// models
import { DropdownListItem } from '../../models/dropdown-list-item.model';
import { FilteredSubperiod } from '../../models/filtered-subperiod.model';
import { BarChartLabels } from '../../models/dashboard-chart-models/bar-chart.model';
import { IntervalLabelResponse } from 'appcoretruckassist';
import { ByStateListItem } from '../../pages/dashboard-by-state/models/by-state-list-item.model';

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

    static setBarChartLabels(
        barChartLables: IntervalLabelResponse[],
        selectedSubPeriod: string
    ): BarChartLabels {
        let filteredTooltipLabels: string[] = [];

        const filteredLabels = barChartLables.map((barChartLabel) => {
            filteredTooltipLabels = [
                ...filteredTooltipLabels,
                barChartLabel.tooltipLabel,
            ];

            const isSelectedSubPeriodIncludedInCustomPeriodList =
                (DashboardSubperiodConstants.CUSTOM_SUBPERIOD_LABEL_LIST.includes(
                    selectedSubPeriod
                ) &&
                    !barChartLabel.label.includes(DashboardStringEnum.PM) &&
                    !barChartLabel.label.includes(DashboardStringEnum.AM)) ||
                DashboardSubperiodConstants.CUSTOM_SUBPERIOD_LABEL_LIST_2.includes(
                    selectedSubPeriod
                );

            if (isSelectedSubPeriodIncludedInCustomPeriodList) {
                const splitLabel = barChartLabel.label.split(
                    DashboardStringEnum.EMPTY_SPACE_STRING
                );

                if (splitLabel[2]) {
                    const concatinatedDateString = `${splitLabel[0]} ${splitLabel[1]}`;

                    return [concatinatedDateString, splitLabel[2]];
                }

                return [splitLabel[0], splitLabel[1]];
            }

            return barChartLabel.label;
        });

        if (Array.isArray(filteredLabels[0])) {
            return {
                filteredLabels: filteredLabels as string[][],
                filteredTooltipLabels,
            };
        } else {
            return {
                filteredLabels: filteredLabels as string[],
                filteredTooltipLabels,
            };
        }
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
}
