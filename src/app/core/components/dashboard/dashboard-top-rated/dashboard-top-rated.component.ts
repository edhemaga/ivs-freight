import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// bootstrap
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// constants
import { DashboardTopRatedConstants } from '../state/utils/dashboard-top-rated.constants';
import { DashboardColors } from '../state/utils/dashboard-colors.constants';

// helper
import { ArrayHelper } from '../state/utils/array-helper';

// enum
import { ConstantStringEnum } from '../state/enum/constant-string.enum';

// models
import { TopRatedDropdownItem } from '../state/models/top-rated-dropdown-item.model';
import { TopRatedTab } from '../state/models/top-rated-tab.model';
import { DropdownListItem } from '../state/models/dropdown-list-item.model';
import { TopRatedListItem } from '../state/models/top-rated-list-item.model';
import { MainColorsPallete } from '../state/models/main-colors-pallete.model';

@Component({
    selector: 'app-dashboard-top-rated',
    templateUrl: './dashboard-top-rated.component.html',
    styleUrls: ['./dashboard-top-rated.component.scss'],
})
export class DashboardTopRatedComponent implements OnInit, AfterViewInit {
    @ViewChild('popover') public popover: NgbPopover;

    public topRatedForm: UntypedFormGroup;
    public topRatedTitle: string = ConstantStringEnum.DRIVER;

    // list
    public topRatedList: TopRatedListItem[] = [
        {
            id: 1,
            name: 'Denis Rodman',
            firstTabValue: '152,324.5',
            secondTabValue: '8.53',
            isSelected: false,
        },
        {
            id: 2,
            name: 'Sasa Djordjevic',
            firstTabValue: '148,456.5',
            secondTabValue: '8.43',
            isSelected: false,
        },
        {
            id: 3,
            name: 'Nicolas Drozlibrew',
            firstTabValue: '124,421.1',
            secondTabValue: '7.35',
            isSelected: false,
        },
        {
            id: 4,
            name: 'Samuel Lioton',
            firstTabValue: '114,489.3',
            secondTabValue: '7.23',
            isSelected: false,
        },
        {
            id: 5,
            name: 'Angelo Trotter',
            firstTabValue: '96,561.3',
            secondTabValue: '6.87',
            isSelected: false,
        },
        {
            id: 6,
            name: 'Stan Tolbert',
            firstTabValue: '84,156.6',
            secondTabValue: '4.07',
            isSelected: false,
        },
        {
            id: 7,
            name: 'Michael Scott',
            firstTabValue: '64,156.2',
            secondTabValue: '3.52',
            isSelected: false,
        },
        {
            id: 8,
            name: 'Toby Flanders',
            firstTabValue: '42,158.8',
            secondTabValue: '3.43',
            isSelected: false,
        },
        {
            id: 9,
            name: 'Sasuke Uchica',
            firstTabValue: '35,891.6',
            secondTabValue: '2.96',
            isSelected: false,
        },
        {
            id: 10,
            name: 'Peter Simpson',
            firstTabValue: '18,175.4',
            secondTabValue: '2.12',
            isSelected: false,
        },
        {
            id: 11,
            name: 'Jure Guvo',
            firstTabValue: '12,133.4',
            secondTabValue: '1.12',
            isSelected: false,
        },
        {
            id: 12,
            name: 'Jure Guvo1',
            firstTabValue: '12,133.4',
            secondTabValue: '1.12',
            isSelected: false,
        },
        {
            id: 13,
            name: 'Jure Guvo2',
            firstTabValue: '12,133.4',
            secondTabValue: '1.12',
            isSelected: false,
        },
    ];
    public selectedTopRatedList: TopRatedListItem[] = [];

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

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    @ViewChild('doughnutChart', { static: false }) public doughnutChart: any;
    @ViewChild('topDriverBarChart', { static: false })
    public topDriverBarChart: any;

    public selectedDrivers: any[] = [];

    // tabs
    private currentSwitchTab: string = 'All Time';

    // chart
    public chartConfig: object = {};
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
    public chartAxes: object = {};

    // colors
    public circleColor: any[] = [
        '8A9AEF',
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

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        /////////////////////////////////////////////////////

        this.setChartData(this.topRatedList);
    }

    private createForm(): void {
        this.topRatedForm = this.formBuilder.group({
            dropdownLeft: [null],
            dropdownRight: [null],
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

    public handleInputSelect(event: DropdownListItem, action: string): void {
        if (action === ConstantStringEnum.MAIN_PERIOD_DROPDOWN) {
            this.selectedMainPeriod = event;

            switch (event.name) {
                case ConstantStringEnum.TODAY:
                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 1) {
                                    this.selectedSubPeriod = period;
                                }

                                return (
                                    period.id === 1 ||
                                    period.id === 2 ||
                                    period.id === 3
                                );
                            }
                        );
                    break;
                case ConstantStringEnum.WEEK_TO_DATE:
                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 3) {
                                    this.selectedSubPeriod = period;
                                }

                                return (
                                    period.id === 3 ||
                                    period.id === 4 ||
                                    period.id === 5
                                );
                            }
                        );
                    break;
                case ConstantStringEnum.MONTH_TO_DATE:
                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 5) {
                                    this.selectedSubPeriod = period;
                                }

                                return (
                                    period.id === 5 ||
                                    period.id === 6 ||
                                    period.id === 7
                                );
                            }
                        );
                    break;
                case ConstantStringEnum.YEAR_TO_DATE:
                    this.subPeriodDropdownList =
                        DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA.filter(
                            (period) => {
                                if (period.id === 6) {
                                    this.selectedSubPeriod = period;
                                }

                                return (
                                    period.id === 6 ||
                                    period.id === 8 ||
                                    period.id === 9
                                );
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
            this.selectedSubPeriod = event;
        }
    }

    public handleSwitchTopRatedClick(
        topRatedDropdownItem: TopRatedDropdownItem
    ): void {
        const topRatedTabsToDisplay = [
            {
                name: topRatedDropdownItem.tab1,
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

        /* 
        this.topDriverBarChart.animationDuration = 0;
        this.topDriverBarChart.setChartOptions();
       */
    }

    public handleShowMoreClick(): void {
        this.isShowingMore = true;

        this.topRatedListSliceEnd = this.topRatedList.length;
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
    }

    public handleRemoveSelectedClick(
        event: Event,
        topRatedListItem: TopRatedListItem,
        topRatedListItemIndex: number
    ): void {
        event.stopPropagation();

        topRatedListItem.isSelected = false;

        this.selectedTopRatedList = this.selectedTopRatedList.filter(
            (topRatedItem) => topRatedItem.id !== topRatedListItem.id
        );

        this.topRatedList.splice(topRatedListItemIndex, 1);

        this.topRatedList.splice(topRatedListItem.id - 1, 0, topRatedListItem);

        this.topRatedList = ArrayHelper.sortArrayFromIndex(
            this.topRatedList,
            topRatedListItem.id - 1
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

    setChartData(drivers, selectedDrivers?) {
        var dataValues = [];
        var dataColors = [];
        var topTenPercentage = 0;

        drivers.map((item) => {
            dataValues.push(parseFloat(item.percent));
            topTenPercentage = topTenPercentage + parseFloat(item.percent);
        });

        topTenPercentage = parseFloat(topTenPercentage.toFixed(2));
        var otherPercent = 100 - topTenPercentage;
        otherPercent = parseFloat(otherPercent.toFixed(2));

        if (!selectedDrivers) {
            dataValues.push(otherPercent);
        }

        this.circleColor.map((item) => {
            var color = '#' + item;
            dataColors.push(color);
        });

        if (this.circleColor?.length) {
            this.chartColors = this.circleColor;
            this.chartHoverColors = this.hoverCircleColor;
        }

        let chartProp = [];

        if (selectedDrivers) {
            chartProp = [
                {
                    name: drivers.length + ' SELECTED',
                    percent: '$773.08K',
                },
            ];
        } else {
            chartProp = [
                {
                    name: 'TOP ' + drivers.length,
                    value: '$773.08K',
                    percent: topTenPercentage + '%',
                },
                {
                    name: 'ALL OTHERS',
                    value: '$623.56K',
                    percent: otherPercent + '%',
                },
            ];
        }

        this.chartConfig = {
            dataProperties: [
                {
                    defaultConfig: {
                        type: 'doughnut',
                        data: dataValues,
                        backgroundColor: dataColors,
                        borderColor: '#fff',
                        hoverBackgroundColor: ['#596FE8'],
                        hoverBorderColor: '#fff',
                    },
                },
            ],
            chartInnitProperties: chartProp,
            showLegend: true,
            chartValues: [2, 2],
            defaultType: 'doughnut',
            chartWidth: '322',
            chartHeight: '322',
            removeChartMargin: true,
            dataLabels: [],
            driversList: drivers,
            allowAnimation: true,
            noChartImage: 'assets/svg/common/no_data_pay.svg',
            dontUseResponsive: true,
        };

        if (this.doughnutChart) {
            this.doughnutChart.chartInnitProperties = chartProp;
            this.doughnutChart.chartUpdated(dataValues);
        }
    }

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

    removeDriverFromList(e: Event, indx, item) {
        e.stopPropagation();
        item.active = false;
        this.topRatedList.splice(indx, 1);
        let showDefault = false;
        if (this.selectedDrivers?.length == 1) {
            showDefault = true;
        }
        this.topDriverBarChart.removeMultiBarData(
            this.selectedDrivers[indx],
            showDefault
        );
        this.selectedDrivers.splice(indx, 1);
        this.topDriverBarChart.selectedDrivers = this.selectedDrivers;
        if (this.selectedDrivers?.length) {
            this.setChartData(this.selectedDrivers, true);
        }

        /*   this.topRatedList.push(item);
        let allDrivers = [...this.topRatedList];
        let activeDrivers = allDrivers.filter(
            (driver) => driver.active == true
        );
        this.topRatedList = activeDrivers;
        let inactiveDrivers = allDrivers
            .filter((driver) => !driver.active)
            .sort((a, b) => {
                return a.id - b.id;
            });
        inactiveDrivers.map((driver) => {
            this.topRatedList.push(driver);
        });
 */
        this.savedColors.unshift(this.compareColor[item.id]);
        this.savedHoverColors.unshift(this.compareHoverColor[item.id]);
        if (this.selectedDrivers?.length == 0) {
            this.setChartData(this.topRatedList);
        }
        delete this.compareColor[item.id];
        delete this.compareHoverColor[item.id];
    }

    selectCompare(e, item, indx) {
        const itemId: any = item.id;
        if (!(itemId in this.compareColor)) {
            if (!this.savedColors.length) {
                this.savedColors = [...this.circleColor];
                this.circleColor = [];
                this.savedHoverColors = [...this.hoverCircleColor];
                this.hoverCircleColor = [];
            }

            item.active = true;

            const firstInArray = this.savedColors.shift();
            const firstInArrayHover = this.savedHoverColors.shift();

            const objectSize = Object.keys(this.compareColor).length;
            this.compareColor[item.id] = firstInArray;
            this.compareHoverColor[item.id] = firstInArrayHover;
            this.selectedDrivers.push(this.topRatedList[indx]);
            this.doughnutChart.selectedDrivers = this.selectedDrivers;
            this.topDriverBarChart.selectedDrivers = this.selectedDrivers;
            this.topRatedList.splice(indx, 1);
            this.setChartData(this.selectedDrivers, true);
            this.updateBarChart(this.selectedDrivers);
            this.topRatedList.splice(objectSize, 0, item);

            this.hoverDriver(indx);
        } else {
            this.removeDriverFromList(e, indx, item);
        }
    }

    hoverDriver(index: any) {
        this.doughnutChart.hoverDoughnut(index, 'number');
        this.topDriverBarChart.hoverBarChart(this.selectedDrivers[index]);
    }

    removeDriverHover() {
        this.doughnutChart.hoverDoughnut(null);
        this.topDriverBarChart.hoverBarChart(null);
    }

    selectTimePeriod(period) {
        this.topDriverBarChart.updateTime(this.currentSwitchTab, period);
    }

    ////////////////// ne treba vjerovatno

    clearSelected() {
        /*   this.topRatedList.map((driver) => {
            driver.acive = false;
        });
 */
        this.savedColors = [...this.chartColors];
        this.savedHoverColors = [...this.chartHoverColors];

        this.topRatedList.sort((a, b) => {
            return a.id - b.id;
        });

        this.setChartData(this.topRatedList, false);
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

    /* <app-ta-time-period
                    #timePeriod
                    (selectTimePeriod)="selectTimePeriod($event)"
                >
                </app-ta-time-period> */
    @ViewChild('timePeriod', { static: false }) public timePeriod: any;
    @ViewChild('tabSwitch', { static: false }) public tabSwitch: any;
    saveCustomRange(ev) {
        this.timePeriod.changeCustomTime(ev);
        this.topDriverBarChart.updateTime('Custom Set', ev);
    }
    ngAfterViewInit(): void {
        if (this.timePeriod && this.timePeriod.changeTimePeriod) {
            this.timePeriod?.changeTimePeriod('All Time');
        }
    }
}
