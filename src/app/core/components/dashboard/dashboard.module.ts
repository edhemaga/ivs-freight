import { DashboardWeatherMapComponent } from './dashboard-weather/dashboard-weather-map/dashboard-weather-map.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartModule} from 'angular2-chartjs';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';
import { DashboardPerformanceChartComponent } from './dashboard-performance-chart/dashboard-performance-chart.component';
import { DashboardWeatherComponent } from './dashboard-weather/dashboard-weather.component';
import { DashboardWeatherCitiesComponent } from './dashboard-weather/dashboard-weather-cities/dashboard-weather-cities.component';
import { DashboardWeatherBarsComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-bars/dashboard-weather-bars.component';
import { DashboardWeatherInfoWeathersComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-info-weathers/dashboard-weather-info-weathers.component';
import { DashboardWeatherInfoComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-info.component';
import { DashboardStateTrackingComponent } from './dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardHistoryComponent } from './dashboard-history/dashboard-history.component';
import { DashboardStateUsaComponent } from './dashboard-state-tracking/dashboard-state-usa/dashboard-state-usa.component';
import { DashboardFuelComponent } from './dashboard-fuel/dashboard-fuel.component';
import { DashboardCalendarCustomComponent } from './dashboard-calendar-custom/dashboard-calendar-custom.component';
import { DashboardRoadInspectionComponent } from './dashboard-road-inspection/dashboard-road-inspection.component';
import { DashboardStatusesComponent } from './dashboard-statuses/dashboard-statuses.component';
import { DashboardVehicleChartComponent } from './dashboard-vehicle-chart/dashboard-vehicle-chart.component';
import { DashboardLoadingChartComponent } from './dashboard-loading-chart/dashboard-loading-chart.component';
import { DashboardInvChartComponent } from './dashboard-inv-chart/dashboard-inv-chart.component';

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
    DashboardWeatherMapComponent,
    DashboardStateTrackingComponent,
    DashboardHistoryComponent,
    DashboardStateUsaComponent,
    DashboardFuelComponent,
    DashboardCalendarCustomComponent,
    DashboardRoadInspectionComponent,
    DashboardStatusesComponent,
    DashboardVehicleChartComponent,
    DashboardLoadingChartComponent,
    DashboardInvChartComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
}
