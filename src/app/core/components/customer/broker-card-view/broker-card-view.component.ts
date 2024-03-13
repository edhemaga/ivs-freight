import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
    ViewChild,
    OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

//Store
import { BrokerQuery } from '../state/broker-state/broker.query';
import { BrokerMinimalListQuery } from './../state/broker-details-state/broker-minimal-list-state/broker-minimal.query';

//Services
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { BrokerTService } from '../state/broker-state/broker.service';

//Models
import { BrokerResponse } from 'appcoretruckassist';
import { DoughnutChartConfig } from '../../dashboard/state/models/dashboard-chart-models/doughnut-chart.model';
import {
    ChartApiCall,
    LegendAttributes,
} from '../../standalone-components/ta-chart/models/chart-models';
import { BarChartAxes } from '../../dashboard/state/models/dashboard-chart-models/bar-chart.model';
import { BrokerDropdown } from './state/models/broker-models';
import { TabOptions } from '../../standalone-components/ta-tab-switch/state/models/tab-models';

//Constants
import { ChartConstants } from '../../standalone-components/ta-chart/utils/constants/chart.constants';

//Components
import { TaChartComponent } from '../../standalone-components/ta-chart/ta-chart.component';

//Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

//Enums
import {
    ChartTypesEnum,
    ChartColorsEnum,
    ChartDefaultsEnum,
    ChartImagesEnum,
    ChartLegendDataEnum,
    AxisPositionEnum,
} from '../../standalone-components/ta-chart/enums/chart-enums';
import { SETTINGS_ARROW_ACTIONS } from '../../settings/settings-company/utils/enums/settings.enum';
import { BrokerTabsEnum } from './state/enums/broker-enums';

@Component({
    selector: 'app-broker-card-view',
    templateUrl: './broker-card-view.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./broker-card-view.component.scss'],
    providers: [formatDatePipe],
})
export class BrokerCardViewComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('mileageChart') public mileageChart: TaChartComponent;
    @ViewChild('paymentChart') public paymentChart: TaChartComponent;
    @ViewChild('invoiceChart') public invoiceChart: TaChartComponent;

    @Input() broker: BrokerResponse;
    @Input() templateCard: boolean;

    public brokerDropdowns: BrokerDropdown[];
    public brokerList: BrokerResponse[] = this.brokerMinimalQuery.getAll();
    public brokerIndex: number;

    //Invoice
    public invoiceAgeingCounter: number = 0;
    public getPercntageOfPaid: number = 0;

    //Tabs
    public selectedTab: number;
    public tabsBroker: TabOptions[];

    //Note
    public note: UntypedFormControl = new UntypedFormControl();

    //Mileage chart
    public mileageChartConfig: DoughnutChartConfig = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesEnum.LINE,
                    data: [],
                    label: ChartLegendDataEnum.SALARY,
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsEnum.SKY_BLUE,
                    pointBackgroundColor: ChartColorsEnum.WHITE,
                    pointHoverBackgroundColor: ChartColorsEnum.SKY_BLUE,
                    pointHoverBorderColor: ChartColorsEnum.WHITE,
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: ChartTypesEnum.BAR,
                    data: [],
                    label: ChartLegendDataEnum.MILES,
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsEnum.PEACH,
                    backgroundColor: ChartColorsEnum.PEACH,
                    hoverBackgroundColor: ChartColorsEnum.ORANGE,
                    hasGradiendBackground: true,
                    colors: [ChartColorsEnum.CYAN, ChartColorsEnum.APRICOT],
                    hoverColors: [ChartColorsEnum.TEAL, ChartColorsEnum.AMBER],
                    maxBarThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: ChartTypesEnum.BAR,
        chartWidth: ChartDefaultsEnum.WIDTH_417,
        chartHeight: ChartDefaultsEnum.HEIGHT_130,
        onHoverAnnotation: true,
        offset: true,
        hoverTimeDisplay: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesEnum.MIXED_NO_DATA,
    };
    public mileageBarAxes: BarChartAxes = {
        verticalLeftAxes: {
            visible: true,
            minValue: 1,
            maxValue: 3,
            stepSize: 0.5,
            showGridLines: true,
            decimal: true,
        },
        horizontalAxes: {
            visible: true,
            position: AxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };
    public mileageBarChartLegend: LegendAttributes[] = [
        {
            title: ChartLegendDataEnum.AVG_RATE,
            value: 2.37,
            image: ChartImagesEnum.BLUE_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: 0,
        },
        {
            title: ChartLegendDataEnum.HIGHEST_RATE,
            value: 2.86,
            image: ChartImagesEnum.GREEN_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: [1, 0],
        },
        {
            title: ChartLegendDataEnum.LOWEST_RATE,
            value: 1.29,
            image: ChartImagesEnum.YELLOW_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: [1, 1],
        },
    ];

    //Paymeent chart
    public paymentChartConfig: DoughnutChartConfig = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesEnum.LINE,
                    data: [],
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsEnum.SKY_BLUE,
                    pointBackgroundColor: ChartColorsEnum.WHITE,
                    pointHoverBackgroundColor: ChartColorsEnum.SKY_BLUE,
                    pointHoverBorderColor: ChartColorsEnum.WHITE,
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: true,
                    hasGradiendBackground: true,
                    colors: [
                        ChartColorsEnum.PASTEL_BLUE,
                        ChartColorsEnum.RGB_WHITE,
                    ],
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: ChartTypesEnum.BAR,
        chartWidth: ChartDefaultsEnum.WIDTH_417,
        chartHeight: ChartDefaultsEnum.HEIGHT_130,
        annotation: 0,
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesEnum.NO_DATA_PAY,
    };
    public paymentChartLegend: LegendAttributes[] = [
        {
            title: ChartLegendDataEnum.AVG_PAY_PERIODD,
            value: 27,
            image: ChartImagesEnum.BLUE_RED_CIRCLE,
            sufix: ChartLegendDataEnum.DAYS,
            elementId: 0,
            titleReplace: ChartLegendDataEnum.PAY_PERIOD,
            imageReplace: ChartImagesEnum.BLUE_CIRCLE,
        },
        {
            title: ChartLegendDataEnum.PAY_TERM,
            value: 32,
            image: ChartImagesEnum.DASH_LINE,
            sufix: ChartLegendDataEnum.DAYS,
        },
    ];
    public paymentAxes: BarChartAxes = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 52,
            stepSize: 13,
            showGridLines: true,
        },
        horizontalAxes: {
            visible: true,
            position: AxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    //Invoice chart
    public invoiceChartConfig: DoughnutChartConfig = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesEnum.LINE,
                    data: [],
                    label: ChartLegendDataEnum.SALARY,
                    yAxisID: 'y-axis-1', //leave this as a string
                    borderColor: ChartColorsEnum.SKY_BLUE,
                    pointBackgroundColor: ChartColorsEnum.WHITE,
                    pointHoverBackgroundColor: ChartColorsEnum.SKY_BLUE,
                    pointHoverBorderColor: ChartColorsEnum.WHITE,
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: ChartTypesEnum.BAR,
                    data: [],
                    label: ChartLegendDataEnum.MILES,
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsEnum.PEACH,
                    backgroundColor: ChartColorsEnum.PEACH,
                    hoverBackgroundColor: ChartColorsEnum.ORANGE,
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: ChartTypesEnum.BAR,
        chartWidth: ChartDefaultsEnum.WIDTH_417,
        chartHeight: ChartDefaultsEnum.HEIGHT_130,
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        hoverTimeDisplay: true,
        noChartImage: ChartImagesEnum.YELLOW_NO_DATA,
    };
    public invoiceAxes: BarChartAxes = {
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
            position: AxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };
    public invoiceChartLegend: LegendAttributes[] = [
        {
            title: ChartLegendDataEnum.REVENUE,
            value: 0,
            image: ChartImagesEnum.YELLOW_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: 1,
        },
        {
            title: ChartLegendDataEnum.LOAD,
            value: 0,
            image: ChartImagesEnum.BLUE_CIRCLE,
            elementId: 0,
        },
    ];

    //Chart api calls
    public mileageCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    public paymentCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
    public invoiceCall: ChartApiCall = {
        id: -1,
        chartType: 1,
    };

    private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;
    private destroy$ = new Subject<void>();

    constructor(
        private brokerQuery: BrokerQuery,
        private brokerMinimalQuery: BrokerMinimalListQuery,
        private detailsPageDriverSer: DetailsPageService,
        private brokerService: BrokerTService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.broker?.currentValue != changes.broker?.previousValue) {
            this.note.patchValue(changes.broker.currentValue.note);
            this.getBrokerDropdown();
            this.getInvoiceAgeingCount(changes.broker.currentValue);
        }

        this.getMileageChartData(
            changes.broker.currentValue.id,
            this.mileageCall.chartType,
            false
        );

        this.getPaymentChartData(
            changes.broker.currentValue.id,
            this.paymentCall.chartType,
            false
        );

        this.getInvoiceChartData(
            changes.broker.currentValue.id,
            this.invoiceCall.chartType,
            false
        );
    }
    ngOnInit(): void {
        this.tabsButton();

        let currentIndex = this.brokerList.findIndex(
            (brokerId) => brokerId.id === this.broker.id
        );
        this.brokerIndex = currentIndex;
    }
    public tabsButton(): void {
        this.tabsBroker = [
            {
                id: 223,
                name: BrokerTabsEnum.ONE_MONTH,
                checked: true,
            },
            {
                id: 313,
                name: BrokerTabsEnum.THREE_MONTHS,
                checked: false,
            },
            {
                id: 412,
                name: BrokerTabsEnum.SIX_MONTHS,
                checked: false,
            },
            {
                id: 515,
                name: BrokerTabsEnum.ONE_YEAR,
                checked: false,
            },
            {
                id: 1210,
                name: BrokerTabsEnum.YEAR_TO_DATE,
                checked: false,
            },
            {
                id: 1011,
                name: BrokerTabsEnum.ALL,
                checked: false,
            },
        ];
    }

    public getInvoiceAgeingCount(data: BrokerResponse): void {
        this.getPercntageOfPaid =
            (data?.availableCredit / data?.creditLimit) * 100;

        let firstGroup = data?.invoiceAgeingGroupOne?.countInvoice;
        let secondGroup = data?.invoiceAgeingGroupTwo?.countInvoice;
        let threeGroup = data?.invoiceAgeingGroupThree?.countInvoice;
        let fourGroup = data?.invoiceAgeingGroupFour?.countInvoice;
        this.invoiceAgeingCounter =
            firstGroup + secondGroup + threeGroup + fourGroup;
    }

    public getBrokerDropdown(): BrokerDropdown | void {
        this.brokerDropdowns = this.brokerQuery.getAll().map((item) => {
            return {
                id: item.id,
                name: item.businessName,
                status: item.status,
                active: item.id === this.broker.id,
            };
        });
    }
    public onSelectBroker(event: { id: number }): BrokerResponse | void {
        if (event && event.id !== this.broker.id) {
            this.brokerList = this.brokerQuery.getAll().map((item) => {
                return {
                    id: item.id,
                    name: item.businessName,
                    status: item.status,
                    active: item.id === event.id,
                };
            });
            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeBroker(action: string): void {
        let currentIndex = this.brokerList.findIndex(
            (brokerId) => brokerId.id === this.broker.id
        );

        switch (action) {
            case SETTINGS_ARROW_ACTIONS.PREVIOUS:
                currentIndex = --currentIndex;

                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.brokerList[currentIndex].id
                    );
                    this.onSelectBroker({
                        id: this.brokerList[currentIndex].id,
                    });
                    this.brokerIndex = currentIndex;
                }
                break;
            case SETTINGS_ARROW_ACTIONS.NEXT:
                currentIndex = ++currentIndex;

                if (
                    currentIndex !== -1 &&
                    this.brokerList.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.brokerList[currentIndex].id
                    );
                    this.onSelectBroker({
                        id: this.brokerList[currentIndex].id,
                    });
                    this.brokerIndex = currentIndex;
                }
                break;
            default:
                break;
        }
    }

    public changeMileageTab(ev: TabOptions): void {
        this.selectedTab = ev.id;
        const chartType = this.mileageChart?.detailsTimePeriod(ev.name);
        this.getMileageChartData(this.broker.id, chartType);
    }

    public changePaymentTab(ev: TabOptions): void {
        this.selectedTab = ev.id;
        const chartType = this.paymentChart?.detailsTimePeriod(ev.name);
        this.getPaymentChartData(this.broker.id, chartType);
    }

    public changeInvoiceTab(ev: TabOptions): void {
        this.selectedTab = ev.id;
        const chartType = this.invoiceChart?.detailsTimePeriod(ev.name);
        this.getInvoiceChartData(this.broker.id, chartType);
    }

    public getMileageChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ): void {
        if (
            id !== this.mileageCall.id ||
            chartType !== this.mileageCall.chartType
        ) {
            this.mileageCall.id = id;
            this.mileageCall.chartType = chartType;
        } else {
            return;
        }
        this.brokerService
            .getMileageChartData(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.chartDataSet(
                    this.mileageChart,
                    this.mileageChartConfig,
                    this.mileageBarChartLegend,
                    this.mileageBarAxes,
                    item,
                    hideAnimation
                );
            });
    }

    public getPaymentChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ): void {
        if (
            id !== this.paymentCall.id ||
            chartType !== this.paymentCall.chartType
        ) {
            this.paymentCall.id = id;
            this.paymentCall.chartType = chartType;
        } else {
            return;
        }
        this.brokerService
            .getPaymentChartData(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.chartDataSet(
                    this.paymentChart,
                    this.paymentChartConfig,
                    this.paymentChartLegend,
                    this.paymentAxes,
                    item,
                    hideAnimation
                );
            });
    }

    public getInvoiceChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ): void {
        if (
            id !== this.invoiceCall.id ||
            chartType !== this.invoiceCall.chartType
        ) {
            this.invoiceCall.id = id;
            this.invoiceCall.chartType = chartType;
        } else {
            return;
        }
        this.brokerService
            .getInvoiceChartData(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.chartDataSet(
                    this.invoiceChart,
                    this.invoiceChartConfig,
                    this.invoiceChartLegend,
                    this.invoiceAxes,
                    item,
                    hideAnimation
                );
            });
    }

    private chartDataSet(
        chart: TaChartComponent,
        config: DoughnutChartConfig,
        legend: LegendAttributes[],
        axes: BarChartAxes,
        item: any, //leave this any for now because there are multiple responses
        hideAnimation?: boolean
    ): void {
        config.dataLabels = [];

        if (item.brokerMileageRateChartResponse) {
            item.averageRate = 20;
            item.brokerMileageRateChartResponse[2].averageRate = 20;
            item.brokerMileageRateChartResponse[2].lowestRate = 10;
            item.brokerMileageRateChartResponse[2].highestRate = 30;

            item.brokerMileageRateChartResponse[3].averageRate = 25;
            item.brokerMileageRateChartResponse[3].lowestRate = 15;
            item.brokerMileageRateChartResponse[3].highestRate = 35;
        }

        if (item.brokerMileageRateChartResponse) {
            legend[0].value = item?.averageRate ?? 0;
            legend[1].value = item?.highestRate ?? 0;
            legend[2].value = item?.lowestRate ?? 0;

            config.chartValues = [
                item?.averageRate ?? 0,
                item?.highestRate ?? 0,
                item?.lowestRate ?? 0,
            ];
        } else if (item.brokerPaymentHistoryChartResponse) {
            item.averagePayPeriod = 30;
            item.payTerm = 20;

            item.brokerPaymentHistoryChartResponse[1].averagePayPeriod = 20;
            item.brokerPaymentHistoryChartResponse[2].averagePayPeriod = 10;
            item.brokerPaymentHistoryChartResponse[0].averagePayPeriod = 30;
            item.brokerPaymentHistoryChartResponse[4].averagePayPeriod = 40;
            item.brokerPaymentHistoryChartResponse[5].averagePayPeriod = 11;
            item.brokerPaymentHistoryChartResponse[6].averagePayPeriod = 8;
            item.brokerPaymentHistoryChartResponse[7].averagePayPeriod = 24;

            legend[0].value = item?.averagePayPeriod ?? 0;
            legend[1].value = item?.payTerm ?? 0;

            config.annotation = item?.payTerm ?? 0;
            config.chartValues = [item?.averagePayPeriod, item?.payTerm];
        }

        let hasValue = false;

        legend.map((leg) => {
            if (leg.value > 0) hasValue = true;
        });

        config.hasValue = hasValue;

        let firstData = [],
            secondData = [],
            labels = [],
            first_max_value = 0,
            second_max_value = 0;
        const mapData = item?.brokerMileageRateChartResponse
            ? item.brokerMileageRateChartResponse
            : item?.brokerPaymentHistoryChartResponse
            ? item.brokerPaymentHistoryChartResponse
            : null;
        if (!item.brokerPaymentHistoryChartResponse) {
            config.dataProperties[0].defaultConfig.barThickness =
                mapData?.length > 17 ? 10 : 18;
            config.dataProperties[1].defaultConfig.barThickness =
                mapData?.length > 17 ? 10 : 18;
        }
        chart.toolTipData = [];
        mapData.map((data: any) => {
            //leave this any for now because there are multiple responses
            chart.toolTipData.push(data);
            let first_chart_value =
                item.brokerMileageRateChartResponse && data.averageRate
                    ? data.averageRate
                    : item.brokerPaymentHistoryChartResponse &&
                      data.averagePayPeriod
                    ? data.averagePayPeriod
                    : 0;

            if (!first_chart_value && item.brokerMileageRateChartResponse)
                first_chart_value = null;

            let second_chart_value = item.brokerMileageRateChartResponse
                ? [data.highestRate ?? 0, data.lowestRate ?? 0]
                : 0;
            firstData.push(first_chart_value);
            secondData.push(second_chart_value);

            if (first_chart_value > first_max_value)
                first_max_value =
                    first_chart_value + (first_chart_value * 7) / 100;
            if (
                item.brokerMileageRateChartResponse &&
                second_chart_value[0] > second_max_value
            )
                second_max_value =
                    second_chart_value[0] + (second_chart_value[0] * 7) / 100;

            if (data.day)
                labels.push([data.day, this.monthList[data.month - 1]]);
            else labels.push([this.monthList[data.month - 1]]);
        });

        axes.verticalLeftAxes.maxValue = item.brokerMileageRateChartResponse
            ? second_max_value
            : first_max_value;

        if (
            !item.brokerMileageRateChartResponse &&
            !item.brokerPaymentHistoryChartResponse
        )
            axes.verticalRightAxes.maxValue = second_max_value;

        config.dataLabels = labels;
        config.dataProperties[0].defaultConfig.data = firstData;

        if (!item.brokerPaymentHistoryChartResponse)
            config.dataProperties[1].defaultConfig.data = secondData;

        chart.chartDataCheck(config.chartValues);
        chart.updateChartData(hideAnimation);
        chart.saveValues = JSON.parse(JSON.stringify(legend));
        chart.legendAttributes = JSON.parse(JSON.stringify(legend));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
