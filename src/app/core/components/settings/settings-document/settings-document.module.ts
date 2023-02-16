import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDocumentComponent } from './settings-document.component';
import { SettingsDocumentRoutes } from './settings-document.routing';
import { SharedModule } from '../../shared/shared.module';
import { CarrierSearchComponent } from '../../standalone-components/carrier-search/carrier-search.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TruckassistTableToolbarComponent } from '../../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsDocumentRoutes,
        SharedModule,
        CarrierSearchComponent,
        TaUploadFilesComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent
    ],
    declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
