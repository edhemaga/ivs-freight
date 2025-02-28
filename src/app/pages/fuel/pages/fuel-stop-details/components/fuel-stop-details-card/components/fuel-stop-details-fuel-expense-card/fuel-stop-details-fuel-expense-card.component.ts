import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// services
import { FuelService } from '@shared/services/fuel.service';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { CaChartComponent, IChartConfiguration } from 'ca-components';

// constants
import {
    ChartConfiguration,
    ChartLegendConfiguration,
} from '@shared/utils/constants';
import { FuelDetailsChartsConfiguration } from '@pages/fuel/utils/constants';
import { FuelStopDetailsCardConstants } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/utils/constants';

// helpers
import { ChartHelper } from '@shared/utils/helpers';

// models
import { ChartLegendProperty, Tabs } from '@shared/models';
import { FuelStopExpensesResponse, FuelStopResponse } from 'appcoretruckassist';

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
export class FuelStopDetailsFuelExpenseCardComponent implements OnDestroy {
    @Input() set cardData(data: FuelStopResponse) {
        this.getConstantData();

        this.createFuelExpenseCardData(data);
    }

    private destroy$ = new Subject<void>();

    public _cardData: FuelStopResponse;

    public fuelExpenseChartTabs: Tabs[] = ChartHelper.generateTimeTabs();
    public selectedTab: number;

    public fuelChartData!: FuelStopExpensesResponse;
    public fuelChartConfig!: IChartConfiguration;
    public fuelChartLegend!: ChartLegendProperty[];

    public fuelLegendHighlightedBackground!: boolean;
    public fuelLegendTitle!: string;

    constructor(private fuelService: FuelService) {}

    private getConstantData(): void {
        this.fuelExpenseChartTabs = JSON.parse(
            JSON.stringify(
                FuelStopDetailsCardConstants.FUEL_EXPENSES_CHART_TABS
            )
        );
    }

    private createFuelExpenseCardData(
        data: FuelStopResponse,
        chartTimeDetailPages: number = 1
    ): void {
        this._cardData = data;

        this.fuelService
            .getFuelExpenses(this._cardData.id, chartTimeDetailPages)
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
            });
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

    public onChartTabChange(tab: Tabs): void {
        this.selectedTab = tab.id;

        this.createFuelExpenseCardData(this._cardData, this.selectedTab);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
