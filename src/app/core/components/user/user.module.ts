import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// routing
import { UserRoutes } from './user.routing';

// components
import { UserTableComponent } from './user-table/user-table.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

@NgModule({
    imports: [
        CommonModule,

        UserRoutes,

        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TruckassistCardsComponent,
    ],
    declarations: [UserTableComponent],
})
export class UserModule {}
