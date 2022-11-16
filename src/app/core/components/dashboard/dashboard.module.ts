import { DashboardRoutingModule } from './dashboard-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardPerformanceComponent } from './dashboard-performance/dashboard-performance.component';
import { DashboardTopDriverComponent } from './dashboard-top-driver/dashboard-top-driver.component';
import { DashboardPickupByStateComponent } from './dashboard-pickup-by-state/dashboard-pickup-by-state.component';
import { DashboardMapComponent } from './dashboard-map/dashboard-map.component';
import { DashboardStateTrackingComponent } from './dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardStateUsaComponent } from './dashboard-state-tracking/dashboard-state-usa/dashboard-state-usa.component';
import { TaNoteModule } from '../shared/ta-note/ta-note.module';
import { TruckassistSearchModule } from '../shared/truckassist-search/truckassist-search.module';

@NgModule({
   declarations: [
      DashboardComponent,
      DashboardPerformanceComponent,
      DashboardTopDriverComponent,
      DashboardPickupByStateComponent,
      DashboardMapComponent,
      DashboardStateTrackingComponent,
      DashboardStateUsaComponent,
   ],
   imports: [
      CommonModule,
      DashboardRoutingModule,
      ReactiveFormsModule,
      SharedModule,
      TaNoteModule,
      TruckassistSearchModule,
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
