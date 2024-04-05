import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SettingsIntegrationRoutes } from './settings-integration.routing';

// components
import { SettingsIntegrationComponent } from './settings-integration.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsIntegrationRoutes,
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableHeadComponent,
        TaTruckassistTableBodyComponent,
    ],
    declarations: [SettingsIntegrationComponent],
})
export class SettingsIntegrationModule {}
