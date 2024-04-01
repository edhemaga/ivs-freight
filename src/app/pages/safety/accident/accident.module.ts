import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentRoutingModule } from './accident-routing.module';
import { AccidentTableComponent } from './pages/accident-table/accident-table.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { MapListCardComponent } from 'src/app/core/components/shared/map-list-card/map-list-card.component';
import { MapListComponent } from 'src/app/core/components/shared/map-list/map-list.component';
import { MapsComponent } from 'src/app/core/components/shared/maps/maps.component';

@NgModule({
    declarations: [AccidentTableComponent],
    imports: [
        CommonModule,
        AccidentRoutingModule,
        AgmSnazzyInfoWindowModule,
        AgmCoreModule,
        SharedModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        MapListComponent,
        MapListCardComponent,
        MapsComponent,
    ],
})
export class AccidentModule {}
