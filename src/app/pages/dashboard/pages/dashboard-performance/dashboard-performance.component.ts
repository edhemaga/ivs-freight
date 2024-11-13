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
import { DashboardPerformanceChartsConfiguration } from '@pages/dashboard/pages/dashboard-performance/utils/constants';

// helpers
import { DashboardHelper } from '@pages/dashboard/utils/helpers/dashboard.helper';

// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';

// models
import { DashboardTab } from '@pages/dashboard/models/dashboard-tab.model';
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { PerformanceDataItem } from '@pages/dashboard/pages/dashboard-performance/models/performance-data-item.model';
import { PerformanceColorsPallete } from '@pages/dashboard/models/colors-pallete.model';
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import { PerformanceApiArguments } from '@pages/dashboard/pages/dashboard-performance/models/performance-api-arguments.model';
import { DashboardArrayHelper } from '@pages/dashboard/utils/helpers/dashboard-array-helper';
import {
    IntervalLabelResponse,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';
import { IChartConfiguaration } from 'ca-components/lib/components/ca-chart/models';

@Component({
    selector: 'app-dashboard-performance',
    templateUrl: './dashboard-performance.component.html',
    styleUrls: ['./dashboard-performance.component.scss'],
})
export class DashboardPerformanceComponent implements OnInit, OnDestroy {
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
    public performanceChartConfig: IChartConfiguaration;

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

        this.setChartConfiguration();
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
        } else {
            // data boxes
            performanceDataItem.selectedColor = null;
            performanceDataItem.selectedHoverColor = null;

            this.performanceDataColors.find(
                (color) => color.code === selectedColor
            ).isSelected = false;

            this.selectedPerformanceDataCount--;
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

            //     if (selectedPerformanceDataItem.selectedColor) {
            //         // this.lineChart?.changeChartFillProperty(
            //         //     selectedPerformanceDataItem.title,
            //         //     selectedPerformanceDataItem.selectedColor.slice(1)
            //         // );
            //     }
            // } else {
            //     selectedPerformanceDataItem.isHovered = false;

            //     // this.lineChart?.changeChartFillProperty(
            //     //     this.performanceData[index].title,
            //     //     DashboardChartStringEnum.EMPTY_STRING
            //     // );
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
    }

    setChartConfiguration() {
        this.performanceChartConfig =
            DashboardPerformanceChartsConfiguration.PERFORMANCE_CHART_CONFIG;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
