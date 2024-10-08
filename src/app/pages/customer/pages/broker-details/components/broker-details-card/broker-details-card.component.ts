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

// Store
import { BrokerQuery } from '@pages/customer/state/broker-state/broker.query';
import { BrokerMinimalListQuery } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.query';

// Services
import { DetailsPageService } from '@shared/services/details-page.service';
import { BrokerService } from '@pages/customer/services/broker.service';
import { ModalService } from '@shared/services/modal.service';

// Models
import {
    BrokerInvoiceAgeingResponse,
    BrokerResponse,
} from 'appcoretruckassist';
import { DoughnutChartConfig } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';
import { ChartApiCall } from '@shared/components/ta-chart/models/chart-api-call.model';
import { LegendAttributes } from '@shared/components/ta-chart/models/legend-attributes.model';
import { BarChartAxes } from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';
import { BrokerDropdown } from '@pages/customer/pages/broker-details/models/broker-dropdown.model';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';

// Constants
import { ChartConstants } from '@shared/components/ta-chart/utils/constants/chart.constants';
import { BrokerConstants } from '@pages/customer/pages/broker-details/utils/constants/broker.constants';
import { BrokerInvoiceAgingConstants } from '@pages/customer/pages/broker-details/utils/constants/broker-invoice-aging-tabs.constants';

// Components
//import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// Enums
import { ArrowActionsStringEnum } from '@shared/enums/arrow-actions-string.enum';
import { ChartTabStringEnum } from '@shared/enums/chart-tab-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Svg routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/broker-details-svg-routes';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

@Component({
    selector: 'app-broker-details-card',
    templateUrl: './broker-details-card.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./broker-details-card.component.scss'],
    providers: [FormatDatePipe],
})
export class BrokerDetailsCardComponent
    implements OnInit, OnChanges, OnDestroy
{
    // @ViewChild('mileageChart') public mileageChart: TaChartComponent;
    // @ViewChild('paymentChart') public paymentChart: TaChartComponent;
    // @ViewChild('invoiceChart') public invoiceChart: TaChartComponent;

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
    // public mileageChartConfig: DoughnutChartConfig =
    //     BrokerConstants.MILEAGE_CHART_CONFIG;
    public mileageBarAxes: BarChartAxes = BrokerConstants.MILEAGE_BAR_AXES;
    public mileageBarChartLegend: LegendAttributes[] =
        BrokerConstants.MILEAGE_CHART_LEGEND;

    //Paymeent chart
    // public paymentChartConfig: DoughnutChartConfig =
    //     BrokerConstants.PAYMENT_CHART_CONFIG;
    public paymentChartLegend: LegendAttributes[] =
        BrokerConstants.PAYMENT_CHART_LEGEND;
    public paymentAxes: BarChartAxes = BrokerConstants.PAYMENT_CHART_AXES;

    //Invoice chart
    // public invoiceChartConfig: DoughnutChartConfig =
    //     BrokerConstants.INVOICE_CHART_CONFIG;
    public invoiceAxes: BarChartAxes = BrokerConstants.INVOICE_CHART_AXES;
    public invoiceChartLegend: LegendAttributes[] =
        BrokerConstants.INVOICE_CHART_LEGEND;
    public invoiceChartCount: number = 0;

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

    // Invoice Aging Tabs
    public invoiceAgingTabs: TabOptions[] =
        BrokerInvoiceAgingConstants.invoiceAgingTabs;
    public invoiceAgingSelectedTab: number = 1;
    public inoviceAgingData: BrokerInvoiceAgeingResponse;

    private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;
    private destroy$ = new Subject<void>();

    // Svg routes
    public brokerDetailsSvgRoutes = BrokerDetailsSvgRoutes;

    constructor(
        // Store
        private brokerQuery: BrokerQuery,
        private brokerMinimalQuery: BrokerMinimalListQuery,

        // Services
        private detailsPageDriverSer: DetailsPageService,
        private brokerService: BrokerService,
        private modalService: ModalService,
        private tableService: TruckassistTableService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.broker?.currentValue != changes.broker?.previousValue) {
            this.note.patchValue(changes.broker.currentValue.note);
            this.getBrokerDropdown();
            this.getInvoiceAgeingCount(changes.broker.currentValue);
        }

        this.updateCharts(changes.broker?.currentValue.id);
    }

    ngOnInit(): void {
        this.tabsButton();

        let currentIndex = this.brokerList.findIndex(
            (brokerId) => brokerId.id === this.broker.id
        );
        this.brokerIndex = currentIndex;

        this.actionAnimationSubscribe();
    }

    public tabsButton(): void {
        this.tabsBroker = [
            {
                id: 223,
                name: ChartTabStringEnum.ONE_MONTH,
                checked: true,
            },
            {
                id: 313,
                name: ChartTabStringEnum.THREE_MONTHS,
                checked: false,
            },
            {
                id: 412,
                name: ChartTabStringEnum.SIX_MONTHS,
                checked: false,
            },
            {
                id: 515,
                name: ChartTabStringEnum.ONE_YEAR,
                checked: false,
            },
            {
                id: 1210,
                name: ChartTabStringEnum.YEAR_TO_DATE,
                checked: false,
            },
            {
                id: 1011,
                name: ChartTabStringEnum.ALL,
                checked: false,
            },
        ];
    }

    public getInvoiceAgeingCount(data: BrokerResponse): void {
        this.getPercntageOfPaid = Math.round(
            (data?.availableCredit / data?.creditLimit) * 100
        );

        let firstGroup =
            data?.brokerPaidInvoiceAgeing?.invoiceAgeingGroupOne?.countInvoice;
        let secondGroup =
            data?.brokerPaidInvoiceAgeing?.invoiceAgeingGroupTwo?.countInvoice;
        let threeGroup =
            data?.brokerPaidInvoiceAgeing?.invoiceAgeingGroupThree
                ?.countInvoice;
        let fourGroup =
            data?.brokerPaidInvoiceAgeing?.invoiceAgeingGroupFour?.countInvoice;
        this.invoiceAgeingCounter =
            firstGroup + secondGroup + threeGroup + fourGroup;

        if (this.invoiceAgingSelectedTab === 1)
            this.inoviceAgingData = data?.brokerUnpaidInvoiceAgeing;
        else this.inoviceAgingData = data?.brokerPaidInvoiceAgeing;
    }

    public getBrokerDropdown(): void {
        this.brokerDropdowns = this.brokerQuery.getAll().map((item) => {
            return {
                id: item.id,
                name: item.businessName,
                status: item.status,
                active: item.id === this.broker.id,
            };
        });
    }

    public onSelectBroker(event: { id: number; name?: string }): void {
        if (event && event.id !== this.broker.id) {
            if (event.name === TableStringEnum.ADD_NEW_3) {
                this.modalService.openModal(BrokerModalComponent, {
                    size: TableStringEnum.MEDIUM,
                });

                return;
            }

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
            case ArrowActionsStringEnum.PREVIOUS:
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
            case ArrowActionsStringEnum.NEXT:
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

    // public changeMileageTab(ev: TabOptions): void {
    //     this.selectedTab = ev.id;
    //     const chartType = this.mileageChart?.detailsTimePeriod(ev.name);
    //     this.getMileageChartData(this.broker.id, chartType);
    // }

    // public changePaymentTab(ev: TabOptions): void {
    //     this.selectedTab = ev.id;
    //     const chartType = this.paymentChart?.detailsTimePeriod(ev.name);
    //     this.getPaymentChartData(this.broker.id, chartType);
    // }

    // public changeInvoiceTab(ev: TabOptions): void {
    //     this.selectedTab = ev.id;
    //     const chartType = this.invoiceChart?.detailsTimePeriod(ev.name);
    //     this.getInvoiceChartData(this.broker.id, chartType);
    // }

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
        // this.brokerService
        //     .getMileageChartData(id, chartType)
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((item) => {
        //         this.chartDataSet(
        //             this.mileageChart,
        //             this.mileageChartConfig,
        //             this.mileageBarChartLegend,
        //             this.mileageBarAxes,
        //             item,
        //             hideAnimation
        //         );
        //     });
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
        // this.brokerService
        //     .getPaymentChartData(id, chartType)
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((item) => {
        //         this.chartDataSet(
        //             this.paymentChart,
        //             this.paymentChartConfig,
        //             this.paymentChartLegend,
        //             this.paymentAxes,
        //             item,
        //             hideAnimation
        //         );
        //     });
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
        // this.brokerService
        //     .getInvoiceChartData(id, chartType)
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((item) => {
        //         if (item) {
        //             this.invoiceChartCount = item?.count;

        //             this.chartDataSet(
        //                 this.invoiceChart,
        //                 this.invoiceChartConfig,
        //                 this.invoiceChartLegend,
        //                 this.invoiceAxes,
        //                 item,
        //                 hideAnimation
        //             );
        //         }
        //     });
    }

    // private chartDataSet(
    //     chart: TaChartComponent,
    //     config: DoughnutChartConfig,
    //     legend: LegendAttributes[],
    //     axes: BarChartAxes,
    //     item: any, //leave this any for now because there are multiple responses
    //     hideAnimation?: boolean
    // ): void {
    //     return; //leave this commented because we don't have working charts
    //     config.dataLabels = [];

    //     if (item.brokerMileageRateChartResponse) {
    //         item.averageRate = 20;
    //         item.brokerMileageRateChartResponse[2].averageRate = 20;
    //         item.brokerMileageRateChartResponse[2].lowestRate = 10;
    //         item.brokerMileageRateChartResponse[2].highestRate = 30;

    //         item.brokerMileageRateChartResponse[3].averageRate = 25;
    //         item.brokerMileageRateChartResponse[3].lowestRate = 15;
    //         item.brokerMileageRateChartResponse[3].highestRate = 35;
    //     }

    //     if (item.brokerMileageRateChartResponse) {
    //         legend[0].value = item?.averageRate ?? 0;
    //         legend[1].value = item?.highestRate ?? 0;
    //         legend[2].value = item?.lowestRate ?? 0;

    //         config.chartValues = [
    //             item?.averageRate ?? 0,
    //             item?.highestRate ?? 0,
    //             item?.lowestRate ?? 0,
    //         ];
    //     } else if (item.brokerPaymentHistoryChartResponse) {
    //         item.averagePayPeriod = 30;
    //         item.payTerm = 20;

    //         item.brokerPaymentHistoryChartResponse[1].averagePayPeriod = 20;
    //         item.brokerPaymentHistoryChartResponse[2].averagePayPeriod = 10;
    //         item.brokerPaymentHistoryChartResponse[0].averagePayPeriod = 30;
    //         item.brokerPaymentHistoryChartResponse[4].averagePayPeriod = 40;
    //         item.brokerPaymentHistoryChartResponse[5].averagePayPeriod = 11;
    //         item.brokerPaymentHistoryChartResponse[6].averagePayPeriod = 8;
    //         item.brokerPaymentHistoryChartResponse[7].averagePayPeriod = 24;

    //         legend[0].value = item?.averagePayPeriod ?? 0;
    //         legend[1].value = item?.payTerm ?? 0;

    //         config.annotation = item?.payTerm ?? 0;
    //         config.chartValues = [item?.averagePayPeriod, item?.payTerm];
    //     } else if (item.brokerPaidInvoiceChartResponse) {
    //         legend[0].value = item?.revenue ?? 0;
    //         legend[1].value = item?.count ?? 0;

    //         config.chartValues = [item?.revenue, item?.count];
    //     }

    //     let hasValue = false;

    //     legend.map((leg) => {
    //         if (leg.value > 0) hasValue = true;
    //     });

    //     config.hasValue = hasValue;

    //     let firstData = [],
    //         secondData = [],
    //         labels = [],
    //         first_max_value = 0,
    //         second_max_value = 0;
    //     const mapData = item?.brokerMileageRateChartResponse
    //         ? item.brokerMileageRateChartResponse
    //         : item?.brokerPaymentHistoryChartResponse
    //         ? item.brokerPaymentHistoryChartResponse
    //         : item?.brokerPaidInvoiceChartResponse
    //         ? item.brokerPaidInvoiceChartResponse
    //         : null;
    //     if (!item.brokerPaymentHistoryChartResponse) {
    //         config.dataProperties[0].defaultConfig.barThickness =
    //             mapData?.length > 17 ? 10 : 18;
    //         config.dataProperties[1].defaultConfig.barThickness =
    //             mapData?.length > 17 ? 10 : 18;
    //     }
    //     chart.toolTipData = [];
    //     mapData.map((data: any) => {
    //         //leave this any for now because there are multiple responses
    //         chart.toolTipData.push(data);
    //         let first_chart_value =
    //             item.brokerMileageRateChartResponse && data.averageRate
    //                 ? data.averageRate
    //                 : item.brokerPaymentHistoryChartResponse &&
    //                   data.averagePayPeriod
    //                 ? data.averagePayPeriod
    //                 : item.brokerPaidInvoiceChartResponse && data.revenue
    //                 ? data.revenue
    //                 : 0;

    //         if (!first_chart_value && item.brokerMileageRateChartResponse)
    //             first_chart_value = null;

    //         let second_chart_value = item.brokerMileageRateChartResponse
    //             ? [data.highestRate ?? 0, data.lowestRate ?? 0]
    //             : item.brokerPaidInvoiceChartResponse
    //             ? data.count ?? 0
    //             : 0;
    //         firstData.push(first_chart_value);
    //         secondData.push(second_chart_value);

    //         if (first_chart_value > first_max_value)
    //             first_max_value =
    //                 first_chart_value + (first_chart_value * 7) / 100;
    //         if (
    //             item.brokerMileageRateChartResponse &&
    //             second_chart_value[0] > second_max_value
    //         )
    //             second_max_value =
    //                 second_chart_value[0] + (second_chart_value[0] * 7) / 100;

    //         if (
    //             item.brokerPaidInvoiceChartResponse &&
    //             second_chart_value > second_max_value
    //         )
    //             second_max_value =
    //                 second_chart_value + (second_chart_value * 7) / 100;

    //         if (data.day)
    //             labels.push([data.day, this.monthList[data.month - 1]]);
    //         else labels.push([this.monthList[data.month - 1]]);
    //     });

    //     axes.verticalLeftAxes.maxValue = item.brokerMileageRateChartResponse
    //         ? second_max_value
    //         : first_max_value;

    //     if (
    //         !item.brokerMileageRateChartResponse &&
    //         !item.brokerPaymentHistoryChartResponse
    //     )
    //         axes.verticalRightAxes.maxValue = second_max_value;

    //     config.dataLabels = labels;
    //     config.dataProperties[0].defaultConfig.data = firstData;

    //     if (!item.brokerPaymentHistoryChartResponse)
    //         config.dataProperties[1].defaultConfig.data = secondData;

    //     chart.chartDataCheck(config.chartValues);
    //     chart.updateChartData(hideAnimation);
    //     chart.saveValues = JSON.parse(JSON.stringify(legend));
    //     chart.legendAttributes = JSON.parse(JSON.stringify(legend));
    // }

    public updateCharts(id: number): void {
        this.getMileageChartData(id, this.mileageCall.chartType, false);

        this.getPaymentChartData(id, this.paymentCall.chartType, false);

        this.getInvoiceChartData(id, this.invoiceCall.chartType, false);
    }

    public changeInvoiceAgingTab(event: { id: number }): void {
        this.invoiceAgingSelectedTab = event.id;

        this.invoiceAgingTabs = this.invoiceAgingTabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });

        if (event.id === 1)
            this.inoviceAgingData = this.broker.brokerUnpaidInvoiceAgeing;
        else this.inoviceAgingData = this.broker.brokerPaidInvoiceAgeing;
    }

    public actionAnimationSubscribe(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // Add Broker
                if (
                    res?.animation === TableStringEnum.ADD &&
                    res.tab === TableStringEnum.BROKER
                ) {
                    this.getBrokerDropdown();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
