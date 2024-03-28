// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelTableComponent } from './fuel-table/fuel-table.component';
import { FuelRoutingModule } from './fuel-routing.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { MapsComponent } from 'src/app/core/components/shared/maps/maps.component';
import { MapListComponent } from 'src/app/core/components/shared/map-list/map-list.component';
import { MapListCardComponent } from 'src/app/core/components/shared/map-list-card/map-list-card.component';

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
    ],
})
export class FuelModule {}
