import { ProfileImagesModule } from './../profile-images/profile-images.module';
import { AppNoteModule } from './../app-note/app-note.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistTableBodyComponent } from './truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from './truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableToolbarComponent } from './truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistSearchModule } from '../truckassist-search/truckassist-search.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TruckassistProgressExpirationModule } from '../truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TruckassistReveiwModule } from '../truckassist-reveiw/truckassist-reveiw.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaNoteModule } from '../ta-note/ta-note.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GetExpireDataPipe } from '../../../pipes/get-expire-data.pipe';
import { ResizeColumnDirective } from '../../../directives/resize-column.directive';
import { DirectivesModule } from '../../../directives/directives.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    TruckassistTableBodyComponent,
    TruckassistTableHeadComponent,
    TruckassistTableToolbarComponent,
    GetExpireDataPipe,
    ResizeColumnDirective,
  ],
  imports: [
    CommonModule,
    TruckassistSearchModule,
    AngularSvgIconModule,
    TruckassistProgressExpirationModule,
    TruckassistReveiwModule,
    NgbModule,
    TaNoteModule,
    DragDropModule,
    DirectivesModule,
    AppNoteModule,
    ProfileImagesModule,
    PipesModule,
    VirtualScrollerModule,
    ScrollingModule,
  ],
  exports: [
    TruckassistTableBodyComponent,
    TruckassistTableHeadComponent,
    TruckassistTableToolbarComponent,
    GetExpireDataPipe,
  ],
})
export class TruckassistTableModule {}
