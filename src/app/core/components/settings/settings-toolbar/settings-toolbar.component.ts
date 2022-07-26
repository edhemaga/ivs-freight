import { Component, OnInit } from '@angular/core';
import { CompanyQuery } from '../state/company-state/company-settings.query';

@Component({
  selector: 'app-settings-toolbar',
  templateUrl: './settings-toolbar.component.html',
  styleUrls: ['./settings-toolbar.component.scss'],
})
export class SettingsToolbarComponent implements OnInit {
  public countCompany: number;
  public settingsToolbar: any;

  constructor(private copmanyQuery: CompanyQuery) {}
  ngOnInit(): void {
    this.settingsToolbar = [
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
        count: 3,
        svg: 'assets/svg/common/ic_company.svg',
        background: '#FFFFFF',
        route: '/settings/company',
      },
      {
        id: 3,
        name: 'Location',
        count: 7,
        svg: 'assets/svg/common/ic_location.svg',
        background: '#FFFFFF',
        route: '/settings/location',
      },
      {
        id: 4,
        name: 'Document',
        count: 9,
        svg: 'assets/svg/common/ic_document.svg',
        background: '#FFFFFF',
        route: '/settings/document',
      },
      {
        id: 5,
        name: 'Billing',
        count: 10,
        svg: 'assets/svg/common/ic_billing.svg',
        background: '#FFFFFF',
        route: '/settings/billing',
      },
      {
        id: 6,
        name: 'User',
        count: 15,
        svg: 'assets/svg/common/ic_user.svg',
        background: '#FFFFFF',
        route: '/settings/user',
      },
      {
        id: 7,
        name: 'Integration',
        count: 4,
        svg: 'assets/svg/common/ic_integration.svg',
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
  }
  public identity(index: number, item: any): number {
    return item.id;
  }
}
