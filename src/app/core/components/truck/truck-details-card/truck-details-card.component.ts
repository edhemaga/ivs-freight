import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    ViewChild,
    Input,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { card_component_animation } from '../../shared/animations/card-component.animations';
import { TrucksMinimalListQuery } from '../state/truck-details-minima-list-state/truck-details-minimal.query';
import { TruckTService } from '../state/truck.service';
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';
import { ImageBase64Service } from '../../../utils/base64.image';

@Component({
    selector: 'app-truck-details-card',
    templateUrl: './truck-details-card.component.html',
    styleUrls: ['./truck-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        card_component_animation('showHideCardBody'),
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
    @Input() truck: any | any;
    public ownersData: any;
    public truck_list: any[] = this.truckMinimalListQuery.getAll();
    public monthList: any[] = [
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
        'NOV',
        'DEC',
    ];
    public ownerCardOpened: boolean = true;

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
        dataLabels: [
            '',
            'NOV',
            '',
            '2021',
            '',
            'MAR',
            '',
            'MAY',
            '',
            'JUL',
            '',
            'SEP',
        ],
        onHoverAnnotation: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        hoverTimeDisplay: true,
        noChartImage: 'assets/svg/common/yellow_no_data.svg',
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
        dataLabels: [
            '',
            'NOV',
            '',
            '2021',
            '',
            'MAR',
            '',
            'MAY',
            '',
            'JUL',
            '',
            'SEP',
        ],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        noChartImage: 'assets/svg/common/green_no_data.svg',
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
        dataLabels: [
            '',
            'NOV',
            '',
            '2021',
            '',
            'MAR',
            '',
            'MAY',
            '',
            'JUL',
            '',
            'SEP',
        ],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        stacked: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        noChartImage: 'assets/svg/common/stacked_no_data.svg',
    };

    public barChartLegend: any[] = [
        {
            title: 'Miles Per Gallon',
            value: 5830,
            image: 'assets/svg/common/round_yellow.svg',
            sufix: 'mi',
            elementId: 1,
        },
        {
            title: 'Cost Per Gallon',
            value: 19402,
            image: 'assets/svg/common/round_blue.svg',
            prefix: '$',
            elementId: 0,
        },
    ];

    public barChartLegend2: any[] = [
        {
            title: 'Miles',
            value: 150257,
            image: 'assets/svg/common/round_blue_light.svg',
            sufix: 'mi',
            elementId: 1,
        },
        {
            title: 'Revenue',
            value: 190568,
            image: 'assets/svg/common/round_blue.svg',
            prefix: '$',
            elementId: 0,
        },
    ];

    public stackedBarChartLegend: any[] = [
        {
            title: 'Fuel Cost',
            value: 68.56,
            image: 'assets/svg/common/round_yellow.svg',
            prefix: '$',
            elementId: 0,
        },
        {
            title: 'Repair Cost',
            value: 37.56,
            image: 'assets/svg/common/round_blue.svg',
            prefix: '$',
            elementId: 1,
        },
        {
            title: 'Total Cost',
            value: 105.63,
            prefix: '$',
            elementId: 'total',
        },
    ];

    public barAxes: object = {
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
            position: 'bottom',
            showGridLines: false,
        },
    };

    public barAxes2: object = {
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
            position: 'bottom',
            showGridLines: false,
        },
    };

    public stackedBarAxes: object = {
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
            position: 'bottom',
            showGridLines: false,
        },
    };
    public truckIndex: any;
    public revenueCall: any = {
        id: -1,
        chartType: -1,
    };
    public expensesCall: any = {
        id: -1,
        chartType: -1,
    };
    public fuelCall: any = {
        id: -1,
        chartType: -1,
    };
    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private truckMinimalListQuery: TrucksMinimalListQuery,
        private truckService: TruckTService,
        public imageBase64Service: ImageBase64Service,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.truck.firstChange && changes?.truck) {
            this.noteControl.patchValue(changes.truck.currentValue.note);
            this.getTruckDropdown();
        }
        this.getExpensesChartData(changes.truck.currentValue.id, 1, false);
        this.getFuelConsumtionChartData(
            changes.truck.currentValue.id,
            1,
            false
        );
        this.getRevenueChartData(changes.truck.currentValue.id, 1, false);

        this.changeColor();
        this.truckMinimalListQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.truck_list = item));
    }
    ngOnInit(): void {
        this.getTruckById(this.truck.id);
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

        setTimeout(()=>{
            let currentIndex = this.truckDropDowns.findIndex(
                (truck) => truck.id === this.truck.id
            );
            
            this.truckIndex = currentIndex;
        }, 300)
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

    public getTruckById(id: number) {
        this.truckService
            .getTruckById(id, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.truck = item;
            });
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
                    this.stackedBarChartLegend,
                    this.stackedBarAxes,
                    item,
                    hideAnimation,
                    false,
                    true
                );
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
                    this.barChartLegend,
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
                    this.barChartLegend2,
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
                    title: 'Edit',
                    name: 'edit',
                    class: 'regular-text',
                    contentType: 'edit',
                },

                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                },
            ],
            export: true,
        };
    }
    public changeTabPerfomance(ev: any) {
        const chartType = this.stackedBarChart?.detailsTimePeriod(ev.name);
        this.getExpensesChartData(this.truck.id, chartType);
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
    public identity(index: number, item: any): number {
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
                };
            });

        this.truckDropDowns = this.truckDropDowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedTruck(event: any) {
        if (event.id !== this.truck.id) {
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
            case 'previous': {
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
            case 'next': {
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

    chartDataSet(
        chart: any,
        config: any,
        legend: any,
        axes: any,
        item: any,
        hideAnimation?: boolean,
        reverse?: boolean,
        stacked?: boolean
    ) {
        config.dataLabels = [];
        config.chartValues = [
            item?.fuelCost
                ? item.fuelCost
                : item?.milesPerGallon
                ? item.milesPerGallon
                : item?.miles
                ? item.miles
                : null,
            item?.repairCost
                ? item.repairCost
                : item?.costPerGallon
                ? item.costPerGallon
                : item?.revenue
                ? item.revenue
                : null,
            item?.totalCost ? item.totalCost : null,
        ];

        if (legend.length > 2) {
            legend[0].value = item?.fuelCost
                ? item.fuelCost
                : item?.milesPerGallon
                ? item.milesPerGallon
                : null;
            legend[1].value = item?.repairCost
                ? item.repairCost
                : item?.costPerGallon
                ? item.costPerGallon
                : null;
            legend[2].value = item?.totalCost ? item.totalCost : null;
        } else {
            legend[0].value = item?.fuelCost
                ? item.fuelCost
                : item?.milesPerGallon
                ? item.milesPerGallon
                : item?.miles
                ? item.miles
                : null;
            legend[1].value = item?.repairCost
                ? item.repairCost
                : item?.costPerGallon
                ? item.costPerGallon
                : item?.revenue
                ? item.revenue
                : null;
        }

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
        chart.toolTipData = [];
        mapData.map((data, index) => {
            chart.toolTipData.push(data);
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
            if (stacked && dataVal1 + dataVal2 > maxValue) {
                maxValue =
                    dataVal1 + dataVal2 + ((dataVal1 + dataVal2) * 7) / 100;
            } else if (!stacked && dataVal1 > maxValue) {
                maxValue = dataVal1 + (dataVal1 * 7) / 100;
            }
            if (dataVal2 > maxValue2) {
                maxValue2 = dataVal2 + (dataVal2 * 7) / 100;
            }
            if (data.day) {
                labels.push([data.day, this.monthList[data.month - 1]]);
            } else {
                labels.push([this.monthList[data.month - 1]]);
            }
        });

        axes['verticalLeftAxes']['maxValue'] = maxValue;
        axes['verticalRightAxes']['maxValue'] = maxValue2;

        config.dataLabels = labels;
        config.dataProperties[0].defaultConfig.data = reverse
            ? repairCost
            : fuelCost;
        config.dataProperties[1].defaultConfig.data = reverse
            ? fuelCost
            : repairCost;
        chart.chartDataCheck(config.chartValues);
        chart.updateChartData(hideAnimation);
        chart.saveValues = JSON.parse(JSON.stringify(legend));
        chart.legendAttributes = JSON.parse(JSON.stringify(legend));
    }
}
