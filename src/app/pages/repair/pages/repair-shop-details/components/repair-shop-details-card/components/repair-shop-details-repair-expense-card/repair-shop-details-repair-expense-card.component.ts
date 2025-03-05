import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { CaChartComponent } from 'ca-components';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// services
import { RepairService } from '@shared/services/repair.service';

// helpers
import { ChartHelper } from '@shared/utils/helpers';

// constants
import {
    RepairExpenseCartConstants,
    RepairShopChartsConfiguration,
} from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/constants';
import {
    ChartConfiguration,
    ChartLegendConfiguration,
} from '@shared/utils/constants';

// models
import {
    RepairShopExpensesResponse,
    RepairShopResponse,
} from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';
import { IChartConfiguration } from 'ca-components/lib/components/ca-chart/models';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { ChartLegendProperty } from '@shared/models';

@Component({
    selector: 'app-repair-shop-details-repair-expense-card',
    templateUrl: './repair-shop-details-repair-expense-card.component.html',
    styleUrls: ['./repair-shop-details-repair-expense-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
        TaTabSwitchComponent,
        CaChartComponent,
    ],
})
export class RepairShopDetailsRepairExpenseCardComponent implements OnDestroy {
    @Input() set cardData(data: RepairShopResponse) {
        this.createRepairExpenseCardData(data);
    }

    private destroy$ = new Subject<void>();

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public _cardData: RepairShopResponse;

    public repairExpensesChart: any;

    public repairCall: any;
    public monthList: string[] = [];

    public currentShopId: number;

    // Chart
    public repairShopChartData!: RepairShopExpensesResponse;
    public repairShopChartConfig: IChartConfiguration;
    public repairShopExpensesChartLegendData!: ChartLegendProperty[];
    public repairShopExpensesChartTabs: Tabs[] = ChartHelper.generateTimeTabs();
    public repairShopExpensesLegendTitle!: string;
    public repairShopExpensesLegendHighlightedBackground!: boolean;

    constructor(
        private repairService: RepairService,

        // change detection
        private cdRef: ChangeDetectorRef
    ) {}

    private getConstantData(): void {
        this.repairCall = RepairExpenseCartConstants.REPAIR_CALL;

        this.monthList = RepairExpenseCartConstants.MONTH_LIST;
    }

    public createRepairExpenseCardData(data: RepairShopResponse): void {
        this._cardData = data;

        this.getConstantData();

        this.getRepairShopChartData(this._cardData?.id, 1);
    }

    public getRepairShopChartData(id: number, timeFilter?: number): void {
        this.repairService
            .getRepairShopChart(id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((item: RepairShopExpensesResponse) => {
                if (
                    timeFilter &&
                    this.repairShopExpensesChartTabs[timeFilter - 1]
                )
                    this.repairShopExpensesChartTabs[timeFilter - 1].checked =
                        true;
                this.repairShopExpensesLegendHighlightedBackground = false;

                this.repairShopChartData = item;

                this.repairShopChartConfig = {
                    ...RepairShopChartsConfiguration.REPAIR_CHART_CONFIG,
                    chartData:
                        ChartHelper.generateDataByDateTime<RepairShopExpensesResponse>(
                            this.repairShopChartData
                                .repairShopExpensesChartResponse,
                            ChartConfiguration.REPAIR_SHOP_EXPENSES_CONFIGURATION,
                            timeFilter
                        ),
                };

                this.repairShopExpensesChartLegendData = [
                    ...ChartLegendConfiguration.REPAIR_SHOP_EXPENSES_CONFIGURATION(
                        this.repairShopChartData
                    ),
                ];
                let milesPerGallon = [],
                    costPerGallon = [],
                    labels = [],
                    maxValue = 0,
                    maxValue2 = 0;

                item?.repairShopExpensesChartResponse?.forEach((data) => {
                    milesPerGallon.push(data.repair);
                    costPerGallon.push(data.repairCost);

                    if (data.repair > maxValue)
                        maxValue = data.repair + (data.repair * 7) / 100;

                    if (data.repairCost > maxValue2)
                        maxValue2 =
                            data.repairCost + (data.repairCost * 7) / 100;

                    if (data.day)
                        labels.push([data.day, this.monthList[data.month - 1]]);
                    else labels.push([this.monthList[data.month - 1]]);
                });
            });

        this.cdRef.detectChanges();
    }

    public setRepairShopExpensesLegendOnHover(index: number): void {
        const { hasHighlightedBackground, title } = ChartHelper.setChartLegend(
            index,
            this.repairShopChartConfig.chartData.labels
        );

        this.repairShopExpensesLegendHighlightedBackground =
            hasHighlightedBackground;
        this.repairShopExpensesLegendTitle = title;

        const dataForLegend =
            isNaN(index) || index < 0
                ? this.repairShopChartData
                : this.repairShopChartData?.repairShopExpensesChartResponse[
                      index
                  ];

        this.repairShopExpensesChartLegendData = [
            ...ChartLegendConfiguration.REPAIR_SHOP_EXPENSES_CONFIGURATION(
                dataForLegend
            ),
        ];
    }

    public onTabChange(tab: TabOptions): void {
        this.getRepairShopChartData(this._cardData?.id, tab.id);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
