import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    ViewChild,
    OnDestroy,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ShipperMinimalListQuery } from '../state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal.query';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { ShipperTService } from '../state/shipper-state/shipper.service';

@Component({
    selector: 'app-shipper-card-view',
    templateUrl: './shipper-card-view.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./shipper-card-view.component.scss'],
})
export class ShipperCardViewComponent implements OnInit, OnChanges, OnDestroy {
    private destroy$ = new Subject<void>();
    @ViewChild('stackedBarChart', { static: false })
    public stackedBarChart: any;
    @Input() shipper: any;
    @Input() templateCard: boolean;
    public shipperDropdowns: any[] = [];
    public shipperList: any[] = this.shipperMinimalListQuery.getAll();
    public note: UntypedFormControl = new UntypedFormControl();
    public shipperTabs: any[] = [];

    stackedBarChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#80CBBA',
                    backgroundColor: '#80CBBA',
                    hoverBackgroundColor: '#26A690',
                    hoverBorderColor: '#26A690',
                    barThickness: 18,
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [],
                    label: 'Miles',
                    yAxisID: 'y-axis-0',
                    borderColor: '#EF9A9A',
                    backgroundColor: '#EF9A9A',
                    hoverBackgroundColor: '#E57373',
                    hoverBorderColor: '#E57373',
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

    public stackedBarChartLegend: any[] = [
        {
            title: 'Avg. Pickup Time',
            value: 68.56,
            image: 'assets/svg/common/round_green.svg',
            customClass: 'light_green',
            sufix: 'm',
            elementId: 0,
        },
        {
            title: 'Avg. Delivery Time',
            value: 37.56,
            image: 'assets/svg/common/round_blue.svg',
            customClass: 'light_red',
            sufix: 'm',
            elementId: 1,
        },
    ];

    public stackedBarAxes: object = {
        verticalLeftAxes: {
            visible: true,
            minValue: -30,
            maxValue: 30,
            stepSize: 15,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: false,
        },
    };

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

    public shipperCall: any = {
        id: -1,
        chartType: 1,
    };

    public shipperIndex: any;

    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private shipperMinimalListQuery: ShipperMinimalListQuery,
        private shipperService: ShipperTService
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.shipper?.currentValue != changes.shipper?.previousValue) {
            this.note.patchValue(changes?.shipper.currentValue.note);
            this.shipper = changes.shipper.currentValue;
            this.getShipperChartData(changes.shipper.currentValue.id, this.shipperCall.chartType, false);
            this.getShipperDropdown();
        }
    }
    ngOnInit(): void {
        this.tabsButton();

        let currentIndex = this.shipperList.findIndex(
            (shipper) => shipper.id === this.shipper.id
        );
        this.shipperIndex = currentIndex;
    }
    public getShipperDropdown() {
        this.shipperDropdowns = this.shipperMinimalListQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.businessName,
                    active: item.id === this.shipper.id,
                };
            });
    }

    public tabsButton() {
        this.shipperTabs = [
            {
                id: 223,
                name: '1M',
                checked: true,
            },
            {
                name: '3M',
                checked: false,
            },
            {
                id: 412,
                name: '6M',
                checked: false,
            },
            {
                id: 515,
                name: '1Y',
                checked: false,
            },
            {
                id: 1210,
                name: 'YTD',
                checked: false,
            },
            {
                id: 1011,
                name: 'ALL',
                checked: false,
            },
        ];
    }
    public onSelectedShipper(event: any) {
        if ( event && event.id !== this.shipper.id) {
            this.shipperList = this.shipperMinimalListQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.businessName,
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeShipper(action: string) {
        let currentIndex = this.shipperList.findIndex(
            (shipper) => shipper.id === this.shipper.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.shipperList[currentIndex].id
                    );
                    this.onSelectedShipper({
                        id: this.shipperList[currentIndex].id,
                    });
                    this.shipperIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.shipperList.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.shipperList[currentIndex].id
                    );
                    this.onSelectedShipper({
                        id: this.shipperList[currentIndex].id,
                    });
                    this.shipperIndex = currentIndex;
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public converTime(mod) {
        let time_string = moment(mod, 'HH:mm').format('hh:mm A');
        return time_string;
    }

    public changeShipperTabs(ev: any) {
        const chartType = this.stackedBarChart?.detailsTimePeriod(ev.name);
        this.getShipperChartData(this.shipper.id, chartType);
    }

    public getShipperChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ) {
        if (
            id != this.shipperCall.id ||
            chartType != this.shipperCall.chartType
        ) {
            this.shipperCall.id = id;
            this.shipperCall.chartType = chartType;
        } else {
            return false;
        }
        this.shipperService
            .getShipperChart(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                let avgPickupTime = this.convertTimeSpanToMinutes(
                        item.avgPickupTime
                    ),
                    avgDeliveryTime = this.convertTimeSpanToMinutes(
                        item.avgDeliveryTime
                    );
                this.stackedBarChartConfig.dataLabels = [];
                this.stackedBarChartConfig.chartValues = [
                    avgPickupTime,
                    avgDeliveryTime,
                ];
                this.stackedBarChartLegend[0].value = avgPickupTime;
                this.stackedBarChartLegend[1].value = avgDeliveryTime;
                let hasValue = false;
                this.stackedBarChartLegend.map((leg) => {
                    if (leg.value > 0) {
                        hasValue = true;
                    }
                });
                this.stackedBarChartConfig.hasValue = hasValue;
                let milesPerGallon = [],
                    costPerGallon = [],
                    labels = [],
                    maxValue = 0;
                if (item?.shipperAverageWaitingTimeChartResponse?.length > 17) {
                    this.stackedBarChartConfig.dataProperties[0].defaultConfig.barThickness = 10;
                    this.stackedBarChartConfig.dataProperties[1].defaultConfig.barThickness = 10;
                } else {
                    this.stackedBarChartConfig.dataProperties[0].defaultConfig.barThickness = 18;
                    this.stackedBarChartConfig.dataProperties[1].defaultConfig.barThickness = 18;
                }
                this.stackedBarChart.toolTipData = [];
                item.shipperAverageWaitingTimeChartResponse.map(
                    (data, index) => {
                        let pickup = this.convertTimeSpanToMinutes(
                            data.avgPickupTime
                        );
                        let delivery = this.convertTimeSpanToMinutes(
                            data.avgDeliveryTime
                        );

                        this.stackedBarChart.toolTipData.push(data);

                        if (delivery + pickup > maxValue) {
                            maxValue =
                                delivery +
                                pickup +
                                ((delivery + pickup) * 7) / 100;
                        }
                        if (data.day) {
                            labels.push([
                                data.day,
                                this.monthList[data.month - 1],
                            ]);
                        } else {
                            labels.push([this.monthList[data.month - 1]]);
                        }

                        delivery = delivery ? -delivery : 0;
                        milesPerGallon.push(pickup);
                        costPerGallon.push(delivery);
                    }
                );

                this.stackedBarAxes['verticalLeftAxes']['maxValue'] =
                    maxValue / 2;
                this.stackedBarAxes['verticalLeftAxes']['minValue'] = -(
                    maxValue / 2
                );
                this.stackedBarChartConfig.dataLabels = labels;
                this.stackedBarChartConfig.dataProperties[0].defaultConfig.data =
                    milesPerGallon;
                this.stackedBarChartConfig.dataProperties[1].defaultConfig.data =
                    costPerGallon;
                this.stackedBarChart.chartDataCheck(
                    this.stackedBarChartConfig.chartValues
                );
                this.stackedBarChart.updateChartData(hideAnimation);
                this.stackedBarChart.saveValues = JSON.parse(
                    JSON.stringify(this.stackedBarChartLegend)
                );
                this.stackedBarChart.legendAttributes = JSON.parse(
                    JSON.stringify(this.stackedBarChartLegend)
                );
            });

        //this.ref.detectChanges();
    }

    convertTimeSpanToMinutes(timespan) {
        if (!timespan) {
            return 0;
        }
        let totalMinutes = 0;
        let timeArr = JSON.stringify(timespan);
        timeArr = JSON.parse(timeArr).split('.');
        if (timeArr.length > 1) {
            const days = Number(timeArr[0]);
            console.log(days, 'timeArr');
            let hoursAndMinutes = timeArr[1].split(':');
            const hours = Number(hoursAndMinutes[0]) + days * 24;
            const minutes = Number([hoursAndMinutes[1]]);

            totalMinutes = hours * 60 + minutes;
        } else {
            let hoursAndMinutes = timeArr[0].split(':');
            const hours = Number(hoursAndMinutes[0]);
            const minutes = Number([hoursAndMinutes[1]]);
            totalMinutes = hours * 60 + minutes;
        }

        return totalMinutes;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
