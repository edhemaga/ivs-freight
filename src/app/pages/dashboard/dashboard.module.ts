import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmCoreModule } from '@agm/core';

// directives
import { ClickOutsideCustomRangeDirective } from './directives/click-outside-custom-range.directive';

// pipes
import { ThousandFormatterPipe } from './pipes/thousand-formater.pipe';
import { SetTrendIconPipe } from './pages/dashboard-performance/pipes/set-trend-icon.pipe';
import { SetTrendLabelPipe } from './pages/dashboard-performance/pipes/set-trend-label.pipe';
import { CustomSubperiodWidthPipe } from './pipes/custom-subperiod-width.pipe';

// components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardTopRatedComponent } from './pages/dashboard-top-rated/dashboard-top-rated.component';
import { DashboardPerformanceComponent } from './pages/dashboard-performance/dashboard-performance.component';
import { DashboardByStateComponent } from './pages/dashboard-by-state/dashboard-by-state.component';
import { DashboardMapComponent } from './pages/dashboard-map/dashboard-map.component';
import { DashboardStateTrackingComponent } from './pages/dashboard-by-state/components/dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardStateUsaComponent } from './pages/dashboard-by-state/components/dashboard-states/dashboard-state-usa/dashboard-state-usa.component';
import { DashboardDataPlaceholderComponent } from './components/dashboard-data-placeholder/dashboard-data-placeholder.component';
import { DashboardLoadingPlaceholderComponent } from './components/dashboard-loading-placeholder/dashboard-loading-placeholder.component';
import { DashboardDropdownComponent } from './components/dashboard-dropdown/dashboard-dropdown.component';

import { TaTabSwitchComponent } from 'src/app/core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomPeriodRangeComponent } from 'src/app/core/components/standalone-components/ta-custom-period-range/ta-custom-period-range.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';
import { CarrierSearchTwoComponent } from 'src/app/core/components/standalone-components/carrier-search-two/carrier-search-two.component';
import { TaSpinnerComponent } from 'src/app/core/components/shared/ta-spinner/ta-spinner.component';
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
        ThousandFormatterPipe,
        SetTrendIconPipe,
        SetTrendLabelPipe,
        CustomSubperiodWidthPipe,

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
