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
import { FormControl } from '@angular/forms';
import { RepairShopResponse } from 'appcoretruckassist';
import { map, Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DetailsPageService } from '../../../services/details-page/details-page-ser.service';
import { RepairShopMinimalListResponse } from '../../../../../../appcoretruckassist/model/repairShopMinimalListResponse';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RepairDQuery } from '../state/details-state/repair-d.query';

@Component({
    selector: 'app-shop-repair-card-view',
    templateUrl: './shop-repair-card-view.component.html',
    styleUrls: ['./shop-repair-card-view.component.scss'],
})
export class ShopRepairCardViewComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$ = new Subject<void>();
    @ViewChild('reparExpensesChart', { static: false })
    public reparExpensesChart: any;
    @Input() repairShopCardViewData: RepairShopResponse;
    @Input() templateCard: boolean;
    public noteControl: FormControl = new FormControl();
    public count: number;
    public tabs: any;
    public shopsDropdowns: any[] = [];
    public shopsList: any;
    public repairShopObject: any;

    barChartConfig: any = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        1050, 950, 2200, 1100, 1250, 1550, 2100, 2500, 2000,
                        1150, 1300, 1700,
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
                    data: [
                        2200, 1700, 2800, 1100, 1500, 2200, 3300, 3700, 2500,
                        1400, 2200, 2800,
                    ],
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
        chartValues: [46, 755, 0, 36.854],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        defaultType: 'bar',
        chartWidth: '417',
        chartHeight: '130',
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
    };

    public barChartLegend: any[] = [
        {
            title: 'Repair',
            value: 46755,
            image: 'assets/svg/common/round_yellow.svg',
            elementId: 1,
        },
        {
            title: 'Cost',
            value: 36854,
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
            showGridLines: true,
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

    constructor(
        private detailsPageDriverSer: DetailsPageService,
        private tableService: TruckassistTableService,
        private cdRef: ChangeDetectorRef,
        private repairDQuery: RepairDQuery,
        private act_route: ActivatedRoute,
        private router: Router
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
        this.getActiveServices(changes.repairShopCardViewData.currentValue);
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
    }

    public getShopsDropdown() {
        this.repairDQuery.repairShopMinimal$
            .pipe(
                takeUntil(this.destroy$),
                map((data: RepairShopMinimalListResponse) => {
                    return data.pagination.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            status: item.status,
                            svg: item.pinned ? 'ic_star.svg' : null,
                            folder: 'common',
                            active:
                                item.id ===
                                +this.act_route.snapshot.params['id'],
                        };
                    });
                })
            )
            .subscribe((data) => {
                this.shopsDropdowns = data;
            });
    }

    public onSelectedShop(event: any) {
        if (event.id !== +this.act_route.snapshot.params['id']) {
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.tableService.sendActionAnimation({});
    }
}
