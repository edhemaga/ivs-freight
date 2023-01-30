import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDocumentComponent } from './settings-document.component';
import { SettingsDocumentRoutes } from './settings-document.routing';
import { SharedModule } from '../../shared/shared.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';
import { CarrierSearchComponent } from '../../standalone-components/carrier-search/carrier-search.component';

@NgModule({
    imports: [CommonModule, SettingsDocumentRoutes, SharedModule, CarrierSearchComponent, TruckassistTableModule],
    declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
