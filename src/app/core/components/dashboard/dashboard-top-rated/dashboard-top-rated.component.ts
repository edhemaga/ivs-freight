import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// services
import { DashboardService } from '../state/services/dashboard.service';

// bootstrap
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// constants
import { DashboardTopRatedConstants } from '../state/utils/dashboard-top-rated.constants';
import { DashboardColors } from '../state/utils/dashboard-colors.constants';

// helpers
import { ArrayHelper } from '../state/utils/array-helper';

// enum
import { ConstantStringEnum } from '../state/enum/constant-string.enum';
import { ConstantChartStringEnum } from '../state/enum/constant-chart-string.enum';

// models
import { TopRatedDropdownItem } from '../state/models/top-rated-dropdown-item.model';
import { TopRatedTab } from '../state/models/top-rated-tab.model';
import { DropdownListItem } from '../state/models/dropdown-list-item.model';
import { TopRatedListItem } from '../state/models/top-rated-list-item.model';
import { MainColorsPallete } from '../state/models/main-colors-pallete.model';
import {
    ChartInitProperties,
    DoughnutChart,
    DoughnutChartConfig,
} from '../state/models/doughnut-chart.model';

@Component({
    selector: 'app-dashboard-top-rated',
    templateUrl: './dashboard-top-rated.component.html',
    styleUrls: ['./dashboard-top-rated.component.scss'],
})
export class DashboardTopRatedComponent implements OnInit, AfterViewInit {
    @ViewChild('popover') public popover: NgbPopover;
    @ViewChild('doughnutChart') public doughnutChart: DoughnutChart;

    public topRatedForm: UntypedFormGroup;
    public topRatedTitle: string = ConstantStringEnum.DRIVER;

    // list
    public topRatedList: TopRatedListItem[] = [
        {
            id: 1,
            name: 'Denis Rodman',
            value: 152324.5,
            percent: 8.53,
            isSelected: false,
        },
        {
            id: 2,
            name: 'Sasa Djordjevic',
            value: 148456.5,
            percent: 8.43,
            isSelected: false,
        },
        {
            id: 3,
            name: 'Nicolas Drozlibrew',
            value: 125654.3,
            percent: 7.35,
            isSelected: false,
        },
        {
            id: 4,
            name: 'Samuel Lioton',
            value: 114489.8,
            percent: 7.23,
            isSelected: false,
        },
        {
            id: 5,
            name: 'Angelo Trotter',
            value: 95561.4,
            percent: 6.87,
            isSelected: false,
        },
        {
            id: 6,
            name: 'Stan Tolbert',
            value: 84156.6,
            percent: 4.07,
            isSelected: false,
        },
        {
            id: 7,
            name: 'Michael Scott',
            value: 65156.2,
            percent: 3.52,
            isSelected: false,
        },
        {
            id: 8,
            name: 'Toby Flanders',
            value: 42158.8,
            percent: 3.43,
            isSelected: false,
        },
        {
            id: 9,
            name: 'Sasuke Uchica',
            value: 35891.6,
            percent: 2.96,
            isSelected: false,
        },
        {
            id: 10,
            name: 'Peter Simpson',
            value: 18185.5,
            percent: 2.12,
            isSelected: false,
        } /* 
        {
            id: 11,
            name: 'Jure Guvo',
            value: 12133.4,
            percent: 1.12,
            isSelected: false,
        },
        {
            id: 12,
            name: 'Jure Guvo1',
            value: 12133.4,
            percent: 1.12,
            isSelected: false,
        },
        {
            id: 13,
            name: 'Jure Guvo2',
            value: 12133.4,
            percent: 1.12,
            isSelected: false,
        }, */,
    ];
    public selectedTopRatedList: TopRatedListItem[] = [];
    public topRatedListSelectedPercentage: number = 100;

    // show more
    public topRatedListSliceEnd: number = 10;
    public isShowingMore: boolean = false;

    // tabs
    public topRatedTabs: TopRatedTab[] = [];

    // dropdowns
    public topRatedDropdownList: TopRatedDropdownItem[] = [];

    public mainPeriodDropdownList: DropdownListItem[] = [];
    public subPeriodDropdownList: DropdownListItem[] = [];

    public selectedMainPeriod: DropdownListItem =
        DashboardTopRatedConstants.MAIN_PERIOD_DROPDOWN_DATA[4];
    public selectedSubPeriod: DropdownListItem =
        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA[8];

    // colors
    public mainColorsPallete: MainColorsPallete[] = [];

    // charts
    public doughnutChartConfig: DoughnutChartConfig;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    @ViewChild('topDriverBarChart') public topDriverBarChart: any;

    public selectedDrivers: any[] = [];

    // tabs
    private currentSwitchTab: string = 'All Time';

    // chart
    public barChartConfig: object = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'bar',
                    data: [
                        90000, 70000, 25000, 13000, 28000, 80000, 120000, 70000,
                        40000, 50000, 25000, 13000, 28000, 80000, 120000, 70000,
                        40000, 50000, 25000, 13000, 28000, 80000, 120000, 70000,
                        50000, 28000, 80000, 120000, 70000, 50000, 28000, 80000,
                        120000, 70000, 50000, 28000, 80000, 120000, 70000,
                        50000, 28000, 80000, 120000, 70000, 50000, 28000, 80000,
                        120000, 70000, 50000,
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
                        60000, 100000, 95000, 47000, 80000, 120000, 90000,
                        60000, 100000, 95000, 47000, 80000, 120000, 90000,
                        60000, 100000, 95000, 47000, 80000, 120000, 90000,
                        60000, 50000, 100000, 120000, 90000, 60000, 50000,
                        100000, 120000, 90000, 60000, 50000, 100000, 120000,
                        90000, 60000, 50000, 100000, 120000, 90000, 60000,
                        50000, 100000, 120000, 90000, 60000, 50000, 100000,
                        120000,
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
        hassecondTabValueage: true,
        allowAnimation: true,
        offset: true,
        tooltipOffset: { min: 105, max: 279 },
        dataLabels: [
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
        noChartImage: 'assets/svg/common/no_data_pay.svg',
    };
    public barAxes: object = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 120000,
            stepSize: 30000,
            showGridLines: true,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: false,
        },
    };

    // colors
    public compareColor: any = {};
    private chartColors: any[] = [];
    private savedColors: any[] = [];
    private compareHoverColor: any = {};
    private hoverCircleColor: any[] = [
        '596FE8',
        'FD952D',
        'ED445E',
        '2FA558',
        '7F39AA',
        '38BDEB',
        'FFCA28',
        'A2D35F',
        'F276EF',
        '8D6E63',
    ];
    private savedHoverColors: any[] = [];
    private chartHoverColors: any[] = [];

    public circleColor: any[] = [
        /* mainPalleteColors */ '8A9AEF',
        'FDB46B',
        'F27B8E',
        '6DC089',
        'A574C3',
        '73D0F1',
        'FFD54F',
        'BDE08E',
        'F69FF3',
        'A1887F',
        'CCCCCC',
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.setDoughnutChartData(this.topRatedList);
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

        this.mainColorsPallete = DashboardColors.MAIN_COLORS_PALLETE;
    }

    public handleSearchValue(searchValue: string): void {
        console.log(searchValue);
    }

    public handleInputSelect(
        dropdownListItem: DropdownListItem,
        action: string
    ): void {
        if (action === ConstantStringEnum.MAIN_PERIOD_DROPDOWN) {
            this.selectedMainPeriod = dropdownListItem;

            switch (dropdownListItem.name) {
                case ConstantStringEnum.TODAY:
                    const TODAY_SUB_PERIOD_ID = [1, 2, 3];

                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 1) {
                                    this.selectedSubPeriod = period;
                                }

                                return TODAY_SUB_PERIOD_ID.includes(period.id);
                            }
                        );
                    break;
                case ConstantStringEnum.WEEK_TO_DATE:
                    const WTD_SUB_PERIOD_ID = [3, 4, 5];

                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 3) {
                                    this.selectedSubPeriod = period;
                                }

                                return WTD_SUB_PERIOD_ID.includes(period.id);
                            }
                        );
                    break;
                case ConstantStringEnum.MONTH_TO_DATE:
                    const MTD_SUB_PERIOD_ID = [5, 6, 7];

                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 5) {
                                    this.selectedSubPeriod = period;
                                }

                                return MTD_SUB_PERIOD_ID.includes(period.id);
                            }
                        );
                    break;
                case ConstantStringEnum.YEAR_TO_DATE:
                    const YTD_SUB_PERIOD_ID = [5, 6, 7];

                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 6) {
                                    this.selectedSubPeriod = period;
                                }

                                return YTD_SUB_PERIOD_ID.includes(period.id);
                            }
                        );
                    break;
                case ConstantStringEnum.ALL_TIME:
                    break;
                case ConstantStringEnum.CUSTOM:
                    break;
                default:
                    break;
            }
        }

        if (action === ConstantStringEnum.SUB_PERIOD_DROPDOWN) {
            this.selectedSubPeriod = dropdownListItem;
        }
    }

    public handleSwitchTopRatedClick(
        topRatedDropdownItem: TopRatedDropdownItem
    ): void {
        const topRatedTabsToDisplay = [
            {
                name: topRatedDropdownItem.tab1,
                checked: false,
            },
            {
                name: topRatedDropdownItem.tab2,
                checked: true,
            },
        ];

        this.topRatedTabs = topRatedTabsToDisplay;
        this.topRatedTitle = topRatedDropdownItem.name;

        this.topRatedDropdownList.find(
            (topRatedDropdownItem) => topRatedDropdownItem.isActive
        ).isActive = false;

        topRatedDropdownItem.isActive = true;

        this.popover.close();
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

        this.topRatedList = ArrayHelper.sorPartOfArray(this.topRatedList);

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
                        borderColor:
                            ConstantChartStringEnum.DOUGHNUT_COLOR_WHITE,
                        hoverBackgroundColor: [
                            ConstantChartStringEnum.DOUGHNUT_COLOR_WHITE,
                        ],
                        hoverBorderColor:
                            ConstantChartStringEnum.DOUGHNUT_COLOR_WHITE,
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

        let topTenPercentage = 0;
        let otherPercentage = 0;

        let topTenValue = 0;
        let otherValue = 0;

        let chartCenterStats: ChartInitProperties[] = [];

        let filteredTopRatedList: TopRatedListItem[] = [];
        let filteredOtherList: TopRatedListItem[] = [];

        filteredTopRatedList = topRatedList.filter((item, index) => index <= 2);
        filteredOtherList = topRatedList.filter((item, index) => index > 2);

        console.log('filteredTopRatedList', filteredTopRatedList);
        console.log('filteredOtherList', filteredOtherList);

        dataValues = topRatedList.map((topRatedItem, index) => {
            if (this.topRatedList.length <= 10) {
                if (index <= 2) {
                    topTenPercentage += topRatedItem.percent;
                    topTenValue += topRatedItem.value;
                } else {
                    otherPercentage += topRatedItem.percent;
                    otherValue += topRatedItem.value;
                }
            }

            if (topRatedList.length > 10 && topRatedList.length <= 30) {
                if (index <= 4) {
                    topTenPercentage += topRatedItem.percent;
                    topTenValue += topRatedItem.value;
                } else {
                    otherPercentage += topRatedItem.percent;
                    otherValue += topRatedItem.value;
                }
            }

            if (topRatedList.length >= 30) {
                if (index <= 9) {
                    topTenPercentage += topRatedItem.percent;
                    topTenValue += topRatedItem.value;
                } else {
                    otherPercentage += topRatedItem.percent;
                    otherValue += topRatedItem.value;
                }
            }

            return +topRatedItem.percent;
        });

        if (topRatedListItemSelected) {
            const topTenCenterStatsName =
                this.selectedTopRatedList.length === 1
                    ? topRatedList[0].name
                    : topRatedList.length + ConstantChartStringEnum.SELECTED;

            const topTenValueToString = topTenValue.toString();

            chartCenterStats = [
                {
                    value:
                        ConstantChartStringEnum.DOLLAR_SIGN +
                        topTenValueToString +
                        ConstantChartStringEnum.THOUSAND_SIGN,
                    name: topTenCenterStatsName,
                },
            ];
        } else {
            topTenPercentage = +topTenPercentage.toFixed(2);
            otherPercentage = +otherPercentage.toFixed(2);

            dataValues = [...dataValues, otherPercentage];

            const topTenCenterStatsName =
                topRatedList.length <= 10
                    ? ConstantChartStringEnum.TOP_3
                    : topRatedList.length > 10 && topRatedList.length <= 30
                    ? ConstantChartStringEnum.TOP_5
                    : ConstantChartStringEnum.TOP_10;

            chartCenterStats = [
                {
                    percent:
                        topTenPercentage +
                        ConstantChartStringEnum.PERCENTAGE_SIGN,
                    value:
                        ConstantChartStringEnum.DOLLAR_SIGN +
                        topTenValue +
                        ConstantChartStringEnum.THOUSAND_SIGN,
                    name: topTenCenterStatsName,
                },
                {
                    percent:
                        otherPercentage +
                        ConstantChartStringEnum.PERCENTAGE_SIGN,
                    value:
                        ConstantChartStringEnum.DOLLAR_SIGN +
                        otherValue +
                        ConstantChartStringEnum.THOUSAND_SIGN,
                    name: ConstantChartStringEnum.ALL_OTHERS,
                },
            ];
        }

        /*  if (topRatedListItemSelected) {
            filteredTopRatedList = [
                topRatedList[0],
                topRatedList[1],
                topRatedList[2],
            ];

            dataValues = dataValues.filter(
                (item, index) =>
                    index === 0 ||
                    index === 1 ||
                    index === 2 ||
                    index === 3 ||
                    index === 4
            );
        } else {
            filteredTopRatedList = [
                topRatedList[0],
                topRatedList[1],
                topRatedList[2],
            ];

            dataValues = dataValues.filter(
                (item, index) =>
                    index === 0 || index === 1 || index === 2 || index === 10
            );

            dataColors = dataColors.filter(
                (item, index) =>
                    index === 0 || index === 1 || index === 2 || index === 10
            );
        } */

        this.setDoughnutChartConfig(
            dataValues,
            dataColors,
            chartCenterStats,
            topRatedList
        );
    }

    ////////////////////////////////////////////////////////////////

    public handleSwitchTabClick(event, useLast?) {
        const switchData = useLast ? this.currentSwitchTab : event['name']; //currently no data for milage/revnue so insert last chosen
        this.timePeriod.changeTimePeriod(switchData);
        this.currentSwitchTab = switchData;
        if (switchData == 'Custom') {
            return false;
        }
        this.topDriverBarChart.updateTime(switchData);
    }

    ///////////////////////////////////////////////////////

    updateBarChart(selectedStates: any) {
        let dataSend = [
            60000, 100000, 95000, 47000, 80000, 120000, 90000, 60000, 100000,
            95000, 47000, 80000, 120000, 90000, 60000, 100000, 95000, 47000,
            80000, 120000, 90000, 60000, 50000, 100000, 120000,
        ];
        if (this.topDriverBarChart) {
            this.topDriverBarChart.updateMuiliBar(
                selectedStates,
                dataSend,
                this.compareColor,
                this.compareHoverColor
            );
        }
    }

    ////////////////// ne treba vjerovatno

    clearSelected() {
        this.savedColors = [...this.chartColors];
        this.savedHoverColors = [...this.chartHoverColors];

        this.topRatedList.sort((a, b) => {
            return a.id - b.id;
        });

        this.setDoughnutChartData(this.topRatedList, false);
        this.compareColor = [];
        this.compareHoverColor = [];

        this.selectedDrivers.map((item) => {
            this.topDriverBarChart.removeMultiBarData(item, true);
        });

        this.selectedDrivers = [];
        this.topDriverBarChart.selectedDrivers = this.selectedDrivers;
        this.doughnutChart.selectedDrivers = this.selectedDrivers;
        this.removeDriverHover();
    }

    hoverDriver(index: any) {
        this.doughnutChart.hoverDoughnut(index, 'number');
        this.topDriverBarChart.hoverBarChart(this.selectedDrivers[index]);
    }

    removeDriverHover() {
        this.doughnutChart.hoverDoughnut(null);
        this.topDriverBarChart.hoverBarChart(null);
    }

    saveCustomRange(ev) {
        this.timePeriod.changeCustomTime(ev);
        this.topDriverBarChart.updateTime('Custom Set', ev);
    }

    selectTimePeriod(period) {
        this.topDriverBarChart.updateTime(this.currentSwitchTab, period);
    }

    /* <app-ta-time-period
                    #timePeriod
                    (selectTimePeriod)="selectTimePeriod($event)"
                >
                </app-ta-time-period> */
    @ViewChild('timePeriod', { static: false }) public timePeriod: any;
    @ViewChild('tabSwitch', { static: false }) public tabSwitch: any;

    ngAfterViewInit(): void {
        if (this.timePeriod && this.timePeriod.changeTimePeriod) {
            this.timePeriod?.changeTimePeriod('All Time');
        }
    }
}
