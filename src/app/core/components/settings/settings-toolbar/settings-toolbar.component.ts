import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-toolbar',
  templateUrl: './settings-toolbar.component.html',
  styleUrls: ['./settings-toolbar.component.scss'],
})
export class SettingsToolbarComponent {
  public settingsToolbar = [
    {
      id: 1,
      name: 'Settings',
      count: null,
      svg: null,
      background: '#FFFFFF',
      route: null,
    },
    {
      id: 2,
      name: 'Company',
      count: null,
      svg: 'assets/img/svgs/settings-company/settings-company.svg',
      background: '#FFFFFF',
      route: '/settings/company',
    },
    {
      id: 3,
      name: 'Location',
      count: 7,
      svg: 'assets/img/svgs/settings-company/settings-location.svg',
      background: '#FFFFFF',
      route: '/settings/location',
    },
    {
      id: 4,
      name: 'Document',
      count: 9,
      svg: 'assets/img/svgs/settings-company/settings-document.svg',
      background: '#FFFFFF',
      route: '/settings/document',
    },
    {
      id: 5,
      name: 'Billing',
      count: 10,
      svg: 'assets/img/svgs/settings-company/settings-billing.svg',
      background: '#FFFFFF',
      route: '/settings/billing',
    },
    {
      id: 6,
      name: 'User',
      count: 15,
      svg: 'assets/img/svgs/settings-company/settings-user.svg',
      background: '#FFFFFF',
      route: '/settings/user',
    },
    {
      id: 7,
      name: 'Integration',
      count: null,
      svg: 'assets/img/svgs/settings-company/settings-integration.svg',
      background: '#FFFFFF',
      route: '/settings/integration',
    },
    {
      id: 8,
      name: null,
      count: null,
      svg: null,
      background: '#FFFFFF',
      route: null,
    },
  ];

  public identity(index: number, item: any): number {
    return item.id;
  }
}
