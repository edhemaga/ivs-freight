import { ShipperDetailsModule } from './shipper-details/shipper-details.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { BrokerDetailsModule } from './broker-details/broker-details.module';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TaCopyComponent } from '../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../shared/ta-custom-card/ta-custom-card.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { formatEinPipe } from '../../pipes/formatEin.pipe';
import { formatDatePipe } from '../../pipes/formatDate.pipe';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { MapsComponent } from '../shared/maps/maps.component';
import { MapListComponent } from '../shared/map-list/map-list.component';
import { MapListCardComponent } from '../shared/map-list-card/map-list-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [CustomerTableComponent, BrokerCardComponent],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        ShipperDetailsModule,
        BrokerDetailsModule,
        AngularSvgIconModule,
        SharedModule,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
        NgbModule,
        AppTooltipComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TruckassistTableToolbarComponent,
        formatEinPipe,
        formatDatePipe,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent,
        MapsComponent,
        MapListComponent,
        MapListCardComponent
    ],
})
export class CustomerModule {}
