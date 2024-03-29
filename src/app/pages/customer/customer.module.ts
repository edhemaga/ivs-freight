//modules
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

//components
import { BrokerCardComponent } from './pages/broker-card/broker-card.component';

import { CustomerTableComponent } from './pages/customer-table/customer-table.component';

import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';

import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

import { MapsComponent } from 'src/app/core/components/shared/maps/maps.component';
import { MapListComponent } from 'src/app/core/components/shared/map-list/map-list.component';
import { MapListCardComponent } from 'src/app/core/components/shared/map-list-card/map-list-card.component';

import { CustomerCardComponent } from './components/customer-card/customer-card.component';

import { TaInputDropdownTableComponent } from 'src/app/core/components/standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TableCardDropdownActionsComponent } from 'src/app/core/components/standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';

//pipes
import { formatEinPipe } from 'src/app/core/pipes/formatEin.pipe';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

@NgModule({
    declarations: [
        CustomerTableComponent,
        BrokerCardComponent,
        CustomerCardComponent,
    ],
    imports: [
        //modules
        CommonModule,
        CustomerRoutingModule,
        ShipperDetailsModule,
        BrokerDetailsModule,
        AngularSvgIconModule,
        SharedModule,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
        NgbModule,

        //components
        AppTooltipComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        MapsComponent,
        MapListComponent,
        MapListCardComponent,
        TaInputDropdownTableComponent,
        TableCardDropdownActionsComponent,
        TaNoteComponent,

        //pipes
        formatDatePipe,
        formatEinPipe,
    ],
})
export class CustomerModule {}
