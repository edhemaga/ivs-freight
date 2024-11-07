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
import { DashboardByStateService } from '@pages/dashboard/pages/dashboard-by-state/services/dashboard-by-state.service';
import { DashboardService } from '@pages/dashboard/services/dashboard.service';

// enums
import { DashboardStringEnum } from '@pages/dashboard/enums/dashboard-string.enum';
import { DashboardChartStringEnum } from '@pages/dashboard/enums/dashboard-chart-string.enum';
import { ChartImagesStringEnum, ChartTypesStringEnum } from 'ca-components/lib/components/ca-chart/enums';

// helpers
import { DashboardHelper } from '@pages/dashboard/utils/helpers/dashboard.helper';
import { DashboardArrayHelper } from '@pages/dashboard/utils/helpers/dashboard-array-helper';

// constants
import { DashboardByStateConstants } from '@pages/dashboard/pages/dashboard-by-state/utils/constants/dashboard-by-state.constants';
import { DashboardSubperiodConstants } from '@pages/dashboard/utils/constants/dashboard-subperiod.constants';
import { DashboardTopRatedConstants } from '@pages/dashboard/pages/dashboard-top-rated/utils/constants/dashboard-top-rated.constants';
import { DashboardColors } from '@pages/dashboard/utils/constants/dashboard-colors.constants';

// models
import { ByStateListItem } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-list-item.model';
import { DropdownItem } from '@shared/models/dropdown-item.model';
import { DashboardTab } from '@pages/dashboard/models/dashboard-tab.model';
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { ByStateColorsPallete } from '@pages/dashboard/models/colors-pallete.model';
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import { IChartConfiguaration } from 'ca-components/lib/components/ca-chart/models';

import {
    ByStateReportType,
    IntervalLabelResponse,
    LoadStopType,
    SubintervalType,
    TimeInterval,
} from 'appcoretruckassist';
import { ByStateApiArguments } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-api-arguments.model';
import { ByStateWithLoadStopApiArguments } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-with-load-stop-api-arguments.model';
import { MapListItem } from '@pages/dashboard/pages/dashboard-by-state/models/map-list-item.model';

@Component({
    selector: 'app-dashboard-pickup-by-state',
    templateUrl: './dashboard-by-state.component.html',
    styleUrls: ['./dashboard-by-state.component.scss'],
})
export class DashboardByStateComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

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
    private byStateListBeforeSearch: ByStateListItem[] = [];

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
    private selectedCustomPeriodRange: CustomPeriodRange;

    private overallCompanyDuration: number;

    public selectedDropdownWidthSubPeriod: DropdownListItem;

    // colors
    public mainColorsPallete: ByStateColorsPallete[] = [];

    //chart
    public pickUpByStateChartConfig: IChartConfiguaration;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private dashboardByStateService: DashboardByStateService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.getByStateListData();

        this.setChartConfiguration();
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
        // for (let i = 0; i < this.selectedByStateList.length; i++) {
        //     this.barChart?.removeMultiBarData(this.selectedByStateList[i], true);
        // }

        this.selectedByStateList = [];

        // this.barChartValues = {
        //     defaultBarValues: {
        //         topRatedBarValues: [],
        //         otherBarValues: [],
        //     },
        //     defaultBarPercentages: {
        //         topRatedBarPercentage: [],
        //         otherBarPercentage: [],
        //     },
        //     selectedBarValues: [],
        //     selectedBarPercentages: [],
        // };

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

        //this.setBarChartData(this.selectedByStateList, byStateListItemIndex);
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

        // this.setBarChartData(
        //     this.selectedByStateList,
        //     byStateListItemIndex,
        //     true,
        //     byStateListItem
        // );
    }

    public handleHoverSelected(
        index: number,
        removeHover: boolean = false
    ): void {
        // if (!removeHover) {
        //     this.barChart?.hoverBarChart(this.selectedByStateList[index]);
        // } else {
        //     this.barChart?.hoverBarChart(null);
        // }
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

        const byStateArgumentsData = [
            ...(this.byStateTitle === DashboardStringEnum.PICKUP ||
            this.byStateTitle === DashboardStringEnum.DELIVERY
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
            case DashboardStringEnum.PICKUP:
                this.getPickupByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateWithLoadStopApiArguments
                );
                break;
            case DashboardStringEnum.DELIVERY:
                this.getDeliveryByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateWithLoadStopApiArguments
                );
                break;
            case DashboardStringEnum.ROADSIDE:
                this.getRoadsideByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            case DashboardStringEnum.VIOLATION_2:
                this.getViolationByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            case DashboardStringEnum.ACCIDENT_2:
                this.getAccidentByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            case DashboardStringEnum.REPAIR:
                this.getRepairByStateListData(
                    selectedTab,
                    byStateArgumentsData as ByStateApiArguments
                );
                break;
            case DashboardStringEnum.FUEL:
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
                                selectedTab === DashboardStringEnum.COUNT
                                    ? pickup.intervals[i].count
                                    : pickup.intervals[i].revenue,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.COUNT
                                    ? pickup.intervals[i].countPercentage
                                    : pickup.intervals[i].revenuePercentage,
                            ];
                        }

                        return {
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
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = pickupData.pagination.count;

                // intervals

                // colors range & map
                DashboardHelper.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);
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
                                selectedTab === DashboardStringEnum.COUNT
                                    ? delivery.intervals[i].count
                                    : delivery.intervals[i].revenue,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.COUNT
                                    ? delivery.intervals[i].countPercentage
                                    : delivery.intervals[i].revenuePercentage,
                            ];
                        }

                        return {
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
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = deliveryData.pagination.count;

                // intervals

                // colors range & map
                DashboardHelper.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
                // this.setBarChartDateTitle(
                //     deliveryData.intervalLabels[0].tooltipLabel,
                //     deliveryData.intervalLabels[deliveryData.topTen.length - 1]
                //         .tooltipLabel
                // );

                // this.setBarChartLabels(deliveryData.intervalLabels);

                // this.setChartData();
            });
    }

    private getRoadsideByStateListData(
        selectedTab: ByStateReportType,
        byStateArgumentsData: ByStateApiArguments
    ): void {
        this.dashboardByStateService
            .getRoadsideByState(byStateArgumentsData)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoading = false))
            )
            .subscribe((roadsideData) => {
                // by state list and single selection data
                this.byStateList = roadsideData.pagination.data.map(
                    (roadside, index) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < roadside.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === DashboardStringEnum.COUNT
                                    ? roadside.intervals[i].count
                                    : roadside.intervals[i].severityWeight,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.COUNT
                                    ? roadside.intervals[i].countPercentage
                                    : roadside.intervals[i]
                                          .severityWeightPercentage,
                            ];
                        }

                        return {
                            id: index + 1,
                            state: roadside.stateShortName,
                            value:
                                selectedTab === DashboardStringEnum.COUNT
                                    ? roadside.count.toString()
                                    : roadside.severityWeight.toString(),
                            percent:
                                selectedTab === DashboardStringEnum.COUNT
                                    ? roadside.countPercentage.toString()
                                    : roadside.severityWeightPercentage.toString(),
                            isSelected: false,
                            selectedColor: null,
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = roadsideData.pagination.count;

                // intervals

                // colors range & map
                DashboardHelper.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
                // this.setBarChartDateTitle(
                //     roadsideData.intervalLabels[0].tooltipLabel,
                //     roadsideData.intervalLabels[roadsideData.topTen.length - 1]
                //         .tooltipLabel
                // );

                // this.setBarChartLabels(roadsideData.intervalLabels);

                // this.setChartData();
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
                                selectedTab === DashboardStringEnum.COUNT
                                    ? violation.intervals[i].count
                                    : violation.intervals[i].severityWeight,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.COUNT
                                    ? violation.intervals[i].countPercentage
                                    : violation.intervals[i]
                                          .severityWeightPercentage,
                            ];
                        }

                        return {
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
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = violationData.pagination.count;

                // intervals

                // colors range & map
                DashboardHelper.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
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
                                selectedTab === DashboardStringEnum.COUNT
                                    ? accident.intervals[i].count
                                    : accident.intervals[i].severityWeight,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.COUNT
                                    ? accident.intervals[i].countPercentage
                                    : accident.intervals[i]
                                          .severityWeightPercentage,
                            ];
                        }

                        return {
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
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = accidentData.pagination.count;

                // intervals


                // colors range & map
                DashboardHelper.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
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
                                selectedTab === DashboardStringEnum.COUNT
                                    ? repair.intervals[i].count
                                    : repair.intervals[i].cost,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.COUNT
                                    ? repair.intervals[i].countPercentage
                                    : repair.intervals[i].costPercentage,
                            ];
                        }

                        return {
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
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = repairData.pagination.count;

                // intervals

                // colors range & map
                DashboardHelper.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
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
            .subscribe((fuelData) => {
                // by state list and single selection data
                this.byStateList = fuelData.pagination.data.map(
                    (fuel, index) => {
                        let filteredIntervalValues: number[] = [];
                        let filteredIntervalPercentages: number[] = [];

                        for (let i = 0; i < fuel.intervals.length; i++) {
                            filteredIntervalValues = [
                                ...filteredIntervalValues,
                                selectedTab === DashboardStringEnum.GALLON
                                    ? fuel.intervals[i].gallon
                                    : fuel.intervals[i].cost,
                            ];
                            filteredIntervalPercentages = [
                                ...filteredIntervalPercentages,
                                selectedTab === DashboardStringEnum.GALLON
                                    ? fuel.intervals[i].gallonPercentage
                                    : fuel.intervals[i].costPercentage,
                            ];
                        }

                        return {
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
                        };
                    }
                );

                this.byStateListBeforeSearch = [...this.byStateList];

                this.byStateListLength = fuelData.pagination.count;

                // intervals

                // colors range & map
                DashboardHelper.setByStateListColorRange(this.byStateList);

                this.setMapByState(this.byStateList);

                // chart
            });
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


    public setChartConfiguration() {
        this.pickUpByStateChartConfig = {
            chartType: ChartTypesStringEnum.LINE,
            chartData: {
              labels: [],
              datasets: [],
            },
            height: 150,
            width: 100,
            noDataImage: ChartImagesStringEnum.CHART_NO_DATA_YELLOW,
            chartOptions: {},
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
