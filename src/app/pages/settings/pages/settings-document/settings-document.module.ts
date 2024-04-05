import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SettingsDocumentRoutes } from './settings-document.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// components
import { SettingsDocumentComponent } from './settings-document.component';
import { TaSearchComponent } from 'src/app/shared/components/ta-search/ta-search.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { TaUploadFilesNoSliderComponent } from 'src/app/shared/components/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsDocumentRoutes,
        SharedModule,
        TaSearchComponent,
        TaUploadFilesComponent,
        TaUploadFilesNoSliderComponent,
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
    ],
    declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
