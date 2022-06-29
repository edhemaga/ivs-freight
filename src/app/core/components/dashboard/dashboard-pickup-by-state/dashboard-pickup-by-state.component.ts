import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-pickup-by-state',
  templateUrl: './dashboard-pickup-by-state.component.html',
  styleUrls: ['./dashboard-pickup-by-state.component.scss']
})
export class DashboardPickupByStateComponent implements OnInit {

  pickupTitle: string = "Pickup";

  pickupSwitchTabs: any[] = [];

  pickupSwitch: any[] = [];

  pickupStateList: any[] = [
    {
      id: 1,
      name: 'IL',
      price: '$123.45K',
      percent: '8.53%'
    },
    {
      id: 2,
      name: 'IN',
      price: '$102.34K',
      percent: '8.43%'
    },
    {
      id: 3,
      name: 'KY',
      price: '$95.15K',
      percent: '7.35%'
    },
    {
      id: 4,
      name: 'MO',
      price: '$93.52K',
      percent: '7.23%'
    },
    {
      id: 5,
      name: 'IA',
      price: '$89.35K',
      percent: '6.87%'
    },
    {
      id: 6,
      name: 'WI',
      price: '$75.23K',
      percent: '4.07%'
    },
    {
      id: 7,
      name: 'OH',
      price: '$67.52K',
      percent: '3.52%'
    },
    {
      id: 8,
      name: 'TN',
      price: '$65.25K',
      percent: '3.43%'
    },
    {
      id: 9,
      name: 'VA',
      price: '$35.04K',
      percent: '2.96%'
    },
    {
      id: 10,
      name: 'OK',
      price: '$26.23K',
      percent: '2.12%'
    }
  ];

  pickupCircleColor: any[] = ['#6278C7', '#7A8DCB', '#7A8DCB', '#A0AFDE', '#A0AFDE', '#C2CEEC', '#C2CEEC', '#C2CEEC', '#D7E1F4', '#D7E1F4'];

  popoverState: any[] = [
    {
      name: 'Pickup',
      active: true
    },
    {
      name: 'Delivery'
    },
    {
      name: 'Load'
    },
    {
      name: 'Violation'
    },
    {
      name: 'Accident'
    },
    {
      name: 'Repair'
    },
    {
      name: 'Fuel'
    }
  ];


  constructor() { }

  ngOnInit(): void {
    this.pickupSwitchTabs = [
      {
        name: 'Count'
      },
      {
        name: 'Revenue'
      }  
    ];

    this.pickupSwitch = [
      {
        name: 'Today'
      },
      {
        name: 'WTD'
      },
      {
        name: 'MTD'
      },
      {
        name: 'YTD'
      },
      {
        name: 'All Time'
      },
      {
        name: 'Custom'
      }
    ];
  }

  changePickupSwitchTabs(ev){

  }

  changeState(item){
    this.pickupTitle = item.name;
    this.popoverState.map((item) => {
      item.active = false;
      return item;
    })
    item.active = true;
  }


}
