import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// services
import { FuelService } from '@shared/services/fuel.service';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import {
    CaChartComponent,
    CaTabSwitchComponent,
    IChartConfiguration,
} from 'ca-components';

// constants
import {
    ChartConfiguration,
    ChartLegendConfiguration,
} from '@shared/utils/constants';
import { FuelDetailsChartsConfiguration } from '@pages/fuel/utils/constants';

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
        CaTabSwitchComponent,
        CaChartComponent,
    ],
})
export class FuelStopDetailsFuelExpenseCardComponent implements OnDestroy {
    @Input() set cardData(data: FuelStopResponse) {
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

    private createFuelExpenseCardData(
        data: FuelStopResponse,
        timeFilter: number = 1
    ): void {
        this._cardData = data;

        this.fuelService
            .getFuelExpenses(this._cardData.id, timeFilter || 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: FuelStopExpensesResponse) => {
                if (timeFilter && this.fuelExpenseChartTabs[timeFilter - 1])
                    this.fuelExpenseChartTabs = this.fuelExpenseChartTabs?.map(
                        (tab: Tabs, indx: number) => {
                            const tabModified: Tabs = {
                                ...tab,
                                checked: timeFilter - 1 === indx,
                            };
                            return tabModified;
                        }
                    );
                this.fuelChartData = response;

                this.fuelChartConfig = {
                    ...FuelDetailsChartsConfiguration.FUEL_CHART_CONFIG,
                    chartData: ChartHelper.generateDataByDateTime(
                        this.fuelChartData.fuelStopExpensesChartResponse,
                        ChartConfiguration.FUEL_EXPENSES_CONFIGURATION,
                        timeFilter
                    ),
                };

                this.fuelChartLegend =
                    ChartLegendConfiguration.FUEL_EXPENSES_LEGEND(
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
            isNaN(index) || index < 0 || index === null
                ? this.fuelChartData
                : this.fuelChartData?.fuelStopExpensesChartResponse[index];

        this.fuelChartLegend =
            ChartLegendConfiguration.FUEL_EXPENSES_LEGEND(dataForLegend);
    }

    public onChartTabChange(tab: Tabs): void {
        if (this.selectedTab === tab.id) return;
        this.selectedTab = tab.id;
        this.createFuelExpenseCardData(this._cardData, this.selectedTab);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
