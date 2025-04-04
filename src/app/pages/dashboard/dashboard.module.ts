import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { DashboardRoutingModule } from '@pages/dashboard//dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// directives
import { ClickOutsideCustomRangeDirective } from '@pages/dashboard/directives/click-outside-custom-range.directive';

// pipes
import { CaTabSwitchComponent, ThousandFormatterPipe } from 'ca-components';
import { SetTrendIconPipe } from '@pages/dashboard/pages/dashboard-performance/pipes/set-trend-icon.pipe';
import { SetTrendLabelPipe } from '@pages/dashboard/pages/dashboard-performance/pipes/set-trend-label.pipe';
import { TextColorPipe } from '@pages/dashboard/pages/dashboard-by-state/pipes/text-color.pipe';
import {
    ConditionalMoneyFilterPipe,
    CustomSubperiodWidthPipe,
    DropdownClassPipe,
    ShowMorePipe,
} from '@pages/dashboard/pipes';

// components
import { DashboardComponent } from '@pages/dashboard/pages/dashboard/dashboard.component';
import { DashboardTopRatedComponent } from '@pages/dashboard/pages/dashboard-top-rated/dashboard-top-rated.component';
import { DashboardPerformanceComponent } from '@pages/dashboard/pages/dashboard-performance/dashboard-performance.component';
import { DashboardByStateComponent } from '@pages/dashboard/pages/dashboard-by-state/dashboard-by-state.component';
import { DashboardMapComponent } from '@pages/dashboard/pages/dashboard-map/dashboard-map.component';
import { DashboardStateTrackingComponent } from '@pages/dashboard/pages/dashboard-by-state/components/dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardStateUsaComponent } from '@pages/dashboard/pages/dashboard-by-state/components/dashboard-states/dashboard-state-usa/dashboard-state-usa.component';
import { DashboardDataPlaceholderComponent } from '@pages/dashboard/components/dashboard-data-placeholder/dashboard-data-placeholder.component';
import { DashboardLoadingPlaceholderComponent } from '@pages/dashboard/components/dashboard-loading-placeholder/dashboard-loading-placeholder.component';
import { DashboardDropdownComponent } from '@pages/dashboard/components/dashboard-dropdown/dashboard-dropdown.component';

import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomPeriodRangeComponent } from '@shared/components/ta-custom-period-range/ta-custom-period-range.component';
import { TaSearchV2Component } from '@shared/components/ta-search-v2/ta-search-v2.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';
import {
    CaChartComponent,
    CaMapComponent,
    CaChartManagerComponent,
} from 'ca-components';

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
        //AgmCoreModule.forRoot(),

        // directives
        ClickOutsideCustomRangeDirective,

        // pipes
        ThousandFormatterPipe,
        SetTrendIconPipe,
        SetTrendLabelPipe,
        CustomSubperiodWidthPipe,
        TextColorPipe,
        DropdownClassPipe,
        ConditionalMoneyFilterPipe,
        ShowMorePipe,

        // components
        CaTabSwitchComponent,
        TaInputDropdownComponent,
        TaCustomPeriodRangeComponent,
        TaSearchV2Component,
        TaSpinnerComponent,
        CaMapComponent,
        CaChartComponent,
        CaChartManagerComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
