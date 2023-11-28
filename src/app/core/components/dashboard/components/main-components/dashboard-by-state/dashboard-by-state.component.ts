import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    AfterViewInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// store
import { DashboardQuery } from '../../../state/store/dashboard.query';

// enums
import { ConstantStringEnum } from '../../../state/enums/constant-string.enum';

// constants
import { DashboardByStateConstants } from '../../../state/utils/constants/dashboard-by-state.constants';
import { DashboardSubperiodConstants } from '../../../state/utils/constants/dashboard-subperiod.constants';
import { DashboardTopRatedConstants } from '../../../state/utils/constants/dashboard-top-rated.constants';

// models
import { ByStateListItem } from '../../../state/models/dashboard-by-state-models/by-state-list-item.model';
import { DropdownItem } from '../../../state/models/dropdown-item.model';
import { DashboardTab } from '../../../state/models/dashboard-tab.model';
import { DropdownListItem } from '../../../state/models/dropdown-list-item.model';
import { DashboardUtils } from '../../../state/utils/dashboard-utils';

@Component({
    selector: 'app-dashboard-pickup-by-state',
    templateUrl: './dashboard-by-state.component.html',
    styleUrls: ['./dashboard-by-state.component.scss'],
})
export class DashboardByStateComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    public byStateForm: UntypedFormGroup;
    public byStateTitle: string = ConstantStringEnum.PICKUP;

    public isDisplayingPlaceholder: boolean = false;

    // list
    public byStateList: ByStateListItem[] = [
        {
            id: null,
            state: null,
            value: null,
            percent: null,
            isSelected: false,
        },
    ];

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

    private overallCompanyDuration: number;

    //////////////////////////////////////////////////////////////////////////////////////////////////
    @ViewChild('statesBarChart', { static: false }) public statesBarChart: any;
    @ViewChild('timePeriod', { static: false }) public timePeriod: any;

    public barChartConfig: object = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'bar',
                    data: [
                        12, 18, 13, 17, 13, 12, 18, 13, 17, 13, 12, 18, 13, 17,
                        13, 12, 18, 13, 17, 13, 12, 18, 13, 17, 13, 12, 18, 13,
                        17, 13, 12, 18, 13, 17, 13, 12, 18, 13, 17, 13,
                    ],
                    yAxisID: 'y-axis-0',
                    backgroundColor: '#919191',
                    borderColor: '#919191',
                    hoverBackgroundColor: '#6C6C6C',
                    hoverBorderColor: '#707070',
                    label: 'Top 10',
                    id: 'top10',
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [
                        8, 10, 9, 16, 17, 8, 10, 9, 16, 17, 8, 10, 9, 16, 17, 8,
                        10, 9, 16, 17, 8, 10, 9, 16, 17, 8, 10, 9, 16, 17, 8,
                        10, 9, 16, 17, 8, 10, 9, 16, 17,
                    ],
                    yAxisID: 'y-axis-0',
                    backgroundColor: '#CCCCCC',
                    borderColor: '#CCCCCC',
                    hoverBackgroundColor: '#AAAAAA',
                    hoverBorderColor: '#707070',
                    label: 'All Others',
                    id: 'allOthers',
                },
            },
        ],
        showLegend: false,
        chartValues: [2, 2],
        defaultType: 'bar',
        chartWidth: '750',
        chartHeight: '290',
        removeChartMargin: true,
        gridHoverBackground: true,
        startGridBackgroundFromZero: true,
        dataMaxRows: 4,
        hasHoverData: true,
        allowAnimation: true,
        offset: true,
        tooltipOffset: { min: 105, max: 279 },
        dataLabels: [
            [20, 'MON'],
            [21, 'TUE'],
            [22, 'WED'],
            [23, 'THU'],
            [24, 'FRI'],
        ],
        noChartImage: 'assets/svg/common/no_data_pay.svg',
    };
    public barAxes: object = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 20,
            stepSize: 5,
            showGridLines: true,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: false,
        },
    };

    pickupStateList: any[] = [
        {
            id: 1,
            name: 'IL',
            price: '$123.45K',
            percent: '8.53%',
        },
        {
            id: 2,
            name: 'IN',
            price: '$102.34K',
            percent: '8.43%',
        },
        {
            id: 3,
            name: 'KY',
            price: '$95.15K',
            percent: '7.35%',
        },
        {
            id: 4,
            name: 'MO',
            price: '$93.52K',
            percent: '7.23%',
        },
        {
            id: 5,
            name: 'IA',
            price: '$89.35K',
            percent: '6.87%',
        },
        {
            id: 6,
            name: 'WI',
            price: '$75.23K',
            percent: '4.07%',
        },
        {
            id: 7,
            name: 'OH',
            price: '$67.52K',
            percent: '3.52%',
        },
        {
            id: 8,
            name: 'TN',
            price: '$65.25K',
            percent: '3.43%',
        },
        {
            id: 9,
            name: 'VA',
            price: '$35.04K',
            percent: '2.96%',
        },
        {
            id: 10,
            name: 'OK',
            price: '$26.23K',
            percent: '2.12%',
        },
    ];

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
    chartColors: any[] = [];
    compareColor: any = {};
    savedColors: any[] = [];
    selectedStates: any[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardQuery: DashboardQuery
    ) {}

    //////////////////////////////////////////////////////////////////////////////////////////////////
    ngOnInit(): void {
        /*  if (this.pickupCircleColor?.length) {
             this.chartColors = this.pickupCircleColor;
         } */

        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();
    }

    private createForm(): void {
        this.byStateForm = this.formBuilder.group({
            mainPeriod: [null],
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: DropdownItem): string =>
        item.name;

    public handleInputSelect(
        dropdownListItem: DropdownListItem,
        action: string
    ): void {
        if (action === ConstantStringEnum.MAIN_PERIOD_DROPDOWN) {
            /*   if (this.isDisplayingCustomPeriodRange) {
                this.isDisplayingCustomPeriodRange = false;
            }
 */
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
                    /* this.isDisplayingCustomPeriodRange = true; */

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
            (topRatedDropdownItem) => topRatedDropdownItem.isActive
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

        /*   this.topRatedList = [DashboardTopRatedConstants.TOP_RATED_LIST_ITEM];

        this.mainColorsPallete = DashboardColors.TOP_RATED_MAIN_COLORS_PALLETE;
        this.secondaryColorsPallete =
            DashboardColors.TOP_RATED_SECONDARY_COLORS_PALLETE; */
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ngAfterViewInit(): void {
        if (this.timePeriod && this.timePeriod.changeTimePeriod) {
            this.timePeriod?.changeTimePeriod('WTD');
        }
    }

    selectStateCompare(e, item, indx) {
        const itemId: any = item.id;
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
        }
    }

    removeFromStateList(e: Event, indx, item) {
        e.stopPropagation();
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
        delete this.compareColor[item.id];
    }

    hoverState(index: any) {
        this.statesBarChart.hoverBarChart(this.selectedStates[index]);
    }

    removeStateHover() {
        this.statesBarChart.hoverBarChart(null);
    }

    updateBarChart(selectedStates: any) {
        let dataSend = [10, 12, 20, 5, 18];
        if (this.statesBarChart) {
            this.statesBarChart.updateMuiliBar(
                selectedStates,
                dataSend,
                this.compareColor,
                this.compareColor
            );
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
