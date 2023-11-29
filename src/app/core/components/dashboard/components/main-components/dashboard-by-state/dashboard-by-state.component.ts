import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

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

    // search
    public searchValue: string;
    public clearSearchValue: boolean = false;

    // list
    public byStateList: ByStateListItem[] = [];
    private byStateListBeforeSearch: ByStateListItem[] = [];
    public selectedByStateList: ByStateListItem[] = [];

    // show more
    public byStateListSliceEnd: number = 10;
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

    // colors
    public mainColorsPallete: ByStateColorsPallete[] = [];

    // charts
    public barChartConfig: BarChartConfig;
    public barChartAxes: BarChartAxes;
    public barChartDateTitle: string = 'March, 2023 - March, 2025';
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

    //////////////////////////////////////////////////////////////////////////////////////////////////

    pickupCircleColor: any[] = [
        '6278C7',
        '7A8DCB',
        '7A8DCB',
        'A0AFDE',
        'A0AFDE',
        'C2CEEC',
        'C2CEEC',
        'C2CEEC',
        'D7E1F4',
        'D7E1F4',
    ];
    compareColor: any = {};
    savedColors: any[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardQuery: DashboardQuery,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////////////
    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();

        this.setChartData();

        DashboardUtils.setByStateListColorRange(this.byStateList);
    }

    private createForm(): void {
        this.byStateForm = this.formBuilder.group({
            mainPeriod: [null],
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: DropdownItem): string =>
        item.name;

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
                    /* 
                    this.getTopRatedListData(); */

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

                /*   this.getTopRatedListData(); */
            }
        }

        if (action === ConstantStringEnum.SUB_PERIOD_DROPDOWN) {
            this.selectedSubPeriod = dropdownListItem;

            /*  if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
                this.getTopRatedListData(this.selectedCustomPeriodRange);
            } else {
                this.getTopRatedListData();
            } */
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

        /*  this.getTopRatedListData(); */
    }

    public handleSwitchTabClick(activeTab: DashboardTab): void {
        if (this.currentActiveTab?.name === activeTab.name) {
            return;
        }

        this.currentActiveTab = activeTab;

        /* if (this.selectedMainPeriod.name === ConstantStringEnum.CUSTOM) {
            this.getTopRatedListData(this.selectedCustomPeriodRange);
        } else {
            this.getTopRatedListData();
        } */
    }

    public handleShowMoreClick(): void {
        if (!this.isShowingMore) {
            this.isShowingMore = true;

            this.byStateListSliceEnd = this.byStateList.length;

            return;
        }

        if (this.isShowingMore) {
            this.isShowingMore = false;

            this.byStateListSliceEnd = 10;

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

            /*  this.getTopRatedListData(customPeriodRange); */
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

        /*
        this.setBarChartData(this.selectedByStateList, byStateListItemIndex); */
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

        /* this.setBarChartData(
            this.selectedByStateList,
            byStateListItemIndex,
            true,
            byStateListItem
        ); */
    }

    public handleHoverSelected(): /*  index: number,
        removeHover: boolean = false */
    void {
        /*  if (!removeHover) {
            this.barChart.hoverBarChart(this.selectedByStateList[index]);
        } else {
            this.barChart.hoverBarChart(null);
        } */
    }

    private getConstantData(): void {
        this.byStateList = DashboardByStateConstants.BY_STATE_LIST;

        this.byStateDropdownList = JSON.parse(
            JSON.stringify(DashboardByStateConstants.BY_STATE_DROPDOWN_DATA)
        );

        this.byStateTabs = DashboardByStateConstants.BY_STATE_TABS;
        this.currentActiveTab = DashboardByStateConstants.BY_STATE_TABS[0];

        this.mainPeriodDropdownList =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA;

        this.selectedMainPeriod =
            DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[5];

        /*  this.topRatedList = [DashboardTopRatedConstants.TOP_RATED_LIST_ITEM]; */

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

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardUtils.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;
    }

    private setBarChartConfigAndAxes(barChartValues: BarChartValues): void {
        this.barChartConfig = {
            dataProperties: [
                {
                    defaultConfig: {
                        type: ConstantChartStringEnum.BAR,
                        data: [
                            12, 18, 13, 17, 13, 12, 18, 13, 17, 13,
                        ] /* barChartValues?.defaultBarValues
                            ?.topRatedBarValues */,
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
                        data: [
                            8, 10, 9, 16, 17, 8, 10, 9, 16, 17,
                        ] /* barChartValues?.defaultBarValues?.otherBarValues */,
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
            dataLabels: [
                'JAN',
                'FEB',
                'MAR',
                'APR',
                'MAY',
                'JUN',
                'JUL',
                'AUG',
                'SEP',
                'OCT',
            ] /* this.barChartLabels */,
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

    private setChartData(): void {
        this.setBarChartConfigAndAxes(this.barChartValues);

        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    selectStateCompare(e, item, indx) {
        /*   const itemId: any = item.id;
        if (!(itemId in this.compareColor)) {
            item.active = true;
            const firstInArray = this.pickupCircleColor[indx];
            const objectSize = Object.keys(this.compareColor).length;
            this.compareColor[item.id] = firstInArray;
            this.selectedStates.push(this.pickupStateList[indx]);
            this.statesBarChart.selectedDrivers = this.selectedStates;
            this.pickupStateList.splice(indx, 1);
            this.updateBarChart(this.selectedStates);
            this.pickupStateList.splice(objectSize, 0, item);

            this.hoverState(indx);
        } else {
            this.removeFromStateList(e, indx, item);
        } */
    }

    removeFromStateList(e: Event, indx, item) {
        /*   e.stopPropagation();
        item.active = false;
        this.pickupStateList.splice(indx, 1);
        let showDefault = false;
        if (this.selectedStates?.length == 1) {
            showDefault = true;
        }
        this.statesBarChart.removeMultiBarData(
            this.selectedStates[indx],
            showDefault
        );
        this.selectedStates.splice(indx, 1);
        this.statesBarChart.selectedDrivers = this.selectedStates;
        this.pickupStateList.push(item);
        let allStates = [...this.pickupStateList];
        let activeStates = allStates.filter((state) => state.active == true);
        this.pickupStateList = activeStates;
        let inactiveStates = allStates
            .filter((state) => !state.active)
            .sort((a, b) => {
                return a.id - b.id;
            });
        inactiveStates.map((state) => {
            this.pickupStateList.push(state);
        });
        this.savedColors.unshift(this.compareColor[item.id]);
        delete this.compareColor[item.id]; */
    }
}
