import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-office',
  templateUrl: './settings-office.component.html',
  styleUrls: ['./settings-office.component.scss']
})
export class SettingsOfficeComponent implements OnInit {

  public officeData = [
    {
      id: 1,
      name: 'CMA ALTARE GROUP',
      phone: '(123) 456-7890',
      email: 'contact@windsor-brokers.com',
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      companyOwned: 'assets/img/svgs/settings-company/settings-company-owned.svg',
      departments: [
        {
          name: 'Accounting Department',
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com'
        },
        {
          name: 'Dispatch Department',
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com'
        },
        {
          name: 'Safety Department',
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com'
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
          name: 'Accounting Department',
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com'
        },
        {
          name: 'Dispatch Department',
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com'
        },
        {
          name: 'Safety Department',
          phone: '(987) 654-3210',
          phone_ext: '530',
          email: 'contact@windsor-brokers.com'
        },
      ],
      rent: '$350',
      pay_period: 'Monthly',
      day: '5th',
    }
  ]

  constructor() { }

  ngOnInit() {
  }
  public onAction(data: { modalName: string, type: boolean, action: string }) {}

  public identity(index: number, item: any): number {
    return item.id;
  }

  public generateTextForProgressBar(data: any): string {
    return data.pay_period + ' Rent ' + `- ${data.rent}`
  }
}
