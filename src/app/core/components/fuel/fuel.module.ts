// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelTableComponent } from './fuel-table/fuel-table.component';
import { FuelRoutingModule } from './fuel-routing.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../shared/shared.module';

// Components
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { MapsComponent } from '../shared/maps/maps.component';
import { MapListComponent } from '../shared/map-list/map-list.component';
import { MapListCardComponent } from '../shared/map-list-card/map-list-card.component';
import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

@NgModule({
    declarations: [FuelTableComponent],
    exports: [],
    imports: [
        // Modules
        CommonModule,
        FuelRoutingModule,
        AgmSnazzyInfoWindowModule,
        AgmCoreModule,
        SharedModule,

        // Components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        MapsComponent,
        MapListComponent,
        MapListCardComponent,
        TruckassistCardsComponent,
    ],
})
export class FuelModule {}
