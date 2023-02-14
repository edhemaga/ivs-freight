import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentRoutingModule } from './accident-routing.module';
import { AccidentTableComponent } from './accident-table/accident-table.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../../shared/shared.module';
import { TruckassistTableToolbarComponent } from '../../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

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
        TruckassistTableHeadComponent
    ],
})
export class AccidentModule {}
