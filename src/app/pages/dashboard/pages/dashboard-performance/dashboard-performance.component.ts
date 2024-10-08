import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { DashboardPerformanceService } from '@pages/dashboard/pages/dashboard-performance/services/dashboard-performance.service';
import { DashboardService } from '@pages/dashboard/services/dashboard.service';

// constants
import { DashboardPerformanceConstants } from '@pages/dashboard/pages/dashboard-performance/utils/constants/dashboard-performance.constants';
import { DashboardSubperiodConstants } from '@pages/dashboard/utils/constants/dashboard-subperiod.constants';
import { DashboardColors } from '@pages/dashboard/utils/constants/dashboard-colors.constants';
import { DashboardTopRatedConstants } from '@pages/dashboard/pages/dashboard-top-rated/utils/constants/dashboard-top-rated.constants';

// helpers
import { DashboardHelper } from '@pages/dashboard/utils/helpers/dashboard.helper';

// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';
import { DashboardChartStringEnum } from '@pages/dashboard/enums/dashboard-chart-string.enum';

// models
import { DashboardTab } from '@pages/dashboard/models/dashboard-tab.model';
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { PerformanceDataItem } from '@pages/dashboard/pages/dashboard-performance/models/performance-data-item.model';
import { PerformanceColorsPallete } from '@pages/dashboard/models/colors-pallete.model';
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import {
    ChartDefaultConfig,
    //LineChart,
    LineChartAxes,
    LineChartConfig,
} from '@pages/dashboard/models/dashboard-chart-models/line-chart.model';
import {
    //BarChart,
    BarChartAxes,
    BarChartConfig,
    BarChartPerformanceValues,
} from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';
import { PerformanceApiArguments } from '@pages/dashboard/pages/dashboard-performance/models/performance-api-arguments.model';
import { DashboardArrayHelper } from '@pages/dashboard/utils/helpers/dashboard-array-helper';
import {
    IntervalLabelResponse,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';

@Component({
    selector: 'app-dashboard-performance',
    templateUrl: './dashboard-performance.component.html',
    styleUrls: ['./dashboard-performance.component.scss'],
})
export class DashboardPerformanceComponent implements OnInit, OnDestroy {
    // @ViewChild('lineChart') public lineChart: LineChart;
    // @ViewChild('barChart') public barChart: BarChart;

    private destroy$: Subject<void> = new Subject<void>();

    public isLoading: boolean = false;

    public performanceForm: UntypedFormGroup;
    public performanceData: PerformanceDataItem[] = [];

    private selectedPerformanceDataCount: number = 0;
    private maxPerformanceDataItemsSelected = 10;

    // tabs
    public performanceTabs: DashboardTab[] = [];
    public currentActiveTab: DashboardTab;

    private selectedCustomPeriodRange: CustomPeriodRange;
    public clearCustomPeriodRangeValue: boolean = false;

    // dropdown
    public subPeriodDropdownList: DropdownListItem[] = [];
    public selectedSubPeriod: DropdownListItem;
    public selectedDropdownWidthSubPeriod: DropdownListItem;
    public selectedSubPeriodLabel: string;

    private overallCompanyDuration: number;

    // colors
    public performanceDataColors: PerformanceColorsPallete[] = [];

    // charts
    public lineChartConfig: LineChartConfig;
    public lineChartAxes: LineChartAxes;
    public lineChartDateTitle: string;

    public barChartConfig: BarChartConfig;
    public barChartAxes: BarChartAxes;
    private barChartLabels: string[] | string[][] = [];
    private barChartTooltipLabels: string[];
    private barChartValues: BarChartPerformanceValues = {
        pricePerGallonValues: [],
        loadRatePerMileValues: [],
    };

    private axisNumber: number = -1;
    public multipleVerticalLeftAxes: number[];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardService: DashboardService,
        private dashboardPerformanceService: DashboardPerformanceService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.getPerformanceListData();
    }

    private createForm(): void {
        this.performanceForm = this.formBuilder.group({
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: PerformanceDataItem): string =>
        item.title;

    public resetSelectedValues(): void {
        this.performanceData = this.performanceData.map(
            (performanceDataItem) => {
                return {
                    ...performanceDataItem,
                    selectedColor: null,
                    selectedHoverColor: null,
                };
            }
        );

        this.performanceDataColors = this.performanceDataColors.map((color) => {
            return {
                ...color,
                isSelected: false,
            };
        });

        this.selectedPerformanceDataCount = 0;

        this.barChartValues = {
            pricePerGallonValues: [],
            loadRatePerMileValues: [],
        };
    }

    public handleSwitchTabClick(activeTab: DashboardTab): void {
        if (this.clearCustomPeriodRangeValue)
            this.clearCustomPeriodRangeValue = false;

        if (this.currentActiveTab?.name === activeTab.name) return;

        this.currentActiveTab = activeTab;
        this.selectedSubPeriodLabel = this.selectedSubPeriod.name;

        let matchingIdList: number[] = [];

        switch (activeTab.name) {
            case DashboardStringEnum.TODAY:
                matchingIdList = DashboardSubperiodConstants.TODAY_ID_LIST;

                break;
            case DashboardStringEnum.WTD:
                matchingIdList = DashboardSubperiodConstants.WTD_ID_LIST;

                break;
            case DashboardStringEnum.MTD:
                matchingIdList = DashboardSubperiodConstants.MTD_ID_LIST;

                break;
            case DashboardStringEnum.QTD:
                matchingIdList = DashboardSubperiodConstants.QTD_ID_LIST;

                break;
            case DashboardStringEnum.YTD:
                matchingIdList = DashboardSubperiodConstants.YTD_ID_LIST;

                break;
            case DashboardStringEnum.ALL:
                this.setCustomSubPeriodList(this.overallCompanyDuration);

                this.getPerformanceListData();

                break;
            case DashboardStringEnum.CUSTOM:
                this.selectedDropdownWidthSubPeriod = this.selectedSubPeriod;
                this.selectedSubPeriod = null;

                break;
            default:
                break;
        }

        if (
            activeTab.name !== DashboardStringEnum.ALL &&
            activeTab.name !== DashboardStringEnum.CUSTOM
        ) {
            const { filteredSubPeriodDropdownList, selectedSubPeriod } =
                DashboardHelper.setSubPeriodList(matchingIdList);

            this.subPeriodDropdownList = filteredSubPeriodDropdownList;
            this.selectedSubPeriod = selectedSubPeriod;

            this.getPerformanceListData();
        }
    }

    public handleInputSelect(dropdownListItem: DropdownListItem): void {
        if (this.selectedSubPeriod.name === dropdownListItem.name) return;

        this.selectedSubPeriod = dropdownListItem;

        if (this.currentActiveTab.name === DashboardStringEnum.CUSTOM) {
            this.getPerformanceListData(this.selectedCustomPeriodRange);
        } else {
            this.getPerformanceListData();
        }
    }

    public handleSetCustomPeriodRangeClick(
        customPeriodRange: CustomPeriodRange
    ): void {
        this.clearCustomPeriodRangeValue = true;

        if (!customPeriodRange) {
            this.setCustomSubPeriodList(this.overallCompanyDuration);

            this.selectedSubPeriod = this.selectedDropdownWidthSubPeriod;
        } else {
            this.selectedSubPeriod =
                DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.find(
                    (subPeriod) =>
                        subPeriod.name === customPeriodRange.subPeriod
                );

            this.selectedDropdownWidthSubPeriod = this.selectedSubPeriod;
            this.selectedCustomPeriodRange = customPeriodRange;

            this.getPerformanceListData(customPeriodRange);
        }
    }

    public handleCustomPeriodRangeSubperiodEmit(
        selectedDaysRange: number
    ): void {
        this.setCustomSubPeriodList(selectedDaysRange);
    }

    public handlePerformanceDataClick(
        index: number,
        selectedColor: string
    ): void {
        const performanceDataItem = this.performanceData[index];

        if (
            this.selectedPerformanceDataCount ===
                this.maxPerformanceDataItemsSelected &&
            !performanceDataItem.isSelected
        ) {
            return;
        }

        performanceDataItem.isSelected = !performanceDataItem.isSelected;

        if (performanceDataItem.isSelected) {
            // data boxes
            const firstAvailableColor = this.performanceDataColors.find(
                (color) => !color.isSelected
            );

            firstAvailableColor.isSelected = true;

            performanceDataItem.selectedColor = firstAvailableColor.code;
            performanceDataItem.selectedHoverColor =
                firstAvailableColor.hoverCode;

            this.selectedPerformanceDataCount++;

            // line chart
            // this.lineChart?.insertNewChartData(
            //     DashboardChartStringEnum.ADD,
            //     performanceDataItem.title,
            //     performanceDataItem.selectedColor.slice(1)
            // );
        } else {
            // data boxes
            performanceDataItem.selectedColor = null;
            performanceDataItem.selectedHoverColor = null;

            this.performanceDataColors.find(
                (color) => color.code === selectedColor
            ).isSelected = false;

            this.selectedPerformanceDataCount--;

            // line chart
            // this.lineChart?.insertNewChartData(
            //     DashboardChartStringEnum.REMOVE,
            //     performanceDataItem.title
            // );
        }
    }

    public handleCustomPeriodRangeClose(): void {
        this.clearCustomPeriodRangeValue = true;
    }

    public handlePerformanceDataHover(
        index: number,
        removeHover: boolean = false
    ): void {
        if (this.isLoading) return;

        const selectedPerformanceDataItem = this.performanceData[index];

        if (!removeHover) {
            selectedPerformanceDataItem.isHovered = true;

            if (selectedPerformanceDataItem.selectedColor) {
                // this.lineChart?.changeChartFillProperty(
                //     selectedPerformanceDataItem.title,
                //     selectedPerformanceDataItem.selectedColor.slice(1)
                // );
            }
        } else {
            selectedPerformanceDataItem.isHovered = false;

            // this.lineChart?.changeChartFillProperty(
            //     this.performanceData[index].title,
            //     DashboardChartStringEnum.EMPTY_STRING
            // );
        }
    }

    public handleBarChartHover(chartDataValue: number): void {
        // this.lineChart?.showChartTooltip(chartDataValue);
    }

    public handleRemoveChartsHover(): void {
        //waiting for charts this.lineChart?.chartHoverOut();
    }

    private getConstantData(): void {
        this.performanceData = JSON.parse(
            JSON.stringify(DashboardPerformanceConstants.PERFROMANCE_DATA)
        );

        this.performanceTabs = DashboardPerformanceConstants.PERFORMANCE_TABS;
        this.currentActiveTab =
            DashboardPerformanceConstants.PERFORMANCE_TABS[5];

        this.selectedSubPeriodLabel = DashboardStringEnum.DAILY;

        this.performanceDataColors = JSON.parse(
            JSON.stringify(DashboardColors.PERFORMANCE_COLORS_PALLETE)
        );
    }

    private getPerformanceListData(
        customPeriodRange?: CustomPeriodRange
    ): void {
        const selectedMainPeriod = DashboardHelper.ConvertMainPeriod(
            this.currentActiveTab.name === DashboardStringEnum.ALL
                ? DashboardStringEnum.ALL_TIME
                : this.currentActiveTab.name
        ) as TimeInterval;

        const selectedSubPeriod = DashboardHelper.ConvertSubPeriod(
            this.selectedSubPeriod.name
        ) as SubintervalType;

        const performanceArgumentsData: PerformanceApiArguments = [
            selectedMainPeriod,
            customPeriodRange?.fromDate ?? null,
            customPeriodRange?.toDate ?? null,
            selectedSubPeriod,
        ];

        this.isLoading = true;
        this.axisNumber = -1;

        this.resetSelectedValues();

        this.dashboardPerformanceService
            .getPerformance(performanceArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((performanceData) => {
                // performance data
                this.performanceData = this.performanceData.map(
                    (performanceDataItem) => {
                        const titleToLowerCase =
                            performanceDataItem.title.toLowerCase();

                        const matchedPerformanceDataItem =
                            performanceData.performanceTable.performanceTableMetrics.find(
                                (item) =>
                                    item.performanceType.toLowerCase() ===
                                    titleToLowerCase
                            );

                        if (matchedPerformanceDataItem) {
                            return {
                                ...performanceDataItem,
                                isHovered: false,
                                isSelected: false,
                                selectedColor: null,
                                selectedHoverColor: null,
                                lastIntervalValue:
                                    matchedPerformanceDataItem.lastIntervalValue,
                                lastIntervalTrend:
                                    matchedPerformanceDataItem.lastIntervalTrend,
                                intervalAverageValue:
                                    matchedPerformanceDataItem.intervalAverageValue,
                            };
                        }

                        return performanceDataItem;
                    }
                );

                // charts
                for (
                    let i = 0;
                    i <
                    performanceData.performanceGraph.performanceGraphs.length;
                    i++
                ) {
                    const selectedGraphMetricsData =
                        performanceData.performanceGraph.performanceGraphs[i]
                            .performanceGraphMetrics;

                    for (let j = 0; j < selectedGraphMetricsData.length; j++) {
                        const selectedPerformanceType =
                            selectedGraphMetricsData[j];
                        const performanceTypeTitleToLowerCase =
                            selectedPerformanceType.performanceType?.toLowerCase();

                        const matchedPerformanceDataItem =
                            this.performanceData.find(
                                (item) =>
                                    item.title.toLowerCase() ===
                                    performanceTypeTitleToLowerCase
                            );

                        if (matchedPerformanceDataItem) {
                            matchedPerformanceDataItem.lineChartDataValues = [
                                ...matchedPerformanceDataItem.lineChartDataValues,
                                selectedPerformanceType.value,
                            ];
                        } else {
                            if (
                                selectedPerformanceType.performanceType ===
                                DashboardChartStringEnum.BAR_LABEL_PER_GALLON
                            ) {
                                this.barChartValues.pricePerGallonValues = [
                                    ...this.barChartValues.pricePerGallonValues,
                                    Math.floor(Math.random() * 50),
                                    /*   selectedPerformanceType.value, */
                                ];
                            }

                            if (
                                selectedPerformanceType.performanceType ===
                                DashboardChartStringEnum.BAR_LABEL_LOAD_PER_MILE
                            ) {
                                this.barChartValues.loadRatePerMileValues = [
                                    ...this.barChartValues
                                        .loadRatePerMileValues,
                                    Math.floor(Math.random() * 50),
                                    /*  selectedPerformanceType.value, */
                                ];
                            }
                        }
                    }
                }

                this.setLineChartDateTitle(
                    performanceData.intervalLabels[0].tooltipLabel,
                    performanceData.intervalLabels[
                        performanceData.intervalLabels.length - 1
                    ].tooltipLabel
                );
                this.setBarChartLabels(performanceData.intervalLabels);

                this.setChartsData();
            });
    }

    private getOverallCompanyDuration(): void {
        this.dashboardService.getOverallCompanyDuration$
            .pipe(takeUntil(this.destroy$))
            .subscribe((companyDuration: number) => {
                this.overallCompanyDuration = companyDuration;

                this.setCustomSubPeriodList(this.overallCompanyDuration);
            });
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardHelper.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;

        this.selectedDropdownWidthSubPeriod = selectedSubPeriod;
    }

    private setPerformanceDefaultStateData(): void {
        const performanceDataItemIndex = 0;

        const selectedPerformanceDataItem =
            this.performanceData[performanceDataItemIndex];
        const selectedPerformanceDataColor =
            this.performanceDataColors[performanceDataItemIndex];

        this.performanceData = this.performanceData.map(
            (performanceDataItem, index) => {
                if (index !== performanceDataItemIndex) {
                    return {
                        ...performanceDataItem,
                        isSelected: false,
                    };
                }

                return performanceDataItem;
            }
        );

        this.performanceDataColors = this.performanceDataColors.map(
            (color, index) => {
                if (index !== performanceDataItemIndex) {
                    return {
                        ...color,
                        isSelected: false,
                    };
                }

                return color;
            }
        );

        selectedPerformanceDataColor.isSelected = true;

        selectedPerformanceDataItem.isSelected = true;
        selectedPerformanceDataItem.selectedColor =
            selectedPerformanceDataColor.code;
        selectedPerformanceDataItem.selectedHoverColor =
            selectedPerformanceDataColor.hoverCode;

        selectedPerformanceDataColor.isSelected = true;

        this.selectedPerformanceDataCount++;

        // this.lineChart?.resetLineChartData();

        // setTimeout(() => {
        //     this.lineChart?.insertNewChartData(
        //         DashboardChartStringEnum.ADD,
        //         selectedPerformanceDataItem.title,
        //         this.performanceData[
        //             performanceDataItemIndex
        //         ].selectedColor?.slice(1)
        //     );
        // }, 50);
    }

    private setLineChartDateTitle(startInterval: string, endInterval: string) {
        const { chartTitle } = DashboardHelper.setChartDateTitle(
            startInterval,
            endInterval
        );

        this.lineChartDateTitle = chartTitle;
    }

    private setLineChartConfigAndAxes(): void {
        this.lineChartConfig = {
            dataProperties: [],
            showLegend: false,
            chartValues: [2, 2],
            defaultType: DashboardChartStringEnum.LINE,
            chartWidth: DashboardChartStringEnum.LINE_1800_WIDTH,
            chartHeight: DashboardChartStringEnum.LINE_1800_HEIGHT,
            removeChartMargin: true,
            gridHoverBackground: true,
            allowAnimation: true,
            hasHoverData: true,
            offset: true,
            multiHoverData: true,
            multiChartHover: true,
            tooltipOffset: { min: 134, max: 206 },
            dataLabels: [],
            dataTooltipLabels: this.barChartTooltipLabels,
            pricePerGallonValue: this.barChartValues.pricePerGallonValues,
            loadRatePerMileValue: this.barChartValues.loadRatePerMileValues,
            noChartImage: DashboardChartStringEnum.NO_CHART_IMG,
        };

        this.lineChartConfig.dataProperties = this.performanceData.map(
            (performanceDataItem) => {
                return this.createLineChartData(performanceDataItem);
            }
        );

        this.lineChartConfig.dataLabels = this.createLineChartEmptyLabels(
            this.barChartLabels
        ) as string[][];

        const performanceDataLineChartValues = this.performanceData.map(
            (performanceDataItem) => {
                const lineChartMaxValue =
                    DashboardArrayHelper.findLargestNumberInArrayOfArrays([
                        performanceDataItem.lineChartDataValues,
                    ]);

                return lineChartMaxValue;
            }
        );

        this.lineChartAxes = {
            verticalLeftAxes: {
                visible: false,
                minValue: 0,
                maxValue: 10,
                stepSize: 10,
                showGridLines: false,
            },
            horizontalAxes: {
                visible: true,
                position: DashboardChartStringEnum.BAR_AXES_POSITION_BOTTOM,
                showGridLines: false,
            },
        };

        this.multipleVerticalLeftAxes = performanceDataLineChartValues;
    }

    private setBarChartLabels(barChartLables: IntervalLabelResponse[]): void {
        const selectedSubPeriod = DashboardHelper.ConvertSubPeriod(
            this.selectedSubPeriod.name
        );

        const { filteredLabels, filteredTooltipLabels } =
            DashboardHelper.setBarChartLabels(
                barChartLables,
                selectedSubPeriod
            );

        this.barChartLabels = filteredLabels;
        this.barChartTooltipLabels = filteredTooltipLabels;
    }

    private setBarChartConfigAndAxes(
        barChartValues: BarChartPerformanceValues
    ): void {
        // this.barChartConfig = {
        //     dataProperties: [
        //         {
        //             defaultConfig: {
        //                 type: DashboardChartStringEnum.BAR,
        //                 data: barChartValues.pricePerGallonValues,
        //                 backgroundColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY,
        //                 borderColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY_4,
        //                 hoverBackgroundColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY_5,
        //                 hoverBorderColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY,
        //                 label: DashboardChartStringEnum.BAR_LABEL_PER_GALLON,
        //             },
        //         },
        //         {
        //             defaultConfig: {
        //                 type: DashboardChartStringEnum.BAR,
        //                 data: barChartValues.loadRatePerMileValues,
        //                 backgroundColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY_2,
        //                 borderColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY_3,
        //                 hoverBackgroundColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY,
        //                 hoverBorderColor:
        //                     DashboardChartStringEnum.CHART_COLOR_GREY_2,
        //                 label: DashboardChartStringEnum.BAR_LABEL_LOAD_PER_MILE,
        //             },
        //         },
        //     ],
        //     showLegend: false,
        //     chartValues: [2, 2],
        //     defaultType: DashboardChartStringEnum.BAR,
        //     offset: true,
        //     chartWidth: DashboardChartStringEnum.BAR_1800_WIDTH_2,
        //     chartHeight: DashboardChartStringEnum.BAR_1800_HEIGHT_2,
        //     removeChartMargin: true,
        //     gridHoverBackground: true,
        //     hasHoverData: true,
        //     allowAnimation: true,
        //     hoverOtherChart: true,
        //     tooltipOffset: { min: 134, max: 206 },
        //     dataLabels: this.barChartLabels,
        //     noChartImage: DashboardChartStringEnum.NO_CHART_IMG,
        // };

        // // bar max value
        // const barChartMaxValue =
        //     DashboardArrayHelper.findLargestNumberInArrayOfArrays([
        //         barChartValues.pricePerGallonValues,
        //         barChartValues.loadRatePerMileValues,
        //     ]);

        // // bar axes
        // this.barChartAxes = {
        //     verticalLeftAxes: {
        //         visible: false,
        //         minValue: 0,
        //         maxValue: barChartMaxValue,
        //         stepSize: 10,
        //         showGridLines: false,
        //     },
        //     horizontalAxes: {
        //         visible: true,
        //         position: DashboardChartStringEnum.BAR_AXES_POSITION_BOTTOM,
        //         showGridLines: false,
        //     },
        // };
    }

    private setChartsData(): void {
        this.setLineChartConfigAndAxes();
        this.setBarChartConfigAndAxes(this.barChartValues);

        this.setPerformanceDefaultStateData();

        this.changeDetectorRef.detectChanges();
    }

    private createLineChartData(performanceDataItem: PerformanceDataItem): {
        defaultConfig: ChartDefaultConfig;
    } {
        const selectedLineChartDataValues =
            performanceDataItem.lineChartDataValues;
        const selectedLineChartDataTitle = performanceDataItem.title;
        this.axisNumber++;
        return {
            defaultConfig: {
                type: DashboardChartStringEnum.LINE,
                data: selectedLineChartDataValues,
                borderColor: null,
                pointBorderColor: DashboardChartStringEnum.CHART_COLOR_NONE,
                pointBackgroundColor: DashboardChartStringEnum.CHART_COLOR_NONE,
                pointHoverBackgroundColor:
                    DashboardChartStringEnum.CHART_COLOR_WHITE,
                pointHoverBorderColor: null,
                pointHoverRadius: 3,
                pointBorderWidth: 3,
                fill: false,
                hasGradiendBackground: true,
                colors: null,
                id: selectedLineChartDataTitle,
                hidden: true,
                label: selectedLineChartDataTitle,
                yAxisID: `y-axis-${this.axisNumber}`,
            },
        };
    }

    private createLineChartEmptyLabels(
        barChartLabels: string[] | string[][]
    ): (string | string[])[] {
        return DashboardHelper.createBarChartEmptyLabels(barChartLabels);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
