import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDocumentComponent } from './settings-document.component';
import { SettingsDocumentRoutes } from './settings-document.routing';

@NgModule({
   imports: [CommonModule, SettingsDocumentRoutes],
   declarations: [SettingsDocumentComponent],
})
export class SettingsDocumentModule {}
