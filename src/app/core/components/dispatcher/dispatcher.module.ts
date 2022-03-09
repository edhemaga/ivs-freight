import { SharedModule } from './../../shared/shared/shared.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppAddLoadTableComponent} from './app-add-load-table/app-add-load-table.component';
import {DispatchRoutingModule} from './dispatcher-routing.module';
import {AppDispatcherTableNewComponent} from './app-dispatcher-table-new/app-dispatcher-table-new.component';
import {DispatcherTableComponent} from './dispatcher-table/dispatcher-table/dispatcher-table.component';
import {AgmSnazzyInfoWindowModule} from '@agm/snazzy-info-window';
import {LottieModule} from 'ngx-lottie';
import player from 'lottie-web';
import {DispatcherGpsTableComponent} from './dispatcher-gps-table/dispatcher-gps-table.component';
import {DispatcherNoteComponent} from './dispatcher-note/dispatcher-note.component';
import {DispatcherHistoryComponent} from './dispatcher-history/dispatcher-history.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [DispatcherTableComponent, AppAddLoadTableComponent, AppDispatcherTableNewComponent, DispatcherGpsTableComponent, DispatcherNoteComponent, DispatcherHistoryComponent],
  imports: [CommonModule, DispatchRoutingModule, SharedModule, AgmSnazzyInfoWindowModule, LottieModule.forRoot({player: playerFactory})],
  entryComponents: [],
  exports: [],
})
export class DispatcherModule {
}