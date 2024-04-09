import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SettingsDocumentRoutes } from './settings-document.routing';
import { SharedModule } from 'src/app/shared/shared.module';

// components
import { SettingsDocumentComponent } from './settings-document.component';
import { TaSearchComponent } from 'src/app/shared/components/ta-search/ta-search.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaUploadFilesNoSliderComponent } from 'src/app/shared/components/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsDocumentRoutes,
        SharedModule,
        TaSearchComponent,
        TaUploadFilesComponent,
        TaUploadFilesNoSliderComponent,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
    ],
    declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
