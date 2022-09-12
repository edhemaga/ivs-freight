import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppAddLoadTableComponent } from './app-add-load-table/app-add-load-table.component';
import { DispatchRoutingModule } from './dispatcher-routing.module';
import { AppDispatcherTableNewComponent } from './app-dispatcher-table-new/app-dispatcher-table-new.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { DispatcherGpsTableComponent } from './dispatcher-gps-table/dispatcher-gps-table.component';
import { DispatcherNoteComponent } from './dispatcher-note/dispatcher-note.component';
import { DispatcherHistoryComponent } from './dispatcher-history/dispatcher-history.component';
import { DispatcherTableComponent } from './dispatcher-table/dispatcher-table.component';
import { DispatcherDropdownComponent } from './dispatcher-dropdown/dispatcher-dropdown.component';
import { PipesModule } from '../../pipes/pipes.module';
import { DispatcherParkingComponent } from './dispatcher-parking/dispatcher-parking.component';
import { DispatchboardTablesComponent } from './dispatchboard-tables/dispatchboard-tables.component';
import { AppTooltipeModule } from '../shared/app-tooltip/app-tooltip.module';
import { TaNoteModule } from '../shared/ta-note/ta-note.module';
import { SharedModule } from '../shared/shared.module';

export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    DispatcherTableComponent,
    AppAddLoadTableComponent,
    AppDispatcherTableNewComponent,
    DispatcherGpsTableComponent,
    DispatcherNoteComponent,
    DispatcherHistoryComponent,
    DispatcherDropdownComponent,
    DispatcherParkingComponent,
    DispatchboardTablesComponent,
  ],
  imports: [
    CommonModule,
    DispatchRoutingModule,
    SharedModule,
    AgmSnazzyInfoWindowModule,
    LottieModule.forRoot({ player: playerFactory }),
    PipesModule,
    TaNoteModule,
  ],
  entryComponents: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DispatcherModule {}
