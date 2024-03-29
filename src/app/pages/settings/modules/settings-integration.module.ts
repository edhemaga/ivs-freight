import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIntegrationComponent } from '../pages/settings-integration/settings-integration.component';
import { SettingsIntegrationRoutes } from '../routing/settings-integration.routing';
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
