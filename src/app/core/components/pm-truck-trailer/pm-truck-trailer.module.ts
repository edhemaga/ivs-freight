import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmTruckTrailerComponent } from './pm-truck-trailer.component';
import { PMRoutingModule } from './repair-routing.module';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

@NgModule({
    declarations: [PmTruckTrailerComponent],
    imports: [
        CommonModule,
        PMRoutingModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent
    ],
})
export class PmTruckTrailerModule {}
