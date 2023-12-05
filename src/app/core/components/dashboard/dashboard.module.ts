import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmCoreModule } from '@agm/core';

// directives
import { ClickOutsideCustomRangeDirective } from './state/directives/click-outside-custom-range.directive';

// pipes
import { FormatNumberToThousandDecimal } from './state/pipes/thousand-pipe/thousand-formater.pipe';
import { SetTrendIconPipe } from './state/pipes/set-trend-icon-pipe/set-trend-icon.pipe';
import { SetTrendLabelPipe } from './state/pipes/set-trend-label-pipe/set-trend-label.pipe';

// components
import { DashboardComponent } from './components/main-components/dashboard/dashboard.component';
import { DashboardTopRatedComponent } from './components/main-components/dashboard-top-rated/dashboard-top-rated.component';
import { DashboardPerformanceComponent } from './components/main-components/dashboard-performance/dashboard-performance.component';
import { DashboardByStateComponent } from './components/main-components/dashboard-by-state/dashboard-by-state.component';
import { DashboardMapComponent } from './components/main-components/dashboard-map/dashboard-map.component';
import { DashboardStateTrackingComponent } from './components/components/dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardStateUsaComponent } from './components/components/dashboard-states/dashboard-state-usa/dashboard-state-usa.component';
import { DashboardDataPlaceholderComponent } from './components/components/dashboard-data-placeholder/dashboard-data-placeholder.component';
import { DashboardLoadingPlaceholderComponent } from './components/components/dashboard-loading-placeholder/dashboard-loading-placeholder.component';
import { DashboardDropdownComponent } from './components/components/dashboard-dropdown/dashboard-dropdown.component';

import { TaTabSwitchComponent } from '../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomPeriodRangeComponent } from '../standalone-components/ta-custom-period-range/ta-custom-period-range.component';
import { TaChartComponent } from '../standalone-components/ta-chart/ta-chart.component';
import { CarrierSearchTwoComponent } from '../standalone-components/carrier-search-two/carrier-search-two.component';
import { TaSpinnerComponent } from '../shared/ta-spinner/ta-spinner.component';

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardTopRatedComponent,
        DashboardPerformanceComponent,
        DashboardByStateComponent,
        DashboardMapComponent,
        DashboardStateTrackingComponent,
        DashboardStateUsaComponent,
        DashboardDataPlaceholderComponent,
        DashboardLoadingPlaceholderComponent,
        DashboardDropdownComponent,
    ],
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        DashboardRoutingModule,
        AngularSvgIconModule,
        AgmCoreModule.forRoot(),

        // directives
        ClickOutsideCustomRangeDirective,

        // pipes
        FormatNumberToThousandDecimal,
        SetTrendIconPipe,
        SetTrendLabelPipe,

        // components
        TaTabSwitchComponent,
        TaInputDropdownComponent,
        TaCustomPeriodRangeComponent,
        TaChartComponent,
        CarrierSearchTwoComponent,
        TaSpinnerComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
