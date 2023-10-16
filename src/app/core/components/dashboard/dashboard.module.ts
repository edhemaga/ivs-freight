import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';

// components
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardTopRatedComponent } from './dashboard-top-rated/dashboard-top-rated.component';

import { TaTabSwitchComponent } from '../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '../shared/ta-input-dropdown/ta-input-dropdown.component';
import { CarrierSearchTwoComponent } from '../standalone-components/carrier-search-two/carrier-search-two.component';

import { DashboardPerformanceComponent } from './dashboard-performance/dashboard-performance.component';
import { DashboardPickupByStateComponent } from './dashboard-pickup-by-state/dashboard-pickup-by-state.component';
import { DashboardMapComponent } from './dashboard-map/dashboard-map.component';
import { DashboardStateTrackingComponent } from './dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardStateUsaComponent } from './dashboard-state-tracking/dashboard-state-usa/dashboard-state-usa.component';

import { CarrierSearchComponent } from '../standalone-components/carrier-search/carrier-search.component';
import { TaChartComponent } from '../standalone-components/ta-chart/ta-chart.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TaSpinnerComponent } from '../shared/ta-spinner/ta-spinner.component';

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardPerformanceComponent,
        DashboardTopRatedComponent,
        DashboardPickupByStateComponent,
        DashboardMapComponent,
        DashboardStateTrackingComponent,
        DashboardStateUsaComponent,
    ],
    imports: [
        // modules
        CommonModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        NgbModule,
        ChartsModule,
        AgmCoreModule,
        AngularSvgIconModule,

        // components
        CarrierSearchComponent,
        TaChartComponent,
        TaTabSwitchComponent,
        AppTooltipComponent,
        TaSpinnerComponent,
        TaInputDropdownComponent,
        CarrierSearchTwoComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
