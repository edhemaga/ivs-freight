// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PMRoutingModule } from './repair-routing.module';

// Compenents
import { PmTruckTrailerComponent } from './pm-truck-trailer.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

@NgModule({
    declarations: [PmTruckTrailerComponent],
    imports: [
        // Modules
        CommonModule,
        PMRoutingModule,

        // Compenents
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TruckassistCardsComponent,
    ],
})
export class PmTruckTrailerModule {}
