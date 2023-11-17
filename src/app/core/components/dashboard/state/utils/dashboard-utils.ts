import moment from 'moment';

// constants
import { DashboardTopRatedConstants } from './constants/dashboard-top-rated.constants';
import { DashboardSubperiodConstants } from './constants/dashboard-subperiod.constants';

// enums
import { ConstantStringEnum } from '../enums/constant-string.enum';
import { ConstantChartStringEnum } from '../enums/constant-chart-string.enum';

// models
import { DropdownListItem } from '../models/dropdown-list-item.model';
import { FilteredSubperiod } from '../models/filtered-subperiod.model';
import {
    BarChartInterval,
    BarChartLabels,
} from '../models/dashboard-chart-models/bar-chart.model';
import { IntervalLabelResponse } from 'appcoretruckassist';

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

            if (
                ((selectedSubPeriod === ConstantStringEnum.HOURLY ||
                    selectedSubPeriod === ConstantStringEnum.THS ||
                    selectedSubPeriod === ConstantStringEnum.SHS ||
                    selectedSubPeriod === ConstantStringEnum.SMD) &&
                    !barChartLabel.label.includes(ConstantStringEnum.PM) &&
                    !barChartLabel.label.includes(ConstantStringEnum.AM)) ||
                selectedSubPeriod === ConstantStringEnum.DAILY ||
                selectedSubPeriod === ConstantStringEnum.WEEKLY ||
                selectedSubPeriod === ConstantStringEnum.BWL ||
                selectedSubPeriod === ConstantStringEnum.SML ||
                selectedSubPeriod === ConstantStringEnum.QUARTERLY
            ) {
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

    static setBarChartDateTitle(
        startInterval: BarChartInterval,
        endInterval: BarChartInterval
    ): { barDateTitle: string } {
        const startIntervalDate = moment(new Date(startInterval.startTime));
        const endIntervalDate = moment(new Date(endInterval.endTime));

        const dateTitleStartMonth = startIntervalDate.format(
            ConstantChartStringEnum.MMMM
        );
        const dateTitleStartYear = startIntervalDate.format(
            ConstantChartStringEnum.YYYY
        );

        const dateTitleEndMonth = endIntervalDate.format(
            ConstantChartStringEnum.MMMM
        );
        const dateTitleEndtYear = endIntervalDate.format(
            ConstantChartStringEnum.YYYY
        );

        const barDateTitle = `${dateTitleStartMonth}, ${dateTitleStartYear} - ${dateTitleEndMonth}, ${dateTitleEndtYear}`;

        return { barDateTitle };
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
}
