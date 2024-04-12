import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';

// modules
import { AccidentRoutingModule } from './accident-routing.module';
import { SharedModule } from '@shared/shared.module';

// components
import { AccidentTableComponent } from './pages/accident-table/accident-table.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaMapListCardComponent } from '@shared/components/ta-map-list-card/ta-map-list-card.component';
import { TaMapListComponent } from '@shared/components/ta-map-list/ta-map-list.component';
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';

@NgModule({
    declarations: [AccidentTableComponent],
    imports: [
        CommonModule,
        AccidentRoutingModule,
        AgmSnazzyInfoWindowModule,
        AgmCoreModule,
        SharedModule,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaMapListComponent,
        TaMapListCardComponent,
        TaMapsComponent,
    ],
})
export class AccidentModule {}
