import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { MilesRoutingModule } from './miles-routing.module';

//Components
import { MilesComponent } from './pages/miles/miles.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';

@NgModule({
    declarations: [MilesComponent],
    imports: [
        CommonModule,
        MilesRoutingModule,
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
    ],
})
export class MilesModule {}
