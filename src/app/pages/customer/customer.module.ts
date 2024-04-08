// Modules
import { ShipperDetailsModule } from './pages/shipper-details/shipper-details.module';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerRoutingModule } from './customer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { BrokerDetailsModule } from './pages/broker-details/broker-details.module';

// Components
import { BrokerCardComponent } from './pages/broker-card/broker-card.component';

import { CustomerTableComponent } from './pages/customer-table/customer-table.component';

import { TaAppTooltipV2Component } from 'src/app/shared/components/app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';

import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';

import { TaMapsComponent } from 'src/app/shared/components/ta-maps/ta-maps.component';
import { TaMapListComponent } from 'src/app/shared/components/ta-map-list/ta-map-list.component';
import { TaMapListCardComponent } from 'src/app/shared/components/ta-map-list-card/ta-map-list-card.component';

import { CustomerCardComponent } from './pages/customer-table/components/customer-card/customer-card.component';

import { TaInputDropdownTableComponent } from 'src/app/shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';

//pipes
import { FormatEinPipe } from 'src/app/shared/pipes/format-ein.pipe';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

@NgModule({
    declarations: [
        CustomerTableComponent,
        BrokerCardComponent,
        CustomerCardComponent,
    ],
    imports: [
        // Modules
        CommonModule,
        CustomerRoutingModule,
        ShipperDetailsModule,
        BrokerDetailsModule,
        AngularSvgIconModule,
        SharedModule,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
        NgbModule,

        // Components
        TaAppTooltipV2Component,
        TaCopyComponent,
        TaCustomCardComponent,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaMapsComponent,
        TaMapListComponent,
        TaMapListCardComponent,
        TaInputDropdownTableComponent,
        TaTableCardDropdownActionsComponent,
        TaNoteComponent,

        // Pipes
        FormatDatePipe,
        FormatEinPipe,
    ],
})
export class CustomerModule {}
