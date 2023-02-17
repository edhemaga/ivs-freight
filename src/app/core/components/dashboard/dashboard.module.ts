import { DashboardRoutingModule } from './dashboard-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardPerformanceComponent } from './dashboard-performance/dashboard-performance.component';
import { DashboardTopDriverComponent } from './dashboard-top-driver/dashboard-top-driver.component';
import { DashboardPickupByStateComponent } from './dashboard-pickup-by-state/dashboard-pickup-by-state.component';
import { DashboardMapComponent } from './dashboard-map/dashboard-map.component';
import { DashboardStateTrackingComponent } from './dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardStateUsaComponent } from './dashboard-state-tracking/dashboard-state-usa/dashboard-state-usa.component';
import { CarrierSearchComponent } from '../standalone-components/carrier-search/carrier-search.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ChartsModule } from 'ng2-charts';
import { TaChartComponent } from '../standalone-components/ta-chart/ta-chart.component';
import { AgmCoreModule } from '@agm/core';
import { TaTabSwitchComponent } from '../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TaSpinnerComponent } from '../shared/ta-spinner/ta-spinner.component';
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
        CarrierSearchComponent,
        SlickCarouselModule,
        AngularSvgIconModule,
        NgbModule,
        ChartsModule,
        TaChartComponent,
        AgmCoreModule,
        TaTabSwitchComponent,
        AppTooltipComponent,
        TaSpinnerComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
