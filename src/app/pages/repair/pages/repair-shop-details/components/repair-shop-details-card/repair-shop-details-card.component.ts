import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

// Store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';

// Services
import { RepairService } from '@shared/services/repair.service';
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Models
import { RepairShopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-card',
    templateUrl: './repair-shop-details-card.component.html',
    styleUrls: ['./repair-shop-details-card.component.scss'],
})
export class RepairShopCardViewComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();
    public repairExpensesChart: any;
    @Input() repairShopCardViewData: RepairShopResponse;
    @Input() templateCard: boolean;
    public noteControl: UntypedFormControl = new UntypedFormControl();
    public count: number;
    public tabs: any;
    public shopsDropdowns: any[] = [];
    public shopsList: any;
    public repairShopObject: any;
    public shopIndex: any;
    public currentShopId: number;
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
    barChartConfig: any = {
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
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
        hasValue: false,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
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
        noChartImage: 'assets/svg/common/yellow_no_data.svg',
        showHoverTooltip: true,
        showZeroLine: true,
    };

    public barChartLegend: any[] = [
        {
            title: 'Repair',
            value: 0,
            image: 'assets/svg/common/round_yellow.svg',
            elementId: 1,
        },
        {
            title: 'Cost',
            value: 0,
            image: 'assets/svg/common/round_blue.svg',
            prefix: '$',
            elementId: 0,
        },
    ];

    public barAxes: object = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 4000,
            stepSize: 1000,
            showGridLines: false,
        },
        verticalRightAxes: {
            visible: true,
            minValue: 0,
            maxValue: 2800,
            stepSize: 700,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: false,
        },
    };

    public repairCall: any = {
        id: -1,
        chartType: 1,
    };

    constructor(
        // Router
        private act_route: ActivatedRoute,
        private router: Router,

        // Services
        private detailsPageDriverSer: DetailsPageService,
        private tableService: TruckassistTableService,
        private repairService: RepairService,

        // Ref
        private cdRef: ChangeDetectorRef,

        // Store
        private repairDetailsQuery: RepairDetailsQuery
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.repairShopCardViewData?.currentValue !=
            changes.repairShopCardViewData?.previousValue
        ) {
            this.noteControl.patchValue(
                changes.repairShopCardViewData.currentValue.note
            );
            this.repairShopCardViewData =
                changes.repairShopCardViewData?.currentValue;
        }
        this.currentShopId = changes.repairShopCardViewData.currentValue.id;
        this.getRepairShopChartData(
            changes.repairShopCardViewData.currentValue.id,
            this.repairCall.chartType,
            false
        );
        this.getActiveServices(changes.repairShopCardViewData.currentValue);
        this.getShopsDropdown(changes.repairShopCardViewData.currentValue);

        this.cdRef.detectChanges();
    }

    ngOnInit(): void {
        this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res.animation && res.tab === 'repair-shop') {
                    this.repairShopCardViewData = res.data;
                    this.cdRef.detectChanges();
                }
            });

        this.tabsSwitcher();

        // Only One Time Call From Store Data
        this.getShopsDropdown();

        // Call Change Dropdown When Router Change
        this.router.events
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: any) => {
                if (event instanceof NavigationEnd) {
                    this.getShopsDropdown();
                }
            });

        let currentIndex = this.shopsDropdowns.findIndex((item) => item.active);
        this.shopIndex = currentIndex;
    }

    public getShopsDropdown(newData?) {
        this.repairDetailsQuery.repairShopMinimal$
            .pipe(
                takeUntil(this.destroy$),
                map((data: any) => {
                    return data?.pagination?.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            status: item.status,
                            svg: item.pinned ? 'ic_star.svg' : '',
                            folder: 'common',
                            active:
                                item.id ===
                                +this.act_route.snapshot.params['id'],
                        };
                    });
                })
            )
            .subscribe((data) => {
                if (newData) {
                    data[0]['name'] = newData.name;
                }
                this.shopsDropdowns = data;
            });
    }

    public onSelectedShop(event: any) {
        if (event && event.id !== +this.act_route.snapshot.params['id']) {
            this.shopsDropdowns = this.shopsDropdowns.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    svg: item.pinned ? 'ic_star.svg' : null,
                    folder: 'common',
                    active: item.id === event.id,
                };
            });

            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeShop(action: string) {
        let currentIndex = this.shopsDropdowns.findIndex((item) => item.active);

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.onSelectedShop(this.shopsDropdowns[currentIndex]);
                    this.shopIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.shopsDropdowns.length > currentIndex
                ) {
                    this.onSelectedShop({
                        id: this.shopsDropdowns[currentIndex].id,
                    });
                    this.shopIndex = currentIndex;
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public getActiveServices(data: RepairShopResponse) {
        let res = data.serviceTypes.filter((item) => item.active);
        this.count = res.length;
        return this.count;
    }

    public tabsSwitcher() {
        this.tabs = [
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

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public changeRepairTabs(ev: any) {
        //const chartType = this.repairExpensesChart?.detailsTimePeriod(ev.name);
        //this.getRepairShopChartData(this.currentShopId, chartType);
    }

    public getRepairShopChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ) {
        if (
            id != this.repairCall.id ||
            chartType != this.repairCall.chartType
        ) {
            this.repairCall.id = id;
            this.repairCall.chartType = chartType;
        } else {
            return false;
        }
        this.repairService
            .getRepairShopChart(id, chartType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                this.barChartConfig.dataLabels = [];
                this.barChartConfig.chartValues = [item.repair, item.cost];
                this.barChartLegend[0].value = item.repair;
                this.barChartLegend[1].value = item.cost;

                let hasValue = false;

                this.barChartLegend.map((leg) => {
                    if (leg.value > 0) {
                        hasValue = true;
                    }
                });

                this.barChartConfig.hasValue = hasValue;

                this.cdRef.detectChanges();

                let milesPerGallon = [],
                    costPerGallon = [],
                    labels = [],
                    maxValue = 0,
                    maxValue2 = 0;
                if (item?.repairShopExpensesChartResponse?.length > 17) {
                    this.barChartConfig.dataProperties[1].defaultConfig.barThickness = 10;
                } else {
                    this.barChartConfig.dataProperties[1].defaultConfig.barThickness = 18;
                }
                //this.repairExpensesChart.toolTipData = [];
                item.repairShopExpensesChartResponse.map((data) => {
                    //this.repairExpensesChart.toolTipData.push(data);
                    milesPerGallon.push(data.repair);
                    costPerGallon.push(data.repairCost);
                    if (data.repair > maxValue) {
                        maxValue = data.repair + (data.repair * 7) / 100;
                    }
                    if (data.repairCost > maxValue2) {
                        maxValue2 =
                            data.repairCost + (data.repairCost * 7) / 100;
                    }
                    if (data.day) {
                        labels.push([data.day, this.monthList[data.month - 1]]);
                    } else {
                        labels.push([this.monthList[data.month - 1]]);
                    }
                });

                this.barAxes['verticalLeftAxes']['maxValue'] = maxValue;
                this.barAxes['verticalRightAxes']['maxValue'] = maxValue2;
                this.barChartConfig.dataLabels = labels;
                this.barChartConfig.dataProperties[0].defaultConfig.data =
                    costPerGallon;
                this.barChartConfig.dataProperties[1].defaultConfig.data =
                    milesPerGallon;
                // this.repairExpensesChart.chartDataCheck(
                //     this.barChartConfig.chartValues
                // );
                // this.repairExpensesChart.updateChartData(hideAnimation);
                // this.repairExpensesChart.saveValues = JSON.parse(
                //     JSON.stringify(this.barChartLegend)
                // );
                // this.repairExpensesChart.legendAttributes = JSON.parse(
                //     JSON.stringify(this.barChartLegend)
                // );
            });

        this.cdRef.detectChanges();
    }

    public chartHovered(event) {
        //this.repairExpensesChart.hoveringStatus = event;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
