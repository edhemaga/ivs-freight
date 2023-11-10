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

// services
import { DashboardService } from '../../state/services/dashboard.service';

// store
import { DashboardQuery } from '../../state/store/dashboard.query';

// constants
import { DashboardTopRatedConstants } from '../../state/utils/constants/dashboard-top-rated.constants';
import { DashboardColors } from '../../state/utils/constants/dashboard-colors.constants';
import { DashboardSubperiodConstants } from '../../state/utils/constants/dashboard-subperiod.constants';

// helpers
import { DashboardArrayHelper } from '../../state/utils/helpers/dashboard-array-helper';
import { DashboardUtils } from '../../state/utils/dashboard-utils';

// enum
import { ConstantStringEnum } from '../../state/enums/constant-string.enum';
import { ConstantChartStringEnum } from '../../state/enums/constant-chart-string.enum';

// models
import { TopRatedDropdownItem } from '../../state/models/dashboard-top-rated-models/top-rated-dropdown-item.model';
import { DashboardTab } from '../../state/models/dashboard-tab.model';
import { DropdownListItem } from '../../state/models/dropdown-list-item.model';
import { TopRatedListItem } from '../../state/models/dashboard-top-rated-models/top-rated-list-item.model';
import { CustomPeriodRange } from '../../state/models/custom-period-range.model';
import {
    TopRatedMainColorsPallete,
    TopRatedSecondaryColorsPallete,
} from '../../state/models/dashboard-color-models/colors-pallete.model';
import {
    ChartInitProperties,
    DoughnutChart,
    DoughnutChartConfig,
    DoughnutChartPercentage,
    DoughnutChartSigns,
} from '../../state/models/dashboard-chart-models/doughnut-chart.model';
import {
    BarChart,
    BarChartAxes,
    BarChartConfig,
    BarChartValues,
} from '../../state/models/dashboard-chart-models/bar-chart.model';
import {
    DashboardTopReportType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';
import {
    TopRatedApiArguments,
    TopRatedWithoutTabApiArguments,
} from '../../state/models/dashboard-top-rated-models/top-rated-api-arguments.model';

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
    public topRatedTabs: DashboardTab[] = [];
    private currentActiveTab: DashboardTab;

    // dropdowns
    public topRatedDropdownList: TopRatedDropdownItem[] = [];

    public mainPeriodDropdownList: DropdownListItem[] = [];
    public subPeriodDropdownList: DropdownListItem[] = [];

    public selectedMainPeriod: DropdownListItem;
    public selectedSubPeriod: DropdownListItem;

    public isDisplayingCustomPeriodRange: boolean = false;
    private selectedCustomPeriodRange: CustomPeriodRange;

    private overallCompanyDuration: number;

    // colors
    public mainColorsPallete: TopRatedMainColorsPallete[] = [];
    public secondaryColorsPallete: TopRatedSecondaryColorsPallete[] = [];

    // charts
    public doughnutChartConfig: DoughnutChartConfig;
    public barChartConfig: BarChartConfig;
    public barChartAxes: BarChartAxes;
    private barChartLabels: string[] | string[][] = [];
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
        private dashboardService: DashboardService,
        private dashboardQuery: DashboardQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

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
                    this.isDisplayingCustomPeriodRange = true;

                    this.subPeriodDropdownList = [];
                    this.selectedSubPeriod = null;

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
            this.selectedSubPeriod = dropdownListItem;

            if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
                this.getTopRatedListData(this.selectedCustomPeriodRange);
            } else {
                this.getTopRatedListData();
            }
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

        this.selectedMainPeriod =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];

        this.topRatedTitle = topRatedDropdownItem.name;

        this.topRatedDropdownList.find(
            (topRatedDropdownItem) => topRatedDropdownItem.isActive
        ).isActive = false;

        topRatedDropdownItem.isActive = true;

        this.getTopRatedListData();

        this.popover.close();
    }

    public handleSwitchTabClick(activeTab: DashboardTab): void {
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
        } else {
            this.isDisplayingCustomPeriodRange = false;
            this.selectedCustomPeriodRange = customPeriodRange;

            this.getTopRatedListData(customPeriodRange);
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

    private getConstantData(): void {
        this.topRatedDropdownList =
            DashboardTopRatedConstants.TOP_RATED_DROPDOWN_DATA;
        this.topRatedTabs = DashboardTopRatedConstants.TOP_RATED_TABS;

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
            selectedMainPeriod,
            customPeriodRange?.fromDate ?? null,
            customPeriodRange?.toDate ?? null,
            selectedSubPeriod,
        ];

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
        console.log('customPeriodRange', customPeriodRange);

        switch (this.topRatedTitle) {
            case ConstantStringEnum.DISPATCHER:
                this.getTopRatedDispatcherListData(
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
        this.dashboardService
            .getTopRatedDispatcher(topRatedArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((dispatcherData) => {
                console.log('dispatcherData', dispatcherData);
                // top rated list and single selection data
                this.topRatedList = dispatcherData.pagination.data.map(
                    (dispatcher) => {
                        const filteredIntervals = dispatcher.intervals.map(
                            (interval) => {
                                return selectedTab === ConstantStringEnum.LOAD
                                    ? interval.dispatcherLoadCount
                                    : interval.dispatcherRevenue;
                            }
                        );

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervals,
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

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? dispatcherData.allOthers[i].dispatcherLoadCount
                            : dispatcherData.allOthers[i].dispatcherRevenue,
                    ];
                }

                this.setBarChartLabels(dispatcherData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedTruckListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardService
            .getTopRatedTruck(topRatedArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((truckData) => {
                console.log('truckData', truckData);
                // top rated list and single selection data
                this.topRatedList = truckData.pagination.data.map((truck) => {
                    const filteredIntervals = truck.intervals.map(
                        (interval) => {
                            return selectedTab === ConstantStringEnum.MILEAGE
                                ? interval.truckMileage
                                : interval.truckRevenue;
                        }
                    );

                    this.barChartValues.selectedBarValues = [
                        ...this.barChartValues.selectedBarValues,
                        filteredIntervals,
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

                for (let i = 0; i < truckData.topTrucks.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.MILEAGE
                            ? truckData.topTrucks[i].truckMileage
                            : truckData.topTrucks[i].truckRevenue,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.MILEAGE
                            ? truckData.allOthers[i].truckMileage
                            : truckData.allOthers[i].truckRevenue,
                    ];
                }

                this.setBarChartLabels(truckData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedBrokerListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardService
            .getTopRatedBroker(topRatedArgumentsData)
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

                for (let i = 0; i < brokerData.topBrokers.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? brokerData.topBrokers[i].brokerLoadCount
                            : brokerData.topBrokers[i].brokerRevenue,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? brokerData.allOthers[i].brokerLoadCount
                            : brokerData.allOthers[i].brokerRevenue,
                    ];
                }

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

        this.dashboardService
            .getTopRatedShipper(filteredTopRatedArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((shipperData) => {
                console.log('shipperData', shipperData);
                // top rated list and single selection data
                this.topRatedList = shipperData.pagination.data.map(
                    (shipper) => {
                        const filteredIntervals = shipper.intervals.map(
                            (interval) => {
                                return interval.shipperLoadCount;
                            }
                        );

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervals,
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

                for (let i = 0; i < shipperData.topShippers.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        shipperData.topShippers[i].shipperLoadCount,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        shipperData.allOthers[i].shipperLoadCount,
                    ];
                }

                this.setBarChartLabels(shipperData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedOwnerListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardService
            .getTopRatedOwner(topRatedArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((ownerData) => {
                console.log('ownerData', ownerData);
                // top rated list and single selection data
                this.topRatedList = ownerData.pagination.data.map((owner) => {
                    const filteredIntervals = owner.intervals.map(
                        (interval) => {
                            return selectedTab === ConstantStringEnum.LOAD
                                ? interval.ownerLoadCount
                                : interval.ownerRevenue;
                        }
                    );

                    this.barChartValues.selectedBarValues = [
                        ...this.barChartValues.selectedBarValues,
                        filteredIntervals,
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

                for (let i = 0; i < ownerData.topOwners.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? ownerData.topOwners[i].ownerLoadCount
                            : ownerData.topOwners[i].ownerRevenue,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.LOAD
                            ? ownerData.allOthers[i].ownerLoadCount
                            : ownerData.allOthers[i].ownerRevenue,
                    ];
                }

                this.setBarChartLabels(ownerData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedRepairShopListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardService
            .getTopRatedRepairShop(topRatedArgumentsData)
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

                for (let i = 0; i < repairShopData.topRepairShops.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? repairShopData.topRepairShops[i].count
                            : repairShopData.topRepairShops[i].cost,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? repairShopData.allOther[i].count
                            : repairShopData.allOther[i].cost,
                    ];
                }

                this.setBarChartLabels(repairShopData.intervalLabels);

                this.setChartsData();
            });
    }

    private getTopRatedFuelStopListData(
        selectedTab: DashboardTopReportType,
        topRatedArgumentsData: TopRatedApiArguments
    ): void {
        this.dashboardService
            .getTopRatedFuelStop(topRatedArgumentsData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((fuelStopData) => {
                console.log('fuelStopData', fuelStopData);
                // top rated list and single selection data
                this.topRatedList = fuelStopData.pagination.data.map(
                    (fuelStop) => {
                        const filteredIntervals = fuelStop.intervals.map(
                            (interval) => {
                                return selectedTab === ConstantStringEnum.VISIT
                                    ? interval.visitCount
                                    : interval.cost;
                            }
                        );

                        this.barChartValues.selectedBarValues = [
                            ...this.barChartValues.selectedBarValues,
                            filteredIntervals,
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

                for (let i = 0; i < fuelStopData.topFuelStops.length; i++) {
                    // top rated intervals
                    this.barChartValues.defaultBarValues.topRatedBarValues = [
                        ...this.barChartValues.defaultBarValues
                            .topRatedBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? fuelStopData.topFuelStops[i].visitCount
                            : fuelStopData.topFuelStops[i].cost,
                    ];

                    // other intervals
                    this.barChartValues.defaultBarValues.otherBarValues = [
                        ...this.barChartValues.defaultBarValues.otherBarValues,
                        selectedTab === ConstantStringEnum.VISIT
                            ? fuelStopData.allOthers[i].visitCount
                            : fuelStopData.allOthers[i].cost,
                    ];
                }

                this.setBarChartLabels(fuelStopData.intervalLabels);

                this.setChartsData();
            });
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardUtils.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;
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
                /*    case ConstantStringEnum.DRIVER: */
                case ConstantStringEnum.TRUCK:
                    return {
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                            ConstantStringEnum.MILEAGE
                                ? topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN,
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
                                  topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN,
                    };
                default:
                    return {
                        filteredTopTenValue: topTenValue.toString(),
                    };
            }
        } else {
            switch (this.topRatedTitle) {
                /*       case ConstantStringEnum.DRIVER: */
                case ConstantStringEnum.TRUCK:
                    return {
                        filteredTopTenPercentage,
                        filteredTopTenValue:
                            this.currentActiveTab.name ===
                            ConstantStringEnum.MILEAGE
                                ? topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN
                                : ConstantChartStringEnum.DOLLAR_SIGN +
                                  topTenValue +
                                  ConstantChartStringEnum.THOUSAND_SIGN,
                        filteredOtherPercentage,
                        filteredOtherValue: ConstantStringEnum.MILEAGE
                            ? otherValue + ConstantChartStringEnum.THOUSAND_SIGN
                            : ConstantChartStringEnum.DOLLAR_SIGN +
                              otherValue +
                              ConstantChartStringEnum.THOUSAND_SIGN,
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
                    /* this.topRatedTitle === ConstantStringEnum.DRIVER */ this
                        .topRatedTitle === ConstantStringEnum.TRUCK &&
                    this.currentActiveTab.name === ConstantStringEnum.MILEAGE
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

    private setBarChartLabels(barChartLables: string[]): void {
        console.log('barChartLables', barChartLables);

        const selectedSubPeriod = DashboardUtils.ConvertSubPeriod(
            this.selectedSubPeriod.name
        );

        const filteredLabels = barChartLables.map((label) => {
            if (
                selectedSubPeriod === 'Hourly' &&
                !label.includes('PM') &&
                !label.includes('AM')
            ) {
                const splitLabel = label.split(' ');

                return [splitLabel[0], splitLabel[1]];
            } else {
                return label;
            }
        });

        if (Array.isArray(filteredLabels[0])) {
            this.barChartLabels = filteredLabels as string[][];
        } else {
            this.barChartLabels = filteredLabels as string[];
        }

        console.log('this.barChartLabels', this.barChartLabels);
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
                            ConstantChartStringEnum.CHART_COLOR_GREY_5,
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
