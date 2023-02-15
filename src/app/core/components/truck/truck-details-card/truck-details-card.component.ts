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
                    data: [
                        10000, 18000, 20000, 13000, 9000, 10000, 16000, 19000,
                        20000, 15000, 19000, 20000,
                    ],
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
                    data: [41, 27, 50, 33, 37, 37, 39, 39, 41, 37, 47, 50],
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
        chartValues: [150, 257.7, 190, 568.85],
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
            showGridLines: true,
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
    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private truckMinimalListQuery: TrucksMinimalListQuery,
        private truckService: TruckTService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.truck.firstChange && changes?.truck) {
            this.noteControl.patchValue(changes.truck.currentValue.note);
            this.getTruckDropdown();
        }
        this.getExpensesChartData(changes.truck.currentValue.id, 1, false);
        this.getFuelConsumtionChartData(changes.truck.currentValue.id, 1, false);
        this.getRevenueChartData(changes.truck.currentValue.id, 1, false);

        this.changeColor();
        this.truckMinimalListQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.truck_list = item));
    }
    ngOnInit(): void {
        this.getTruckById(this.truck.id);
        this.getExpensesChartData(this.truck.id, 1, false);
        this.getFuelConsumtionChartData(this.truck.id, 1, false);
        this.getRevenueChartData(this.truck.id, 1, false);
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

        let currentIndex = this.truck_list.findIndex(
            (truck) => truck.id === this.truck.id
        );
        this.truckIndex = currentIndex;
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
        this.truckService
            .getExpenses(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                console.log(item, 'itemmm');
                this.stackedBarChartConfig.dataLabels = [];
                this.stackedBarChartConfig.chartValues = [
                    item.fuelCost,
                    item.repairCost,
                    item.totalCost,
                ];
                this.stackedBarChartLegend[0].value = item.fuelCost;
                this.stackedBarChartLegend[1].value = item.repairCost;
                this.stackedBarChartLegend[2].value = item.totalCost;
                let fuelCost = [],
                    repairCost = [],
                    labels = [],
                    maxValue = 0;
                if (item?.truckExpensesCharts?.length > 17) {
                    this.stackedBarChartConfig.dataProperties[0].defaultConfig.barThickness = 10;
                    this.stackedBarChartConfig.dataProperties[1].defaultConfig.barThickness = 10;
                } else {
                    this.stackedBarChartConfig.dataProperties[0].defaultConfig.barThickness = 18;
                    this.stackedBarChartConfig.dataProperties[1].defaultConfig.barThickness = 18;
                }
                item.truckExpensesCharts.map((data, index) => {
                    fuelCost.push(data.fuelCost);
                    repairCost.push(data.repairCost);
                    if (data.fuelCost + data.repairCost > maxValue) {
                        maxValue =
                            data.fuelCost +
                            data.repairCost +
                            ((data.fuelCost + data.repairCost) * 7) / 100;
                    }
                    if (data.day) {
                        labels.push([data.day, this.monthList[data.month - 1]]);
                    } else {
                        labels.push([this.monthList[data.month - 1]]);
                    }
                });

                this.stackedBarAxes['verticalLeftAxes']['maxValue'] = maxValue;
                this.stackedBarChartConfig.dataLabels = labels;
                this.stackedBarChartConfig.dataProperties[0].defaultConfig.data =
                    fuelCost;
                this.stackedBarChartConfig.dataProperties[1].defaultConfig.data =
                    repairCost;
                this.stackedBarChart.chartDataCheck(
                    this.stackedBarChartConfig.chartValues
                );
                this.stackedBarChart.updateChartData(hideAnimation);
                this.stackedBarChart.saveValues = JSON.parse(
                    JSON.stringify(this.stackedBarChartLegend)
                );
            });
    }

    public getFuelConsumtionChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ) {
        this.truckService
            .getFuelConsumption(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.payrollChartConfig.dataLabels = [];
                this.payrollChartConfig.chartValues = [
                    item.milesPerGallon,
                    item.costPerGallon,
                ];
                this.barChartLegend[0].value = item.milesPerGallon;
                this.barChartLegend[1].value = item.costPerGallon;
                let milesPerGallon = [],
                    costPerGallon = [],
                    labels = [],
                    maxValue = 0,
                    maxValue2 = 0;
                if (item?.truckFuelConsumptionCharts?.length > 17) {
                    this.payrollChartConfig.dataProperties[1].defaultConfig.barThickness = 10;
                } else {
                    this.payrollChartConfig.dataProperties[1].defaultConfig.barThickness = 18;
                }
                item.truckFuelConsumptionCharts.map((data, index) => {
                    milesPerGallon.push(data.milesPerGallon);
                    costPerGallon.push(data.costPerGallon);
                    if (data.milesPerGallon > maxValue) {
                        maxValue =
                            data.milesPerGallon +
                            (data.milesPerGallon * 7) / 100;
                    }
                    if (data.costPerGallon > maxValue2) {
                        maxValue2 =
                            data.costPerGallon + (data.costPerGallon * 7) / 100;
                    }
                    if (data.day) {
                        labels.push([data.day, this.monthList[data.month - 1]]);
                    } else {
                        labels.push([this.monthList[data.month - 1]]);
                    }
                });

                this.barAxes['verticalLeftAxes']['maxValue'] = maxValue;
                this.barAxes['verticalRightAxes']['maxValue'] = maxValue2;
                this.payrollChartConfig.dataLabels = labels;
                this.payrollChartConfig.dataProperties[0].defaultConfig.data =
                    costPerGallon;
                this.payrollChartConfig.dataProperties[1].defaultConfig.data =
                    milesPerGallon;
                this.payrollChart.chartDataCheck(
                    this.payrollChartConfig.chartValues
                );
                this.payrollChart.updateChartData(hideAnimation);
                this.payrollChart.saveValues = JSON.parse(
                    JSON.stringify(this.barChartLegend)
                );
            });
    }

    public getRevenueChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ) {
        this.truckService
            .getRevenue(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.revenueChartConfig.dataLabels = [];
                this.revenueChartConfig.chartValues = [
                    item.miles,
                    item.revenue,
                ];
                this.barChartLegend2[0].value = item.miles;
                this.barChartLegend2[1].value = item.revenue;
                let milesPerGallon = [],
                    costPerGallon = [],
                    labels = [],
                    maxValue = 0,
                    maxValue2 = 0;
                if (item?.truckRevenueCharts?.length > 17) {
                    this.revenueChartConfig.dataProperties[1].defaultConfig.barThickness = 10;
                } else {
                    this.revenueChartConfig.dataProperties[1].defaultConfig.barThickness = 18;
                }
                item.truckRevenueCharts.map((data, index) => {
                    milesPerGallon.push(data.miles);
                    costPerGallon.push(data.revenue);
                    if (data.miles > maxValue) {
                        maxValue =
                            data.miles +
                            (data.miles * 7) / 100;
                    }
                    if (data.revenue > maxValue2) {
                        maxValue2 =
                            data.revenue + (data.revenue * 7) / 100;
                    }
                    if (data.day) {
                        labels.push([data.day, this.monthList[data.month - 1]]);
                    } else {
                        labels.push([this.monthList[data.month - 1]]);
                    }
                });

                this.barAxes2['verticalLeftAxes']['maxValue'] = maxValue;
                this.barAxes2['verticalRightAxes']['maxValue'] = maxValue2;
                this.revenueChartConfig.dataLabels = labels;
                this.revenueChartConfig.dataProperties[0].defaultConfig.data =
                    costPerGallon;
                this.revenueChartConfig.dataProperties[1].defaultConfig.data =
                    milesPerGallon;
                this.revenueChart.chartDataCheck(
                    this.revenueChartConfig.chartValues
                );
                this.revenueChart.updateChartData(hideAnimation);
                this.revenueChart.saveValues = JSON.parse(
                    JSON.stringify(this.barChartLegend2)
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
        let chartType =
            ev.name == '1M'
                ? 1
                : ev.name == '3M'
                ? 2
                : ev.name == '6M'
                ? 3
                : ev.name == '1Y'
                ? 4
                : ev.name == 'YTD'
                ? 5
                : ev.name == 'ALL'
                ? 6
                : 1;

        this.getExpensesChartData(this.truck.id, chartType);
    }
    public changeTabFuel(ev: any) {
        let chartType =
            ev.name == '1M'
                ? 1
                : ev.name == '3M'
                ? 2
                : ev.name == '6M'
                ? 3
                : ev.name == '1Y'
                ? 4
                : ev.name == 'YTD'
                ? 5
                : ev.name == 'ALL'
                ? 6
                : 1;

        this.getFuelConsumtionChartData(this.truck.id, chartType);
    }
    public changeTabRevenue(ev: any) {
        let chartType =
            ev.name == '1M'
                ? 1
                : ev.name == '3M'
                ? 2
                : ev.name == '6M'
                ? 3
                : ev.name == '1Y'
                ? 4
                : ev.name == 'YTD'
                ? 5
                : ev.name == 'ALL'
                ? 6
                : 1;

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
        }
    }
    public onChangeTruck(action: string) {
        let currentIndex = this.truck_list.findIndex(
            (truck) => truck.id === this.truck.id
        );
        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.truck_list[currentIndex].id
                    );
                    this.onSelectedTruck({
                        id: this.truck_list[currentIndex].id,
                    });
                    this.truckIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.truck_list.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.truck_list[currentIndex].id
                    );
                    this.onSelectedTruck({
                        id: this.truck_list[currentIndex].id,
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

    public onOpenCloseCard(mod: any){
        this.ownerCardOpened = mod;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
