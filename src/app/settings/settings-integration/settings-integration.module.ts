import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIntegrationComponent } from './settings-integration.component';
import { SettingsIntegrationRoutes } from './settings-integration.routing';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsIntegrationRoutes,
        TruckassistTableToolbarComponent,
        TruckassistTableHeadComponent,
        TruckassistTableBodyComponent,
    ],
    declarations: [SettingsIntegrationComponent],
})
export class SettingsIntegrationModule {}
