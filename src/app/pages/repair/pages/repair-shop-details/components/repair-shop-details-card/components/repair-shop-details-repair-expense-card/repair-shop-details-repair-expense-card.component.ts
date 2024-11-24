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

// constants
import { RepairExpenseCartConstants, RepairShopChartsConfiguration } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/utils/constants';

// models
import { RepairShopResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';
import { IChartConfiguaration } from 'ca-components/lib/components/ca-chart/models';

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
        CaChartComponent
    ],
})
export class RepairShopDetailsRepairExpenseCardComponent implements OnDestroy {
    @Input() set cardData(data: RepairShopResponse) {
        this.createRepairExpenseCardData(data);
    }

    private destroy$ = new Subject<void>();

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public _cardData: RepairShopResponse;

    /* TODO - set chart types */
    // public barChartConfig: any;
    // public barChartAxes: any;
    // public barChartLegend: any[] = [];

    public repairExpensesChart: any;

    public repairCall: any;
    public monthList: string[] = [];

    public currentShopId: number;

    public chartTabs: Tabs[];

    public repairShopChartConfig: IChartConfiguaration = RepairShopChartsConfiguration.REPAIR_CHART_CONFIG;

    constructor(
        private repairService: RepairService,

        // change detection
        private cdRef: ChangeDetectorRef
    ) { }

    private getConstantData(): void {
        this.repairCall = RepairExpenseCartConstants.REPAIR_CALL;

        this.monthList = RepairExpenseCartConstants.MONTH_LIST;

        this.chartTabs = RepairExpenseCartConstants.CHART_TABS;
    }

    public createRepairExpenseCardData(data): void {
        this._cardData = data;

        this.getConstantData();

        this.getRepairShopChartData(
            this._cardData?.id,
            this.repairCall.chartType,
            false
        );
    }

    public getRepairShopChartData(
        id: number,
        chartType: number,
        hideAnimation?: boolean
    ): boolean {
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
                // this.barChartConfig.dataLabels = [];
                // this.barChartConfig.chartValues = [item.repair, item.cost];

                // this.barChartLegend[0].value = item.repair;
                // this.barChartLegend[1].value = item.cost;

                // let hasValue = false;

                // this.barChartLegend.forEach((leg) => {
                //     if (leg.value > 0) hasValue = true;
                // });

                // this.barChartConfig.hasValue = hasValue;

                let milesPerGallon = [],
                    costPerGallon = [],
                    labels = [],
                    maxValue = 0,
                    maxValue2 = 0;

                // if (item?.repairShopExpensesChartResponse?.length > 17) {
                //     this.barChartConfig.dataProperties[1].defaultConfig.barThickness = 10;
                // } else {
                //     this.barChartConfig.dataProperties[1].defaultConfig.barThickness = 18;
                // }

                //this.repairExpensesChart.toolTipData = [];
                item.repairShopExpensesChartResponse.forEach((data) => {
                    //this.repairExpensesChart.toolTipData.push(data);
                    milesPerGallon.push(data.repair);
                    costPerGallon.push(data.repairCost);

                    if (data.repair > maxValue)
                        maxValue = data.repair + (data.repair * 7) / 100;

                    if (data.repairCost > maxValue2)
                        maxValue2 =
                            data.repairCost + (data.repairCost * 7) / 100;

                    if (data.day) {
                        labels.push([data.day, this.monthList[data.month - 1]]);
                    } else {
                        labels.push([this.monthList[data.month - 1]]);
                    }
                });

                // this.barChartAxes['verticalLeftAxes']['maxValue'] = maxValue;
                // this.barChartAxes['verticalRightAxes']['maxValue'] = maxValue2;

                // this.barChartConfig.dataLabels = labels;
                // this.barChartConfig.dataProperties[0].defaultConfig.data =
                //     costPerGallon;
                // this.barChartConfig.dataProperties[1].defaultConfig.data =
                //     milesPerGallon;

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

    public chartHovered(isHovered: boolean): void {
        // this.repairExpensesChart.hoveringStatus = isHovered;
    }

    public onTabChange(tab: Tabs): void {
        /* const chartType = this.repairExpensesChart?.detailsTimePeriod(tab.name);

      this.getRepairShopChartData(this._cardData?.id, chartType); */
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
