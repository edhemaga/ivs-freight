import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { ShipperDetailsRoutingModule } from '@pages/customer/pages/shipper-details/shipper-details-routing.module';

// Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import { ShipperDetailsItemComponent } from '@pages/customer/pages/shipper-details/components/shipper-details-item/shipper-details-item.component';
import { ShipperDetailsCardComponent } from '@pages/customer/pages/shipper-details/components/shipper-details-card/shipper-details-card.component';
import { ShipperDetailsComponent } from '@pages/customer/pages/shipper-details/shipper-details.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaContactsCardComponent } from '@shared/components/ta-contacts-card/ta-contacts-card.component';
import { ShipperDetailsMapCoverCardComponent } from '@pages/customer/pages/shipper-details/components/shipper-details-card/components/shipper-details-map-cover-card/shipper-details-map-cover-card.component';
import { CaChartComponent, CaTabSwitchComponent } from 'ca-components';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatTimePipe } from '@shared/pipes/format-time.pipe';
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';

@NgModule({
    declarations: [
        ShipperDetailsComponent,
        ShipperDetailsItemComponent,
        ShipperDetailsCardComponent,
    ],
    exports: [ShipperDetailsCardComponent, SharedModule],
    imports: [
        // Routes
        ShipperDetailsRoutingModule,

        // Modules
        CommonModule,
        SharedModule,
        NgbModule,
        AngularSvgIconModule,

        // Components
        TaAppTooltipV2Component,
        TaDetailsHeaderCardComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaDetailsHeaderComponent,
        CaTabSwitchComponent,
        TaContactsCardComponent,
        ShipperDetailsMapCoverCardComponent,
        CaChartComponent,

        // Pipes
        FormatDatePipe,
        FormatTimePipe,
        FormatPhonePipe,
    ],
    providers: [FormatDatePipe],
})
export class ShipperDetailsModule {}
