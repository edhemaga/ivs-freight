import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SettingsDocumentRoutes } from './settings-document.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// components
import { SettingsDocumentComponent } from './settings-document.component';
import { TaCarrierSearchComponent } from 'src/app/shared/components/ta-carrier-search/ta-carrier-search.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TaUploadFilesNoSliderComponent } from 'src/app/shared/components/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsDocumentRoutes,
        SharedModule,
        TaCarrierSearchComponent,
        TaUploadFilesComponent,
        TaUploadFilesNoSliderComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
    ],
    declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
