import { Component, OnInit } from '@angular/core';
import { SettingsLocationService } from '../../state/location-state/settings-location.service';
@Component({
  selector: 'app-settings-repair-shop',
  templateUrl: './settings-repair-shop.component.html',
  styleUrls: ['./settings-repair-shop.component.scss'],
})
export class SettingsRepairShopComponent implements OnInit {
  public repairShopData = [
    {
      id: 1,
      name: 'IVS REPAIR SHOP',
      phone: '(123) 456-7890',
      email: 'contact@windsor-brokers.com',
      address: '5462 N East River Rd apt 611 Chicago, IL 60656',
      companyOwned: 'ic_company.svg',
      services: [
        {
          id: 1,
          name: 'Truck',
          svg: 'assets/svg/common/repair-services/ic_truck.svg',
          isUsefulService: true,
        },
        {
          id: 2,
          name: 'Trailer',
          svg: 'assets/svg/common/repair-services/ic_trailer.svg',
          isUsefulService: true,
        },
        {
          id: 3,
          name: 'Mobile',
          svg: 'assets/svg/common/repair-services/ic_mobile.svg',
          isUsefulService: false,
        },
        {
          id: 4,
          name: 'Shop',
          svg: 'assets/svg/common/repair-services/ic_shop.svg',
          isUsefulService: true,
        },
        {
          id: 5,
          name: 'Towing',
          svg: 'assets/svg/common/repair-services/ic_towing.svg',
          isUsefulService: true,
        },
        {
          id: 6,
          name: 'Parts',
          svg: 'assets/svg/common/repair-services/ic_parts.svg',
          isUsefulService: true,
        },
        {
          id: 7,
          name: 'Tire',
          svg: 'assets/svg/common/repair-services/ic_tire.svg',
          isUsefulService: true,
        },
        {
          id: 9,
          name: 'Dealer',
          svg: 'assets/svg/common/repair-services/ic_dealer.svg',
          isUsefulService: false,
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
      companyOwned: 'ic_company.svg',
      services: [
        {
          id: 1,
          name: 'Truck',
          svg: 'assets/svg/common/repair-services/ic_truck.svg',
          isUsefulService: true,
        },
        {
          id: 2,
          name: 'Trailer',
          svg: 'assets/svg/common/repair-services/ic_trailer.svg',
          isUsefulService: true,
        },
        {
          id: 3,
          name: 'Mobile',
          svg: 'assets/svg/common/repair-services/ic_mobile.svg',
          isUsefulService: false,
        },
        {
          id: 4,
          name: 'Shop',
          svg: 'assets/svg/common/repair-services/ic_shop.svg',
          isUsefulService: true,
        },
        {
          id: 5,
          name: 'Towing',
          svg: 'assets/svg/common/repair-services/ic_towing.svg',
          isUsefulService: true,
        },
        {
          id: 6,
          name: 'Parts',
          svg: 'assets/svg/common/repair-services/ic_parts.svg',
          isUsefulService: true,
        },
        {
          id: 7,
          name: 'Tire',
          svg: 'assets/svg/common/repair-services/ic_tire.svg',
          isUsefulService: true,
        },
        {
          id: 9,
          name: 'Dealer',
          svg: 'assets/svg/common/repair-services/ic_dealer.svg',
          isUsefulService: false,
        },
      ],
      rent: '$350.000',
      pay_period: 'Weekly',
      day: '25th',
    },
  ];

  constructor(private settingsLocationService: SettingsLocationService) {}

  ngOnInit() {}

  public onAction(modal: { modalName: string; type: string; company?: any }) {
    this.settingsLocationService.onModalAction(modal);
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
