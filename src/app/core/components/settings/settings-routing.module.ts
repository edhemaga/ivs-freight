import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'company', pathMatch: 'full' },
  {
    path: 'company',
    component: SettingsComponent,
    data: { title: 'Company' },
  },
  {
    path: 'location',
    component: SettingsComponent,
    data: { title: 'Location' },
  },
  {
    path: 'document',
    component: SettingsComponent,
    data: { title: 'Document' },
  },
  {
    path: 'billing',
    component: SettingsComponent,
    data: { title: 'Billing' },
  },
  {
    path: 'user',
    component: SettingsComponent,
    data: { title: 'User' },
  },
  {
    path: 'integration',
    component: SettingsComponent,
    data: { title: 'Integration' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
