import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Moment
import moment from 'moment';

// Store
import { ShipperMinimalListQuery } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.query';

// Services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ShipperService } from '@pages/customer/services';
import { ModalService } from '@shared/services/modal.service';

// Constants
import { ShipperDetailsChartsConfiguration } from '@pages/customer/pages/shipper-details/components/shipper-details-item/utils/constants';
import {
    ChartConfiguration,
    ChartLegendConfiguration,
} from '@shared/utils/constants';

// Components
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';

// Models
import { IChartConfiguration } from 'ca-components/lib/components/ca-chart/models';
import { ChartLegendProperty, Tabs } from '@shared/models';
import { ShipperAverageWaitingTimeResponse } from 'appcoretruckassist';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Helpers
import { ChartHelper, TimespanConvertHelper } from '@shared/utils/helpers';

@Component({
    selector: 'app-shipper-details-card',
    templateUrl: './shipper-details-card.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./shipper-details-card.component.scss'],
})
export class ShipperDetailsCardComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();
    @Input() shipper: any;
    @Input() templateCard: boolean;
    public shipperDropdowns: any[] = [];
    public shipperList: any[] = this.shipperMinimalListQuery.getAll();
    public note: UntypedFormControl = new UntypedFormControl();
    public shipperTabs: Tabs[] = [];
    public selectedTab: number;

    // Charts
    public payrollChartData!: ShipperAverageWaitingTimeResponse;
    public payrollChartConfig: IChartConfiguration;
    public payrollChartLegend!: ChartLegendProperty[];
    public payrollChartTabs: Tabs[] = ChartHelper.generateTimeTabs();
    public payrollLegendHighlightedBackground!: boolean;
    public payrollLegendTitle!: string;

    public monthList: string[] = [
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
        // Services
        private detailsPageDriverSer: DetailsPageService,
        private shipperService: ShipperService,
        private modalService: ModalService,

        // Store
        private shipperMinimalListQuery: ShipperMinimalListQuery
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.shipper?.currentValue != changes.shipper?.previousValue) {
            this.note.patchValue(changes?.shipper.currentValue.note);
            this.shipper = changes.shipper.currentValue;
            this.getShipperChartData(
                changes.shipper.currentValue.id,
                this.shipperCall.chartType,
                false
            );
            this.getShipperDropdown();
        }
    }
    ngOnInit(): void {
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

    public onSelectedShipper(event: any) {
        if (event && event.id !== this.shipper.id) {
            if (event.name === TableStringEnum.ADD_NEW_3) {
                this.modalService.openModal(ShipperModalComponent, {
                    size: TableStringEnum.MEDIUM,
                });

                return;
            }

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
        this.selectedTab = ev.id;
        this.getShipperChartData(this.shipper.id, this.selectedTab);
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
            .subscribe(
                (item: ShipperAverageWaitingTimeResponse) => {
                    let avgPickupTime =
                            TimespanConvertHelper.convertTimeSpanToMinutes(
                                item.avgPickupTime
                            ),
                        avgDeliveryTime =
                            TimespanConvertHelper.convertTimeSpanToMinutes(
                                item.avgDeliveryTime
                            );

                    let milesPerGallon = [],
                        costPerGallon = [],
                        labels = [],
                        maxValue = 0;

                    item.shipperAverageWaitingTimeChartResponse.map((data) => {
                        const pickup =
                            TimespanConvertHelper.convertTimeSpanToMinutes(
                                data.avgPickupTime
                            );
                        let delivery =
                            TimespanConvertHelper.convertTimeSpanToMinutes(
                                data.avgDeliveryTime
                            );

                        if (delivery + pickup > maxValue) {
                            maxValue =
                                delivery +
                                pickup +
                                ((delivery + pickup) * 7) / 100;
                        }
                        if (data.day)
                            labels.push([
                                data.day,
                                this.monthList[data.month - 1],
                            ]);
                        else labels.push([this.monthList[data.month - 1]]);

                        delivery = delivery ? -delivery : 0;
                        milesPerGallon.push(pickup);
                        costPerGallon.push(delivery);
                    });

                    this.payrollChartData = { ...item };
                    this.payrollChartConfig = {
                        ...ShipperDetailsChartsConfiguration.PAYROLL_CHART_CONFIG,
                        chartData: ChartHelper.generateDataByDateTime(
                            this.payrollChartData
                                .shipperAverageWaitingTimeChartResponse,
                            ChartConfiguration.SHIPPER_AVERAGE_WAITING_TIME_CONFIGURATION
                        ),
                    };
                },
                () => {
                    this.payrollChartConfig = {
                        ...ShipperDetailsChartsConfiguration.PAYROLL_CHART_CONFIG,
                        chartData: {
                            datasets: [],
                            labels: [],
                        },
                    };
                }
            );
    }

    public setPayrollLegendOnHover(index: number | null): void {
        const { hasHighlightedBackground, title } = ChartHelper.setChartLegend(
            index,
            this.payrollChartConfig.chartData.labels
        );

        this.payrollLegendHighlightedBackground = hasHighlightedBackground;
        this.payrollLegendTitle = title;

        const dataForLegend =
            isNaN(index) || index < 0
                ? this.payrollChartData
                : this.payrollChartData?.shipperAverageWaitingTimeChartResponse[
                      index
                  ];

        this.payrollChartLegend =
            ChartLegendConfiguration.SHIPPER_AVERAGE_WAITING_TIME_CONFIGURATION(
                dataForLegend
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
