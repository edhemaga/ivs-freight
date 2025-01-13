import {
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// Services
import { DashboardTopRatedService } from '@pages/dashboard/pages/dashboard-top-rated/services/dashboard-top-rated.service';
import { DashboardService } from '@pages/dashboard/services/dashboard.service';

// Constants
import { DashboardTopRatedConstants } from '@pages/dashboard/pages/dashboard-top-rated/utils/constants/dashboard-top-rated.constants';
import { DashboardColors } from '@pages/dashboard/utils/constants/dashboard-colors.constants';
import { DashboardSubperiodConstants } from '@pages/dashboard/utils/constants/dashboard-subperiod.constants';
import { DashboardTopRatedChartsConfiguration } from '@pages/dashboard/pages/dashboard-top-rated/utils/constants';
import { ChartConfiguration } from '@shared/utils/constants';

// Helpers
import { DashboardArrayHelper } from '@pages/dashboard/utils/helpers/dashboard-array-helper';
import { DashboardHelper } from '@pages/dashboard/utils/helpers/dashboard.helper';
import { ChartHelper } from '@shared/utils/helpers';

// Enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';

// Models
import { DropdownItem } from '@shared/models/dropdown-item.model';
import { DashboardTab } from '@pages/dashboard/models/dashboard-tab.model';
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { TopRatedListItem } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-list-item.model';
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import {
    TopRatedMainColorsPallete,
    TopRatedSecondaryColorsPallete,
} from '@pages/dashboard/models/colors-pallete.model';
import {
    DashboardTopReportType,
    SubintervalType,
    TimeInterval,
    TopDriverListResponse,
    TopFuelStopListResponse,
    TopRepairShopResponse,
    TopTruckListResponse,
} from 'appcoretruckassist';
import { TopRatedApiArguments } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-api-arguments.model';
import { TopRatedWithoutTabApiArguments } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-without-tab-api-arguments.model';
import {
    IChartCenterLabel,
    IChartConfiguration,
    IChartData,
    IBaseDataset
} from 'ca-components/lib/components/ca-chart/models';

@Component({
    selector: 'app-dashboard-top-rated',
    templateUrl: './dashboard-top-rated.component.html',
    styleUrls: ['./dashboard-top-rated.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardTopRatedComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public topRatedForm: UntypedFormGroup;
    public topRatedTitle: string = DashboardStringEnum.DRIVER;

    public isDisplayingPlaceholder: boolean = false;
    public isLoading: boolean = false;

    // Search
    public searchValue: string;
    public clearSearchValue: boolean = false;

    // List
    public topRatedList: TopRatedListItem[] = [];
    public selectedTopRatedList: TopRatedListItem[] = [];
    private topRatedListBeforeSearch: TopRatedListItem[] = [];
    public topRatedListSelectedPercentage: number = 100;

    public topRatedListLength: number = 0;

    // Show more
    public isShowingMore: boolean = false;

    // Tabs
    public topRatedTabs: DashboardTab[] = [];
    private currentActiveTab: DashboardTab;

    // Dropdowns
    public topRatedDropdownList: DropdownItem[] = [];

    public mainPeriodDropdownList: DropdownListItem[] = [];
    public subPeriodDropdownList: DropdownListItem[] = [];

    public selectedMainPeriod: DropdownListItem;
    public selectedSubPeriod: DropdownListItem;

    public isDisplayingCustomPeriodRange: boolean = false;
    private selectedCustomPeriodRange: CustomPeriodRange;

    private overallCompanyDuration: number;

    public selectedDropdownWidthSubPeriod: DropdownListItem;

    // Colors
    public mainColorsPallete: TopRatedMainColorsPallete[] = [];
    public secondaryColorsPallete: TopRatedSecondaryColorsPallete[] = [];

    // Charts
    public doughnutChartConfig: IChartConfiguration =
        DashboardTopRatedChartsConfiguration.DOUGHNUT_CHART_CONFIG;
    public doughnutCenterLabels!: IChartCenterLabel[];

    public barChartConfig: IChartConfiguration =
        DashboardTopRatedChartsConfiguration.BAR_CHART_CONFIG;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardTopRatedService: DashboardTopRatedService,
        private dashboardService: DashboardService
    ) { }

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.getTopRatedListData();
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
        this.selectedTopRatedList = [];
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

                    this.getTopRatedListData();

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

                this.getTopRatedListData();
            }
        }

        if (action === DashboardStringEnum.SUB_PERIOD_DROPDOWN) {
            if (this.selectedSubPeriod.name === dropdownListItem.name) return;

            this.selectedSubPeriod = dropdownListItem;

            if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM)
                this.getTopRatedListData(this.selectedCustomPeriodRange);
            else
                this.getTopRatedListData();

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

        if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM) {
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

        this.isShowingMore = false;

        if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM) {
            this.getTopRatedListData(this.selectedCustomPeriodRange);
        } else {
            this.getTopRatedListData();
        }
    }

    public handleShowMoreClick(): void {
        this.isShowingMore = !this.isShowingMore;

        if (this.selectedMainPeriod.name === DashboardStringEnum.CUSTOM)
            this.getTopRatedListData(this.selectedCustomPeriodRange);
        else
            this.getTopRatedListData();

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
    }

    public handleHoverSelected(
        index: number,
        removeHover: boolean = false
    ): void { }

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
        this.dashboardService.getOverallCompanyDuration$
            .pipe(takeUntil(this.destroy$))
            .subscribe((companyDuration: number) => {
                this.overallCompanyDuration = companyDuration;

                this.setCustomSubPeriodList(this.overallCompanyDuration);
            });
    }

    private getTopRatedListData(customPeriodRange?: CustomPeriodRange): void {
        const selectedTab = this.currentActiveTab
            .name as DashboardTopReportType;

        const selectedMainPeriod = DashboardHelper.ConvertMainPeriod(
            this.selectedMainPeriod.name
        ) as TimeInterval;

        const selectedSubPeriod = DashboardHelper.ConvertSubPeriod(
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
            case DashboardStringEnum.DISPATCHER:
                this.getTopRatedDispatcherListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case DashboardStringEnum.DRIVER:
                this.getTopRatedDriverListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case DashboardStringEnum.TRUCK:
                this.getTopRatedTruckListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case DashboardStringEnum.BROKER:
                this.getTopRatedBrokerListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case DashboardStringEnum.SHIPPER:
                this.getTopRatedShipperListData(topRatedArgumentsData);
                break;
            case DashboardStringEnum.OWNER:
                this.getTopRatedOwnerListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case DashboardStringEnum.REPAIR_SHOP:
                this.getTopRatedRepairShopListData(
                    selectedTab,
                    topRatedArgumentsData
                );
                break;
            case DashboardStringEnum.FUEL_STOP:
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
                                selectedTab === DashboardStringEnum.LOAD
                                    ? dispatcher.intervals[i]
                                        .dispatcherLoadCount
                                    : dispatcher.intervals[i].dispatcherRevenue,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.LOAD
                                    ? dispatcher.intervals[i]
                                        .dispatcherLoadPercentage
                                    : dispatcher.intervals[i]
                                        .dispatcherRevenuePercentage,
                            ];
                        }

                        return {
                            id: dispatcher.id,
                            name: dispatcher.name,
                            value:
                                selectedTab === DashboardStringEnum.LOAD
                                    ? dispatcher.loadsCount.toString()
                                    : dispatcher.revenue.toString(),
                            percent:
                                selectedTab === DashboardStringEnum.LOAD
                                    ? dispatcher.loadPercentage.toString()
                                    : dispatcher.revenuePercentage.toString(),
                            isSelected: false,
                        };
                    }
                );

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = dispatcherData.pagination.count;

                // intervals
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
            .subscribe((driverData: TopDriverListResponse) => {
                const totalMileagePercentage: number = driverData
                    .pagination
                    .data
                    .reduce((accumulator, item) => {
                        return (accumulator += item.mileagePercentage);
                    }, 0);

                const allOtherMileagePercentage = 1 - totalMileagePercentage;

                const totalMileage: number = driverData
                    .pagination
                    .data
                    .reduce((accumulator, item) => {
                        return (accumulator += item.mileage);
                    }, 0);

                const allOtherMiles: number = driverData
                    .allOthers
                    .reduce((accumulator, item) => {
                        return (accumulator += item.driverMileage);
                    }, 0);

                this.doughnutCenterLabels =
                    [
                        {
                            value: `${totalMileagePercentage}%`,
                            position: {
                                top: -14
                            }
                        },
                        {
                            value: `${totalMileage.toFixed(2)}`,
                            fontSize: 14,
                            position: {
                                top: -14
                            }
                        },
                        {
                            value: `Top ${driverData.pagination.count}`,
                            fontSize: 11,
                            color: '#AAAAAA',
                            position: {
                                top: -14
                            }
                        },
                        {
                            value: `${(100 - totalMileagePercentage).toFixed(2)}%`,
                            position: {
                                top: 14
                            }
                        },
                        {
                            value: `${allOtherMiles}`,
                            fontSize: 14,
                            position: {
                                top: 14
                            }
                        },
                        {
                            value: `All others`,
                            fontSize: 11,
                            color: '#AAAAAA',
                            position: {
                                top: 14
                            }
                        },
                    ];

                let chartData: IChartData<IBaseDataset> = ChartHelper.generateDataByDateTime(
                    driverData.pagination.data,
                    ChartConfiguration.topDriverConfiguration);

                // if (allOtherMileagePercentage)
                //     chartData.datasets[0].data = [...[...chartData.datasets[0].data], allOtherMileagePercentage];

                this.doughnutChartConfig = {
                    ...this.doughnutChartConfig,
                    chartData,
                    centerLabels: this.doughnutCenterLabels
                }

                // top rated list and single selection data
                this.topRatedList = driverData.pagination.data.map((driver) => {
                    let filteredIntervalValues: number[] = [];
                    let filteredIntervalPercentages: number[] = [];

                    for (let i = 0; i < driver.intervals.length; i++) {
                        filteredIntervalValues = [
                            ...filteredIntervalValues,
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? driver.intervals[i].driverMileage
                                : driver.intervals[i].driverRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? driver.intervals[i].driverMileagePercentage
                                : driver.intervals[i].driverRevenuePercentage,
                        ];
                    }

                    return {
                        id: driver.id,
                        name: driver.name,
                        value:
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? driver.mileage.toString()
                                : driver.revenue.toString(),
                        percent:
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? driver.mileagePercentage.toString()
                                : driver.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = driverData.pagination.count;

                // intervals
            });
    }

    public setDoughnutHoveredIndex(event: number | null): void {
        if (event === null) {
            this.doughnutChartConfig.centerLabels = this.doughnutCenterLabels;
            return;
        }

        const topRatedListItem: TopRatedListItem = this.topRatedList[event];

        this.doughnutChartConfig.centerLabels = [
            {
                value: `${topRatedListItem.percent}%`,
                position: {
                    top: 24
                }
            },
            {
                value: `$${topRatedListItem.value}`,
                fontSize: 14,
                position: {
                    top: 24
                }
            },
            {
                value: `${topRatedListItem.name}`,
                fontSize: 11,
                color: '#AAAAAA',
                position: {
                    top: 24
                }
            },
        ];
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
            .subscribe((truckData: TopTruckListResponse) => {
                // top rated list and single selection data
                this.topRatedList = truckData.pagination.data.map((truck) => {
                    let filteredIntervalValues: number[] = [];
                    let filteredIntervalPercentages: number[] = [];

                    for (let i = 0; i < truck.intervals.length; i++) {
                        filteredIntervalValues = [
                            ...filteredIntervalValues,
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? truck.intervals[i].truckMileage
                                : truck.intervals[i].truckRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? truck.intervals[i].truckMileagePercentage
                                : truck.intervals[i].truckRevenuePercentage,
                        ];
                    }

                    return {
                        id: truck.id,
                        name: truck.number,
                        value:
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? truck.mileage.toString()
                                : truck.revenue.toString(),
                        percent:
                            selectedTab === DashboardStringEnum.MILEAGE
                                ? truck.mileagePercentage.toString()
                                : truck.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = truckData.pagination.count;

                // intervals
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
                            selectedTab === DashboardStringEnum.LOAD
                                ? broker.intervals[i].brokerLoadCount
                                : broker.intervals[i].brokerRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === DashboardStringEnum.LOAD
                                ? broker.intervals[i].brokerLoadPercentage
                                : broker.intervals[i].brokerRevenuePercentage,
                        ];
                    }

                    return {
                        id: broker.id,
                        name: broker.name,
                        value:
                            selectedTab === DashboardStringEnum.LOAD
                                ? broker.loadsCount.toString()
                                : broker.revenue.toString(),
                        percent:
                            selectedTab === DashboardStringEnum.LOAD
                                ? broker.loadPercentage.toString()
                                : broker.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = brokerData.pagination.count;

                // intervals
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
                            selectedTab === DashboardStringEnum.LOAD
                                ? owner.intervals[i].ownerLoadCount
                                : owner.intervals[i].ownerRevenue,
                        ];
                        filteredIntervalPercentages = [
                            ...filteredIntervalPercentages,
                            selectedTab === DashboardStringEnum.LOAD
                                ? owner.intervals[i].ownerLoadPercentage
                                : owner.intervals[i].ownerRevenuePercentage,
                        ];
                    }

                    return {
                        id: owner.id,
                        name: owner.name,
                        value:
                            selectedTab === DashboardStringEnum.LOAD
                                ? owner.loadCount.toString()
                                : owner.revenue.toString(),
                        percent:
                            selectedTab === DashboardStringEnum.LOAD
                                ? owner.loadPercentage.toString()
                                : owner.revenuePercentage.toString(),
                        isSelected: false,
                    };
                });

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = ownerData.pagination.count;

                // intervals
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
                    (repairShop: TopRepairShopResponse) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < repairShop.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === DashboardStringEnum.VISIT
                                    ? repairShop.intervals[i].count
                                    : repairShop.intervals[i].cost,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.VISIT
                                    ? repairShop.intervals[i].countPercentage
                                    : repairShop.intervals[i].costPercentage,
                            ];
                        }

                        return {
                            id: repairShop.id,
                            name: repairShop.name,
                            value:
                                selectedTab === DashboardStringEnum.VISIT
                                    ? repairShop.visit.toString()
                                    : repairShop.cost.toString(),
                            percent:
                                selectedTab === DashboardStringEnum.VISIT
                                    ? repairShop.visitPercentage.toString()
                                    : repairShop.costPercentage.toString(),
                            isSelected: false,
                        };
                    }
                );

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = repairShopData.pagination.count;

                // intervals
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
            .subscribe((fuelStopData: TopFuelStopListResponse) => {
                // top rated list and single selection data
                this.topRatedList = fuelStopData.pagination.data.map(
                    (fuelStop) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < fuelStop.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === DashboardStringEnum.VISIT
                                    ? fuelStop.intervals[i].visitCount
                                    : fuelStop.intervals[i].cost,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.VISIT
                                    ? fuelStop.intervals[i].visitPercentage
                                    : fuelStop.intervals[i].costPercentage,
                            ];
                        }

                        return {
                            id: fuelStop.id,
                            name: fuelStop.name,
                            value:
                                selectedTab === DashboardStringEnum.VISIT
                                    ? fuelStop.visitCount.toString()
                                    : fuelStop.cost.toString(),
                            percent:
                                selectedTab === DashboardStringEnum.VISIT
                                    ? fuelStop.visitPercentage.toString()
                                    : fuelStop.costPercentage.toString(),
                            isSelected: false,
                        };
                    }
                );

                this.topRatedListBeforeSearch = [...this.topRatedList];

                this.topRatedListLength = fuelStopData.pagination.count;

                // intervals
            });
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardHelper.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;

        this.selectedDropdownWidthSubPeriod = selectedSubPeriod;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
