import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// moment
import moment from 'moment';

// services
import { DashboardPerformanceService } from '../../state/services/dashboard-performance.service';

// store
import { DashboardQuery } from '../../state/store/dashboard.query';

// constants
import { DashboardPerformanceConstants } from '../../state/utils/constants/dashboard-performance.constants';
import { DashboardSubperiodConstants } from '../../state/utils/constants/dashboard-subperiod.constants';
import { DashboardColors } from '../../state/utils/constants/dashboard-colors.constants';

// helpers
import { DashboardUtils } from '../../state/utils/dashboard-utils';

// enums
import { ConstantStringEnum } from '../../state/enums/constant-string.enum';
import { ConstantChartStringEnum } from '../../state/enums/constant-chart-string.enum';

// models
import { DashboardTab } from '../../state/models/dashboard-tab.model';
import { DropdownListItem } from '../../state/models/dropdown-list-item.model';
import { PerformanceDataItem } from '../../state/models/dashboard-performance-models/performance-data-item.model';
import { PerformanceColorsPallete } from '../../state/models/dashboard-color-models/colors-pallete.model';
import { CustomPeriodRange } from '../../state/models/custom-period-range.model';
import {
    ChartDefaultConfig,
    LineChart,
    LineChartAxes,
    LineChartConfig,
} from '../../state/models/dashboard-chart-models/line-chart.model';
import {
    BarChart,
    BarChartAxes,
    BarChartConfig,
    BarChartValues,
} from '../../state/models/dashboard-chart-models/bar-chart.model';
import { PerformanceApiArguments } from '../../state/models/dashboard-performance-models/performance-api-arguments.model';
import { SubintervalType, TimeInterval } from 'appcoretruckassist';

@Component({
    selector: 'app-dashboard-performance',
    templateUrl: './dashboard-performance.component.html',
    styleUrls: ['./dashboard-performance.component.scss'],
})
export class DashboardPerformanceComponent implements OnInit, OnDestroy {
    @ViewChild('lineChart') public lineChart: LineChart;
    @ViewChild('barChart') public barChart: BarChart;

    private destroy$: Subject<void> = new Subject<void>();

    public performanceForm: UntypedFormGroup;
    public performanceData: PerformanceDataItem[] = [
        {
            title: 'NET INCOME',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 462.57,
            lastMonthTrend: 138.01,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'REVENUE',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 642.3,
            lastMonthTrend: 5.37,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'LOAD',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 37,
            lastMonthTrend: 3,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'MILES',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 15.35,
            lastMonthTrend: 2.06,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'FUEL GALLON',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 2.35,
            lastMonthTrend: 237.5,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'FUEL COST',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 19.3,
            lastMonthTrend: 2.37,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'REPAIR COST',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 8.34,
            lastMonthTrend: 768.3,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'ROADSIDE INSP.',
            isSelected: false,
            isHovered: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 47,
            lastMonthTrend: 5,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'VIOLATION',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 5,
            lastMonthTrend: 1,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'ACCIDENT',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 0,
            lastMonthTrend: 100,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'EXPENSES',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 322.25,
            lastMonthTrend: 8.37,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'DRIVER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 3,
            lastMonthTrend: 6,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'TRUCK',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 5,
            lastMonthTrend: 2,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'TRAILER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 2,
            lastMonthTrend: 2,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'OWNER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 1,
            lastMonthTrend: 1,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'USER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 0,
            lastMonthTrend: 6,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'REPAIR SHOP',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 12,
            lastMonthTrend: 4,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'BROKER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 7,
            lastMonthTrend: 1,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'SHIPPER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 35,
            lastMonthTrend: 12,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
    ];

    private selectedPerformanceDataCount: number = 0;
    private maxPerformanceDataItemsSelected = 10;

    // tabs
    public performanceTabs: DashboardTab[] = [];
    public currentActiveTab: DashboardTab;

    private selectedCustomPeriodRange: CustomPeriodRange;

    // dropdown
    public subPeriodDropdownList: DropdownListItem[] = [];
    public selectedSubPeriod: DropdownListItem;

    private overallCompanyDuration: number;

    // colors
    public performanceDataColors: PerformanceColorsPallete[] = [];

    // charts
    public lineChartConfig: LineChartConfig;
    public lineChartAxes: LineChartAxes;
    private lineChartDataValues: number[][] = [
        [
            8, 50, 14, 1, 29, 42, 21, 45, 26, 36, 13, 23, 21, 48, 20, 21, 18,
            46, 32, 10,
        ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [
            37, 32, 2, 39, 18, 34, 26, 9, 24, 51, 49, 21, 42, 44, 27, 43, 32,
            15, 0, 16,
        ],
        [
            0, 31, 11, 36, 14, 4, 24, 4, 5, 6, 25, 24, 35, 2, 27, 27, 17, 20,
            52, 11,
        ],
        [
            13, 45, 39, 0, 18, 5, 51, 18, 24, 49, 30, 18, 22, 31, 18, 14, 18,
            37, 31, 11,
        ],
        [
            28, 8, 19, 25, 17, 6, 32, 35, 32, 9, 51, 27, 52, 9, 25, 37, 47, 47,
            3, 29,
        ],
        [
            48, 50, 37, 49, 40, 43, 34, 44, 24, 30, 22, 32, 27, 30, 3, 31, 8,
            36, 13, 13,
        ],
        [
            32, 45, 35, 26, 36, 18, 35, 49, 40, 46, 23, 13, 41, 45, 49, 9, 0,
            33, 50, 31,
        ],
        [
            44, 14, 19, 27, 28, 21, 33, 2, 18, 28, 43, 34, 36, 36, 42, 40, 38,
            5, 30, 11,
        ],
        [
            34, 15, 40, 44, 52, 3, 4, 11, 32, 1, 27, 2, 42, 3, 41, 49, 37, 9,
            32, 16,
        ],
        [
            30, 42, 52, 25, 49, 26, 35, 48, 27, 44, 32, 9, 25, 21, 25, 9, 32,
            37, 23, 8,
        ],
        [
            25, 41, 29, 35, 0, 24, 52, 36, 46, 32, 21, 52, 13, 43, 14, 52, 33,
            14, 22, 27,
        ],
        [
            47, 33, 7, 6, 30, 21, 42, 41, 1, 47, 7, 39, 47, 17, 8, 32, 43, 43,
            44, 9,
        ],
        [
            47, 1, 17, 25, 24, 33, 21, 27, 4, 51, 16, 36, 25, 47, 29, 37, 42,
            45, 38, 7,
        ],
        [
            50, 28, 52, 25, 1, 38, 41, 35, 39, 11, 14, 34, 42, 7, 18, 44, 5, 1,
            41, 15,
        ],
        [
            46, 46, 28, 48, 13, 27, 49, 2, 25, 48, 46, 21, 20, 26, 17, 10, 51,
            15, 19, 31,
        ],
        [
            36, 27, 26, 31, 35, 2, 40, 43, 13, 42, 5, 13, 52, 1, 33, 34, 40, 19,
            42, 38,
        ],
        [
            4, 42, 21, 16, 49, 18, 27, 50, 39, 21, 41, 43, 47, 29, 22, 5, 23, 4,
            33, 46,
        ],
        [
            33, 49, 5, 20, 52, 5, 34, 30, 2, 40, 27, 47, 6, 48, 51, 19, 2, 13,
            0, 46,
        ],
    ];

    public barChartConfig: BarChartConfig;
    public barChartAxes: BarChartAxes;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardQuery: DashboardQuery,
        private dashboardPerformanceService: DashboardPerformanceService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.setChartsData();

        this.getPerformanceListData();

        this.setPerformanceDefaultStateData(0);
    }

    private createForm(): void {
        this.performanceForm = this.formBuilder.group({
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: PerformanceDataItem): string =>
        item.title;

    public handleSwitchTabClick(activeTab: DashboardTab): void {
        if (this.currentActiveTab?.name === activeTab.name) {
            return;
        }

        this.currentActiveTab = activeTab;

        let matchingIdList: number[] = [];

        switch (activeTab.name) {
            case ConstantStringEnum.TODAY:
                matchingIdList = DashboardSubperiodConstants.TODAY_ID_LIST;

                break;
            case ConstantStringEnum.WTD:
                matchingIdList = DashboardSubperiodConstants.WTD_ID_LIST;

                break;
            case ConstantStringEnum.MTD:
                matchingIdList = DashboardSubperiodConstants.MTD_ID_LIST;

                break;
            case ConstantStringEnum.QTD:
                matchingIdList = DashboardSubperiodConstants.QTD_ID_LIST;

                break;
            case ConstantStringEnum.YTD:
                matchingIdList = DashboardSubperiodConstants.YTD_ID_LIST;

                break;
            case ConstantStringEnum.ALL:
                this.setCustomSubPeriodList(this.overallCompanyDuration);

                break;
            default:
                break;
        }

        if (
            activeTab.name !== ConstantStringEnum.ALL &&
            activeTab.name !== ConstantStringEnum.CUSTOM
        ) {
            const { filteredSubPeriodDropdownList, selectedSubPeriod } =
                DashboardUtils.setSubPeriodList(matchingIdList);

            this.subPeriodDropdownList = filteredSubPeriodDropdownList;
            this.selectedSubPeriod = selectedSubPeriod;
        }
    }

    public handleInputSelect(dropdownListItem: DropdownListItem): void {
        this.selectedSubPeriod = dropdownListItem;
    }

    public handleSetCustomPeriodRangeClick(
        customPeriodRange: CustomPeriodRange
    ): void {
        const fromDate = moment(new Date(customPeriodRange.fromDate));
        const toDate = moment(new Date(customPeriodRange.toDate));

        const selectedDaysRange =
            toDate.diff(fromDate, ConstantStringEnum.DAYS) + 1;

        if (selectedDaysRange < 0) {
            return;
        }

        this.selectedCustomPeriodRange = customPeriodRange;

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
            this.lineChart.insertNewChartData(
                ConstantChartStringEnum.ADD,
                performanceDataItem.title,
                performanceDataItem.selectedColor.slice(1)
            );
        } else {
            // data boxes
            performanceDataItem.selectedColor = null;
            performanceDataItem.selectedHoverColor = null;

            this.performanceDataColors.find(
                (color) => color.code === selectedColor
            ).isSelected = false;

            this.selectedPerformanceDataCount--;

            // line chart
            this.lineChart.insertNewChartData(
                ConstantChartStringEnum.REMOVE,
                performanceDataItem.title
            );
        }
    }

    public handlePerformanceDataHover(
        index: number,
        removeHover: boolean = false
    ): void {
        const selectedPerformanceDataItem = this.performanceData[index];

        if (!removeHover) {
            selectedPerformanceDataItem.isHovered = true;

            if (selectedPerformanceDataItem.selectedColor) {
                this.lineChart.changeChartFillProperty(
                    selectedPerformanceDataItem.title,
                    selectedPerformanceDataItem.selectedColor.slice(1)
                );
            }
        } else {
            selectedPerformanceDataItem.isHovered = false;

            this.lineChart.changeChartFillProperty(
                this.performanceData[index].title,
                ConstantChartStringEnum.EMPTY_STRING
            );
        }
    }

    public handleBarChartHover(chartDataValue: number): void {
        this.lineChart.showChartTooltip(chartDataValue);
    }

    public handleRemoveChartsHover(): void {
        this.lineChart.chartHoverOut();
    }

    private getConstantData(): void {
        this.performanceTabs = DashboardPerformanceConstants.PERFORMANCE_TABS;
        this.currentActiveTab =
            DashboardPerformanceConstants.PERFORMANCE_TABS[2];

        this.performanceDataColors = DashboardColors.PERFORMANCE_COLORS_PALLETE;
    }

    private getPerformanceListData(): void {
        const selectedMainPeriod = DashboardUtils.ConvertMainPeriod(
            this.currentActiveTab.name
        ) as TimeInterval;

        const selectedSubPeriod = DashboardUtils.ConvertSubPeriod(
            this.selectedSubPeriod.name
        ) as SubintervalType;

        const performanceArgumentsData: PerformanceApiArguments = [
            selectedMainPeriod,
            /* customPeriodRange?.fromDate ?? */ null,
            /* customPeriodRange?.toDate ?? */ null,
            selectedSubPeriod,
        ];

        /* this.resetSelectedValues(); */

        this.dashboardPerformanceService
            .getPerformance(performanceArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((performanceData) => {
                console.log('performanceData', performanceData);
                console.log(typeof performanceData.performance);
            });
    }

    private getOverallCompanyDuration(): void {
        this.dashboardQuery.companyDuration$
            .pipe(takeUntil(this.destroy$))
            .subscribe((companyDuration: number) => {
                if (companyDuration) {
                    this.overallCompanyDuration = companyDuration;
                }
            });

        this.setCustomSubPeriodList(this.overallCompanyDuration);
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardUtils.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;
    }

    private setPerformanceDefaultStateData(
        performanceDataItemIndex: number
    ): void {
        const selectedPerformanceDataItem =
            this.performanceData[performanceDataItemIndex];
        const selectedPerformanceDataColor =
            this.performanceDataColors[performanceDataItemIndex];

        selectedPerformanceDataItem.isSelected = true;
        selectedPerformanceDataItem.selectedColor =
            selectedPerformanceDataColor.code;
        selectedPerformanceDataItem.selectedHoverColor =
            selectedPerformanceDataColor.hoverCode;

        selectedPerformanceDataColor.isSelected = true;

        this.selectedPerformanceDataCount++;

        setTimeout(() => {
            this.lineChart?.insertNewChartData(
                ConstantChartStringEnum.ADD,
                selectedPerformanceDataItem.title,
                this.performanceData[
                    performanceDataItemIndex
                ].selectedColor.slice(1)
            );
        }, 100);
    }

    private setLineChartConfigAndAxes(): void {
        this.lineChartConfig = {
            dataProperties: [],
            showLegend: false,
            chartValues: [2, 2],
            defaultType: ConstantChartStringEnum.LINE,
            chartWidth: ConstantChartStringEnum.LINE_1800_WIDTH,
            chartHeight: ConstantChartStringEnum.LINE_1800_HEIGHT,
            removeChartMargin: true,
            gridHoverBackground: true,
            allowAnimation: true,
            hasHoverData: true,
            offset: true,
            multiHoverData: true,
            multiChartHover: true,
            tooltipOffset: { min: 134, max: 206 },
            dataLabels: [
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
                ['', ''],
            ],
            noChartImage: ConstantChartStringEnum.NO_CHART_IMG,
        };

        this.lineChartConfig.dataProperties = this.performanceData.map(
            (performanceDataItem, index) => {
                return this.createLineChartData(performanceDataItem, index);
            }
        );

        // line axes
        this.lineChartAxes = {
            verticalLeftAxes: {
                visible: false,
                minValue: 0,
                maxValue: 52,
                stepSize: 10,
                showGridLines: false,
            },
            horizontalAxes: {
                visible: true,
                position: ConstantChartStringEnum.BAR_AXES_POSITION_BOTTOM,
                showGridLines: false,
            },
        };
    }

    private setBarChartConfigAndAxes(barChartValues?: BarChartValues): void {
        console.log('barChartValues', barChartValues);
        this.barChartConfig = {
            dataProperties: [
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.BAR,
                        data: [
                            52, 21, 27, 37, 28, 25, 21, 10, 15, 45, 27, 46, 41,
                            28, 24, 12, 21, 27, 37, 28,
                        ],
                        backgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        borderColor: ConstantChartStringEnum.CHART_COLOR_GREY_4,
                        hoverBackgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_5,
                        hoverBorderColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        label: ConstantChartStringEnum.BAR_LABEL_PER_GALLON,
                    },
                },
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.BAR,
                        data: [
                            52, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 46, 10,
                            14, 30, 7, 28, 11, 20, 39,
                        ],
                        backgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_2,
                        borderColor: ConstantChartStringEnum.CHART_COLOR_GREY_3,
                        hoverBackgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        hoverBorderColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_2,
                        label: ConstantChartStringEnum.BAR_LABEL_LOAD_PER_MILE,
                    },
                },
            ],
            showLegend: false,
            chartValues: [2, 2],
            defaultType: ConstantChartStringEnum.BAR,
            offset: true,
            chartWidth: ConstantChartStringEnum.BAR_1800_WIDTH_2,
            chartHeight: ConstantChartStringEnum.BAR_1800_HEIGHT_2,
            removeChartMargin: true,
            gridHoverBackground: true,
            hasHoverData: true,
            allowAnimation: true,
            hoverOtherChart: true,
            tooltipOffset: { min: 134, max: 206 },
            dataLabels: [
                ['01', 'WED'],
                ['02', 'THU'],
                ['03', 'FRI'],
                ['04', 'SAT'],
                ['05', 'SUN'],
                ['06', 'MON'],
                ['07', 'TUE'],
                ['08', 'WED'],
                ['09', 'THU'],
                ['10', 'FRI'],
                ['11', 'SAT'],
                ['12', 'SUN'],
                ['13', 'MON'],
                ['14', 'TUE'],
                ['15', 'WED'],
                ['16', 'THU'],
                ['17', 'FRI'],
                ['18', 'SAT'],
                ['19', 'SUN'],
                ['20', 'MON'],
            ],
            dataTooltipLabels: [],
            noChartImage: ConstantChartStringEnum.NO_CHART_IMG,
        };

        this.barChartAxes = {
            verticalLeftAxes: {
                visible: false,
                minValue: 0,
                maxValue: 52,
                stepSize: 10,
                showGridLines: false,
            },
            horizontalAxes: {
                visible: true,
                position: ConstantChartStringEnum.BAR_AXES_POSITION_BOTTOM,
                showGridLines: false,
            },
        };
    }

    private setChartsData(): void {
        this.setLineChartConfigAndAxes();
        this.setBarChartConfigAndAxes();
    }

    private createLineChartData(
        performanceDataItem: PerformanceDataItem,
        performanceDataItemIndex: number
    ): { defaultConfig: ChartDefaultConfig } {
        const selectedLineChartDataValue =
            this.lineChartDataValues[performanceDataItemIndex];
        const selectedLineChartDataTitle = performanceDataItem.title;

        return {
            defaultConfig: {
                type: ConstantChartStringEnum.LINE,
                data: selectedLineChartDataValue,
                borderColor: null,
                pointBorderColor: ConstantChartStringEnum.CHART_COLOR_NONE,
                pointBackgroundColor: ConstantChartStringEnum.CHART_COLOR_NONE,
                pointHoverBackgroundColor:
                    ConstantChartStringEnum.CHART_COLOR_WHITE,
                pointHoverBorderColor: null,
                pointHoverRadius: 3,
                pointBorderWidth: 3,
                fill: false,
                hasGradiendBackground: true,
                colors: null,
                id: selectedLineChartDataTitle,
                hidden: true,
                label: selectedLineChartDataTitle,
            },
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
