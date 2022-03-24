import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsStoreService } from '../../state/settings.service';

@Component({
  selector: 'app-settings-repair-shop',
  templateUrl: './settings-repair-shop.component.html',
  styleUrls: ['./settings-repair-shop.component.scss']
})
export class SettingsRepairShopComponent implements OnInit {
  public repairShopData = [
    {
      id: 1,
      name: 'IVS REPAIR SHOP',
      phone: '(123) 456-7890',
      email: '',
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      companyOwned:
        'assets/img/svgs/settings-company/settings-company-owned.svg',
      services: [
        {
          id: 1,
          name: 'Truck',
          svg: 'assets/img/svgs/settings-company/settings-truck.svg',
          isUsefulService: true,
        },
        {
          id: 2,
          name: 'Trailer',
          svg: 'assets/img/svgs/settings-company/settings-trailer.svg',
          isUsefulService: false,
        },
        {
          id: 3,
          name: 'Mobile',
          svg: 'assets/img/svgs/settings-company/settings-mobile.svg',
          isUsefulService: false,
        },
        {
          id: 4,
          name: 'Shop',
          svg: 'assets/img/svgs/settings-company/settings-shop.svg',
          isUsefulService: false,
        },
        {
          id: 5,
          name: 'Towing',
          svg: 'assets/img/svgs/settings-company/settings-towing.svg',
          isUsefulService: true,
        },
        {
          id: 6,
          name: 'Parts',
          svg: 'assets/img/svgs/settings-company/settings-parts.svg',
          isUsefulService: false,
        },
        {
          id: 7,
          name: 'Tire',
          svg: 'assets/img/svgs/settings-company/settings-tire.svg',
          isUsefulService: true,
        },
        {
          id: 9,
          name: 'Dealer',
          svg: 'assets/img/svgs/settings-company/settings-dealer.svg',
          isUsefulService: true,
        },
      ],
      rent: '',
      pay_period: '',
      day: '',
    },
    {
      id: 2,
      name: 'KSKA TRUCK REPAIRS',
      phone: '(123) 456-7890',
      email: 'contact@windsor-brokers.com',
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      companyOwned:
        'assets/img/svgs/settings-company/settings-company-owned.svg',
      services: [
        {
          id: 1,
          name: 'Truck',
          svg: 'assets/img/svgs/settings-company/settings-truck.svg',
          isUsefulService: true,
        },
        {
          id: 2,
          name: 'Trailer',
          svg: 'assets/img/svgs/settings-company/settings-trailer.svg',
          isUsefulService: true,
        },
        {
          id: 3,
          name: 'Mobile',
          svg: 'assets/img/svgs/settings-company/settings-mobile.svg',
          isUsefulService: false,
        },
        {
          id: 4,
          name: 'Shop',
          svg: 'assets/img/svgs/settings-company/settings-shop.svg',
          isUsefulService: true,
        },
        {
          id: 5,
          name: 'Towing',
          svg: 'assets/img/svgs/settings-company/settings-towing.svg',
          isUsefulService: true,
        },
        {
          id: 6,
          name: 'Parts',
          svg: 'assets/img/svgs/settings-company/settings-parts.svg',
          isUsefulService: true,
        },
        {
          id: 7,
          name: 'Tire',
          svg: 'assets/img/svgs/settings-company/settings-tire.svg',
          isUsefulService: true,
        },
        {
          id: 9,
          name: 'Dealer',
          svg: 'assets/img/svgs/settings-company/settings-dealer.svg',
          isUsefulService: false,
        },
      ],
      rent: '$350.000',
      pay_period: 'Weekly',
      day: '25th',
    },
  ];
  constructor(private settingsStoreService: SettingsStoreService) {}

  ngOnInit() {}
  
  public onAction(data: { type: boolean; modalName: string; action: string }) {
    this.settingsStoreService.onModalAction(data);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  public generateTextForProgressBar(data: any): string {
    return data.pay_period + ' Rent ' + `- ${data.rent}`;
  }

  public getActiveServices(services: any[]): any[] {
    return services.filter((item) => item.isUsefulService);
  }
}
