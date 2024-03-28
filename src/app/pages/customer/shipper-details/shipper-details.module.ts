import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { ShipperDetailsRoutes } from './shipper-details.routing';

// Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import { ShipperDetailsSingleComponent } from './shipper-details-single/shipper-details-single.component';
import { ShipperCardViewComponent } from './../shipper-card-view/shipper-card-view.component';
import { ShipperDetailsComponent } from './shipper-details.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaDetailsHeaderCardComponent } from 'src/app/core/components/shared/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
import { TaCommonHeaderComponent } from 'src/app/core/components/shared/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from 'src/app/core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';

// Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { formatTimePipe } from 'src/app/core/pipes/formatTime.pipe';

@NgModule({
    declarations: [
        ShipperDetailsComponent,
        ShipperDetailsSingleComponent,
        ShipperCardViewComponent,
    ],
    exports: [ShipperCardViewComponent, SharedModule],
    imports: [
        // Routes
        ShipperDetailsRoutes,

        // Modules
        CommonModule,
        SharedModule,
        NgbModule,
        AngularSvgIconModule,

        // Components
        TaChartComponent,
        AppTooltipComponent,
        TaDetailsHeaderCardComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaCommonHeaderComponent,
        TaTabSwitchComponent,

        // Pipes
        formatDatePipe,
        formatTimePipe,
    ],
    providers: [formatDatePipe],
})
export class ShipperDetailsModule {}
