import { DashboardRoutingModule } from './dashboard-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartModule} from 'angular2-chartjs';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared/shared.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';
import { DashboardPerformanceChartComponent } from './dashboard-performance-chart/dashboard-performance-chart.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardStatisticsComponent,
    DashboardPerformanceChartComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule
  ]
})
export class DashboardModule {
}
