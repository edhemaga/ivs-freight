import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-office',
  templateUrl: './settings-office.component.html',
  styleUrls: ['./settings-office.component.scss'],
})
export class SettingsOfficeComponent implements OnInit {
  public officeData = [
    {
      id: 1,
      name: 'CMA ALTARE GROUP',
      phone: '(123) 456-7890',
      email: 'contact@windsor-brokers.com',
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      companyOwned: 'assets/svg/common/ic_company.svg',
      departments: [
        {
          name: 'Accounting Department',
          check: true,
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com',
        },
        {
          name: 'Dispatch Department',
          check: true,
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com',
        },
        {
          name: 'Safety Department',
          check: true,
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com',
        },
      ],
      rent: '',
      pay_period: '',
      day: '',
    },
    {
      id: 2,
      name: 'ALEXANDRO CASTOR OFFICE',
      phone: '(123) 456-7890',
      email: '',
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      companyOwned: '',
      departments: [
        {
          id: 26,
          name: 'Accounting Department',
          check: true,
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 18,
          name: 'Dispatch Department',
          check: false,
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com',
        },
        {
          id: 4,
          name: 'Safety Department',
          check: true,
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com',
        },
      ],
      rent: '$350',
      pay_period: 'Monthly',
      day: '5th',
    },
  ];

  constructor(private settingsStoreService: SettingsStoreService) {}

  ngOnInit() {}

  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsStoreService.onModalAction(modal);
  }

  public identityOfficeData(index: number, item: any): number {
    return item.id;
  }

  public identityCardData(index: number, item: any): number {
    return item.id;
  }

  public generateTextForProgressBar(data: any): string {
    return data.pay_period + ' Rent ' + `- ${data.rent}`;
  }
}
