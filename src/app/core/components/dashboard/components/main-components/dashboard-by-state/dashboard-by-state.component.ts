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
import { DashboardByStateService } from '../../../state/services/dashboard-by-state.service';

// store
import { DashboardQuery } from '../../../state/store/dashboard.query';

// enums
import { ConstantStringEnum } from '../../../state/enums/constant-string.enum';
import { ConstantChartStringEnum } from '../../../state/enums/constant-chart-string.enum';

// helpers
import { DashboardUtils } from '../../../state/utils/dashboard-utils';
import { DashboardArrayHelper } from '../../../state/utils/helpers/dashboard-array-helper';

// constants
import { DashboardByStateConstants } from '../../../state/utils/constants/dashboard-by-state.constants';
import { DashboardSubperiodConstants } from '../../../state/utils/constants/dashboard-subperiod.constants';
import { DashboardTopRatedConstants } from '../../../state/utils/constants/dashboard-top-rated.constants';
import { DashboardColors } from '../../../state/utils/constants/dashboard-colors.constants';

// models
import { ByStateListItem } from '../../../state/models/dashboard-by-state-models/by-state-list-item.model';
import { DropdownItem } from '../../../state/models/dropdown-item.model';
import { DashboardTab } from '../../../state/models/dashboard-tab.model';
import { DropdownListItem } from '../../../state/models/dropdown-list-item.model';
import { ByStateColorsPallete } from '../../../state/models/dashboard-color-models/colors-pallete.model';
import { CustomPeriodRange } from '../../../state/models/custom-period-range.model';
import {
    BarChart,
    BarChartAxes,
    BarChartConfig,
    BarChartValues,
} from '../../../state/models/dashboard-chart-models/bar-chart.model';
import {
    ByStateReportType,
    IntervalLabelResponse,
    LoadStopType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';
import {
    ByStateApiArguments,
    ByStateWithLoadStopApiArguments,
} from '../../../state/models/dashboard-by-state-models/by-state-api-arguments.model';
import { MapListItem } from '../../../state/models/dashboard-state-models/map-list-item.model';

@Component({
    selector: 'app-dashboard-pickup-by-state',
    templateUrl: './dashboard-by-state.component.html',
    styleUrls: ['./dashboard-by-state.component.scss'],
})
export class DashboardByStateComponent implements OnInit, OnDestroy {
    @ViewChild('barChart') public barChart: BarChart;

    private destroy$ = new Subject<void>();

    public byStateForm: UntypedFormGroup;
    public byStateTitle: string = ConstantStringEnum.PICKUP;

    public isDisplayingPlaceholder: boolean = false;
    public isLoading: boolean = true;

    // search
    public searchValue: string;
    public clearSearchValue: boolean = false;

    // list
    public byStateList: ByStateListItem[] = [];
    public selectedByStateList: ByStateListItem[] = [];
    public byStateMapList: MapListItem[] = [];
    private byStateListBeforeSearch: ByStateListItem[] = [];

    public byStateListLength: number = 0;

    // show more
    public isShowingMore: boolean = false;

    // tabs
    public byStateTabs: DashboardTab[] = [];
    private currentActiveTab: DashboardTab;

    // dropdowns
    public byStateDropdownList: DropdownItem[] = [];

    public mainPeriodDropdownList: DropdownListItem[] = [];
    public subPeriodDropdownList: DropdownListItem[] = [];

    public selectedMainPeriod: DropdownListItem;
    public selectedSubPeriod: DropdownListItem;

    public isDisplayingCustomPeriodRange: boolean = false;
    private selectedCustomPeriodRange: CustomPeriodRange;

    private overallCompanyDuration: number;

    public selectedDropdownWidthSubPeriod: DropdownListItem;

    // colors
    public mainColorsPallete: ByStateColorsPallete[] = [];

    // charts
    public barChartConfig: BarChartConfig;
    public barChartAxes: BarChartAxes;
    public barChartDateTitle: string;
    private barChartLabels: string[] | string[][] = [];
    private barChartTooltipLabels: string[];
    private barChartValues: BarChartValues = {
        defaultBarValues: {
            topRatedBarValues: [],
            otherBarValues: [],
        },
        defaultBarPercentages: {
            topRatedBarPercentage: [],
            otherBarPercentage: [],
        },
        selectedBarValues: [],
        selectedBarPercentages: [],
    };

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardQuery: DashboardQuery,
        private changeDetectorRef: ChangeDetectorRef,
        private dashboardByStateService: DashboardByStateService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.getByStateListData();

        this.setChartData();
    }

    private createForm(): void {
        this.byStateForm = this.formBuilder.group({
            mainPeriod: [null],
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: DropdownItem): string =>
        item.name;

    public resetSelectedValues(): void {
        for (let i = 0; i < this.selectedByStateList.length; i++) {
            this.barChart.removeMultiBarData(this.selectedByStateList[i], true);
        }

        this.selectedByStateList = [];

        this.barChartValues = {
            defaultBarValues: {
                topRatedBarValues: [],
                otherBarValues: [],
            },
            defaultBarPercentages: {
                topRatedBarPercentage: [],
                otherBarPercentage: [],
            },
            selectedBarValues: [],
            selectedBarPercentages: [],
        };

        this.clearSearchValue = true;
    }

    public highlightSearchValue(text: string, isSelected: boolean) {
        return DashboardUtils.highlightPartOfString(
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
        if (action === ConstantStringEnum.MAIN_PERIOD_DROPDOWN) {
            if (
                dropdownListItem.name !== ConstantStringEnum.CUSTOM &&
                this.selectedMainPeriod.name === dropdownListItem.name
            )
                return;

            if (this.isDisplayingCustomPeriodRange)
                this.isDisplayingCustomPeriodRange = false;

            this.selectedMainPeriod = dropdownListItem;

            let matchingIdList: number[] = [];

            switch (dropdownListItem.name) {
                case ConstantStringEnum.TODAY:
                    matchingIdList = DashboardSubperiodConstants.TODAY_ID_LIST;

                    break;
                case ConstantStringEnum.WEEK_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.WTD_ID_LIST;

                    break;
                case ConstantStringEnum.MONTH_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.MTD_ID_LIST;

                    break;
                case ConstantStringEnum.QUARTAL_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.QTD_ID_LIST;

                    break;
                case ConstantStringEnum.YEAR_TO_DATE:
                    matchingIdList = DashboardSubperiodConstants.YTD_ID_LIST;

                    break;
                case ConstantStringEnum.ALL_TIME:
                    this.setCustomSubPeriodList(this.overallCompanyDuration);

                    this.getByStateListData();

                    break;
                case ConstantStringEnum.CUSTOM:
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
                dropdownListItem.name !== ConstantStringEnum.ALL_TIME &&
                dropdownListItem.name !== ConstantStringEnum.CUSTOM
            ) {
                const { filteredSubPeriodDropdownList, selectedSubPeriod } =
                    DashboardUtils.setSubPeriodList(matchingIdList);

                this.subPeriodDropdownList = filteredSubPeriodDropdownList;
                this.selectedSubPeriod = selectedSubPeriod;

                this.getByStateListData();
            }
        }

        if (action === ConstantStringEnum.SUB_PERIOD_DROPDOWN) {
            if (this.selectedSubPeriod.name === dropdownListItem.name) return;

            this.selectedSubPeriod = dropdownListItem;

            if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
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

        if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
            this.selectedMainPeriod =
                DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];

            this.setCustomSubPeriodList(this.overallCompanyDuration);
        }

        this.getByStateListData();
    }

    public handleSwitchTabClick(activeTab: DashboardTab): void {
        if (this.currentActiveTab.name === activeTab.name) return;

        this.currentActiveTab = activeTab;

        if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
            this.getByStateListData(this.selectedCustomPeriodRange);
        } else {
            this.getByStateListData();
        }
    }

    public handleShowMoreClick(): void {
        this.isShowingMore = !this.isShowingMore;

        if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
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

    public handleAddSelectedClick(
        byStateListItem: ByStateListItem,
        byStateListItemIndex: number
    ): void {
        const maxByStateItemsSelected = 5;

        if (
            byStateListItem.isSelected ||
            this.selectedByStateList.length === maxByStateItemsSelected
        )
            return;

        byStateListItem.isSelected = true;

        this.selectedByStateList = [
            ...this.selectedByStateList,
            byStateListItem,
        ];

        this.byStateList.splice(byStateListItemIndex, 1);
        this.byStateList.splice(
            this.selectedByStateList.length - 1,
            0,
            byStateListItem
        );

        this.setBarChartData(this.selectedByStateList, byStateListItemIndex);
    }

    public handleRemoveSelectedClick(
        event: Event,
        byStateListItem: ByStateListItem,
        byStateListItemIndex: number
    ): void {
        event.stopPropagation();

        this.byStateList.splice(byStateListItemIndex, 1);
        this.byStateList.splice(byStateListItem.id - 1, 0, byStateListItem);

        byStateListItem.isSelected = false;

        this.byStateList = DashboardArrayHelper.sorPartOfArray(
            this.byStateList
        );

        this.selectedByStateList = this.selectedByStateList.filter(
            (byStateItem) => byStateItem.id !== byStateListItem.id
        );

        this.setBarChartData(
            this.selectedByStateList,
            byStateListItemIndex,
            true,
            byStateListItem
        );
    }

    public handleHoverSelected(
        index: number,
        removeHover: boolean = false
    ): void {
        if (!removeHover) {
            this.barChart.hoverBarChart(this.selectedByStateList[index]);
        } else {
            this.barChart.hoverBarChart(null);
        }
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

        this.mainColorsPallete = DashboardColors.BY_STATE_COLORS_PALLETE;
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

    private getByStateListData(customPeriodRange?: CustomPeriodRange): void {
        const loadStopType = (
            this.byStateTitle === ConstantStringEnum.PICKUP
                ? ConstantStringEnum.PICKUP
                : ConstantStringEnum.DELIVERY
        ) as LoadStopType;

        const selectedTab = (
            this.currentActiveTab.name === ConstantStringEnum.SW
                ? ConstantStringEnum.SEVERITY_WEIGHT
                : this.currentActiveTab.name
        ) as ByStateReportType;

        const selectedMainPeriod = DashboardUtils.ConvertMainPeriod(
            this.selectedMainPeriod.name
        ) as TimeInterval;

        const selectedSubPeriod = DashboardUtils.ConvertSubPeriod(
            this.selectedSubPeriod.name
        ) as SubintervalType;

        const byStateArgumentsData = [
            ...(this.byStateTitle === ConstantStringEnum.PICKUP ||
            this.byStateTitle === ConstantStringEnum.DELIVERY
                ? [loadStopType]
                : []),
            selectedTab,
            null,
            null,
            null,
            this.isShowingMore,
            selectedMainPeriod,
            customPeriodRange?.fromDate ?? null,
            customPeriodRange?.toDate ?? null,
            selectedSubPeriod,
        ];

        this.isLoading = true;

        this.resetSelectedValues();

        switch (this.byStateTitle) {
            case ConstantStringEnum.PICKUP:
                this.getPickupByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateWithLoadStopApiArguments
                );
                break;
            case ConstantStringEnum.DELIVERY:
                this.getDeliveryByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateWithLoadStopApiArguments
                );
                break;
            case ConstantStringEnum.VIOLATION_2:
                this.getViolationByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            case ConstantStringEnum.ACCIDENT_2:
                this.getAccidentByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            case ConstantStringEnum.REPAIR:
                this.getRepairByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            case ConstantStringEnum.FUEL:
                this.getFuelByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            default:
                break;
        }
    }

    private getPickupByStateListData(
        selectedTab: ByStateReportType,
        byStateArgumentsData: ByStateWithLoadStopApiArguments
    ): void {
        this.dashboardByStateService
            .getPickupByState(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((pickupData) => {
                // by state list and single selection data
                this.byStateList = pickupData.pagination.data.map(
                    (pickup, index) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < pickup.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? pickup.intervals[i].count
                                    : pickup.intervals[i].revenue,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? pickup.intervals[i].countPercentage
                                    : pickup.intervals[i].revenuePercentage,
                            ];
                        }

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervalValues,
                        ];

                        this.barChartValues.selectedBarPercentages = [
                            ...this.barChartValues.selectedBarPercentages,
                            filteredIntervalPercentages,
                        ];

                        return {
                            id: index + 1,
                            state: pickup.stateShortName,
                            value:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? pickup.count.toString()
                                    : pickup.revenue.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? pickup.countPercentage.toString()
                                    : pickup.revenuePercentage.toString(),
                            isSelected: false,
                            selectedColor: null,
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = pickupData.pagination.count;

                // intervals

                for (let i = 0; i < pickupData.topTen.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? pickupData.topTen[i].count
                            : pickupData.topTen[i].revenue,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? pickupData.topTen[i].countPercentage
                                : pickupData.topTen[i].revenuePercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? pickupData.others[i].count
                            : pickupData.others[i].revenue,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? pickupData.others[i].countPercentage
                                : pickupData.others[i].revenuePercentage,
                        ];
                }

                // colors range & map
                DashboardUtils.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
                this.setBarChartDateTitle(
                    pickupData.intervalLabels[0].tooltipLabel,
                    pickupData.intervalLabels[pickupData.topTen.length - 1]
                        .tooltipLabel
                );

                this.setBarChartLabels(pickupData.intervalLabels);

                this.setChartData();
            });
    }

    private getDeliveryByStateListData(
        selectedTab: ByStateReportType,
        byStateArgumentsData: ByStateWithLoadStopApiArguments
    ): void {
        this.dashboardByStateService
            .getDeliveryByState(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((deliveryData) => {
                // by state list and single selection data
                this.byStateList = deliveryData.pagination.data.map(
                    (delivery, index) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < delivery.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? delivery.intervals[i].count
                                    : delivery.intervals[i].revenue,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? delivery.intervals[i].countPercentage
                                    : delivery.intervals[i].revenuePercentage,
                            ];
                        }

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervalValues,
                        ];

                        this.barChartValues.selectedBarPercentages = [
                            ...this.barChartValues.selectedBarPercentages,
                            filteredIntervalPercentages,
                        ];

                        return {
                            id: index + 1,
                            state: delivery.stateShortName,
                            value:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? delivery.count.toString()
                                    : delivery.revenue.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? delivery.countPercentage.toString()
                                    : delivery.revenuePercentage.toString(),
                            isSelected: false,
                            selectedColor: null,
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = deliveryData.pagination.count;

                // intervals

                for (let i = 0; i < deliveryData.topTen.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? deliveryData.topTen[i].count
                            : deliveryData.topTen[i].revenue,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? deliveryData.topTen[i].countPercentage
                                : deliveryData.topTen[i].revenuePercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? deliveryData.others[i].count
                            : deliveryData.others[i].revenue,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? deliveryData.others[i].countPercentage
                                : deliveryData.others[i].revenuePercentage,
                        ];
                }

                // colors range & map
                DashboardUtils.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
                this.setBarChartDateTitle(
                    deliveryData.intervalLabels[0].tooltipLabel,
                    deliveryData.intervalLabels[deliveryData.topTen.length - 1]
                        .tooltipLabel
                );

                this.setBarChartLabels(deliveryData.intervalLabels);

                this.setChartData();
            });
    }

    private getViolationByStateListData(
        selectedTab: ByStateReportType,
        byStateArgumentsData: ByStateApiArguments
    ): void {
        this.dashboardByStateService
            .getViolationByState(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((violationData) => {
                // by state list and single selection data
                this.byStateList = violationData.pagination.data.map(
                    (violation, index) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < violation.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? violation.intervals[i].count
                                    : violation.intervals[i].severityWeight,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? violation.intervals[i].countPercentage
                                    : violation.intervals[i]
                                          .severityWeightPercentage,
                            ];
                        }

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervalValues,
                        ];

                        this.barChartValues.selectedBarPercentages = [
                            ...this.barChartValues.selectedBarPercentages,
                            filteredIntervalPercentages,
                        ];

                        return {
                            id: index + 1,
                            state: violation.stateShortName,
                            value:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? violation.count.toString()
                                    : violation.severityWeight.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? violation.countPercentage.toString()
                                    : violation.severityWeightPercentage.toString(),
                            isSelected: false,
                            selectedColor: null,
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = violationData.pagination.count;

                // intervals

                for (let i = 0; i < violationData.topTen.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? violationData.topTen[i].count
                            : violationData.topTen[i].severityWeight,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? violationData.topTen[i].countPercentage
                                : violationData.topTen[i]
                                      .severityWeightPercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? violationData.others[i].count
                            : violationData.others[i].severityWeight,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? violationData.others[i].countPercentage
                                : violationData.others[i]
                                      .severityWeightPercentage,
                        ];
                }

                // colors range & map
                DashboardUtils.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
                this.setBarChartDateTitle(
                    violationData.intervalLabels[0].tooltipLabel,
                    violationData.intervalLabels[
                        violationData.topTen.length - 1
                    ].tooltipLabel
                );

                this.setBarChartLabels(violationData.intervalLabels);

                this.setChartData();
            });
    }

    private getAccidentByStateListData(
        selectedTab: ByStateReportType,
        byStateArgumentsData: ByStateApiArguments
    ): void {
        this.dashboardByStateService
            .getAccidentByState(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((accidentData) => {
                // by state list and single selection data
                this.byStateList = accidentData.pagination.data.map(
                    (accident, index) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < accident.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? accident.intervals[i].count
                                    : accident.intervals[i].severityWeight,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? accident.intervals[i].countPercentage
                                    : accident.intervals[i]
                                          .severityWeightPercentage,
                            ];
                        }

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervalValues,
                        ];

                        this.barChartValues.selectedBarPercentages = [
                            ...this.barChartValues.selectedBarPercentages,
                            filteredIntervalPercentages,
                        ];

                        return {
                            id: index + 1,
                            state: accident.stateShortName,
                            value:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? accident.count.toString()
                                    : accident.severityWeight.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? accident.countPercentage.toString()
                                    : accident.severityWeightPercentage.toString(),
                            isSelected: false,
                            selectedColor: null,
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = accidentData.pagination.count;

                // intervals

                for (let i = 0; i < accidentData.topTen.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? accidentData.topTen[i].count
                            : accidentData.topTen[i].severityWeight,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? accidentData.topTen[i].countPercentage
                                : accidentData.topTen[i]
                                      .severityWeightPercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? accidentData.others[i].count
                            : accidentData.others[i].severityWeight,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? accidentData.others[i].countPercentage
                                : accidentData.others[i]
                                      .severityWeightPercentage,
                        ];
                }

                // colors range & map
                DashboardUtils.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
                this.setBarChartDateTitle(
                    accidentData.intervalLabels[0].tooltipLabel,
                    accidentData.intervalLabels[accidentData.topTen.length - 1]
                        .tooltipLabel
                );

                this.setBarChartLabels(accidentData.intervalLabels);

                this.setChartData();
            });
    }

    private getRepairByStateListData(
        selectedTab: ByStateReportType,
        byStateArgumentsData: ByStateApiArguments
    ): void {
        this.dashboardByStateService
            .getRepairByState(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((repairData) => {
                // by state list and single selection data
                this.byStateList = repairData.pagination.data.map(
                    (repair, index) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < repair.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? repair.intervals[i].count
                                    : repair.intervals[i].cost,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.COUNT
                                    ? repair.intervals[i].countPercentage
                                    : repair.intervals[i].costPercentage,
                            ];
                        }

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervalValues,
                        ];

                        this.barChartValues.selectedBarPercentages = [
                            ...this.barChartValues.selectedBarPercentages,
                            filteredIntervalPercentages,
                        ];

                        return {
                            id: index + 1,
                            state: repair.stateShortName,
                            value:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? repair.count.toString()
                                    : repair.cost.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.COUNT
                                    ? repair.countPercentage.toString()
                                    : repair.costPercentage.toString(),
                            isSelected: false,
                            selectedColor: null,
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = repairData.pagination.count;

                // intervals

                for (let i = 0; i < repairData.topTen.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? repairData.topTen[i].count
                            : repairData.topTen[i].cost,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? repairData.topTen[i].countPercentage
                                : repairData.topTen[i].costPercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.COUNT
                            ? repairData.others[i].count
                            : repairData.others[i].cost,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.COUNT
                                ? repairData.others[i].countPercentage
                                : repairData.others[i].costPercentage,
                        ];
                }

                // colors range & map
                DashboardUtils.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
                this.setBarChartDateTitle(
                    repairData.intervalLabels[0].tooltipLabel,
                    repairData.intervalLabels[repairData.topTen.length - 1]
                        .tooltipLabel
                );

                this.setBarChartLabels(repairData.intervalLabels);

                this.setChartData();
            });
    }

    private getFuelByStateListData(
        selectedTab: ByStateReportType,
        byStateArgumentsData: ByStateApiArguments
    ): void {
        this.dashboardByStateService
            .getFuelByState(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe(() => {
                // by state list and single selection data
            });
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardUtils.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;

        this.selectedDropdownWidthSubPeriod = selectedSubPeriod;
    }

    private setBarChartDateTitle(
        startInterval: string,
        endInterval: string
    ): void {
        const { chartTitle } = DashboardUtils.setChartDateTitle(
            startInterval,
            endInterval
        );

        this.barChartDateTitle = chartTitle;
    }

    private setBarChartLabels(barChartLables: IntervalLabelResponse[]): void {
        const selectedSubPeriod = DashboardUtils.ConvertSubPeriod(
            this.selectedSubPeriod.name
        );

        const { filteredLabels, filteredTooltipLabels } =
            DashboardUtils.setBarChartLabels(barChartLables, selectedSubPeriod);

        this.barChartLabels = filteredLabels;
        this.barChartTooltipLabels = filteredTooltipLabels;
    }

    private setBarChartConfigAndAxes(barChartValues: BarChartValues): void {
        this.barChartConfig = {
            dataProperties: [
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.BAR,
                        data: barChartValues?.defaultBarValues
                            ?.topRatedBarValues,
                        dataPercentages:
                            barChartValues?.defaultBarPercentages
                                ?.topRatedBarPercentage,
                        backgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        borderColor: ConstantChartStringEnum.CHART_COLOR_GREY_4,
                        hoverBackgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_5,
                        hoverBorderColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        label:
                            this.byStateList.length <= 10
                                ? ConstantChartStringEnum.BAR_LABEL_TOP_3
                                : this.byStateList.length > 10 &&
                                  this.byStateList.length <= 30
                                ? ConstantChartStringEnum.BAR_LABEL_TOP_5
                                : ConstantChartStringEnum.BAR_LABEL_TOP_10,
                        id: ConstantChartStringEnum.BAR_ID_TOP,
                    },
                },
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.BAR,
                        data: barChartValues?.defaultBarValues?.otherBarValues,
                        dataPercentages:
                            barChartValues?.defaultBarPercentages
                                ?.otherBarPercentage,
                        backgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_2,
                        borderColor: ConstantChartStringEnum.CHART_COLOR_GREY_3,
                        hoverBackgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        hoverBorderColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_2,
                        label: ConstantChartStringEnum.BAR_LABEL_OTHER,
                        id: ConstantChartStringEnum.BAR_ID_OTHER,
                    },
                },
            ],
            showLegend: false,
            chartValues: [2, 2],
            defaultType: ConstantChartStringEnum.BAR,
            chartWidth: ConstantChartStringEnum.BAR_1800_WIDTH,
            chartHeight: ConstantChartStringEnum.BAR_1800_HEIGHT,
            removeChartMargin: true,
            gridHoverBackground: true,
            startGridBackgroundFromZero: true,
            dataMaxRows: 4,
            hasHoverData: true,
            hassecondTabValueage: true,
            allowAnimation: true,
            offset: true,
            tooltipOffset: { min: 105, max: 279 },
            dataLabels: this.barChartLabels,
            dataTooltipLabels: this.barChartTooltipLabels,
            selectedTab: this.currentActiveTab.name,
            noChartImage: ConstantChartStringEnum.NO_CHART_IMG,
        };

        // bar max value
        const barChartMaxValue = +this.byStateList[0]?.value;

        // bar axes
        this.barChartAxes = {
            verticalLeftAxes: {
                visible: true,
                minValue: 0,
                maxValue: barChartMaxValue,
                stepSize: 10,
                showGridLines: true,
            },
            horizontalAxes: {
                visible: true,
                position: ConstantChartStringEnum.BAR_AXES_POSITION_BOTTOM,
                showGridLines: false,
            },
        };
    }

    private setBarChartData(
        byStateList: ByStateListItem[],
        byStateListItemIndex: number,
        isRemoving?: boolean,
        byStateListItem?: ByStateListItem
    ): void {
        if (!isRemoving) {
            const chartValues =
                this.barChartValues.selectedBarValues[byStateListItemIndex];
            const chartPercentages =
                this.barChartValues.selectedBarPercentages[
                    byStateListItemIndex
                ];

            let selectedColors: string[] = [];
            let selectedHoverColors: string[] = [];

            for (let i = 0; i < byStateList.length; i++) {
                selectedColors = [
                    ...selectedColors,
                    this.mainColorsPallete[i].code,
                ];
                selectedHoverColors = [
                    ...selectedHoverColors,
                    this.mainColorsPallete[i].code,
                ];
            }

            if (this.barChart) {
                this.barChart.updateMuiliBar(
                    byStateList,
                    chartValues,
                    chartPercentages,
                    selectedColors,
                    selectedHoverColors
                );
            }
        } else {
            const displayChartDefaultValue =
                this.selectedByStateList.length === 0;

            this.barChart.removeMultiBarData(
                byStateListItem,
                displayChartDefaultValue
            );
        }
    }

    private setChartData(): void {
        this.setBarChartConfigAndAxes(this.barChartValues);

        this.changeDetectorRef.detectChanges();
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
