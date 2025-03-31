// constants
import { DashboardTopRatedConstants } from '@pages/dashboard/pages/dashboard-top-rated/utils/constants/dashboard-top-rated.constants';
import { DashboardSubperiodConstants } from '@pages/dashboard/utils/constants/dashboard-subperiod.constants';
import { DashboardColors } from '@pages/dashboard/utils/constants/dashboard-colors.constants';

// helpers
import { DashboardStringHelper } from '@pages/dashboard/utils/helpers/dashboard-string.helper';

// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';
import { PerformanceCurrencyValuesEnum } from '@pages/dashboard/pages/dashboard-performance/enums';

// service
import { DashboardByStateService } from '@pages/dashboard/pages/dashboard-by-state/services/dashboard-by-state.service';

// models
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { FilteredSubperiod } from '@pages/dashboard/models/filtered-subperiod.model';
import { ByStateListItem } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-list-item.model';
import { IStateConfiguration } from '@pages/dashboard/pages/dashboard-by-state/models';
import { AccidentByStateResponse, ByStateReportType, FuelByStateResponse, PickupDeliveryByStateResponse, RepairByStateResponse, RoadsideByStateResponse, ViolationByStateResponse } from 'appcoretruckassist';

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

    static setChartDateTitle(startText: string, endText: string): string {
        const titleStart =
            DashboardStringHelper.capitalizeFirstLetter(startText);
        const titleEnd = DashboardStringHelper.capitalizeFirstLetter(endText);

        const chartTitle = `${titleStart} - ${titleEnd}`;

        return chartTitle;
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
        return Object.values(PerformanceCurrencyValuesEnum).includes(
            key.toUpperCase() as PerformanceCurrencyValuesEnum
        );
    }

    static selectByStateConfiguration(
        dashboardByStateService: DashboardByStateService,
        selectedTab: ByStateReportType,
        byStateTitle: string
    ): IStateConfiguration {
        const byStateConfig = {
            [DashboardStringEnum.PICKUP]: {
                serviceMethod: dashboardByStateService.getPickupByState.bind(
                    dashboardByStateService
                ),
                dataTransform: (pickup: PickupDeliveryByStateResponse, index: number) => ({
                    id: index + 1,
                    state: pickup.stateShortName,
                    value:
                        selectedTab === DashboardStringEnum.COUNT
                            ? pickup.count.toString()
                            : pickup.revenue.toString(),
                    percent:
                        selectedTab === DashboardStringEnum.COUNT
                            ? pickup.countPercentage.toString()
                            : pickup.revenuePercentage.toString(),
                    isSelected: false,
                    selectedColor: null,
                    intervals: pickup.intervals
                } as ByStateListItem),
            },
            [DashboardStringEnum.DELIVERY]: {
                serviceMethod: dashboardByStateService.getDeliveryByState.bind(
                    dashboardByStateService
                ),
                dataTransform: (delivery: PickupDeliveryByStateResponse, index: number) => ({
                    id: index + 1,
                    state: delivery.stateShortName,
                    value:
                        selectedTab === DashboardStringEnum.COUNT
                            ? delivery.count.toString()
                            : delivery.revenue.toString(),
                    percent:
                        selectedTab === DashboardStringEnum.COUNT
                            ? delivery.countPercentage.toString()
                            : delivery.revenuePercentage.toString(),
                    isSelected: false,
                    selectedColor: null,
                    intervals: delivery.intervals
                }),
            },
            [DashboardStringEnum.ROADSIDE]: {
                serviceMethod: dashboardByStateService.getRoadsideByState.bind(
                    dashboardByStateService
                ),
                dataTransform: (rodeside: RoadsideByStateResponse, index: number) => ({
                    id: index + 1,
                    state: rodeside.stateShortName,
                    value:
                        selectedTab === DashboardStringEnum.COUNT
                            ? rodeside.count.toString()
                            : rodeside.severityWeight.toString(),
                    percent:
                        selectedTab === DashboardStringEnum.COUNT
                            ? rodeside.countPercentage.toString()
                            : rodeside.severityWeightPercentage.toString(),
                    isSelected: false,
                    selectedColor: null,
                    intervals: rodeside.intervals
                }),
            },
            [DashboardStringEnum.VIOLATION_2]: {
                serviceMethod: dashboardByStateService.getViolationByState.bind(
                    dashboardByStateService
                ),
                dataTransform: (violation: ViolationByStateResponse, index: number) => ({
                    id: index + 1,
                    state: violation.stateShortName,
                    value:
                        selectedTab === DashboardStringEnum.COUNT
                            ? violation.count.toString()
                            : violation.severityWeight.toString(),
                    percent:
                        selectedTab === DashboardStringEnum.COUNT
                            ? violation.countPercentage.toString()
                            : violation.severityWeightPercentage.toString(),
                    isSelected: false,
                    selectedColor: null,
                    intervals: violation.intervals
                }),
            },
            [DashboardStringEnum.ACCIDENT_2]: {
                serviceMethod: dashboardByStateService.getAccidentByState.bind(
                    dashboardByStateService
                ),
                dataTransform: (accident: AccidentByStateResponse, index: number) => ({
                    id: index + 1,
                    state: accident.stateShortName,
                    value:
                        selectedTab === DashboardStringEnum.COUNT
                            ? accident.count.toString()
                            : accident.severityWeight.toString(),
                    percent:
                        selectedTab === DashboardStringEnum.COUNT
                            ? accident.countPercentage.toString()
                            : accident.severityWeightPercentage.toString(),
                    isSelected: false,
                    selectedColor: null,
                    intervals: accident.intervals
                }),
            },
            [DashboardStringEnum.REPAIR]: {
                serviceMethod: dashboardByStateService.getRepairByState.bind(
                    dashboardByStateService
                ),
                dataTransform: (repair: RepairByStateResponse, index: number) => ({
                    id: index + 1,
                    state: repair.stateShortName,
                    value:
                        selectedTab === DashboardStringEnum.COUNT
                            ? repair.count.toString()
                            : repair.cost.toString(),
                    percent:
                        selectedTab === DashboardStringEnum.COUNT
                            ? repair.countPercentage.toString()
                            : repair.costPercentage.toString(),
                    isSelected: false,
                    selectedColor: null,
                    intervals: repair.intervals
                }),
            },
            [DashboardStringEnum.FUEL]: {
                serviceMethod: dashboardByStateService.getFuelByState.bind(
                    dashboardByStateService
                ),
                dataTransform: (fuel: FuelByStateResponse, index: number) => ({
                    id: index + 1,
                    state: fuel.stateShortName,
                    value:
                        selectedTab === DashboardStringEnum.GALLON
                            ? fuel.gallon.toString()
                            : fuel.cost.toString(),
                    percent:
                        selectedTab === DashboardStringEnum.GALLON
                            ? fuel.gallonPercentage.toString()
                            : fuel.costPercentage.toString(),
                    isSelected: false,
                    selectedColor: null,
                    intervals: fuel.intervals
                }),
            },
        };

        return byStateConfig[byStateTitle];
    }
}
