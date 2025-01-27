import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core';
import {
    map,
    Subject,
    takeUntil
} from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

// Store
import { BrokerQuery } from '@pages/customer/state/broker-state/broker.query';
import { BrokerMinimalListQuery } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.query';

// Services
import { DetailsPageService } from '@shared/services/details-page.service';
import { BrokerService } from '@pages/customer/services';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Models
import {
    BrokerInvoiceAgeingResponse,
    BrokerMileageRateChartResponse,
    BrokerMileageRateResponse,
    BrokerPaidInvoiceChartResponse,
    BrokerPaidInvoiceResponse,
    BrokerPaymentHistoryChartResponse,
    BrokerPaymentHistoryResponse,
    BrokerResponse,
} from 'appcoretruckassist';
import {
    BrokerDropdown,
    IBrokerPaymentHistory,
    IBrokerPaymentHistoryChart
} from '@pages/customer/pages/broker-details/models/';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { IChartConfiguration } from 'ca-components/lib/components/ca-chart/models';
import {
    ChartLegendProperty,
    ChartTypeProperty,
    Tabs
} from '@shared/models';

// Constants
import {
    BrokerChartsConfiguration,
} from '@pages/customer/pages/broker-details/utils/constants/';
import { BrokerInvoiceAgingConstants } from '@pages/customer/pages/broker-details/utils/constants';
import {
    ChartConfiguration,
    ChartLegendConfiguration
} from '@shared/utils/constants';

// Components
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// Enums
import {
    ChartTabStringEnum,
    TableStringEnum,
    ArrowActionsStringEnum,
} from '@shared/enums';
import {
    EChartAnnotationType,
    EChartEventProperties
} from 'ca-components';

// SVG routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/';

// Helpers
import { ChartHelper } from '@shared/utils/helpers';

@Component({
    selector: 'app-broker-details-card',
    templateUrl: './broker-details-card.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./broker-details-card.component.scss'],
    providers: [FormatDatePipe],
})
export class BrokerDetailsCardComponent
    implements OnInit, OnChanges, OnDestroy {
    @Input() broker: BrokerResponse;
    @Input() templateCard: boolean;

    public brokerDropdowns: BrokerDropdown[];
    public brokerList: BrokerResponse[] = this.brokerMinimalQuery.getAll();
    public brokerIndex: number;

    //Invoice
    public invoiceAgeingCounter: number = 0;
    public getPercentageOfPaid: number = 0;

    //Tabs
    public selectedTab: number;
    public tabsBroker: TabOptions[];

    //Note
    public note: UntypedFormControl = new UntypedFormControl();

    // Invoice Aging Tabs
    public invoiceAgingTabs: TabOptions[] =
        BrokerInvoiceAgingConstants.invoiceAgingTabs;
    public invoiceAgingSelectedTab: number = 1;
    public invoiceAgingData: BrokerInvoiceAgeingResponse;

    private destroy$ = new Subject<void>();

    // Svg routes
    public brokerDetailsSvgRoutes = BrokerDetailsSvgRoutes;

    //Chart
    public invoiceChartData!: BrokerPaidInvoiceResponse;
    public invoiceChartConfig!: IChartConfiguration;
    public invoiceChartLegend!: ChartLegendProperty[];
    public invoiceChartTabs: Tabs[] = ChartHelper.generateTimeTabs();
    public invoiceLegendTitle!: string;
    public invoiceLegendHighlightedBackground!: boolean;

    public mileageChartData!: BrokerMileageRateResponse;
    public mileageChartConfig!: IChartConfiguration;
    public mileageChartLegendData!: ChartLegendProperty[];
    public mileageChartTabs: Tabs[] = ChartHelper.generateTimeTabs();
    public mileageLegendTitle!: string;
    public mileageLegendHighlightedBackground!: boolean;

    public paymentChartData!: IBrokerPaymentHistory;
    public paymentChartConfig!: IChartConfiguration;
    public paymentChartLegendData!: ChartLegendProperty[];
    public paymentChartTabs: Tabs[] = ChartHelper.generateTimeTabs();
    public paymentLegendTitle!: string;
    public paymentLegendHighlightedBackground!: boolean;
    constructor(
        // Store
        private brokerQuery: BrokerQuery,
        private brokerMinimalQuery: BrokerMinimalListQuery,

        // Services
        private detailsPageDriverSer: DetailsPageService,
        private brokerService: BrokerService,
        private modalService: ModalService,
        private tableService: TruckassistTableService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.broker?.currentValue != changes.broker?.previousValue) {
            this.note.patchValue(changes.broker.currentValue.note);
            this.getBrokerDropdown();
            this.getInvoiceAgeingCount(changes.broker.currentValue);
        }
    }

    ngOnInit(): void {
        this.tabsButton();

        let currentIndex = this.brokerList.findIndex(
            (brokerId) => brokerId.id === this.broker.id
        );
        this.brokerIndex = currentIndex;

        this.actionAnimationSubscribe();

        this.getMileageRateHistory();

        this.getInvoiceChartData();

        this.getPaymentChartData();
    }

    private getMileageRateHistory(timeFilter?: number): void {
        this.brokerService.getMileageChartData(this.broker.id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: BrokerMileageRateResponse) => {
                if (timeFilter && this.mileageChartTabs[timeFilter - 1])
                    this.mileageChartTabs[timeFilter - 1].checked = true;

                this.mileageChartData = { ...response };

                this.mileageChartConfig = {
                    ...BrokerChartsConfiguration.MILEAGE_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime<BrokerMileageRateChartResponse>(
                        this.mileageChartData.brokerMileageRateChartResponse,
                        ChartConfiguration.mileageRateConfiguration,
                        timeFilter
                    )
                };
                this.mileageChartLegendData =
                    ChartLegendConfiguration.mileageLegendConfiguration(this.mileageChartData);
            });
    }

    private getInvoiceChartData(timeFilter?: number): void {
        this.brokerService.getInvoiceChartData(this.broker.id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: BrokerPaidInvoiceResponse) => {
                if (timeFilter && this.invoiceChartTabs[timeFilter - 1])
                    this.invoiceChartTabs[timeFilter - 1].checked = true;

                this.invoiceChartData = { ...response };

                this.invoiceChartConfig = {
                    ...BrokerChartsConfiguration.INVOICE_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime<BrokerPaidInvoiceChartResponse>
                        (
                            this.invoiceChartData.brokerPaidInvoiceChartResponse,
                            ChartConfiguration.brokerPaidInvoiceConfiguration,
                            timeFilter
                        )
                };
                this.invoiceChartLegend =
                    ChartLegendConfiguration.invoiceChartLegendConfiguration(this.invoiceChartData);
            })
    }

    private getPaymentChartData(timeFilter?: number): void {
        this.brokerService.getPaymentChartData(this.broker.id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$),
                map((data: BrokerPaymentHistoryResponse): IBrokerPaymentHistory => {
                    const averagePayPeriod: string = String(data.averagePayPeriod);
                    return {
                        ...data,
                        averagePayPeriod: this.timeSpanToDecimal(averagePayPeriod),
                        brokerPaymentHistoryChartResponse:
                            [...data.brokerPaymentHistoryChartResponse.map(
                                (item: BrokerPaymentHistoryChartResponse): IBrokerPaymentHistoryChart => {
                                    const averagePayPeriodItem: string = String(item.averagePayPeriod);
                                    return {
                                        ...item,
                                        averagePayPeriod: this.timeSpanToDecimal(averagePayPeriodItem)
                                    }
                                }
                            )]
                    }
                })
            )
            .subscribe((response: IBrokerPaymentHistory) => {

                if (timeFilter && this.invoiceChartTabs[timeFilter - 1])
                    this.invoiceChartTabs[timeFilter - 1].checked = true;

                this.paymentChartData = { ...response };

                const paymentHistoryDataConfig: ChartTypeProperty[] =
                    ChartConfiguration.paymentHistoryConfiguration(this.paymentChartData);

                this.paymentChartConfig = {
                    ...BrokerChartsConfiguration.PAYMENT_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime<IBrokerPaymentHistory>
                        (
                            this.paymentChartData.brokerPaymentHistoryChartResponse,
                            paymentHistoryDataConfig,
                            timeFilter
                        ),
                    annotations: [
                        {
                            value: this.paymentChartData.payTerm,
                            type: EChartAnnotationType.LINE,
                            axis: EChartEventProperties.Y_AXIS_0,
                            color: paymentHistoryDataConfig[0].color,
                        }
                    ]
                };

                this.paymentChartLegendData = ChartLegendConfiguration
                    .brokerPaymentHistory(this.paymentChartData);
            })
    }

    public setMileageLegendOnHover(index: number): void {
        const {
            hasHighlightedBackground,
            title
        } =
            ChartHelper.setChartLegend(
                index,
                this.mileageChartConfig.chartData.labels
            );

        this.mileageLegendHighlightedBackground = hasHighlightedBackground;
        this.mileageLegendTitle = title;

        if (index === null || index === undefined) {
            this.mileageChartLegendData = ChartLegendConfiguration
                .mileageLegendConfiguration(this.mileageChartData);
            return;
        }

        const dataForLegend = index >= 0 ?
            this.mileageChartData?.
                brokerMileageRateChartResponse[index] :
            this.mileageChartData

        this.mileageChartLegendData = ChartLegendConfiguration
            .mileageLegendConfiguration(dataForLegend);
    }

    public setInvoiceLegendOnHover(index: number): void {

        const {
            hasHighlightedBackground,
            title
        } =
            ChartHelper.setChartLegend(
                index,
                this.invoiceChartConfig.chartData.labels
            );

        this.invoiceLegendHighlightedBackground = hasHighlightedBackground;
        this.invoiceLegendTitle = title;

        if (index === null || index === undefined) {
            this.invoiceChartLegend = ChartLegendConfiguration
                .invoiceChartLegendConfiguration(
                    this.invoiceChartData);
            return;
        }

        const dataForLegend = index >= 0 ?
            this.invoiceChartData?.
                brokerPaidInvoiceChartResponse[index] :
            this.invoiceChartData

        this.invoiceChartLegend = ChartLegendConfiguration
            .invoiceChartLegendConfiguration(dataForLegend);
    }

    public setPaymentHistoryLegendOnHover(index: number): void {
        const {
            hasHighlightedBackground,
            title
        } =
            ChartHelper.setChartLegend(
                index,
                this.paymentChartConfig.chartData.labels
            );

        this.paymentLegendHighlightedBackground = hasHighlightedBackground;
        this.paymentLegendTitle = title;

        if (index === null || index === undefined) {
            this.paymentChartLegendData = ChartLegendConfiguration
                .brokerPaymentHistory(this.paymentChartData);
            return;
        }

        const dataForLegend = index >= 0 ?
            this.paymentChartData?.
                brokerPaymentHistoryChartResponse[index] :
            this.paymentChartData

        this.paymentChartLegendData = ChartLegendConfiguration
            .brokerPaymentHistory(dataForLegend);
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
        this.getPercentageOfPaid = Math.round(
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
            this.invoiceAgingData = data?.brokerUnpaidInvoiceAgeing;
        else this.invoiceAgingData = data?.brokerPaidInvoiceAgeing;
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

    public changeMileageTab(event: TabOptions): void {
        this.getMileageRateHistory(event.id);
    }

    public changePaymentTab(event: TabOptions): void {
        this.getPaymentChartData(event.id);
    }

    public changeInvoiceTab(event: TabOptions): void {
        this.getInvoiceChartData(event.id);
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
            this.invoiceAgingData = this.broker.brokerUnpaidInvoiceAgeing;
        else this.invoiceAgingData = this.broker.brokerPaidInvoiceAgeing;
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

    // TODO extract to helper
    private timeSpanToDecimal(timeSpan: string): number {
        // Check if the timespan is negative and remove the negative sign for easier processing
        const isNegative = timeSpan.startsWith('-');
        const cleanTimeSpan = isNegative ? timeSpan.slice(1) : timeSpan;

        // Split the cleanTimeSpan string into its parts: day.hour:minute:second:millisecond
        const [dayHour, minute, second, millisecond] = cleanTimeSpan.split(':');

        // Handle cases where day is missing, default days to 0
        const [daysOrHours, hours] = dayHour.includes('.')
            ? dayHour.split('.').map(Number)
            : [0, Number(dayHour)];

        const days = daysOrHours;

        // Convert all parts into their respective time fractions
        const hoursInDays = hours / 24;
        const minutesInDays = Number(minute) / (24 * 60);
        const secondsInDays = Number(second) / (24 * 60 * 60);

        // Sum up all parts to get the total decimal representation
        let totalDays = days + hoursInDays + minutesInDays + secondsInDays;

        // If the original timespan was negative, return the negative value
        if (isNegative)
            totalDays = -totalDays;

        return Number(totalDays.toFixed(2));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
