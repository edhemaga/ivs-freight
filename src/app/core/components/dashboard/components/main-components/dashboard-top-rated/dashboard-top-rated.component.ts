import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { DashboardTopRatedService } from '../../../state/services/dashboard-top-rated.service';

// store
import { DashboardQuery } from '../../../state/store/dashboard.query';

// constants
import { DashboardTopRatedConstants } from '../../../state/utils/constants/dashboard-top-rated.constants';
import { DashboardColors } from '../../../state/utils/constants/dashboard-colors.constants';
import { DashboardSubperiodConstants } from '../../../state/utils/constants/dashboard-subperiod.constants';

// helpers
import { DashboardArrayHelper } from '../../../state/utils/helpers/dashboard-array-helper';
import { DashboardUtils } from '../../../state/utils/dashboard-utils';

// enum
import { ConstantStringEnum } from '../../../state/enums/constant-string.enum';
import { ConstantChartStringEnum } from '../../../state/enums/constant-chart-string.enum';

// models
import { DropdownItem } from '../../../state/models/dropdown-item.model';
import { DashboardTab } from '../../../state/models/dashboard-tab.model';
import { DropdownListItem } from '../../../state/models/dropdown-list-item.model';
import { TopRatedListItem } from '../../../state/models/dashboard-top-rated-models/top-rated-list-item.model';
import { CustomPeriodRange } from '../../../state/models/custom-period-range.model';
import {
    TopRatedMainColorsPallete,
    TopRatedSecondaryColorsPallete,
} from '../../../state/models/dashboard-color-models/colors-pallete.model';
import {
    ChartInitProperties,
    DoughnutChart,
    DoughnutChartConfig,
    DoughnutChartPercentage,
    DoughnutChartSigns,
} from '../../../state/models/dashboard-chart-models/doughnut-chart.model';
import {
    BarChart,
    BarChartAxes,
    BarChartConfig,
    BarChartValues,
} from '../../../state/models/dashboard-chart-models/bar-chart.model';
import {
    DashboardTopReportType,
    IntervalLabelResponse,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';
import {
    TopRatedApiArguments,
    TopRatedWithoutTabApiArguments,
} from '../../../state/models/dashboard-top-rated-models/top-rated-api-arguments.model';

@Component({
    selector: 'app-dashboard-top-rated',
    templateUrl: './dashboard-top-rated.component.html',
    styleUrls: ['./dashboard-top-rated.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardTopRatedComponent implements OnInit, OnDestroy {
    @ViewChild('doughnutChart') public doughnutChart: DoughnutChart;
    @ViewChild('barChart') public barChart: BarChart;

    private destroy$: Subject<void> = new Subject<void>();

    public topRatedForm: UntypedFormGroup;
    public topRatedTitle: string = ConstantStringEnum.DRIVER;

    public isDisplayingPlaceholder: boolean = false;
    public isLoading: boolean = false;

    // search
    public searchValue: string;
    public clearSearchValue: boolean = false;

    // list
    public topRatedList: TopRatedListItem[] = [];
    public selectedTopRatedList: TopRatedListItem[] = [];
    private topRatedListBeforeSearch: TopRatedListItem[] = [];
    public topRatedListSelectedPercentage: number = 100;

    public topRatedListLength: number = 0;

    // show more
    public isShowingMore: boolean = false;

    // tabs
    public topRatedTabs: DashboardTab[] = [];
    private currentActiveTab: DashboardTab;

    // dropdowns
    public topRatedDropdownList: DropdownItem[] = [];

    public mainPeriodDropdownList: DropdownListItem[] = [];
    public subPeriodDropdownList: DropdownListItem[] = [];

    public selectedMainPeriod: DropdownListItem;
    public selectedSubPeriod: DropdownListItem;

    public isDisplayingCustomPeriodRange: boolean = false;
    private selectedCustomPeriodRange: CustomPeriodRange;

    private overallCompanyDuration: number;

    public selectedDropdownWidthSubPeriod: DropdownListItem;

    // colors
    public mainColorsPallete: TopRatedMainColorsPallete[] = [];
    public secondaryColorsPallete: TopRatedSecondaryColorsPallete[] = [];

    // charts
    public doughnutChartConfig: DoughnutChartConfig;

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
        private changeDetectorRef: ChangeDetectorRef,
        private dashboardTopRatedService: DashboardTopRatedService,
        private dashboardQuery: DashboardQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.getTopRatedListData();

        this.setChartsData();
    }

    private createForm(): void {
        this.topRatedForm = this.formBuilder.group({
            mainPeriod: [null],
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: DropdownItem): string =>
        item.name;

    public resetSelectedValues(): void {
        for (let i = 0; i < this.selectedTopRatedList.length; i++) {
            this.barChart.removeMultiBarData(
                this.selectedTopRatedList[i],
                true
            );
        }

        this.selectedTopRatedList = [];

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

            this.topRatedListBeforeSearch = [...this.topRatedList];

            const filteredTopRatedList = this.topRatedList.filter(
                (topRatedListItem) =>
                    !topRatedListItem.isSelected &&
                    topRatedListItem.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
            );

            if (!filteredTopRatedList.length) {
                this.isDisplayingPlaceholder = true;

                return;
            }

            this.topRatedList = this.topRatedList.splice(
                0,
                this.selectedTopRatedList.length
            );

            this.topRatedList = [...this.topRatedList, ...filteredTopRatedList];
        } else {
            this.topRatedList = this.topRatedListBeforeSearch;

            this.searchValue = null;
            this.clearSearchValue = false;

            this.isDisplayingPlaceholder = false;

            if (this.selectedTopRatedList.length) {
                this.setDoughnutChartData(this.selectedTopRatedList, true);
            } else {
                this.setDoughnutChartData(this.topRatedList);
            }
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

                    this.getTopRatedListData();

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

                this.getTopRatedListData();
            }
        }

        if (action === ConstantStringEnum.SUB_PERIOD_DROPDOWN) {
            if (this.selectedSubPeriod.name === dropdownListItem.name) return;

            this.selectedSubPeriod = dropdownListItem;

            if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
                this.getTopRatedListData(this.selectedCustomPeriodRange);
            } else {
                this.getTopRatedListData();
            }
        }
    }

    public handleSwitchTopRatedClick(topRatedDropdownItem: DropdownItem): void {
        if (topRatedDropdownItem.name === this.topRatedTitle) return;

        const topRatedTabsToDisplay = [
            {
                name: topRatedDropdownItem.tab1,
                checked: true,
            },
            {
                name: topRatedDropdownItem.tab2,
                checked: false,
            },
        ];

        this.topRatedTabs = topRatedTabsToDisplay;
        this.currentActiveTab = topRatedTabsToDisplay[0];

        this.topRatedTitle = topRatedDropdownItem.name;

        this.topRatedDropdownList.find(
            (topRatedDropdownItem) => topRatedDropdownItem.isActive
        ).isActive = false;

        topRatedDropdownItem.isActive = true;

        if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
            this.selectedMainPeriod =
                DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];

            this.setCustomSubPeriodList(this.overallCompanyDuration);
        }

        this.getTopRatedListData();
    }

    public handleSwitchTabClick(activeTab: DashboardTab): void {
        if (this.currentActiveTab.name === activeTab.name) {
            return;
        }

        this.currentActiveTab = activeTab;

        if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
            this.getTopRatedListData(this.selectedCustomPeriodRange);
        } else {
            this.getTopRatedListData();
        }
    }

    public handleShowMoreClick(): void {
        this.isShowingMore = !this.isShowingMore;

        if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
            this.getTopRatedListData(this.selectedCustomPeriodRange);
        } else {
            this.getTopRatedListData();
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

            this.getTopRatedListData(customPeriodRange);

            this.selectedDropdownWidthSubPeriod = this.selectedSubPeriod;
        }
    }

    public handleOutsideCustomPeriodRangeClick() {
        this.isDisplayingCustomPeriodRange = false;
    }

    public handleAddSelectedClick(
        topRatedListItem: TopRatedListItem,
        topRatedListItemIndex: number
    ): void {
        const maxTopRatedItemsSelected = 5;

        if (
            topRatedListItem.isSelected ||
            this.selectedTopRatedList.length === maxTopRatedItemsSelected
        )
            return;

        topRatedListItem.isSelected = true;

        this.selectedTopRatedList = [
            ...this.selectedTopRatedList,
            topRatedListItem,
        ];

        this.topRatedList.splice(topRatedListItemIndex, 1);
        this.topRatedList.splice(
            this.selectedTopRatedList.length - 1,
            0,
            topRatedListItem
        );

        this.topRatedListSelectedPercentage = +(
            100 / this.selectedTopRatedList.length
        ).toFixed(2);

        this.setDoughnutChartData(this.selectedTopRatedList, true);
        this.setBarChartData(this.selectedTopRatedList, topRatedListItemIndex);
    }

    public handleRemoveSelectedClick(
        event: Event,
        topRatedListItem: TopRatedListItem,
        topRatedListItemIndex: number
    ): void {
        event.stopPropagation();

        this.topRatedList.splice(topRatedListItemIndex, 1);
        this.topRatedList.splice(topRatedListItem.id - 1, 0, topRatedListItem);

        topRatedListItem.isSelected = false;

        this.topRatedList = DashboardArrayHelper.sorPartOfArray(
            this.topRatedList
        );

        this.selectedTopRatedList = this.selectedTopRatedList.filter(
            (topRatedItem) => topRatedItem.id !== topRatedListItem.id
        );

        this.topRatedListSelectedPercentage = +(
            100 / this.selectedTopRatedList.length
        ).toFixed(2);

        if (this.selectedTopRatedList.length) {
            this.setDoughnutChartData(this.selectedTopRatedList, true);
        } else {
            this.setDoughnutChartData(this.topRatedList);
        }

        this.setBarChartData(
            this.selectedTopRatedList,
            topRatedListItemIndex,
            true,
            topRatedListItem
        );
    }

    public handleHoverSelected(
        index: number,
        removeHover: boolean = false
    ): void {
        if (!removeHover) {
            this.doughnutChart.hoverDoughnut(
                index,
                ConstantChartStringEnum.NUMBER
            );
            this.barChart.hoverBarChart(this.selectedTopRatedList[index]);
        } else {
            this.doughnutChart.hoverDoughnut(null);
            this.barChart.hoverBarChart(null);
        }
    }

    private getConstantData(): void {
        this.topRatedList = [DashboardTopRatedConstants.TOP_RATED_LIST_ITEM];

        this.topRatedDropdownList = JSON.parse(
            JSON.stringify(DashboardTopRatedConstants.TOP_RATED_DROPDOWN_DATA)
        );

        this.topRatedTabs = DashboardTopRatedConstants.TOP_RATED_TABS;
        this.currentActiveTab = DashboardTopRatedConstants.TOP_RATED_TABS[0];

        this.mainPeriodDropdownList =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA;

        this.selectedMainPeriod =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];

        this.mainColorsPallete = DashboardColors.TOP_RATED_MAIN_COLORS_PALLETE;
        this.secondaryColorsPallete =
            DashboardColors.TOP_RATED_SECONDARY_COLORS_PALLETE;
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

    private getTopRatedListData(customPeriodRange?: CustomPeriodRange): void {
        const selectedTab = this.currentActiveTab
            .name as DashboardTopReportType;

        const selectedMainPeriod = DashboardUtils.ConvertMainPeriod(
            this.selectedMainPeriod.name
        ) as TimeInterval;

        const selectedSubPeriod = DashboardUtils.ConvertSubPeriod(
            this.selectedSubPeriod.name
        ) as SubintervalType;

        const topRatedArgumentsData: TopRatedApiArguments = [
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

        switch (this.topRatedTitle) {
            case ConstantStringEnum.DISPATCHER:
                this.getTopRatedDispatcherListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case ConstantStringEnum.DRIVER:
                this.getTopRatedDriverListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case ConstantStringEnum.TRUCK:
                this.getTopRatedTruckListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case ConstantStringEnum.BROKER:
                this.getTopRatedBrokerListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case ConstantStringEnum.SHIPPER:
                this.getTopRatedShipperListData(topRatedArgumentsData);
                break;
            case ConstantStringEnum.OWNER:
                this.getTopRatedOwnerListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case ConstantStringEnum.REPAIR_SHOP:
                this.getTopRatedRepairShopListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case ConstantStringEnum.FUEL_STOP:
                this.getTopRatedFuelStopListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            default:
                break;
        }
    }

    private getTopRatedDispatcherListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardTopRatedService
            .getTopRatedDispatcher(topRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((dispatcherData) => {
                // top rated list and single selection data
                this.topRatedList = dispatcherData.pagination.data.map(
                    (dispatcher) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < dispatcher.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.LOAD
                                    ? dispatcher.intervals[i]
                                          .dispatcherLoadCount
                                    : dispatcher.intervals[i].dispatcherRevenue,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.LOAD
                                    ? dispatcher.intervals[i]
                                          .dispatcherLoadPercentage
                                    : dispatcher.intervals[i]
                                          .dispatcherRevenuePercentage,
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
                            id: dispatcher.id,
                            name: dispatcher.name,
                            value:
                                selectedTab === ConstantStringEnum.LOAD
                                    ? dispatcher.loadsCount.toString()
                                    : dispatcher.revenue.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.LOAD
                                    ? dispatcher.loadPercentage.toString()
                                    : dispatcher.revenuePercentage.toString(),
                            isSelected: false,
                        };
                    }
                );

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = dispatcherData.pagination.count;

                // intervals

                for (let i = 0; i < dispatcherData.topDispatchers.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? dispatcherData.topDispatchers[i]
                                  .dispatcherLoadCount
                            : dispatcherData.topDispatchers[i]
                                  .dispatcherRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.LOAD
                                ? dispatcherData.topDispatchers[i]
                                      .dispatcherLoadPercentage
                                : dispatcherData.topDispatchers[i]
                                      .dispatcherRevenuePercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? dispatcherData.allOthers[i].dispatcherLoadCount
                            : dispatcherData.allOthers[i].dispatcherRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.LOAD
                                ? dispatcherData.allOthers[i]
                                      .dispatcherLoadPercentage
                                : dispatcherData.allOthers[i]
                                      .dispatcherRevenuePercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    dispatcherData.intervalLabels[0].tooltipLabel,
                    dispatcherData.intervalLabels[
                        dispatcherData.topDispatchers.length - 1
                    ].tooltipLabel
                );
                this.setBarChartLabels(dispatcherData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedDriverListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardTopRatedService
            .getTopRatedDriver(topRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((driverData) => {
                // top rated list and single selection data
                this.topRatedList = driverData.pagination.data.map((driver) => {
                    let filteredIntervalValues: number[] = [];
                    let filteredIntervalPercentages: number[] = [];

                    for (let i = 0; i < driver.intervals.length; i++) {
                        filteredIntervalValues = [
                            ...filteredIntervalValues,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? driver.intervals[i].driverMileage
                                : driver.intervals[i].driverRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? driver.intervals[i].driverMileagePercentage
                                : driver.intervals[i].driverRevenuePercentage,
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
                        id: driver.id,
                        name: driver.name,
                        value:
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? driver.mileage.toString()
                                : driver.revenue.toString(),
                        percent:
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? driver.mileagePercentage.toString()
                                : driver.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = driverData.pagination.count;

                // intervals

                for (let i = 0; i < driverData.topDrivers.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.MILEAGE
                            ? driverData.topDrivers[i].driverMileage
                            : driverData.topDrivers[i].driverRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? driverData.topDrivers[i]
                                      .driverMileagePercentage
                                : driverData.topDrivers[i]
                                      .driverRevenuePercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.MILEAGE
                            ? driverData.allOthers[i].driverMileage
                            : driverData.allOthers[i].driverRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? driverData.allOthers[i]
                                      .driverMileagePercentage
                                : driverData.allOthers[i]
                                      .driverRevenuePercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    driverData.intervalLabels[0].tooltipLabel,
                    driverData.intervalLabels[
                        driverData.intervalLabels.length - 1
                    ].tooltipLabel
                );
                this.setBarChartLabels(driverData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedTruckListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardTopRatedService
            .getTopRatedTruck(topRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((truckData) => {
                // top rated list and single selection data
                this.topRatedList = truckData.pagination.data.map((truck) => {
                    let filteredIntervalValues: number[] = [];
                    let filteredIntervalPercentages: number[] = [];

                    for (let i = 0; i < truck.intervals.length; i++) {
                        filteredIntervalValues = [
                            ...filteredIntervalValues,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? truck.intervals[i].truckMileage
                                : truck.intervals[i].truckRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? truck.intervals[i].truckMileagePercentage
                                : truck.intervals[i].truckRevenuePercentage,
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
                        id: truck.id,
                        name: truck.number,
                        value:
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? truck.mileage.toString()
                                : truck.revenue.toString(),
                        percent:
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? truck.mileagePercentage.toString()
                                : truck.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = truckData.pagination.count;

                // intervals

                for (let i = 0; i < truckData.topTrucks.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.MILEAGE
                            ? truckData.topTrucks[i].truckMileage
                            : truckData.topTrucks[i].truckRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? truckData.topTrucks[i].truckMileagePercentage
                                : truckData.topTrucks[i].truckRevenuePercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.MILEAGE
                            ? truckData.allOthers[i].truckMileage
                            : truckData.allOthers[i].truckRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.MILEAGE
                                ? truckData.allOthers[i].truckMileagePercentage
                                : truckData.allOthers[i].truckRevenuePercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    truckData.intervalLabels[0].tooltipLabel,
                    truckData.intervalLabels[truckData.topTrucks.length - 1]
                        .tooltipLabel
                );
                this.setBarChartLabels(truckData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedBrokerListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardTopRatedService
            .getTopRatedBroker(topRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((brokerData) => {
                // top rated list and single selection data
                this.topRatedList = brokerData.pagination.data.map((broker) => {
                    let filteredIntervalValues: number[] = [];
                    let filteredIntervalPercentages: number[] = [];

                    for (let i = 0; i < broker.intervals.length; i++) {
                        filteredIntervalValues = [
                            ...filteredIntervalValues,
                            selectedTab === ConstantStringEnum.LOAD
                                ? broker.intervals[i].brokerLoadCount
                                : broker.intervals[i].brokerRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === ConstantStringEnum.LOAD
                                ? broker.intervals[i].brokerLoadPercentage
                                : broker.intervals[i].brokerRevenuePercentage,
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
                        id: broker.id,
                        name: broker.name,
                        value:
                            selectedTab === ConstantStringEnum.LOAD
                                ? broker.loadsCount.toString()
                                : broker.revenue.toString(),
                        percent:
                            selectedTab === ConstantStringEnum.LOAD
                                ? broker.loadPercentage.toString()
                                : broker.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = brokerData.pagination.count;

                // intervals

                for (let i = 0; i < brokerData.topBrokers.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? brokerData.topBrokers[i].brokerLoadCount
                            : brokerData.topBrokers[i].brokerRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.LOAD
                                ? brokerData.topBrokers[i].brokerLoadPercentage
                                : brokerData.topBrokers[i]
                                      .brokerRevenuePercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? brokerData.allOthers[i].brokerLoadCount
                            : brokerData.allOthers[i].brokerRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.LOAD
                                ? brokerData.allOthers[i].brokerLoadPercentage
                                : brokerData.allOthers[i]
                                      .brokerRevenuePercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    brokerData.intervalLabels[0].tooltipLabel,
                    brokerData.intervalLabels[brokerData.topBrokers.length - 1]
                        .tooltipLabel
                );
                this.setBarChartLabels(brokerData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedShipperListData(
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        const filteredTopRatedArgumentsData = topRatedArgumentsData.splice(
            1
        ) as TopRatedWithoutTabApiArguments;

        this.dashboardTopRatedService
            .getTopRatedShipper(filteredTopRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((shipperData) => {
                // top rated list and single selection data
                this.topRatedList = shipperData.pagination.data.map(
                    (shipper) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < shipper.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                shipper.intervals[i].shipperLoadCount,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                shipper.intervals[i].shipperLoadPercentage,
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
                            id: shipper.id,
                            name: shipper.name,
                            value: shipper.loadsCount.toString(),
                            percent: shipper.loadPercentage.toString(),
                            isSelected: false,
                        };
                    }
                );

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = shipperData.pagination.count;

                // intervals

                for (let i = 0; i < shipperData.topShippers.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        shipperData.topShippers[i].shipperLoadCount,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            shipperData.topShippers[i].shipperLoadPercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        shipperData.allOthers[i].shipperLoadCount,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            shipperData.allOthers[i].shipperLoadPercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    shipperData.intervalLabels[0].tooltipLabel,
                    shipperData.intervalLabels[
                        shipperData.topShippers.length - 1
                    ].tooltipLabel
                );
                this.setBarChartLabels(shipperData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedOwnerListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardTopRatedService
            .getTopRatedOwner(topRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((ownerData) => {
                // top rated list and single selection data
                this.topRatedList = ownerData.pagination.data.map((owner) => {
                    let filteredIntervalValues: number[] = [];
                    let filteredIntervalPercentages: number[] = [];

                    for (let i = 0; i < owner.intervals.length; i++) {
                        filteredIntervalValues = [
                            ...filteredIntervalValues,
                            selectedTab === ConstantStringEnum.LOAD
                                ? owner.intervals[i].ownerLoadCount
                                : owner.intervals[i].ownerRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === ConstantStringEnum.LOAD
                                ? owner.intervals[i].ownerLoadPercentage
                                : owner.intervals[i].ownerRevenuePercentage,
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
                        id: owner.id,
                        name: owner.name,
                        value:
                            selectedTab === ConstantStringEnum.LOAD
                                ? owner.loadCount.toString()
                                : owner.revenue.toString(),
                        percent:
                            selectedTab === ConstantStringEnum.LOAD
                                ? owner.loadPercentage.toString()
                                : owner.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = ownerData.pagination.count;

                // intervals

                for (let i = 0; i < ownerData.topOwners.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? ownerData.topOwners[i].ownerLoadCount
                            : ownerData.topOwners[i].ownerRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.LOAD
                                ? ownerData.topOwners[i].ownerLoadPercentage
                                : ownerData.topOwners[i].ownerRevenuePercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? ownerData.allOthers[i].ownerLoadCount
                            : ownerData.allOthers[i].ownerRevenue,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.LOAD
                                ? ownerData.allOthers[i].ownerLoadPercentage
                                : ownerData.allOthers[i].ownerRevenuePercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    ownerData.intervalLabels[0].tooltipLabel,
                    ownerData.intervalLabels[ownerData.topOwners.length - 1]
                        .tooltipLabel
                );
                this.setBarChartLabels(ownerData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedRepairShopListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardTopRatedService
            .getTopRatedRepairShop(topRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((repairShopData) => {
                // top rated list and single selection data
                this.topRatedList = repairShopData.pagination.data.map(
                    (repairShop) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < repairShop.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.VISIT
                                    ? repairShop.intervals[i].count
                                    : repairShop.intervals[i].cost,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.VISIT
                                    ? repairShop.intervals[i].countPercentage
                                    : repairShop.intervals[i].costPercentage,
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
                            id: repairShop.id,
                            name: repairShop.name,
                            value:
                                selectedTab === ConstantStringEnum.VISIT
                                    ? repairShop.visit.toString()
                                    : repairShop.cost.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.VISIT
                                    ? repairShop.visitPercentage.toString()
                                    : repairShop.costPercentage.toString(),
                            isSelected: false,
                        };
                    }
                );

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = repairShopData.pagination.count;

                // intervals

                for (let i = 0; i < repairShopData.topRepairShops.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? repairShopData.topRepairShops[i].count
                            : repairShopData.topRepairShops[i].cost,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.VISIT
                                ? repairShopData.topRepairShops[i]
                                      .countPercentage
                                : repairShopData.topRepairShops[i]
                                      .costPercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? repairShopData.allOther[i].count
                            : repairShopData.allOther[i].cost,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.VISIT
                                ? repairShopData.allOther[i].countPercentage
                                : repairShopData.allOther[i].costPercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    repairShopData.intervalLabels[0].tooltipLabel,
                    repairShopData.intervalLabels[
                        repairShopData.topRepairShops.length - 1
                    ].tooltipLabel
                );
                this.setBarChartLabels(repairShopData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedFuelStopListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardTopRatedService
            .getTopRatedFuelStop(topRatedArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((fuelStopData) => {
                // top rated list and single selection data
                this.topRatedList = fuelStopData.pagination.data.map(
                    (fuelStop) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < fuelStop.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === ConstantStringEnum.VISIT
                                    ? fuelStop.intervals[i].visitCount
                                    : fuelStop.intervals[i].cost,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === ConstantStringEnum.VISIT
                                    ? fuelStop.intervals[i].visitPercentage
                                    : fuelStop.intervals[i].costPercentage,
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
                            id: fuelStop.id,
                            name: fuelStop.name,
                            value:
                                selectedTab === ConstantStringEnum.VISIT
                                    ? fuelStop.visitCount.toString()
                                    : fuelStop.cost.toString(),
                            percent:
                                selectedTab === ConstantStringEnum.VISIT
                                    ? fuelStop.visitPercentage.toString()
                                    : fuelStop.costPercentage.toString(),
                            isSelected: false,
                        };
                    }
                );

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = fuelStopData.pagination.count;

                // intervals

                for (let i = 0; i < fuelStopData.topFuelStops.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? fuelStopData.topFuelStops[i].visitCount
                            : fuelStopData.topFuelStops[i].cost,
                    ];

                    this.barChartValues.defaultBarPercentages.topRatedBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .topRatedBarPercentage,
                            selectedTab === ConstantStringEnum.VISIT
                                ? fuelStopData.topFuelStops[i].visitPercentage
                                : fuelStopData.topFuelStops[i].costPercentage,
                        ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? fuelStopData.allOthers[i].visitCount
                            : fuelStopData.allOthers[i].cost,
                    ];

                    this.barChartValues.defaultBarPercentages.otherBarPercentage =
                        [
                            ...this.barChartValues.defaultBarPercentages
                                .otherBarPercentage,
                            selectedTab === ConstantStringEnum.VISIT
                                ? fuelStopData.allOthers[i].visitPercentage
                                : fuelStopData.allOthers[i].costPercentage,
                        ];
                }

                this.setBarChartDateTitle(
                    fuelStopData.intervalLabels[0].tooltipLabel,
                    fuelStopData.intervalLabels[
                        fuelStopData.topFuelStops.length - 1
                    ].tooltipLabel
                );
                this.setBarChartLabels(fuelStopData.intervalLabels);

                this.setChartsData();
            });
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardUtils.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;

        this.selectedDropdownWidthSubPeriod = selectedSubPeriod;
    }

    private setDoughnutChartCenterStats(
        isTopRatedListItemSelected: boolean,
        topRatedList: TopRatedListItem[],
        topTenValue: number,
        otherValue?: number,
        topTenPercentage?: number,
        otherPercentage?: number
    ): ChartInitProperties[] {
        let chartCenterStats: ChartInitProperties[] = [];

        if (isTopRatedListItemSelected) {
            const topTenCenterStatsName =
                this.selectedTopRatedList.length === 1
                    ? topRatedList[0].name
                    : topRatedList.length + ConstantChartStringEnum.SELECTED;

            const { filteredTopTenValue } = this.setDoughnutChartValueSigns(
                isTopRatedListItemSelected,
                topTenValue
            );

            chartCenterStats = [
                {
                    value: filteredTopTenValue,
                    name: topTenCenterStatsName,
                },
            ];
        } else {
            const topTenCenterStatsName =
                topRatedList.length <= 10
                    ? ConstantChartStringEnum.TOP_3
                    : topRatedList.length > 10 && topRatedList.length <= 30
                    ? ConstantChartStringEnum.TOP_5
                    : ConstantChartStringEnum.TOP_10;

            topTenPercentage = +topTenPercentage.toFixed(2);
            otherPercentage = +otherPercentage.toFixed(2);

            topTenValue = +topTenValue.toFixed(2);
            otherValue = +otherValue.toFixed(2);

            const {
                filteredTopTenValue,
                filteredTopTenPercentage,
                filteredOtherPercentage,
                filteredOtherValue,
            } = this.setDoughnutChartValueSigns(
                isTopRatedListItemSelected,
                topTenValue,
                topTenPercentage,
                otherPercentage,
                otherValue
            );

            chartCenterStats = [
                {
                    percent: filteredTopTenPercentage,
                    value: filteredTopTenValue,
                    name: topTenCenterStatsName,
                },
                {
                    percent: filteredOtherPercentage,
                    value: filteredOtherValue,
                    name: ConstantChartStringEnum.ALL_OTHERS,
                },
            ];
        }

        return chartCenterStats;
    }

    private setDoughnutChartValueSigns(
        isTopRatedListItemSelected: boolean,
        topTenValue: number,
        topTenPercentage?: number,
        otherPercentage?: number,
        otherValue?: number
    ): DoughnutChartSigns {
        const filteredTopTenPercentage =
            topTenPercentage + ConstantChartStringEnum.PERCENTAGE_SIGN;
        const filteredOtherPercentage =
            otherPercentage + ConstantChartStringEnum.PERCENTAGE_SIGN;

        if (isTopRatedListItemSelected) {
            switch (this.topRatedTitle) {
                case ConstantStringEnum.DRIVER:
                case ConstantStringEnum.TRUCK:
                    return {
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                            ConstantStringEnum.MILEAGE
                                ? topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue,
                    };
                case ConstantStringEnum.REPAIR_SHOP:
                case ConstantStringEnum.BROKER:
                case ConstantStringEnum.OWNER:
                case ConstantStringEnum.REPAIR_SHOP:
                case ConstantStringEnum.FUEL_STOP:
                    return {
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                                ConstantStringEnum.LOAD ||
                            this.currentActiveTab.name ===
                                ConstantStringEnum.VISIT
                                ? topTenValue.toString()
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue,
                    };
                default:
                    return {
                        filteredTopTenValue: topTenValue.toString(),
                    };
            }
        } else {
            switch (this.topRatedTitle) {
                case ConstantStringEnum.DRIVER:
                case ConstantStringEnum.TRUCK:
                    return {
                        filteredTopTenPercentage,
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                            ConstantStringEnum.MILEAGE
                                ? topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue,
                        filteredOtherPercentage,
                        filteredOtherValue: ConstantStringEnum.MILEAGE
                            ? otherValue + ConstantChartStringEnum.THOUSAND_SIGN
                            : ConstantChartStringEnum.DOLLAR_SIGN + otherValue,
                    };
                case ConstantStringEnum.DISPATCHER:
                case ConstantStringEnum.BROKER:
                case ConstantStringEnum.OWNER:
                case ConstantStringEnum.REPAIR_SHOP:
                case ConstantStringEnum.FUEL_STOP:
                    return {
                        filteredTopTenPercentage,
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                                ConstantStringEnum.LOAD ||
                            this.currentActiveTab.name ===
                                ConstantStringEnum.VISIT
                                ? topTenValue.toString()
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue,
                        filteredOtherPercentage,
                        filteredOtherValue:
                            this.currentActiveTab.name ===
                                ConstantStringEnum.VISIT ||
                            this.currentActiveTab.name ===
                                ConstantStringEnum.LOAD
                                ? otherValue.toString()
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  otherValue,
                    };
                default:
                    return {
                        filteredTopTenPercentage,
                        filteredTopTenValue: topTenValue.toString(),
                        filteredOtherPercentage,
                        filteredOtherValue: otherValue.toString(),
                    };
            }
        }
    }

    private setDoughnutChartValueAndColor(
        dataValues: number[],
        dataColors: string[],
        topRatedList: TopRatedListItem[]
    ): TopRatedListItem[] {
        let filteredTopRatedList: TopRatedListItem[] = [];

        if (this.topRatedList.length <= 10) {
            dataValues.splice(3, 7);
            dataColors.splice(3, 7);

            filteredTopRatedList = topRatedList.filter(
                (_, index) => index <= 2
            );
        }

        if (topRatedList.length > 10 && topRatedList.length <= 30) {
            dataValues.splice(5);
            dataColors.splice(5, 5);

            filteredTopRatedList = topRatedList.filter(
                (_, index) => index <= 4
            );
        }

        if (topRatedList.length >= 30) {
            dataValues.splice(10);

            filteredTopRatedList = topRatedList.filter(
                (_, index) => index <= 9
            );
        }

        return filteredTopRatedList;
    }

    private setDoughnutChartPercentage(
        topRatedList: TopRatedListItem[],
        isTopRatedListItemSelected: boolean
    ): DoughnutChartPercentage {
        let topTenPercentage = 0;
        let otherPercentage = 0;

        let topTenValue = 0;
        let otherValue = 0;

        const filterdDataValues = topRatedList.map((topRatedItem, index) => {
            if (!isTopRatedListItemSelected) {
                if (this.topRatedList.length <= 10) {
                    if (index <= 2) {
                        topTenPercentage += +topRatedItem.percent;
                        topTenValue += +topRatedItem.value;
                    } else {
                        otherPercentage += +topRatedItem.percent;
                        otherValue += +topRatedItem.value;
                    }
                }

                if (topRatedList.length > 10 && topRatedList.length <= 30) {
                    if (index <= 4) {
                        topTenPercentage += +topRatedItem.percent;
                        topTenValue += +topRatedItem.value;
                    } else {
                        otherPercentage += +topRatedItem.percent;
                        otherValue += +topRatedItem.value;
                    }
                }

                if (topRatedList.length >= 30) {
                    if (index <= 9) {
                        topTenPercentage += +topRatedItem.percent;
                        topTenValue += +topRatedItem.value;
                    } else {
                        otherPercentage += +topRatedItem.percent;
                        otherValue += +topRatedItem.value;
                    }
                }
            } else {
                topTenValue += +topRatedItem.value;
            }

            return +topRatedItem.percent;
        });

        return {
            filterdDataValues,
            topTenPercentage,
            topTenValue,
            otherPercentage,
            otherValue,
        };
    }

    private setDoughnutChartFilteredList(
        topRatedList: TopRatedListItem[]
    ): TopRatedListItem[] {
        return topRatedList.map((topRatedListItem) => {
            return {
                ...topRatedListItem,
                value:
                    (this.topRatedTitle === ConstantStringEnum.DRIVER &&
                        this.currentActiveTab.name ===
                            ConstantStringEnum.MILEAGE) ||
                    (this.topRatedTitle === ConstantStringEnum.TRUCK &&
                        this.currentActiveTab.name ===
                            ConstantStringEnum.MILEAGE)
                        ? topRatedListItem.value +
                          ConstantChartStringEnum.THOUSAND_SIGN
                        : (this.topRatedTitle === ConstantStringEnum.TRUCK &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.REVENUE) ||
                          (this.topRatedTitle ===
                              ConstantStringEnum.DISPATCHER &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.REVENUE) ||
                          (this.topRatedTitle === ConstantStringEnum.BROKER &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.REVENUE) ||
                          (this.topRatedTitle ===
                              ConstantStringEnum.REPAIR_SHOP &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.COST) ||
                          (this.topRatedTitle === ConstantStringEnum.OWNER &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.REVENUE) ||
                          (this.topRatedTitle ===
                              ConstantStringEnum.FUEL_STOP &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.COST)
                        ? ConstantChartStringEnum.DOLLAR_SIGN +
                          topRatedListItem.value
                        : topRatedListItem.value,
                percent:
                    topRatedListItem.percent +
                    ConstantChartStringEnum.PERCENTAGE_SIGN,
            };
        });
    }

    private setDoughnutChartConfig(
        dataValues: number[],
        dataColors: string[],
        chartCenterStats: ChartInitProperties[],
        topRatedList: TopRatedListItem[]
    ): void {
        this.doughnutChartConfig = {
            dataProperties: [
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.DOUGHNUT,
                        data: dataValues,
                        backgroundColor: dataColors,
                        borderColor: ConstantChartStringEnum.CHART_COLOR_WHITE,
                        hoverBackgroundColor: [
                            ConstantChartStringEnum.CHART_COLOR_WHITE,
                        ],
                        hoverBorderColor:
                            ConstantChartStringEnum.CHART_COLOR_WHITE,
                    },
                },
            ],
            chartInnitProperties: chartCenterStats,
            showLegend: true,
            chartValues: [2, 2],
            defaultType: ConstantChartStringEnum.DOUGHNUT,
            type: ConstantChartStringEnum.DOUGHNUT,
            chartWidth: ConstantChartStringEnum.DOUGHNUT_1800_DIMENSION,
            chartHeight: ConstantChartStringEnum.DOUGHNUT_1800_DIMENSION,
            removeChartMargin: true,
            dataLabels: [],
            driversList: topRatedList,
            allowAnimation: true,
            noChartImage: ConstantChartStringEnum.NO_CHART_IMG,
            dontUseResponsive: true,
        };

        if (this.doughnutChart) {
            this.doughnutChart.chartInnitProperties = chartCenterStats;
            this.doughnutChart.chartUpdated(dataValues);
        }
    }

    private setDoughnutChartData(
        topRatedList: TopRatedListItem[],
        isTopRatedListItemSelected?: boolean
    ): void {
        let dataValues: number[] = [];
        let dataColors: string[] = this.mainColorsPallete.map(
            (color) => color.code
        );

        let chartCenterStats: ChartInitProperties[] = [];

        const {
            filterdDataValues,
            topTenPercentage,
            topTenValue,
            otherPercentage,
            otherValue,
        } = this.setDoughnutChartPercentage(
            topRatedList,
            isTopRatedListItemSelected
        );

        dataValues = [...filterdDataValues];

        if (isTopRatedListItemSelected) {
            chartCenterStats = this.setDoughnutChartCenterStats(
                isTopRatedListItemSelected,
                topRatedList,
                topTenValue
            );
        } else {
            chartCenterStats = this.setDoughnutChartCenterStats(
                isTopRatedListItemSelected,
                topRatedList,
                topTenValue,
                otherValue,
                topTenPercentage,
                otherPercentage
            );

            topRatedList = this.setDoughnutChartValueAndColor(
                dataValues,
                dataColors,
                topRatedList
            );

            dataValues = [...dataValues, otherPercentage];
        }

        topRatedList = this.setDoughnutChartFilteredList(topRatedList);

        this.setDoughnutChartConfig(
            dataValues,
            dataColors,
            chartCenterStats,
            topRatedList
        );
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
                            this.topRatedList.length <= 10
                                ? ConstantChartStringEnum.BAR_LABEL_TOP_3
                                : this.topRatedList.length > 10 &&
                                  this.topRatedList.length <= 30
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
        const barChartMaxValue = +this.topRatedList[0]?.value;

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
        topRatedList: TopRatedListItem[],
        topRatedListItemIndex: number,
        isRemoving?: boolean,
        topRatedListItem?: TopRatedListItem
    ): void {
        if (!isRemoving) {
            const chartValues =
                this.barChartValues.selectedBarValues[topRatedListItemIndex];
            const chartPercentages =
                this.barChartValues.selectedBarPercentages[
                    topRatedListItemIndex
                ];

            let selectedColors: string[] = [];
            let selectedHoverColors: string[] = [];

            for (let i = 0; i < topRatedList.length; i++) {
                selectedColors = [
                    ...selectedColors,
                    this.secondaryColorsPallete[i].code,
                ];
                selectedHoverColors = [
                    ...selectedHoverColors,
                    this.mainColorsPallete[i].code,
                ];
            }

            if (this.barChart) {
                this.barChart.updateMuiliBar(
                    topRatedList,
                    chartValues,
                    chartPercentages,
                    selectedColors,
                    selectedHoverColors
                );
            }
        } else {
            const displayChartDefaultValue =
                this.selectedTopRatedList.length === 0;

            this.barChart.removeMultiBarData(
                topRatedListItem,
                displayChartDefaultValue
            );
        }
    }

    private setChartsData(): void {
        this.setDoughnutChartData(this.topRatedList);
        this.setBarChartConfigAndAxes(this.barChartValues);

        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
