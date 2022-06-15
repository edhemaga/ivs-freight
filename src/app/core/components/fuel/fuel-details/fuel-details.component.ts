import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fuel-details',
  templateUrl: './fuel-details.component.html',
  styleUrls: ['./fuel-details.component.scss'],
})
export class FuelDetailsComponent implements OnInit {
  public fuelConfig: any[] = [];
  constructor() {}

  ngOnInit(): void {
    this.fuelConf();
  }

  /**Function return id */
  public identity(index: number, item: any): number {
    return item.id;
  }

  fuelConf() {
    this.fuelConfig = [
      {
        id: 0,
        name: 'Fuel Stop Details',
        template: 'general',
      },
      {
        id: 1,
        name: 'Transaction',
        template: 'transaction',
        icon: true,
        data: 25,
        customText: 'Date',
        icons: [
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_search.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_clock.svg',
          },

          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_funnel.svg',
          },
          {
            id: Math.random() * 1000,
            icon: 'assets/svg/common/ic_dollar.svg',
          },
        ],
      },
      {
        id: 2,
        name: 'Fuelled Vehicle',
        template: 'fuel-vehicle',
        data: 18,
        hide: true,
        customText: 'Cost',
      },
    ];
  }
}
