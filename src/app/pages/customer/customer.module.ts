import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { ShipperDetailsModule } from '@pages/customer/pages/shipper-details/shipper-details.module';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerRoutingModule } from '@pages/customer/customer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
// import { AgmCoreModule } from '@agm/core';
import { BrokerDetailsModule } from '@pages/customer/pages/broker-details/broker-details.module';

// Components
import { BrokerCardComponent } from '@pages/customer/pages/broker-card/broker-card.component';

import { CustomerTableComponent } from '@pages/customer/pages/customer-table/customer-table.component';

import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';

//import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';
import { TaMapListComponent } from '@shared/components/ta-map-list/ta-map-list.component';
import { TaMapListCardComponent } from '@shared/components/ta-map-list-card/ta-map-list-card.component';

import { CustomerCardComponent } from '@pages/customer/pages/customer-table/components/customer-card/customer-card.component';

import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';

import { TaContactsCardComponent } from '@shared/components/ta-contacts-card/ta-contacts-card.component';
import { TaInputDropdownContactsComponent } from '@shared/components/ta-input-dropdown-contacts/ta-input-dropdown-contacts.component';

//pipes
import { FormatEinPipe } from '@shared/pipes/format-ein.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';
import { CardValuePipe } from '@shared/pipes/card-value.pipe';

//store
import { StoreModule } from '@ngrx/store';
import { customerCardModalReducer } from '@pages/customer/pages/customer-table/components/customer-card-modal/state/customer-card-modal.reducer';

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
        // AgmCoreModule,
        // AgmSnazzyInfoWindowModule,
        NgbModule,

        // Components
        TaAppTooltipV2Component,
        TaCopyComponent,
        TaCustomCardComponent,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        // TaMapsComponent,
        TaMapListComponent,
        TaMapListCardComponent,
        TaInputDropdownTableComponent,
        TaTableCardDropdownActionsComponent,
        TaNoteComponent,
        TaContactsCardComponent,
        TaInputDropdownContactsComponent,

        // Pipes
        FormatDatePipe,
        FormatEinPipe,
        FlipCardsPipe,
        CardValuePipe,

        //Store
        StoreModule.forFeature('customerCardData', customerCardModalReducer),
    ],
})
export class CustomerModule {}
