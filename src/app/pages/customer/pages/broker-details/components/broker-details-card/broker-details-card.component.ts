import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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
    BrokerPaymentHistoryResponse,
    BrokerResponse,
} from 'appcoretruckassist';
import { BrokerDropdown } from '@pages/customer/pages/broker-details/models/';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { IChartConfiguration } from 'ca-components/lib/components/ca-chart/models';
import { ChartLegendProperty, Tabs } from '@shared/models';

// Constants
import {
    BrokerChartsConfiguration,
} from '@pages/customer/pages/broker-details/utils/constants/';
import { BrokerInvoiceAgingConstants } from '@pages/customer/pages/broker-details/utils/constants/';

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

// Svg routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/';

// Helpers
import { ChartHelper } from '@shared/utils/helpers';
import { ChartConfiguration } from '@shared/utils/constants';
import { ChartLegendConfiguration } from '@shared/utils/constants/charts/chart-legend-configuration.constants';

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
    public getPercntageOfPaid: number = 0;

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

    //private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;
    private destroy$ = new Subject<void>();

    // Svg routes
    public brokerDetailsSvgRoutes = BrokerDetailsSvgRoutes;

    //Chart
    public invoiceChartConfig!: IChartConfiguration;
    public invoiceChartLegend!: ChartLegendProperty[];
    public invoiceChartTabs: Tabs[] = ChartHelper.generateTimeTabs();

    public mileageChartConfig!: IChartConfiguration;
    public mileageChartLegendData!: ChartLegendProperty[];
    public mileageChartTabs: Tabs[] = ChartHelper.generateTimeTabs();

    public paymentChartConfig!: IChartConfiguration;
    public paymentChartLegendData!: ChartLegendProperty[];
    public paymentChartTabs: Tabs[] = ChartHelper.generateTimeTabs();

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
                this.mileageChartConfig = {
                    ...BrokerChartsConfiguration.MILEAGE_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime<BrokerMileageRateChartResponse>(
                        response.brokerMileageRateChartResponse,
                        ChartConfiguration.mileageRateConfiguration,
                        timeFilter
                    )
                };
                this.mileageChartLegendData =
                    ChartLegendConfiguration.mileageLegendConfiguration(response);
            });
    }

    private getInvoiceChartData(timeFilter?: number): void {
        this.brokerService.getInvoiceChartData(this.broker.id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: BrokerPaidInvoiceResponse) => {
                if (timeFilter && this.invoiceChartTabs[timeFilter - 1])
                    this.invoiceChartTabs[timeFilter - 1].checked = true;
                this.invoiceChartConfig = {
                    ...BrokerChartsConfiguration.INVOICE_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime<BrokerPaidInvoiceChartResponse>
                        (
                            response.brokerPaidInvoiceChartResponse,
                            ChartConfiguration.brokerPaidInvoiceConfiguration,
                            timeFilter
                        )
                };
                this.invoiceChartLegend = ChartLegendConfiguration.invoiceChartLegendConfiguration(response);
            })
    }

    private getPaymentChartData(timeFilter?: number): void {
        this.brokerService.getPaymentChartData(this.broker.id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: BrokerPaymentHistoryResponse) => {
                if (timeFilter && this.invoiceChartTabs[timeFilter - 1])
                    this.invoiceChartTabs[timeFilter - 1].checked = true;
                this.paymentChartConfig = {
                    ...BrokerChartsConfiguration.PAYMENT_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime<BrokerPaymentHistoryResponse>
                        (
                            response.brokerPaymentHistoryChartResponse,
                            ChartConfiguration.paymentHistoryConfiguration(response),
                            timeFilter
                        )
                };
                this.paymentChartLegendData = ChartLegendConfiguration
                    .brokerPaymentHistory(response);
            })
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
