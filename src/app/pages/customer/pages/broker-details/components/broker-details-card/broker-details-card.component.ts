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
import { BrokerService } from '@pages/customer/services';
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Models
import {
    BrokerInvoiceAgeingResponse,
    BrokerResponse,
} from 'appcoretruckassist';
import { BrokerDropdown } from '@pages/customer/pages/broker-details/models/';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { IChartConfiguaration } from 'ca-components/lib/components/ca-chart/models';

// Constants
import {
    BrokerChartsConfiguration,
    BrokerConstants,
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
    ArrowActionsStringEnum
} from '@shared/enums';

// Svg routes
import { BrokerDetailsSvgRoutes } from '@pages/customer/pages/broker-details/utils/svg-routes/';

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
    public inoviceAgingData: BrokerInvoiceAgeingResponse;

    //private monthList: string[] = ChartConstants.MONTH_LIST_SHORT;
    private destroy$ = new Subject<void>();

    // Svg routes
    public brokerDetailsSvgRoutes = BrokerDetailsSvgRoutes;

    //Chart

    public invoiceChartConfig: IChartConfiguaration =
        BrokerChartsConfiguration.INVOICE_CHART_CONFIG;
    public mileageChartConfig: IChartConfiguaration =
        BrokerChartsConfiguration.MILEAGE_CHART_CONFIG;
    public paymentChartConfig: IChartConfiguaration =
        BrokerChartsConfiguration.PAYMENT_CHART_CONFIG;

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

        //this.updateCharts(changes.broker?.currentValue.id);
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

    public changeMileageTab(ev: TabOptions): void {
        this.selectedTab = ev.id;
    }

    public changePaymentTab(ev: TabOptions): void {
        this.selectedTab = ev.id;
    }

    public changeInvoiceTab(ev: TabOptions): void {
        this.selectedTab = ev.id;
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
