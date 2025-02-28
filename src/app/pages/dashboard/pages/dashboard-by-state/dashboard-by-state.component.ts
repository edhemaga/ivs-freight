import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Observable, Subject, takeUntil, tap } from 'rxjs';

// services
import { DashboardByStateService } from '@pages/dashboard/pages/dashboard-by-state/services/dashboard-by-state.service';
import { DashboardService } from '@pages/dashboard/services/dashboard.service';

// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';

// helpers
import { DashboardHelper } from '@pages/dashboard/utils/helpers/dashboard.helper';
import { DashboardArrayHelper } from '@pages/dashboard/utils/helpers/dashboard-array-helper';

// constants
import { DashboardSubperiodConstants } from '@pages/dashboard/utils/constants/dashboard-subperiod.constants';
import { DashboardTopRatedConstants } from '@pages/dashboard/pages/dashboard-top-rated/utils/constants/dashboard-top-rated.constants';
import { DashboardColors } from '@pages/dashboard/utils/constants/dashboard-colors.constants';
import {
    DashboardByStateChartDatasetConfiguration,
    DashboardByStateChartsConfiguration,
    DashboardByStateConstants,
} from '@pages/dashboard/pages/dashboard-by-state/utils/constants';
import { DashboardConstants } from '@pages/dashboard/utils/constants';

// models
import { DropdownItem } from '@shared/models/dropdown-item.model';
import { DashboardTab } from '@pages/dashboard/models/dashboard-tab.model';
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import {
    IBaseDataset,
    IChartConfiguration,
} from 'ca-components/lib/components/ca-chart/models';

import {
    ByStateReportType,
    IntervalLabelResponse,
    LoadStopType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';

import {
    ByStateApiArguments,
    ByStateIntervalResponse,
    ByStateListItem,
    ByStateResponse,
    ByStateWithLoadStopApiArguments,
    MapListItem,
} from '@pages/dashboard/pages/dashboard-by-state/models';

import { DashboardByStateSvgRoutes } from '@pages/dashboard/pages/dashboard-by-state/utils/svg-routes';

@Component({
    selector: 'app-dashboard-pickup-by-state',
    templateUrl: './dashboard-by-state.component.html',
    styleUrls: ['./dashboard-by-state.component.scss'],
})
export class DashboardByStateComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    //config
    private byStatechartLables: string[] = [];
    private initalByStateBarChartConfig: IChartConfiguration;
    private byStateChartDatasetConfig =
        DashboardByStateChartDatasetConfiguration.BY_STATE_CHART_DATASET_CONFIG;

    // state
    private selectedStatesOrder: Map<number, number> = new Map();

    // list
    private byStateListBeforeSearch: ByStateListItem[] = [];

    // dropdowns
    private selectedCustomPeriodRange: CustomPeriodRange;
    private overallCompanyDuration: number;

    public byStateForm: UntypedFormGroup;
    public byStateTitle: string = DashboardStringEnum.PICKUP;

    public isDisplayingPlaceholder: boolean = false;
    public isLoading: boolean = true;

    // search
    public searchValue: string;
    public clearSearchValue: boolean = false;

    // list
    public byStateList: ByStateListItem[] = [];
    public selectedByStateList: ByStateListItem[] = [];
    public byStateMapList: MapListItem[] = [];

    public byStateListLength: number = 0;

    // show more
    public isShowingMore: boolean = false;

    // tabs
    public byStateTabs: DashboardTab[] = [];
    public currentActiveTab: DashboardTab;

    // dropdowns
    public byStateDropdownList: DropdownItem[] = [];

    public mainPeriodDropdownList: DropdownListItem[] = [];
    public subPeriodDropdownList: DropdownListItem[] = [];

    public selectedMainPeriod: DropdownListItem;
    public selectedSubPeriod: DropdownListItem;

    public isDisplayingCustomPeriodRange: boolean = false;

    public selectedDropdownWidthSubPeriod: DropdownListItem;

    // svg Routes
    public svgRoutes = DashboardByStateSvgRoutes;

    //chart
    public byStateBarChartConfig: IChartConfiguration =
        DashboardByStateChartsConfiguration.BY_STATE_CHART_CONFIG;
    public byStateBarChartTitle: string = DashboardConstants.STRING_EMPTY;
    public intervalTooltipLabel: string[] = [];

    get topCategory(): string {
        const lenght = this.byStateList.length;
        if (lenght <= 10) return DashboardConstants.BAR_CHART_LABEL_TOP_3;
        else if (lenght > 10 && lenght <= 30)
            return DashboardConstants.BAR_CHART_LABEL_TOP_5;
        else return DashboardConstants.BAR_CHART_LABEL_TOP_10;
    }

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardByStateService: DashboardByStateService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.getByStateListData();
    }

    private createForm(): void {
        this.byStateForm = this.formBuilder.group({
            mainPeriod: [null],
            subPeriod: [null],
        });
    }

    public resetSelectedValues(): void {
        this.selectedByStateList = [];

        this.clearSearchValue = true;
    }

    public highlightSearchValue(text: string, isSelected: boolean) {
        return DashboardHelper.highlightPartOfString(
            text,
            this.searchValue,
            isSelected
        );
    }

    public handleSearchValue(searchValue: string): void {
        if (searchValue) {
            this.searchValue = searchValue;

            this.byStateListBeforeSearch = [...this.byStateList];

            const filteredByStateList = this.byStateList.filter(
                (byStateListItem) =>
                    !byStateListItem.isSelected &&
                    byStateListItem.state
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
            );

            if (!filteredByStateList.length) {
                this.isDisplayingPlaceholder = true;

                return;
            }

            this.byStateList = this.byStateList.splice(
                0,
                this.selectedByStateList.length
            );

            this.byStateList = [...this.byStateList, ...filteredByStateList];
        } else {
            this.byStateList = this.byStateListBeforeSearch;

            this.searchValue = null;
            this.clearSearchValue = false;

            this.isDisplayingPlaceholder = false;
        }
    }

    public handleInputSelect(
        dropdownListItem: DropdownListItem,
        action: string
    ): void {
        if (action === DashboardStringEnum.MAIN_PERIOD_DROPDOWN) {
            if (
                dropdownListItem.name !== DashboardStringEnum.CUSTOM &&
                this.selectedMainPeriod.name === dropdownListItem.name
            )
                return;

            if (this.isDisplayingCustomPeriodRange)
                this.isDisplayingCustomPeriodRange = false;

            this.selectedMainPeriod = dropdownListItem;

            let matchingIdList: number[] = [];

            switch (dropdownListItem.name) {
                case DashboardStringEnum.TODAY:
                    matchingIdList = DashboardSubperiodConstants.TODAY_ID_LIST;

                    break;
                case DashboardStringEnum.WEEK_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.WTD_ID_LIST;

                    break;
                case DashboardStringEnum.MONTH_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.MTD_ID_LIST;

                    break;
                case DashboardStringEnum.QUARTAL_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.QTD_ID_LIST;

                    break;
                case DashboardStringEnum.YEAR_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.YTD_ID_LIST;

                    break;
                case DashboardStringEnum.ALL_TIME:
                    this.setCustomSubPeriodList(this.overallCompanyDuration);

                    this.getByStateListData();

                    break;
                case DashboardStringEnum.CUSTOM:
                    this.selectedDropdownWidthSubPeriod =
                        this.selectedSubPeriod;

                    this.subPeriodDropdownList = [];
                    this.selectedSubPeriod = null;

                    this.isDisplayingCustomPeriodRange = true;

                    break;
                default:
                    break;
            }

            if (
                dropdownListItem.name !== DashboardStringEnum.ALL_TIME &&
                dropdownListItem.name !== DashboardStringEnum.CUSTOM
            ) {
                const { filteredSubPeriodDropdownList, selectedSubPeriod } =
                    DashboardHelper.setSubPeriodList(matchingIdList);

                this.subPeriodDropdownList = filteredSubPeriodDropdownList;
                this.selectedSubPeriod = selectedSubPeriod;

                this.getByStateListData();
            }
        }

        if (action === DashboardStringEnum.SUB_PERIOD_DROPDOWN) {
            if (this.selectedSubPeriod.name === dropdownListItem.name) return;

            this.selectedSubPeriod = dropdownListItem;

            if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM) {
                this.getByStateListData(this.selectedCustomPeriodRange);
            } else {
                this.getByStateListData();
            }
        }
    }

    public handleSwitchByStateClick(byStateDropdownItem: DropdownItem): void {
        if (byStateDropdownItem.name === this.byStateTitle) return;

        const byStateTabsToDisplay = [
            {
                name: byStateDropdownItem.tab1,
                checked: true,
            },
            {
                name: byStateDropdownItem.tab2,
                checked: false,
            },
        ];

        this.byStateTabs = byStateTabsToDisplay;
        this.currentActiveTab = byStateTabsToDisplay[0];

        this.byStateTitle = byStateDropdownItem.name;

        this.byStateDropdownList.find(
            (byStateDropdownItem) => byStateDropdownItem.isActive
        ).isActive = false;

        byStateDropdownItem.isActive = true;

        if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM) {
            this.selectedMainPeriod =
                DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];

            this.setCustomSubPeriodList(this.overallCompanyDuration);
        }

        this.getByStateListData();
    }

    public handleSwitchTabClick(activeTab: DashboardTab): void {
        if (this.currentActiveTab.name === activeTab.name) return;

        this.currentActiveTab = activeTab;

        if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM) {
            this.getByStateListData(this.selectedCustomPeriodRange);
        } else {
            this.getByStateListData();
        }
    }

    public handleShowMoreClick(): void {
        this.isShowingMore = !this.isShowingMore;

        if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM) {
            this.getByStateListData(this.selectedCustomPeriodRange);
        } else {
            this.getByStateListData();
        }
    }

    public handleCustomPeriodRangeSubperiodEmit(
        selectedDaysRange: number
    ): void {
        this.setCustomSubPeriodList(selectedDaysRange);
    }

    public handleSetCustomPeriodRangeClick(
        customPeriodRange: CustomPeriodRange
    ): void {
        if (!customPeriodRange) {
            this.isDisplayingCustomPeriodRange = false;

            this.selectedMainPeriod =
                DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];

            this.setCustomSubPeriodList(this.overallCompanyDuration);

            this.selectedSubPeriod = this.selectedDropdownWidthSubPeriod;
        } else {
            this.isDisplayingCustomPeriodRange = false;
            this.selectedCustomPeriodRange = customPeriodRange;

            this.getByStateListData(customPeriodRange);

            this.selectedDropdownWidthSubPeriod = this.selectedSubPeriod;
        }
    }

    public toggleItemSelection(
        byStateListItem: ByStateListItem,
        byStateListItemIndex: number
    ): void {
        const maxByStateItemsSelected = 5;

        if (byStateListItem.isSelected) {
            this.byStateList.splice(byStateListItemIndex, 1);
            this.byStateList.splice(byStateListItem.id - 1, 0, byStateListItem);

            byStateListItem.isSelected = false;

            this.byStateList = DashboardArrayHelper.sortPartOfArray(
                this.byStateList
            );

            this.selectedByStateList = this.selectedByStateList.filter(
                (byStateItem) => byStateItem.id !== byStateListItem.id
            );

            this.selectedStatesOrder.delete(byStateListItem.id);

            if (!this.selectedByStateList.length)
                this.byStateBarChartConfig = {
                    ...this.initalByStateBarChartConfig,
                };
            else this.displaySelectedStatesInChart(this.selectedByStateList);
            return;
        }

        if (this.selectedByStateList.length === maxByStateItemsSelected) return;

        byStateListItem.isSelected = true;

        const order = this.selectedByStateList.length;
        this.selectedStatesOrder.set(byStateListItem.id, order);

        this.selectedByStateList = [
            ...this.selectedByStateList,
            byStateListItem,
        ];

        this.displaySelectedStatesInChart(this.selectedByStateList);

        this.byStateList.splice(byStateListItemIndex, 1);
        this.byStateList.splice(
            this.selectedByStateList.length - 1,
            0,
            byStateListItem
        );
    }

    private displaySelectedStatesInChart(
        selectedByStateList: ByStateListItem[]
    ): void {
        const propertyKey =
            DashboardByStateConstants.BY_STATE_REPORT_TYPE_MAP[
                this.currentActiveTab.name as ByStateReportType
            ];

        const extractedBarChartDatasets: IBaseDataset[] = [];

        selectedByStateList.forEach((selectedStateItem) => {
            const dataSetData: number[] = [];
            selectedStateItem?.intervals.forEach((interval) => {
                const value =
                    interval[propertyKey as keyof ByStateIntervalResponse];

                if (typeof value === 'number')
                    dataSetData.push(value);
            });
            const order =
                this.selectedStatesOrder.get(selectedStateItem.id) ?? 0;
            const dataset = {
                ...this.byStateChartDatasetConfig,
                label: selectedStateItem.state,
                data: dataSetData,
                order,
                backgroundColor: selectedStateItem.selectedColor,
                hoverBackgroundColor: selectedStateItem.selectedColor,
                borderColor: selectedStateItem.selectedColor,
                hoverBorderColor: selectedStateItem.selectedColor,
                fill: true,
            };
            extractedBarChartDatasets.push(dataset);
        });

        this.byStateBarChartConfig = {
            ...this.byStateBarChartConfig,
            chartData: {
                labels: this.byStatechartLables,
                datasets: extractedBarChartDatasets,
            },
        };
    }

    private getConstantData(): void {
        this.byStateDropdownList = JSON.parse(
            JSON.stringify(DashboardByStateConstants.BY_STATE_DROPDOWN_DATA)
        );

        this.byStateTabs = DashboardByStateConstants.BY_STATE_TABS;
        this.currentActiveTab = DashboardByStateConstants.BY_STATE_TABS[0];

        this.mainPeriodDropdownList =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA;

        this.selectedMainPeriod =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];
    }

    private getOverallCompanyDuration(): void {
        this.dashboardService.getOverallCompanyDuration$
            .pipe(takeUntil(this.destroy$))
            .subscribe((companyDuration: number) => {
                this.overallCompanyDuration = companyDuration;

                this.setCustomSubPeriodList(this.overallCompanyDuration);
            });
    }

    private getByStateListData(customPeriodRange?: CustomPeriodRange): void {
        const loadStopType = (
            this.byStateTitle === DashboardStringEnum.PICKUP
                ? DashboardStringEnum.PICKUP
                : DashboardStringEnum.DELIVERY
        ) as LoadStopType;

        const selectedTab = (
            this.currentActiveTab.name === DashboardStringEnum.SW
                ? DashboardStringEnum.SEVERITY_WEIGHT
                : this.currentActiveTab.name
        ) as ByStateReportType;

        const selectedMainPeriod = DashboardHelper.ConvertMainPeriod(
            this.selectedMainPeriod.name
        ) as TimeInterval;

        const selectedSubPeriod = DashboardHelper.ConvertSubPeriod(
            this.selectedSubPeriod.name
        ) as SubintervalType;

        let byStateArgumentsData:
            | ByStateApiArguments
            | ByStateWithLoadStopApiArguments;

        if (
            this.byStateTitle === DashboardStringEnum.PICKUP ||
            this.byStateTitle === DashboardStringEnum.DELIVERY
        ) {
            byStateArgumentsData = [
                loadStopType,
                selectedTab,
                null,
                null,
                null,
                this.isShowingMore,
                selectedMainPeriod,
                customPeriodRange?.fromDate ?? null,
                customPeriodRange?.toDate ?? null,
                selectedSubPeriod,
            ] as ByStateWithLoadStopApiArguments;
        } else {
            byStateArgumentsData = [
                selectedTab,
                null,
                null,
                null,
                this.isShowingMore,
                selectedMainPeriod,
                customPeriodRange?.fromDate ?? null,
                customPeriodRange?.toDate ?? null,
                selectedSubPeriod,
            ] as ByStateApiArguments;
        }

        this.isLoading = true;

        this.resetSelectedValues();

        const config = DashboardHelper.selectByStateConfiguration(
            this.dashboardByStateService,
            selectedTab,
            this.byStateTitle
        );

        if (config) {
            this.getDataByState(
                selectedTab,
                byStateArgumentsData,
                config.serviceMethod,
                config.dataTransform
            );
        }
    }

    private getDataByState(
        selectedTab: ByStateReportType,
        byStateArgumentsData:
            | ByStateApiArguments
            | ByStateWithLoadStopApiArguments,
        serviceMethod: (
            args: ByStateApiArguments | ByStateWithLoadStopApiArguments
        ) => Observable<ByStateResponse>,
        dataTransform: (
            response: ByStateResponse,
            index: number,
            selectedTab: ByStateReportType,
            intervals?: Array<ByStateIntervalResponse> | null
        ) => ByStateListItem
    ): void {
        this.isLoading = true;

        serviceMethod(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((responseData) => {
                this.byStateList = responseData.pagination.data.map(
                    (response, index) =>
                        dataTransform(
                            response,
                            index,
                            selectedTab,
                            response.intervals
                        )
                );

                this.byStateListBeforeSearch = [...this.byStateList];
                this.byStateListLength = responseData.pagination.count;

                DashboardHelper.setByStateListColorRange(this.byStateList);
                this.setMapByState(this.byStateList);

                this.byStateBarChartTitle = DashboardHelper.setChartDateTitle(
                    responseData.intervalLabels[0].tooltipLabel,
                    responseData.intervalLabels[responseData.topTen.length - 1]
                        .tooltipLabel
                );
                this.setToolTipLables(responseData.intervalLabels);

                this.byStatechartLables = responseData.intervalLabels.map(
                    (item) => item.label || DashboardConstants.STRING_EMPTY
                );

                const byStateBarChartData = this.setByStateBarChartData(
                    responseData.topTen,
                    responseData.others,
                    selectedTab
                );

                this.byStateBarChartConfig = {
                    ...this.byStateBarChartConfig,
                    chartData: {
                        labels: this.byStatechartLables,
                        datasets: byStateBarChartData,
                    },
                };

                this.initalByStateBarChartConfig = {
                    ...this.byStateBarChartConfig,
                };
            });
    }

    private setByStateBarChartData(
        topPicks: ByStateIntervalResponse[],
        otherPicks: ByStateIntervalResponse[],
        selectedTab: ByStateReportType
    ): IBaseDataset[] {
        const topPicksDataset = {
            ...this.byStateChartDatasetConfig,
            label: this.topCategory,
            data: topPicks.map((item) =>
                this.getValueBySelectedTab(item, selectedTab)
            ),
            order: 1,
            backgroundColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[0].color,
            hoverBackgroundColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[0].color,
            hoverBorderColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[0].color,
            borderColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[0].color,
        };

        const othersDataset = {
            ...this.byStateChartDatasetConfig,
            label: DashboardConstants.BAR_CHART_LABEL_ALL_OTHERS,
            data: otherPicks.map((item) =>
                this.getValueBySelectedTab(item, selectedTab)
            ),
            order: 2,
            backgroundColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[1].color,
            hoverBackgroundColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[1].color,
            hoverBorderColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[1].color,
            borderColor:
                DashboardColors.BAR_PERFORMANCE_COLORS_PALLETE[1].color,
        };

        return [topPicksDataset, othersDataset];
    }

    private getValueBySelectedTab(
        intervalResponse: ByStateIntervalResponse,
        selectedTab: ByStateReportType
    ): number {
        const propertyKey =
            DashboardByStateConstants.BY_STATE_REPORT_TYPE_MAP[selectedTab];
        if (propertyKey in intervalResponse) {
            return intervalResponse[propertyKey] ?? 0;
        }
        return 0;
    }

    private setToolTipLables(intervalLabels: IntervalLabelResponse[]): void {
        this.intervalTooltipLabel = intervalLabels.map(
            (intervalLabel) => intervalLabel.tooltipLabel
        );
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardHelper.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;

        this.selectedDropdownWidthSubPeriod = selectedSubPeriod;
    }

    private setMapByState(byStateList: ByStateListItem[]): void {
        const filteredByStateList = byStateList.map((byStateListItem) => {
            return {
                state: byStateListItem.state,
                selectedColor: byStateListItem.selectedColor,
                value: byStateListItem.value,
                percent: byStateListItem.percent,
            };
        });

        this.byStateMapList = filteredByStateList;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
