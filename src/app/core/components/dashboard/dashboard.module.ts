import { DashboardRoutingModule } from './dashboard-routing.module';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardPerformanceComponent } from './dashboard-performance/dashboard-performance.component';
import { DashboardTopDriverComponent } from './dashboard-top-driver/dashboard-top-driver.component';
@NgModule({
  declarations: [
    DashboardComponent,
    DashboardPerformanceComponent,
    DashboardTopDriverComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
}
