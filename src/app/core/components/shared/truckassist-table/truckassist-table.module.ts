import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistTableBodyComponent } from './truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from './truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableToolbarComponent } from './truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistSearchModule } from '../truckassist-search/truckassist-search.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TruckassistProgressExpirationModule } from '../truckassist-progress-expiration/truckassist-progress-expiration.module';
import { GetExpireDataPipe } from 'src/app/core/pipes/get-expire-data.pipe';
import { TableDropdownComponent } from '../table-dropdown/table-dropdown.component';
import { TruckassistReveiwModule } from '../truckassist-reveiw/truckassist-reveiw.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaNoteModule } from '../ta-note/ta-note.module';

@NgModule({
  declarations: [
    TruckassistTableBodyComponent,
    TruckassistTableHeadComponent,
    TruckassistTableToolbarComponent,
    GetExpireDataPipe,
    TableDropdownComponent
  ],
  imports: [
    CommonModule,
    TruckassistSearchModule,
    AngularSvgIconModule,
    TruckassistProgressExpirationModule,
    TruckassistReveiwModule,
    NgbModule,
    TaNoteModule
  ],
  exports: [
    TruckassistTableBodyComponent,
    TruckassistTableHeadComponent,
    TruckassistTableToolbarComponent,
    GetExpireDataPipe,
    TableDropdownComponent
  ],
})
export class TruckassistTableModule {}
