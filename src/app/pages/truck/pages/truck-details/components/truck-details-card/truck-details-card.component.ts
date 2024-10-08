import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    ViewChild,
    Input,
    SimpleChanges,
    HostListener,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';

import { Subject, takeUntil } from 'rxjs';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckService } from '@shared/services/truck.service';

// animations
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

// store
import { TrucksMinimalListQuery } from '@pages/truck/state/truck-details-minima-list-state/truck-details-minimal.query';

// enums
import { ChartAxisPositionEnum } from '@shared/components/ta-chart/enums/chart-axis-position-string.enum';
import { ChartLegendDataStringEnum } from '@shared/components/ta-chart/enums/chart-legend-data-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TruckDetailsEnum } from '@pages/truck/pages/truck-details/enums/truck-details.enum';

// constants
import { ChartConstants } from '@shared/components/ta-chart/utils/constants/chart.constants';
import { TruckDetailsConstants } from '@pages/truck/pages/truck-details/utils/constants/truck-details.constants';

// components
//import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';

// models
import { TruckResponse, TruckPerformanceResponse } from 'appcoretruckassist';
import { DoughnutChartConfig } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';
import { BarChartAxes } from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';
import { ChartApiCall } from '@shared/components/ta-chart/models/chart-api-call.model';
import { LegendAttributes } from '@shared/components/ta-chart/models/legend-attributes.model';

@Component({
    selector: 'app-truck-details-card',
    templateUrl: './truck-details-card.component.html',
    styleUrls: ['./truck-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        cardComponentAnimation('showHideCardBody'),
        trigger('ownerDetailsAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'hidden',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    opacity: 0,
                })
            ),
            transition('false <=> true', [animate('0.2s ease')]),
            transition('true <=> false', [animate('0.2s ease')]),
        ]),
    ],
})
export class TruckDetailsCardComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('revenueChart', { static: false }) public revenueChart: any;
    @ViewChild('stackedBarChart', { static: false })
    public stackedBarChart: any;
    @ViewChild('payrollChart', { static: false }) public payrollChart: any;
    public noteControl: UntypedFormControl = new UntypedFormControl();
    public fhwaNote: UntypedFormControl = new UntypedFormControl();
    public registrationNote: UntypedFormControl = new UntypedFormControl();
    public titleNote: UntypedFormControl = new UntypedFormControl();
    public buttonsArrayPerfomance: any;
    public buttonsArrayFuel: any;
    public buttonsArrayRevenue: any;
    public toggler: boolean[] = [];
    public togglerOwner: boolean;
    public truckDropDowns: any[] = [];
    public dataEdit: any;
    private destroy$ = new Subject<void>();
    @Input() templateCard: boolean = false;
    @Input() truck: TruckResponse;
    public ownersData: any;
    public truck_list: any[] = this.truckMinimalListQuery.getAll();
    private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;
    public ownerCardOpened: boolean = true;
    public featureNumber: number = 0;
    payrollChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [],
                    label: 'Salary',
                    yAxisID: 'y-axis-1',
                    borderColor: '#6D82C7',
                    pointBackgroundColor: '#FFFFFF',
                    pointHoverBackgroundColor: '#6D82C7',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#FFCC80',
                    backgroundColor: '#FFCC80',
                    hoverBackgroundColor: '#FFA726',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [0, 0],
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        hoverTimeDisplay: true,
        noChartImage: 'assets/svg/common/yellow_no_data.svg',
        showHoverTooltip: true,
        showZeroLine: true,
    };

    revenueChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [],
                    label: 'Salary',
                    yAxisID: 'y-axis-1',
                    borderColor: '#6D82C7',
                    pointBackgroundColor: '#FFFFFF',
                    pointHoverBackgroundColor: '#6D82C7',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#B2DFD1',
                    backgroundColor: '#B2DFD1',
                    hoverBackgroundColor: '#4DB6A2',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        noChartImage: 'assets/svg/common/green_no_data.svg',
        hasSameDataIndex: true,
        showHoverTooltip: true,
        showZeroLine: true,
    };

    stackedBarChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#FFCC80',
                    backgroundColor: '#FFCC80',
                    hoverBackgroundColor: '#FFA726',
                    hoverBorderColor: '#FFA726',
                    barThickness: 18,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#97A8DC',
                    backgroundColor: '#97A8DC',
                    hoverBackgroundColor: '#536BC2',
                    hoverBorderColor: '#536BC2',
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [0, 0, 0],
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        stacked: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        noChartImage: 'assets/svg/common/stacked_no_data.svg',
        showHoverTooltip: true,
        showZeroLine: true,
    };

    public barChartLegend: LegendAttributes[] = [
        {
            title: 'Miles Per Gallon',
            value: 0,
            image: 'assets/svg/common/round_yellow.svg',
            sufix: 'mi',
            elementId: 1,
        },
        {
            title: 'Cost Per Gallon',
            value: 0,
            image: 'assets/svg/common/round_blue.svg',
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 0,
        },
    ];

    public barChartLegend2: LegendAttributes[] = [
        {
            title: 'Miles',
            value: 0,
            image: 'assets/svg/common/round_blue_light.svg',
            sufix: 'mi',
            elementId: 1,
        },
        {
            title: 'Revenue',
            value: 0,
            image: 'assets/svg/common/round_blue.svg',
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 0,
        },
    ];

    public stackedBarChartLegend: LegendAttributes[] = [
        {
            title: 'Fuel Cost',
            value: 0,
            image: 'assets/svg/common/round_yellow.svg',
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 0,
        },
        {
            title: 'Repair Cost',
            value: 0,
            image: 'assets/svg/common/round_blue.svg',
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 1,
        },
        {
            title: 'Total Cost',
            value: 0,
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 'total',
        },
    ];

    public barAxes: BarChartAxes = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 60,
            stepSize: 15,
            showGridLines: false,
        },
        verticalRightAxes: {
            visible: true,
            minValue: 0,
            maxValue: 24000,
            stepSize: 6000,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: ChartAxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    public barAxes2: BarChartAxes = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 60,
            stepSize: 15,
            showGridLines: false,
        },
        verticalRightAxes: {
            visible: true,
            minValue: 0,
            maxValue: 24000,
            stepSize: 6000,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: ChartAxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    public stackedBarAxes: BarChartAxes = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 60,
            stepSize: 15,
            showGridLines: false,
        },
        verticalRightAxes: {
            visible: true,
            minValue: 0,
            maxValue: 24000,
            stepSize: 6000,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: ChartAxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };
    public truckIndex: number;
    public revenueCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    public performanceCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    public expensesCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    public fuelCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    public performance: TruckPerformanceResponse;
    public isWideScreen: boolean = false;
    public ownerHistoryHeader: { label: string }[] =
        TruckDetailsConstants.ownerHistoryHeader;

    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private truckMinimalListQuery: TrucksMinimalListQuery,
        private truckService: TruckService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.truck.firstChange && changes?.truck) {
            this.noteControl.patchValue(changes.truck.currentValue.note);
            this.getTruckDropdown();
        }
        this.setFeatureNumber(this.truck);
        this.checkWidth(window.innerWidth);

        this.getTruckChartData(changes.truck.currentValue.id);

        this.changeColor();
        this.truckMinimalListQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.truck_list = item));
    }
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkWidth(event.target.innerWidth);
    }

    checkWidth(width: number) {
        this.isWideScreen = width > 1508; // Adjust the width threshold as needed
    }
    ngOnInit(): void {
        this.noteControl.patchValue(this.truck.note);
        this.getTruckDropdown();
        this.buttonSwitcher();
        this.initTableOptions();

        let array1 = [...this.truck.ownerHistories];

        array1.sort((a, b) => {
            return b.id - a.id;
        });
        //this.truck.ownerHistories = array1;
        this.ownersData = array1;
        setTimeout(() => {
            let currentIndex = this.truckDropDowns.findIndex(
                (truck) => truck.id === this.truck.id
            );

            this.truckIndex = currentIndex;
        }, 300);
    }

    public sortKeys = (a, b) => {
        return a.value.id > b.value.id ? -1 : 1;
    };

    public changeColor() {
        document.documentElement.style.setProperty(
            '--dynamic-colour',
            this.truck?.color?.code ? this.truck.color.code : '#aaa'
        );
    }

    public buttonSwitcher() {
        this.buttonsArrayPerfomance = [
            {
                id: 5,
                name: '1M',
                checked: true,
            },
            {
                id: 10,
                name: '3M',
            },
            {
                id: 12,
                name: '6M',
            },
            {
                id: 15,
                name: '1Y',
            },
            {
                id: 20,
                name: 'YTD',
            },
            {
                id: 30,
                name: 'ALL',
            },
        ];
        this.buttonsArrayRevenue = [
            {
                id: 36,
                name: '1M',
                checked: true,
            },
            {
                id: 66,
                name: '3M',
            },
            {
                id: 97,
                name: '6M',
            },
            {
                id: 99,
                name: '1Y',
            },
            {
                id: 101,
                name: 'YTD',
            },
            {
                id: 103,
                name: 'ALL',
            },
        ];
        this.buttonsArrayFuel = [
            {
                id: 222,
                name: '1M',
                checked: true,
            },
            {
                id: 333,
                name: '3M',
            },
            {
                id: 444,
                name: '6M',
            },
            {
                id: 555,
                name: '1Y',
            },
            {
                id: 231,
                name: 'YTD',
            },
            {
                id: 213,
                name: 'ALL',
            },
        ];
    }

    public getExpensesChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ) {
        if (
            id != this.expensesCall.id ||
            chartType != this.expensesCall.chartType
        ) {
            this.expensesCall.id = id;
            this.expensesCall.chartType = chartType;
        } else {
            return false;
        }
        this.truckService
            .getExpenses(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.chartDataSet(
                    this.stackedBarChart,
                    this.stackedBarChartConfig,
                    //this.stackedBarChartLegend,
                    this.stackedBarAxes,
                    item,
                    hideAnimation,
                    false,
                    //true
                );
            });
    }
    public getPerformanceChart(id: number, chartType: number) {
        if (
            id != this.performanceCall.id ||
            chartType != this.performanceCall.chartType
        ) {
            this.performanceCall.id = id;
            this.performanceCall.chartType = chartType;
        } else {
            return false;
        }
        this.truckService
            .getPerformace(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.performance = item;
            });
    }
    public getFuelConsumtionChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ) {
        if (id != this.fuelCall.id || chartType != this.fuelCall.chartType) {
            this.fuelCall.id = id;
            this.fuelCall.chartType = chartType;
        } else {
            return false;
        }
        this.truckService
            .getFuelConsumption(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.chartDataSet(
                    this.payrollChart,
                    this.payrollChartConfig,
                    //this.barChartLegend,
                    this.barAxes,
                    item,
                    hideAnimation,
                    true
                );
            });
    }

    public getRevenueChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ) {
        if (
            id != this.revenueCall.id ||
            chartType != this.revenueCall.chartType
        ) {
            this.revenueCall.id = id;
            this.revenueCall.chartType = chartType;
        } else {
            return false;
        }
        this.truckService
            .getRevenue(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.chartDataSet(
                    this.revenueChart,
                    this.revenueChartConfig,
                    //this.barChartLegend2,
                    this.barAxes2,
                    item,
                    hideAnimation,
                    true
                );
            });
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataEdit = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: TableStringEnum.EDIT_2,
                    name: TableStringEnum.EDIT,
                    class: TableStringEnum.REGULAR_TEXT,
                    contentType: TableStringEnum.EDIT,
                },

                {
                    title: TableStringEnum.DELETE_2,
                    name: TableStringEnum.DELETE_ITEM,
                    type: TableStringEnum.DRIVER,
                    text: 'Are you sure you want to delete driver(s)?',
                    class: TableStringEnum.DELETE_TEXT,
                    iconName: TableStringEnum.DELETE,
                },
            ],
            export: true,
        };
    }
    public changeTabExpenses(ev: any) {
        const chartType = this.stackedBarChart?.detailsTimePeriod(ev.name);
        this.getExpensesChartData(this.truck.id, chartType);
    }
    public changeTabPerfomance(ev: any) {
        const chartType = this.payrollChart?.detailsTimePeriod(ev.name);
        this.getPerformanceChart(this.truck.id, chartType);
    }
    public changeTabFuel(ev: any) {
        const chartType = this.payrollChart?.detailsTimePeriod(ev.name);
        this.getFuelConsumtionChartData(this.truck.id, chartType);
    }
    public changeTabRevenue(ev: any) {
        const chartType = this.revenueChart?.detailsTimePeriod(ev.name);
        this.getRevenueChartData(this.truck.id, chartType);
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string) {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    /**Function retrun id */
    public identity(index: number, _: any): number {
        return index;
    }
    public getTruckDropdown() {
        this.truckDropDowns = this.truckMinimalListQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.truckNumber,
                    status: item.status,
                    svg: item.truckType.logoName,
                    folder: 'common/trucks',
                    active: item.id === this.truck.id,
                    owner: item.owner,
                };
            });

        this.truckDropDowns = this.truckDropDowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedTruck(event: any) {
        if (event && event.id !== this.truck.id) {
            this.truckDropDowns = this.truckMinimalListQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.truckNumber,
                        svg: item.truckType.logoName,
                        folder: 'common/trucks',
                        status: item.status,
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);

            this.truckDropDowns = this.truckDropDowns.sort(
                (x, y) => Number(y.status) - Number(x.status)
            );
        }
    }
    public onChangeTruck(action: string) {
        let currentIndex = this.truckDropDowns.findIndex(
            (truck) => truck.id === this.truck.id
        );

        switch (action) {
            case TruckDetailsEnum.PREVIOUS: {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.truckDropDowns[currentIndex].id
                    );
                    this.onSelectedTruck({
                        id: this.truckDropDowns[currentIndex].id,
                    });
                    this.truckIndex = currentIndex;
                }
                break;
            }
            case TruckDetailsEnum.NEXT: {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.truckDropDowns.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.truckDropDowns[currentIndex].id
                    );
                    this.onSelectedTruck({
                        id: this.truckDropDowns[currentIndex].id,
                    });
                    this.truckIndex = currentIndex;
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    public onOpenCloseCard(mod: any) {
        this.ownerCardOpened = mod;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public chartDataSet(
        //chart: TaChartComponent,
        config: DoughnutChartConfig,
        legend: LegendAttributes[],
        axes: BarChartAxes,
        item: any, //leave this any because of many responses
        hideAnimation?: boolean,
        reverse?: boolean,
        stacked?: boolean
    ): void {
        config.dataLabels = [];
        config.chartValues = [
            item?.fuelCost
                ? item.fuelCost
                : item?.milesPerGallon
                    ? item.milesPerGallon
                    : item?.miles
                        ? item.miles
                        : 0,
            item?.repairCost
                ? item.repairCost
                : item?.costPerGallon
                    ? item.costPerGallon
                    : item?.revenue
                        ? item.revenue
                        : 0,
            item?.totalCost ? item.totalCost : null,
        ];

        if (legend.length > 2) {
            legend[0].value = item?.fuelCost
                ? item.fuelCost
                : item?.milesPerGallon
                    ? item.milesPerGallon
                    : 0;
            legend[1].value = item?.repairCost
                ? item.repairCost
                : item?.costPerGallon
                    ? item.costPerGallon
                    : 0;
            legend[2].value = item?.totalCost ? item.totalCost : null;
        } else {
            legend[0].value = item?.fuelCost
                ? item.fuelCost
                : item?.milesPerGallon
                    ? item.milesPerGallon
                    : item?.miles
                        ? item.miles
                        : 0;
            legend[1].value = item?.repairCost
                ? item.repairCost
                : item?.costPerGallon
                    ? item.costPerGallon
                    : item?.revenue
                        ? item.revenue
                        : 0;
        }

        let hasValue = false;

        legend.map((leg) => {
            if (leg.value > 0) hasValue = true;
        });

        config.hasValue = hasValue;

        let fuelCost = [],
            repairCost = [],
            labels = [],
            maxValue = 0,
            maxValue2 = 0;
        const mapData = item?.truckExpensesCharts
            ? item.truckExpensesCharts
            : item?.truckFuelConsumptionCharts
                ? item.truckFuelConsumptionCharts
                : item?.truckRevenueCharts
                    ? item.truckRevenueCharts
                    : null;
        if (mapData?.length > 17) {
            config.dataProperties[0].defaultConfig.barThickness = 10;
            config.dataProperties[1].defaultConfig.barThickness = 10;
        } else {
            config.dataProperties[0].defaultConfig.barThickness = 18;
            config.dataProperties[1].defaultConfig.barThickness = 18;
        }
       // chart.toolTipData = [];
        mapData.map((data) => {
            //chart.toolTipData.push(data);
            let dataVal1 = data?.fuelCost
                ? data.fuelCost
                : data?.milesPerGallon
                    ? data.milesPerGallon
                    : data?.miles
                        ? data.miles
                        : 0;
            let dataVal2 = data?.repairCost
                ? data.repairCost
                : data?.costPerGallon
                    ? data.costPerGallon
                    : data?.revenue
                        ? data.revenue
                        : 0;
            fuelCost.push(dataVal1);
            repairCost.push(dataVal2);
            if (stacked && dataVal1 + dataVal2 > maxValue)
                maxValue =
                    dataVal1 + dataVal2 + ((dataVal1 + dataVal2) * 7) / 100;
            else if (!stacked && dataVal1 > maxValue)
                maxValue = dataVal1 + (dataVal1 * 7) / 100;
            if (dataVal2 > maxValue2)
                maxValue2 = dataVal2 + (dataVal2 * 7) / 100;
            if (data.day)
                labels.push([data.day, this.monthList[data.month - 1]]);
            else labels.push([this.monthList[data.month - 1]]);
        });

        axes.verticalLeftAxes.maxValue = maxValue;
        axes.verticalRightAxes.maxValue = maxValue2;

        config.dataLabels = labels;
        config.dataProperties[0].defaultConfig.data = reverse
            ? repairCost
            : fuelCost;
        config.dataProperties[1].defaultConfig.data = reverse
            ? fuelCost
            : repairCost;
        // chart.chartDataCheck(config.chartValues);
        // chart.updateChartData(hideAnimation);
        // chart.saveValues = JSON.parse(JSON.stringify(legend));
        // chart.legendAttributes = JSON.parse(JSON.stringify(legend));
    }

    public setFeatureNumber(truck: TruckResponse): void {
        this.featureNumber = 0;
        if (truck.doubleBunk) {
            this.featureNumber++;
        }
        if (truck.refrigerator) {
            this.featureNumber++;
        }
        if (truck.blower) {
            this.featureNumber++;
        }
        if (truck.pto) {
            this.featureNumber++;
        }
        if (truck.dashCam) {
            this.featureNumber++;
        }
        if (truck.headacheRack) {
            this.featureNumber++;
        }
        if (truck.dcInverter) {
            this.featureNumber++;
        }
    }

    public getLastSixChars(mod: string): string | string[] {
        let lastSixChars: string | string[] = mod;

        if (mod.length > 6) {
            lastSixChars = mod.slice(-6);

            let stringLength = mod.length;
            let firsNum = stringLength - 6;
            lastSixChars = [mod.slice(0, firsNum), mod.slice(-6)];
        }
        return lastSixChars;
    }

    public getTruckChartData(id: number): void {
        this.getExpensesChartData(id, this.expensesCall.chartType, false);
        this.getPerformanceChart(id, this.performanceCall.chartType);

        this.getFuelConsumtionChartData(id, this.fuelCall.chartType, false);
        this.getRevenueChartData(id, this.revenueCall.chartType, false);
    }
}
