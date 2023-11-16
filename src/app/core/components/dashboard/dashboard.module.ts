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

// components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardTopRatedComponent } from './components/dashboard-top-rated/dashboard-top-rated.component';

import { TaTabSwitchComponent } from '../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaSpinnerComponent } from '../shared/ta-spinner/ta-spinner.component';
import { TaCustomPeriodRangeComponent } from '../standalone-components/ta-custom-period-range/ta-custom-period-range.component';
import { TaChartComponent } from '../standalone-components/ta-chart/ta-chart.component';
import { CarrierSearchTwoComponent } from '../standalone-components/carrier-search-two/carrier-search-two.component';

import { DashboardPerformanceComponent } from './components/dashboard-performance/dashboard-performance.component';
import { DashboardPickupByStateComponent } from './components/dashboard-pickup-by-state/dashboard-pickup-by-state.component';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardStateTrackingComponent } from './components/dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardStateUsaComponent } from './components/dashboard-state-tracking/dashboard-state-usa/dashboard-state-usa.component';

import { CarrierSearchComponent } from '../standalone-components/carrier-search/carrier-search.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { FormatNumberToThousandDecimal } from './state/pipes/thousand-pipe/thousand-formater.pipe';

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardTopRatedComponent,
        DashboardPerformanceComponent,
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
        AgmCoreModule,
        AngularSvgIconModule,

        // directives
        ClickOutsideCustomRangeDirective,

        // pipes
        FormatNumberToThousandDecimal,

        // components
        TaTabSwitchComponent,
        TaInputDropdownComponent,
        TaSpinnerComponent,
        TaCustomPeriodRangeComponent,
        TaChartComponent,
        CarrierSearchTwoComponent,
        CarrierSearchComponent,
        AppTooltipComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
