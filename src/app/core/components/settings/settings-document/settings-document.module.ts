import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDocumentComponent } from './settings-document.component';
import { SettingsDocumentRoutes } from './settings-document.routing';
import { SharedModule } from '../../shared/shared.module';
import { TruckassistSearchModule } from '../../shared/truckassist-search/truckassist-search.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';

@NgModule({
    imports: [CommonModule, SettingsDocumentRoutes, SharedModule, TruckassistSearchModule, TruckassistTableModule],
    declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
