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
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { card_component_animation } from '../../shared/animations/card-component.animations';
import { TrucksMinimalListQuery } from '../state/truck-details-minima-list-state/truck-details-minimal.query';
import { TruckTService } from '../state/truck.service';
import { animate, style, transition, trigger, state } from '@angular/animations';

@Component({
    selector: 'app-truck-details-card',
    templateUrl: './truck-details-card.component.html',
    styleUrls: ['./truck-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [card_component_animation('showHideCardBody'), 
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
    ]),],
})
export class TruckDetailsCardComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('revenueChart', { static: false }) public revenueChart: any;
    @ViewChild('stackedBarChart', { static: false })
    public stackedBarChart: any;
    @ViewChild('payrollChart', { static: false }) public payrollChart: any;
    public noteControl: FormControl = new FormControl();
    public fhwaNote: FormControl = new FormControl();
    public registrationNote: FormControl = new FormControl();
    public titleNote: FormControl = new FormControl();
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

    payrollChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        9000, 7500, 19000, 10000, 11000, 13500, 18000, 22000,
                        17000, 10000, 11000, 14000,
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
                    data: [33, 25, 42, 12, 23, 33, 50, 57, 34, 19, 12, 42],
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
        chartValues: [100, 100],
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
                    data: [20, 17, 40, 23, 27, 27, 29, 29, 31, 37, 37, 40],
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
                    data: [20, 10, 18, 12, 15, 12, 14, 11, 13, 14, 15, 9],
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
            title: 'Revenue',
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
                checked: false,
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
    public changeTabPerfomance(ev: any) {}
    public changeTabFuel(ev: any) {}
    public changeTabRevenue(ev: any) {}

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
                    name: this.truck.truckNumber,
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
                }

                break;
            }
            default: {
                break;
            }
        }
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
