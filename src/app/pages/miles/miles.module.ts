import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { MilesRoutingModule } from '@pages/miles/miles-routing.module';

//Components
import { MilesComponent } from '@pages/miles/pages/miles/miles.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';

@NgModule({
    declarations: [MilesComponent],
    imports: [
        CommonModule,
        MilesRoutingModule,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
    ],
})
export class MilesModule {}
