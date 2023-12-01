// constants
import { DashboardTopRatedConstants } from './constants/dashboard-top-rated.constants';
import { DashboardSubperiodConstants } from './constants/dashboard-subperiod.constants';
import { DashboardColors } from './constants/dashboard-colors.constants';

// helpers
import { DashboardStringHelper } from './helpers/dashboard-string.helper';

// enums
import { ConstantStringEnum } from '../enums/constant-string.enum';

// models
import { DropdownListItem } from '../models/dropdown-list-item.model';
import { FilteredSubperiod } from '../models/filtered-subperiod.model';
import { BarChartLabels } from '../models/dashboard-chart-models/bar-chart.model';
import { IntervalLabelResponse } from 'appcoretruckassist';
import { ByStateListItem } from '../models/dashboard-by-state-models/by-state-list-item.model';

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
                    !barChartLabel.label.includes(ConstantStringEnum.PM) &&
                    !barChartLabel.label.includes(ConstantStringEnum.AM)) ||
                DashboardSubperiodConstants.CUSTOM_SUBPERIOD_LABEL_LIST_2.includes(
                    selectedSubPeriod
                );

            if (isSelectedSubPeriodIncludedInCustomPeriodList) {
                const splitLabel = barChartLabel.label.split(
                    ConstantStringEnum.EMPTY_SPACE_STRING
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

        const regex = new RegExp(searchValue, ConstantStringEnum.REGEX_GI);

        return text.replace(
            regex,
            (match) => `<span class="highlight">${match}</span>`
        );
    }

    static setByStateListColorRange(byStateList: ByStateListItem[]): void {
        let duzina = 0;

        if (!byStateList.length) return;

        if (
            byStateList.length <= DashboardColors.BY_STATE_COLORS_PALLETE.length
        ) {
            duzina = 1;
        } else {
            duzina = byStateList.length / 5;

            if (!Number.isInteger(duzina)) {
                duzina = Math.ceil(duzina);
            }
        }

        let neki = duzina;
        let brojacBoje = 0;

        for (let i = 0; i < byStateList.length; i++) {
            if (i < neki) {
                byStateList[i].selectedColor =
                    DashboardColors.BY_STATE_COLORS_PALLETE[brojacBoje].code;
            }

            if (i + 1 === neki) {
                brojacBoje++;

                neki += duzina;
            }
        }
    }
}
