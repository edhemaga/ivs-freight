import { DashboardWeatherMapComponent } from './dashboard-weather/dashboard-weather-map/dashboard-weather-map.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartModule} from 'angular2-chartjs';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared/shared.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';
import { DashboardPerformanceChartComponent } from './dashboard-performance-chart/dashboard-performance-chart.component';
import { DashboardWeatherComponent } from './dashboard-weather/dashboard-weather.component';
import { DashboardWeatherCitiesComponent } from './dashboard-weather/dashboard-weather-cities/dashboard-weather-cities.component';
import { DashboardWeatherBarsComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-bars/dashboard-weather-bars.component';
import { DashboardWeatherInfoWeathersComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-info-weathers/dashboard-weather-info-weathers.component';
import { DashboardWeatherInfoComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-info.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardStatisticsComponent,
    DashboardPerformanceChartComponent,
    DashboardWeatherComponent,
    DashboardWeatherCitiesComponent,
    DashboardWeatherBarsComponent,
    DashboardWeatherInfoWeathersComponent,
    DashboardWeatherInfoComponent,
    DashboardWeatherMapComponent
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
