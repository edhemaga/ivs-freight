import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

// services
import { FuelService } from '@shared/services/fuel.service';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { CaChartComponent, IChartConfiguration } from 'ca-components';

// constants
import { ChartLegendConfiguration } from '@shared/utils/constants';

// helpers
import { ChartHelper } from '@shared/utils/helpers';

// models
import { ChartLegendProperty, Tabs } from '@shared/models';
import { FuelStopExpensesResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-stop-details-fuel-expense-card',
    templateUrl: './fuel-stop-details-fuel-expense-card.component.html',
    styleUrl: './fuel-stop-details-fuel-expense-card.component.scss',
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
export class FuelStopDetailsFuelExpenseCardComponent
    implements OnInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    public fuelLegendHighlightedBackground!: boolean;
    public fuelChartData!: FuelStopExpensesResponse;
    public fuelChartConfig!: IChartConfiguration;
    public fuelChartLegend!: ChartLegendProperty[];
    public fuelLegendTitle!: string;

    public tabsFuel: Tabs[] = ChartHelper.generateTimeTabs();

    public selectedTab: number;

    constructor(private fuelService: FuelService) {}

    ngOnInit(): void {
        this.tabsFuel = [
            {
                id: 221,
                name: '1M',
            },
            {
                id: 511,
                name: '3M',
            },
            {
                id: 416,
                name: '6M',
            },
            {
                id: 511,
                name: '1Y',
            },
            {
                id: 1224,
                name: 'YTD',
            },
            {
                id: 1902,
                name: 'ALL',
            },
        ];
    }

    public setFuelLegendOnHover(index: number): void {
        const { hasHighlightedBackground, title } = ChartHelper.setChartLegend(
            index,
            this.fuelChartConfig.chartData.labels
        );

        this.fuelLegendHighlightedBackground = hasHighlightedBackground;
        this.fuelLegendTitle = title;

        const dataForLegend =
            isNaN(index) || index < 0
                ? this.fuelChartData
                : this.fuelChartData?.fuelStopExpensesChartResponse[index];

        this.fuelChartLegend =
            ChartLegendConfiguration.fuelExpensesLegend(dataForLegend);
    }

    public changeTab(ev: any) {
        this.selectedTab = ev.id;
        this.getFuelExpenses(this.selectedTab);
    }

    private getFuelExpenses(timeFilter?: number): void {
        /* this.fuelService
          .getFuelExpenses(this.fuelData.id, timeFilter || 1)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: FuelStopExpensesResponse) => {
              this.fuelChartData = response;
              
              this.fuelChartConfig = {
                  ...FuelDetailsChartsConfiguration.FUEL_CHART_CONFIG,
                  chartData: ChartHelper.generateDataByDateTime(
                      this.fuelChartData.fuelStopExpensesChartResponse,
                      ChartConfiguration.fuelExpensesConfiguration
                  ),
              };
    
              this.fuelChartLegend =
                  ChartLegendConfiguration.fuelExpensesLegend(
                      this.fuelChartData
                  );
          }); */
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
