import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { ShipperDetailsRoutes } from './shipper-details.routing';

// Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import { ShipperDetailsItemComponent } from './components/shipper-details-item/shipper-details-item.component';
import { ShipperDetailsCardComponent } from './components/shipper-details-card/shipper-details-card.component';
import { ShipperDetailsComponent } from './shipper-details.component';
import { TaChartComponent } from 'src/app/shared/components/ta-chart/ta-chart.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';

// Pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { FormatTimePipe } from 'src/app/shared/pipes/format-time.pipe';

@NgModule({
    declarations: [
        ShipperDetailsComponent,
        ShipperDetailsItemComponent,
        ShipperDetailsCardComponent,
    ],
    exports: [ShipperDetailsCardComponent, SharedModule],
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
        TaDetailsHeaderComponent,
        TaTabSwitchComponent,

        // Pipes
        FormatDatePipe,
        FormatTimePipe,
    ],
    providers: [FormatDatePipe],
})
export class ShipperDetailsModule {}
