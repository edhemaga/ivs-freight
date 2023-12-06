//modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRoutingModule } from './load-routing.module';

//components
import { LoadTableComponent } from './load-table/load-table.component';
import { LoadCardComponent } from './load-card/load-card.component';
import { LoadDetailsModule } from './load-details/load-details.module';

import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

//pipes
import { formatDatePipe } from '../../pipes/formatDate.pipe';

@NgModule({
    declarations: [LoadTableComponent, LoadCardComponent],
    imports: [
        //modules
        CommonModule,
        LoadRoutingModule,
        AngularSvgIconModule,
        LoadDetailsModule,

        //components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TruckassistCardsComponent,

        //pipes
        formatDatePipe,
    ],
})
export class LoadModule {}
