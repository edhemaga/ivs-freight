import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerTableComponent } from './owner-table/owner-table.component';
import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerCardComponent } from './owner-card/owner-card.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

@NgModule({
    declarations: [OwnerTableComponent, OwnerCardComponent],
    imports: [
        CommonModule,
        OwnerRoutingModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent
    ],
})
export class OwnerModule {}
