// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelTableComponent } from './pages/fuel-table/fuel-table.component';
import { FuelRoutingModule } from './fuel-routing.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { TaMapsComponent } from 'src/app/shared/components/ta-maps/ta-maps.component';
import { TaMapListComponent } from 'src/app/shared/components/ta-map-list/ta-map-list.component';
import { TaMapListCardComponent } from 'src/app/shared/components/ta-map-list-card/ta-map-list-card.component';

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
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaMapsComponent,
        TaMapListComponent,
        TaMapListCardComponent,
    ],
})
export class FuelModule {}
