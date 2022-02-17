import { DashboardRoutingModule } from './dashboard-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared/shared.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardStatisticsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class DashboardModule {
}
