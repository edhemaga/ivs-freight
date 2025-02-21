import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// pipes
import { FormatDatePipe } from '@shared/pipes';
import { ChartHelper } from '@shared/utils/helpers';
import { FuelStopExpensesResponse } from 'appcoretruckassist';
import { ChartLegendProperty, Tabs } from '@shared/models';
import { IChartConfiguration } from 'ca-components';
import {
    ChartConfiguration,
    ChartLegendConfiguration,
} from '@shared/utils/constants';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { Subject, takeUntil } from 'rxjs';

// services
import { FuelService } from '@shared/services/fuel.service';
import { FuelDetailsChartsConfiguration } from '@pages/fuel/utils/constants';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'app-fuel-stop-details-card',
    templateUrl: './fuel-stop-details-card.component.html',
    styleUrl: './fuel-stop-details-card.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,

        // pipes
        FormatDatePipe,
    ],
})
export class FuelStopDetailsCardComponent implements OnInit, OnDestroy {
    public fuelDropdown: any;
    public storeDropdown: any;

    public noteControl: UntypedFormControl = new UntypedFormControl();

    public fuelPriceColors: any[] = [
        '#4DB6A2',
        '#81C784',
        '#FFD54F',
        '#FFB74D',
        '#E57373',
        '#919191',
    ];

    // charts
    public fuelLegendHighlightedBackground!: boolean;
    public fuelChartData!: FuelStopExpensesResponse;
    public fuelChartConfig!: IChartConfiguration;
    public fuelChartLegend!: ChartLegendProperty[];
    public fuelLegendTitle!: string;

    public tabsFuel: Tabs[] = ChartHelper.generateTimeTabs();

    public selectedTab: number;

    private destroy$ = new Subject<void>();

    constructor(private fuelService: FuelService) {}

    ngOnInit(): void {
        this.fuelDropDown();
        this.storeDropDown();

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

    public fuelDropDown() {
        let fuelNames = [
            { id: 1, name: 'PILOT TRAVEL STOP 1' },
            { id: 2, name: 'PILOT TRAVEL STOP 2' },
        ];
        this.fuelDropdown = fuelNames.map((item) => {
            return {
                id: item.id,
                name: item.name,
                active: item.id,
            };
        });
    }

    public storeDropDown() {
        let storeNames = [
            { id: 1, name: 'Store 424', pinned: true },
            { id: 2, name: 'Store 555', pinned: null },
        ];
        this.storeDropdown = storeNames.map((item) => {
            return {
                id: item.id,
                name: item.name,
                svg: item.pinned ? 'ic_star.svg' : null,
                folder: 'common',
                active: item.id,
            };
        });
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
