import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';

// modules
import { AccidentRoutingModule } from './accident-routing.module';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// components
import { AccidentTableComponent } from './pages/accident-table/accident-table.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { TaMapListCardComponent } from 'src/app/shared/components/ta-map-list-card/ta-map-list-card.component';
import { TaMapListComponent } from 'src/app/shared/components/ta-map-list/ta-map-list.component';
import { TaMapsComponent } from 'src/app/shared/components/ta-maps/ta-maps.component';

@NgModule({
    declarations: [AccidentTableComponent],
    imports: [
        CommonModule,
        AccidentRoutingModule,
        AgmSnazzyInfoWindowModule,
        AgmCoreModule,
        SharedModule,
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaMapListComponent,
        TaMapListCardComponent,
        TaMapsComponent,
    ],
})
export class AccidentModule {}
