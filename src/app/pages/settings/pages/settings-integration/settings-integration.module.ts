import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SettingsIntegrationRoutes } from './settings-integration.routing';

// components
import { SettingsIntegrationComponent } from './settings-integration.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsIntegrationRoutes,
        TaTableToolbarComponent,
        TaTableHeadComponent,
        TaTableBodyComponent,
    ],
    declarations: [SettingsIntegrationComponent],
})
export class SettingsIntegrationModule {}
