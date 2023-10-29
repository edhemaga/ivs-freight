import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// bootstrap
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// moment
import moment from 'moment';

// services
import { DashboardService } from '../state/services/dashboard.service';

// constants
import { DashboardTopRatedConstants } from '../state/utils/dashboard-top-rated.constants';
import { DashboardColors } from '../state/utils/dashboard-colors.constants';

// helpers
import { DashboardArrayHelper } from '../state/utils/dashboard-array-helper';
import { DashboardUtils } from '../state/utils/dashboard-utils';

// enum
import { ConstantStringEnum } from '../state/enum/constant-string.enum';
import { ConstantChartStringEnum } from '../state/enum/constant-chart-string.enum';

// models
import { TopRatedDropdownItem } from '../state/models/top-rated-dropdown-item.model';
import { TopRatedTab } from '../state/models/top-rated-tab.model';
import { DropdownListItem } from '../state/models/dropdown-list-item.model';
import { TopRatedListItem } from '../state/models/top-rated-list-item.model';
import {
    MainColorsPallete,
    SecondaryColorsPallete,
} from '../state/models/colors-pallete.model';
import {
    ChartInitProperties,
    DoughnutChart,
    DoughnutChartConfig,
    DoughnutChartPercentage,
    DoughnutChartSigns,
} from '../state/models/doughnut-chart.model';
import {
    BarChart,
    BarChartAxes,
    BarChartConfig,
    BarChartValues,
} from '../state/models/bar-chart.model';
import {
    DashboardTopReportType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';
import { CustomPeriodRange } from '../state/models/custom-period-range.model';

@Component({
    selector: 'app-dashboard-top-rated',
    templateUrl: './dashboard-top-rated.component.html',
    styleUrls: ['./dashboard-top-rated.component.scss'],
})
export class DashboardTopRatedComponent implements OnInit, OnDestroy {
    @ViewChild('popover') public popover: NgbPopover;
    @ViewChild('doughnutChart') public doughnutChart: DoughnutChart;
    @ViewChild('barChart') public barChart: BarChart;

    private destroy$: Subject<void> = new Subject<void>();

    public topRatedForm: UntypedFormGroup;
    public topRatedTitle: string = ConstantStringEnum.DRIVER;

    // list
    public topRatedList: TopRatedListItem[] = [
        {
            id: 1,
            name: 'Denis Rodman',
            value: '152324.5',
            percent: '8.53',
            isSelected: false,
        },
        {
            id: 2,
            name: 'Sasa Djordjevic',
            value: '148456.5',
            percent: '8.43',
            isSelected: false,
        },
        {
            id: 3,
            name: 'Nicolas Drozlibrew',
            value: '125654.3',
            percent: '7.35',
            isSelected: false,
        },
        {
            id: 4,
            name: 'Samuel Lioton',
            value: '114489.8',
            percent: '7.23',
            isSelected: false,
        },
        {
            id: 5,
            name: 'Angelo Trotter',
            value: '95561.4',
            percent: '6.87',
            isSelected: false,
        },
        {
            id: 6,
            name: 'Stan Tolbert',
            value: '84156.6',
            percent: '4.07',
            isSelected: false,
        },
        {
            id: 7,
            name: 'Michael Scott',
            value: '65156.2',
            percent: '3.52',
            isSelected: false,
        },
        {
            id: 8,
            name: 'Toby Flanders',
            value: '42158.8',
            percent: '3.43',
            isSelected: false,
        },
        {
            id: 9,
            name: 'Sasuke Uchica',
            value: '35891.6',
            percent: '2.96',
            isSelected: false,
        },
        {
            id: 10,
            name: 'Peter Simpson',
            value: '18185.5',
            percent: '2.12',
            isSelected: false,
        },
    ];
    public selectedTopRatedList: TopRatedListItem[] = [];
    public topRatedListSelectedPercentage: number = 100;

    // show more
    public topRatedListSliceEnd: number = 10;
    public isShowingMore: boolean = false;

    // tabs
    public topRatedTabs: TopRatedTab[] = [];
    private currentActiveTab: TopRatedTab;

    // dropdowns
    public topRatedDropdownList: TopRatedDropdownItem[] = [];

    public mainPeriodDropdownList: DropdownListItem[] = [];
    public subPeriodDropdownList: DropdownListItem[] = [];

    public selectedMainPeriod: DropdownListItem;
    public selectedSubPeriod: DropdownListItem;

    public isDisplayingCustomPeriodRange: boolean = false;

    // colors
    public mainColorsPallete: MainColorsPallete[] = [];
    private secondaryColorsPallete: SecondaryColorsPallete[] = [];

    // charts
    public doughnutChartConfig: DoughnutChartConfig;
    public barChartConfig: BarChartConfig;
    public barChartAxes: BarChartAxes;
    private barChartLabels: string[] = [];
    private barChartValues: BarChartValues = {
        defaultBarValues: {
            topRatedBarValues: [],
            otherBarValues: [],
        },
        selectedBarValues: [],
    };

    constructor(
        private formBuilder: UntypedFormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.setDoughnutChartData(this.topRatedList);

        this.setBarChartConfigAndAxes();
    }

    private createForm(): void {
        this.topRatedForm = this.formBuilder.group({
            mainPeriod: [null],
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: TopRatedDropdownItem): string =>
        item.name;

    private getConstantData(): void {
        this.topRatedDropdownList =
            DashboardTopRatedConstants.TOP_RATED_DROPDOWN_DATA;
        this.topRatedTabs = DashboardTopRatedConstants.TOP_RATED_TABS;

        this.mainPeriodDropdownList =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA;
        this.subPeriodDropdownList =
            DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA;

        this.selectedMainPeriod =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];
        this.selectedSubPeriod =
            DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA[8];

        this.mainColorsPallete = DashboardColors.MAIN_COLORS_PALLETE;
        this.secondaryColorsPallete = DashboardColors.SECONDARY_COLORS_PALLETE;
    }

    public handleSearchValue(searchValue: string): void {
        console.log(searchValue);
    }

    public handleInputSelect(
        dropdownListItem: DropdownListItem,
        action: string
    ): void {
        if (action === ConstantStringEnum.MAIN_PERIOD_DROPDOWN) {
            if (this.isDisplayingCustomPeriodRange) {
                this.isDisplayingCustomPeriodRange = false;
            }

            this.selectedMainPeriod = dropdownListItem;

            let matchingIdList: number[];

            switch (dropdownListItem.name) {
                case ConstantStringEnum.TODAY:
                    matchingIdList = [1, 2, 3];

                    break;
                case ConstantStringEnum.WEEK_TO_DATE:
                    matchingIdList = [3, 4, 5];

                    break;
                case ConstantStringEnum.MONTH_TO_DATE:
                    matchingIdList = [5, 6, 7];

                    break;
                case ConstantStringEnum.QUARTAL_TO_DATE:
                    matchingIdList = [5, 6, 8];

                    break;
                case ConstantStringEnum.YEAR_TO_DATE:
                    matchingIdList = [6, 8, 9];

                    break;
                case ConstantStringEnum.ALL_TIME:
                    break;
                case ConstantStringEnum.CUSTOM:
                    this.isDisplayingCustomPeriodRange = true;

                    break;
                default:
                    break;
            }

            if (
                dropdownListItem.name !== ConstantStringEnum.ALL_TIME &&
                dropdownListItem.name !== ConstantStringEnum.CUSTOM
            ) {
                this.setSubPeriodList(matchingIdList);
                this.getTopRatedListData();
            }
        }

        if (action === ConstantStringEnum.SUB_PERIOD_DROPDOWN) {
            this.selectedSubPeriod = dropdownListItem;

            this.getTopRatedListData();
        }
    }

    public handleSwitchTopRatedClick(
        topRatedDropdownItem: TopRatedDropdownItem
    ): void {
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

        this.getTopRatedListData();

        this.popover.close();
    }

    public handleSwitchTabClick(activeTab: TopRatedTab): void {
        if (this.currentActiveTab?.name === activeTab.name) {
            return;
        }

        this.currentActiveTab = activeTab;

        this.getTopRatedListData();
    }

    public handleShowMoreClick(): void {
        if (!this.isShowingMore) {
            this.isShowingMore = true;

            this.topRatedListSliceEnd = this.topRatedList.length;

            return;
        }

        if (this.isShowingMore) {
            this.isShowingMore = false;

            this.topRatedListSliceEnd = 10;

            return;
        }
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

        this.isDisplayingCustomPeriodRange = false;

        this.setCustomSubPeriodList(selectedDaysRange);
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
        ) {
            return;
        }

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

    private getTopRatedListData(): void {
        const selectedTab: DashboardTopReportType = this.currentActiveTab
            .name as DashboardTopReportType;

        const selectedMainPeriod: TimeInterval =
            DashboardUtils.ConvertMainPeriod(
                this.selectedMainPeriod.name
            ) as TimeInterval;

        const selectedSubPeriod: SubintervalType =
            DashboardUtils.ConvertSubPeriod(
                this.selectedSubPeriod.name
            ) as SubintervalType;

        this.barChartValues = {
            defaultBarValues: {
                topRatedBarValues: [],
                otherBarValues: [],
            },
            selectedBarValues: [],
        };

        console.log('selectedTab', selectedTab);
        console.log('selectedMainPeriod', selectedMainPeriod);
        console.log('selectedSubPeriod', selectedSubPeriod);

        switch (this.topRatedTitle) {
            case ConstantStringEnum.BROKER:
                this.getTopRatedBrokerListData(
                    selectedTab,
                    selectedMainPeriod,
                    selectedSubPeriod
                );

                break;
            case ConstantStringEnum.SHIPPER:
                /*   this.dashboardService
                    .getTopRatedShipper(
                        ...topRatedArgumentsData
                    )
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((shipperData) => {
                        console.log('shipperData', shipperData);
                    }); */
                break;
            case ConstantStringEnum.REPAIR_SHOP:
                this.getTopRatedRepairShopListData(
                    selectedTab,
                    selectedMainPeriod,
                    selectedSubPeriod
                );

                break;
            default:
                break;
        }
    }

    private getTopRatedBrokerListData(
        selectedTab: DashboardTopReportType,
        selectedMainPeriod: TimeInterval,
        selectedSubPeriod: SubintervalType
    ): void {
        const topRatedArgumentsData = [
            selectedTab,
            null,
            null,
            null,
            selectedMainPeriod,
            null,
            null,
            selectedSubPeriod,
        ] as const;

        this.dashboardService
            .getTopRatedBroker(...topRatedArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((brokerData) => {
                console.log('brokerData', brokerData);
                // top rated list and single selection data
                this.topRatedList = brokerData.pagination.data.map((broker) => {
                    const filteredIntervals = broker.intervals.map(
                        (interval) => {
                            return selectedTab === ConstantStringEnum.LOAD
                                ? interval.brokerLoadCount
                                : interval.brokerRevenue;
                        }
                    );

                    this.barChartValues.selectedBarValues = [
                        ...this.barChartValues.selectedBarValues,
                        filteredIntervals,
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

                for (let i = 0; i < brokerData.topTenBrokers.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? brokerData.topTenBrokers[i].brokerLoadCount
                            : brokerData.topTenBrokers[i].brokerRevenue,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? brokerData.allOthers[i].brokerLoadCount
                            : brokerData.allOthers[i].brokerRevenue,
                    ];
                }

                this.setDoughnutChartData(this.topRatedList);
                this.setBarChartConfigAndAxes(this.barChartValues);

                this.changeDetectorRef.detectChanges();
            });
    }

    private getTopRatedRepairShopListData(
        selectedTab: DashboardTopReportType,
        selectedMainPeriod: TimeInterval,
        selectedSubPeriod: SubintervalType
    ): void {
        const topRatedArgumentsData = [
            selectedTab,
            null,
            null,
            null,
            selectedMainPeriod,
            null,
            null,
            selectedSubPeriod,
        ] as const;

        this.dashboardService
            .getTopRatedRepairShop(...topRatedArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((repairShopData) => {
                console.log('repairShopData', repairShopData);
                // top rated list and single selection data
                this.topRatedList = repairShopData.pagination.data.map(
                    (repairShop) => {
                        const filteredIntervals = repairShop.intervals.map(
                            (interval) => {
                                return selectedTab === ConstantStringEnum.VISIT
                                    ? interval.count
                                    : interval.cost;
                            }
                        );

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervals,
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

                for (
                    let i = 0;
                    i < repairShopData.topTenRepairShops.length;
                    i++
                ) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? repairShopData.topTenRepairShops[i].count
                            : repairShopData.topTenRepairShops[i].cost,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? repairShopData.allOther[i].count
                            : repairShopData.allOther[i].cost,
                    ];
                }

                this.setDoughnutChartData(this.topRatedList);
                this.setBarChartConfigAndAxes(this.barChartValues);

                this.changeDetectorRef.detectChanges();
            });
    }

    private setSubPeriodList(subPeriodIdList: number[]): void {
        this.subPeriodDropdownList =
            DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                (period) => {
                    if (period.id === subPeriodIdList[0]) {
                        this.selectedSubPeriod = period;
                    }

                    return subPeriodIdList.includes(period.id);
                }
            );
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        let matchingIdList: number[];

        if (selectedDaysRange >= 1 && selectedDaysRange <= 2) {
            matchingIdList = [1, 2, 3];
        }

        if (selectedDaysRange > 2 && selectedDaysRange <= 14) {
            matchingIdList = [3, 4, 5, 6];
        }

        if (selectedDaysRange > 14 && selectedDaysRange <= 60) {
            matchingIdList = [5, 6, 7];
        }

        if (selectedDaysRange > 60 && selectedDaysRange <= 365) {
            matchingIdList = [6, 8, 9, 10];
        }

        if (selectedDaysRange > 365 && selectedDaysRange <= 730) {
            matchingIdList = [8, 9, 10, 11];
        }

        if (selectedDaysRange > 730) {
            matchingIdList = [9, 10, 11];
        }

        this.setSubPeriodList(matchingIdList);
    }

    private setDoughnutChartCenterStats(
        topRatedListItemSelected: boolean,
        topRatedList: TopRatedListItem[],
        topTenValue: number,
        otherValue?: number,
        topTenPercentage?: number,
        otherPercentage?: number
    ): ChartInitProperties[] {
        let chartCenterStats: ChartInitProperties[] = [];

        if (topRatedListItemSelected) {
            const topTenCenterStatsName =
                this.selectedTopRatedList.length === 1
                    ? topRatedList[0].name
                    : topRatedList.length + ConstantChartStringEnum.SELECTED;

            const { filteredTopTenValue } = this.setDoughnutChartValueSigns(
                topRatedListItemSelected,
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
                topRatedListItemSelected,
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
        topRatedListItemSelected: boolean,
        topTenValue: number,
        topTenPercentage?: number,
        otherPercentage?: number,
        otherValue?: number
    ): DoughnutChartSigns {
        const filteredTopTenPercentage =
            topTenPercentage + ConstantChartStringEnum.PERCENTAGE_SIGN;
        const filteredOtherPercentage =
            otherPercentage + ConstantChartStringEnum.PERCENTAGE_SIGN;

        if (topRatedListItemSelected) {
            switch (this.topRatedTitle) {
                case ConstantStringEnum.DRIVER:
                    return {
                        filteredTopTenValue:
                            ConstantChartStringEnum.DOLLAR_SIGN +
                            topTenValue +
                            ConstantChartStringEnum.THOUSAND_SIGN,
                    };
                case ConstantStringEnum.BROKER:
                case ConstantStringEnum.REPAIR_SHOP:
                    return {
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                                ConstantStringEnum.LOAD ||
                            this.currentActiveTab.name ===
                                ConstantStringEnum.VISIT
                                ? topTenValue.toString()
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN,
                    };
                default:
                    break;
            }
        } else {
            switch (this.topRatedTitle) {
                case ConstantStringEnum.DRIVER:
                    return {
                        filteredTopTenPercentage,
                        filteredTopTenValue:
                            topTenValue + ConstantChartStringEnum.THOUSAND_SIGN,
                        filteredOtherPercentage,
                        filteredOtherValue:
                            otherValue + ConstantChartStringEnum.THOUSAND_SIGN,
                    };
                case ConstantStringEnum.BROKER:
                case ConstantStringEnum.REPAIR_SHOP:
                    return {
                        filteredTopTenPercentage,
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                                ConstantStringEnum.LOAD ||
                            this.currentActiveTab.name ===
                                ConstantStringEnum.VISIT
                                ? topTenValue.toString()
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN,
                        filteredOtherPercentage,
                        filteredOtherValue:
                            this.currentActiveTab.name ===
                                ConstantStringEnum.VISIT ||
                            this.currentActiveTab.name ===
                                ConstantStringEnum.LOAD
                                ? otherValue.toString()
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  otherValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN,
                    };
                default:
                    break;
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
        topRatedListItemSelected: boolean
    ): DoughnutChartPercentage {
        let topTenPercentage = 0;
        let otherPercentage = 0;

        let topTenValue = 0;
        let otherValue = 0;

        const filterdDataValues = topRatedList.map((topRatedItem, index) => {
            if (!topRatedListItemSelected) {
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
                    this.topRatedTitle === ConstantStringEnum.DRIVER
                        ? topRatedListItem.value +
                          ConstantChartStringEnum.THOUSAND_SIGN
                        : (this.topRatedTitle === ConstantStringEnum.BROKER &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.REVENUE) ||
                          (this.topRatedTitle ===
                              ConstantStringEnum.REPAIR_SHOP &&
                              this.currentActiveTab.name ===
                                  ConstantStringEnum.COST)
                        ? ConstantChartStringEnum.DOLLAR_SIGN +
                          topRatedListItem.value +
                          ConstantChartStringEnum.THOUSAND_SIGN
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
        topRatedListItemSelected?: boolean
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
            topRatedListItemSelected
        );

        dataValues = [...filterdDataValues];

        if (topRatedListItemSelected) {
            chartCenterStats = this.setDoughnutChartCenterStats(
                topRatedListItemSelected,
                topRatedList,
                topTenValue
            );
        } else {
            chartCenterStats = this.setDoughnutChartCenterStats(
                topRatedListItemSelected,
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

    private setBarChartConfigAndAxes(barChartValues?: BarChartValues): void {
        console.log('barChartValues', barChartValues);
        this.barChartConfig = {
            dataProperties: [
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.BAR,
                        data: barChartValues?.defaultBarValues
                            ?.topRatedBarValues ?? [
                            90, 70, 25, 13, 28, 80, 12, 70, 40, 50, 25, 13, 28,
                            80, 120, 70, 40, 50, 25, 13, 28, 80, 120, 70, 50,
                        ],
                        backgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        borderColor: ConstantChartStringEnum.CHART_COLOR_GREY_4,
                        hoverBackgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        hoverBorderColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY,
                        label: ConstantChartStringEnum.BAR_LABEL_TOP,
                        id: ConstantChartStringEnum.BAR_ID_TOP,
                    },
                },
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.BAR,
                        data: barChartValues?.defaultBarValues
                            ?.otherBarValues ?? [
                            60, 100, 95, 47, 80, 120, 90, 60, 100, 95, 47, 80,
                            120, 90, 60, 100, 95, 47, 80, 120, 90, 60, 50, 100,
                            120,
                        ],
                        backgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_2,
                        borderColor: ConstantChartStringEnum.CHART_COLOR_GREY_3,
                        hoverBackgroundColor:
                            ConstantChartStringEnum.CHART_COLOR_GREY_2,
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
            dataLabels: this.barChartLabels.length
                ? this.barChartLabels
                : [
                      'MAR',
                      '',
                      'MAY',
                      '',
                      'JUL',
                      '',
                      'SEP',
                      '',
                      'NOV',
                      '',
                      '2024',
                      '',
                      'MAR',
                      '',
                      'MAY',
                      '',
                      'JUL',
                      '',
                      'SEP',
                      '',
                      'NOV',
                      '',
                      '2025',
                      '',
                      'MAR',
                  ],
            noChartImage: ConstantChartStringEnum.NO_CHART_IMG,
        };

        // bar max value
        const barChartMaxValue = +this.topRatedList[0].value;

        // bar axes
        this.barChartAxes = {
            verticalLeftAxes: {
                visible: true,
                minValue: 0,
                maxValue: barChartValues?.defaultBarValues?.topRatedBarValues
                    ? barChartMaxValue
                    : 200,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
