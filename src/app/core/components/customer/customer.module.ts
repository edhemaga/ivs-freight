//modules
import { ShipperDetailsModule } from './shipper-details/shipper-details.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerRoutingModule } from './customer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { BrokerDetailsModule } from './broker-details/broker-details.module';

//components
import { BrokerCardComponent } from './broker-card/broker-card.component';

import { CustomerTableComponent } from './customer-table/customer-table.component';

import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TaCopyComponent } from '../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../shared/ta-custom-card/ta-custom-card.component';

import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

import { MapsComponent } from '../shared/maps/maps.component';
import { MapListComponent } from '../shared/map-list/map-list.component';
import { MapListCardComponent } from '../shared/map-list-card/map-list-card.component';

import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

//pipes
import { formatEinPipe } from '../../pipes/formatEin.pipe';

import { formatDatePipe } from '../../pipes/formatDate.pipe';
@NgModule({
    declarations: [CustomerTableComponent, BrokerCardComponent],
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
        TruckassistCardsComponent,

        //pipes
        formatDatePipe,
        formatEinPipe,
    ],
})
export class CustomerModule {}
