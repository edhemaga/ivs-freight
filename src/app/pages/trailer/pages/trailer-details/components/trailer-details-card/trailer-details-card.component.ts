import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';

// services
import { DetailsPageService } from '@shared/services/details-page.service';

// animations
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';
import { cardComponentAnimation } from '@shared/animations/card-component.animation';

// store
import { TrailersMinimalListQuery } from '@pages/trailer/state/trailer-minimal-list-state/trailer-minimal.query';

// models
import { TrailerDropdown } from '@pages/trailer/pages/trailer-details/models/trailer-dropdown.model';
import { TrailerMinimalResponse } from 'appcoretruckassist';
import { LegendAttributes } from '@shared/components/ta-chart/models/legend-attributes.model';
import { ChartLegendDataStringEnum } from '@shared/components/ta-chart/enums/chart-legend-data-string.enum';
import { ChartApiCall } from '@shared/components/ta-chart/models/chart-api-call.model';
import { BarChartAxes } from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';
import { ChartAxisPositionEnum } from '@shared/components/ta-chart/enums/chart-axis-position-string.enum';

//components
//import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { DoughnutChartConfig } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';

//enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Component({
    selector: 'app-trailer-details-card',
    templateUrl: './trailer-details-card.component.html',
    styleUrls: ['./trailer-details-card.component.scss'],
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
export class TrailerDetailsCardComponent
    implements OnInit, OnChanges, OnDestroy {
    @Input() trailer: any;
    @Input() templateCard: boolean = false;
    @ViewChild('payrollChart', { static: false }) public payrollChart: any;

    private destroy$ = new Subject<void>();
    public note: UntypedFormControl = new UntypedFormControl();
    public titleNote: UntypedFormControl = new UntypedFormControl();
    public registrationNote: UntypedFormControl = new UntypedFormControl();
    public inspectionNote: UntypedFormControl = new UntypedFormControl();
    public toggler: boolean[] = [];
    public dataEdit;
    public toggleOwner: boolean;
    public trailerDropDowns: TrailerDropdown[] = [];
    public trailer_list: TrailerMinimalResponse[] =
        this.trailerMinimalQuery.getAll();
    public trailerIndex: number;
    public ownerCardOpened: boolean = true;

    public stackedBarChartLegend: LegendAttributes = {
        title: 'Fuel Cost',
        value: 0,
        image: 'assets/svg/common/round_yellow.svg',
        prefix: ChartLegendDataStringEnum.DOLLAR,
        elementId: 0,
    };
    public fuelCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };

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
    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private trailerMinimalQuery: TrailersMinimalListQuery
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.trailer?.firstChange) {
            this.getTrailerDropdown();
            this.note.patchValue(changes.trailer.currentValue.note);
        }
        this.trailerMinimalQuery.selectAll().subscribe((item) => {
            this.trailer_list = item;
        });
    }

    ngOnInit(): void {
        this.initTableOptions();
        this.getTrailerDropdown();

        setTimeout(() => {
            let currentIndex = this.trailerDropDowns.findIndex(
                (trailer) => trailer.id === this.trailer.id
            );

            this.trailerIndex = currentIndex;
        }, 300);
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
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

    /**Function return format date from DB */
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public getTrailerDropdown(): void {
        this.trailerDropDowns = this.trailerMinimalQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.trailerNumber,
                    svg: item.trailerType.logoName,
                    folder: 'common/trailers',
                    status: item.status,
                    active: item.id === this.trailer.id,
                };
            });

        this.trailerDropDowns = this.trailerDropDowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedTrailer(event: { id: number }): void {
        if (event && event.id !== this.trailer.id) {
            this.trailerDropDowns = this.trailerMinimalQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.trailerNumber,
                        status: item.status,
                        svg: item.trailerType.logoName,
                        folder: 'common/trailers',
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);

            this.trailerDropDowns = this.trailerDropDowns.sort(
                (x, y) => Number(y.status) - Number(x.status)
            );
        }
    }

    public onChangeTrailer(action: string): void {
        let currentIndex = this.trailerDropDowns.findIndex(
            (trailer) => trailer.id === this.trailer.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.trailerDropDowns[currentIndex].id
                    );
                    this.onSelectedTrailer({
                        id: this.trailerDropDowns[currentIndex].id,
                    });
                    this.trailerIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.trailerDropDowns.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.trailerDropDowns[currentIndex].id
                    );
                    this.onSelectedTrailer({
                        id: this.trailerDropDowns[currentIndex].id,
                    });
                    this.trailerIndex = currentIndex;
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    public sortKeys = (a, b) => {
        return a.value.id > b.value.id ? -1 : 1;
    };

    public onOpenCloseCard(isCardOpen: boolean): void {
        this.ownerCardOpened = isCardOpen;
    }

    public getLastSixChars(copyValue): string | string[] {
        let lastSixChars = copyValue;

        if (copyValue.length > 6) {
            lastSixChars = copyValue.slice(-6);

            const stringLength = copyValue.length;
            const firsNum = stringLength - 6;
            lastSixChars = [copyValue.slice(0, firsNum), copyValue.slice(-6)];
        }

        return lastSixChars;
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
        // this.trailerService
        //     .getFuelConsumption(id, chartType)
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((item) => {
        //         this.chartDataSet(
        //             this.payrollChart,
        //             this.payrollChartConfig,
        //             this.barChartLegend,
        //             this.barAxes,
        //             item,
        //             hideAnimation,
        //             true
        //         );
        //     });
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
        //chart.toolTipData = [];

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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
