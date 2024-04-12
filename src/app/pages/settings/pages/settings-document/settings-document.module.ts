import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SettingsDocumentRoutingModule } from '@app/pages/settings/pages/settings-document/settings-document-routing.module';
import { SharedModule } from '@shared/shared.module';

// components
import { SettingsDocumentComponent } from '@pages/settings/pages/settings-document/settings-document.component';
import { TaSearchComponent } from '@shared/components/ta-search/ta-search.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaUploadFilesNoSliderComponent } from '@shared/components/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsDocumentRoutingModule,
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
