import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDocumentComponent } from './settings-document.component';
import { SettingsDocumentRoutes } from './settings-document.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [CommonModule, SettingsDocumentRoutes, SharedModule],
    declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
