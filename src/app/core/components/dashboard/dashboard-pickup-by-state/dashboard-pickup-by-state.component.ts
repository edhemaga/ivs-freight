import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard-pickup-by-state',
  templateUrl: './dashboard-pickup-by-state.component.html',
  styleUrls: ['./dashboard-pickup-by-state.component.scss']
})
export class DashboardPickupByStateComponent implements OnInit {
  @ViewChild('t2') t2: any;
  @ViewChild('t3') t3: any;


  periodTitle: string = "Daily";

  pickupTitle: string = "Pickup";

  stateSwitchTabsType1: any[] = [];

  stateSwitchTabsType2: any[] = [];

  stateSwitchTabsType3: any[] = [];

  stateSwitchTabsType4: any[] = [];

  pickupSwitch: any[] = [];

  periodSwitchItems: any[] = [];

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

  pickupCircleColor: any[] = ['6278C7', '7A8DCB', '7A8DCB', 'A0AFDE', 'A0AFDE', 'C2CEEC', 'C2CEEC', 'C2CEEC', 'D7E1F4', 'D7E1F4'];

  compareColor: any = {};
  savedColors: any[] = [];

  popoverState: any[] = [
    {
      name: 'Pickup',
      active: true,
      tabSwitch1: 'Count',
      tabSwitch2: 'Revenue'
    },
    {
      name: 'Delivery',
      tabSwitch1: 'Count',
      tabSwitch2: 'Revenue'
    },
    {
      name: 'Load',
      tabSwitch1: 'Count',
      tabSwitch2: 'Revenue'
    },
    {
      name: 'Violation',
      tabSwitch1: 'Count',
      tabSwitch2: 'SW'
    },
    {
      name: 'Accident',
      tabSwitch1: 'Count',
      tabSwitch2: 'SW'
    },
    {
      name: 'Repair',
      tabSwitch1: 'Count',
      tabSwitch2: 'Cost'
    },
    {
      name: 'Fuel',
      tabSwitch1: 'Price',
      tabSwitch2: 'Cost'
    }
  ];


  constructor() { }

  ngOnInit(): void {
    this.stateSwitchTabsType1 = [
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
        name: 'Custom',
        custom: true
      }
    ];

    this.periodSwitchItems = [
      {
        name: 'Hourly'
      },
      {
        name: 'Daily',
        active: true
      },
      {
        name: 'Weekly'
      },
      {
        name: 'Monthly'
      }
    ];
  }

  changeStateSwitchTabs(ev){

  }

  selectStateCompare(item, indx){
    const itemId: any = item.id;
    if(!(itemId in this.compareColor)){

      const firstInArray = this.pickupCircleColor[indx];
      const objectSize = Object.keys(this.compareColor).length;
      this.compareColor[item.id] = firstInArray;
      this.pickupStateList.splice(indx, 1);
      this.pickupStateList.splice(objectSize, 0, item);
    }
  }

  removeFromStateList(e: Event,indx, item){
    e.stopPropagation()
    this.pickupStateList.splice(indx, 1);
    this.pickupStateList.push(item);
    this.savedColors.unshift(this.compareColor[item.id]);
    delete this.compareColor[item.id];
  }

  changeState(item){
    const newSwitchValue = [
      {
        name: item.tabSwitch1,
        checked: true
      },
      {
        name: item.tabSwitch2
      }
    ];
    this.stateSwitchTabsType1 = newSwitchValue;
    this.pickupTitle = item.name;
    this.popoverState.map((item) => {
      item.active = false;
      return item;
    })
    item.active = true;
    this.t3.close();
  }

  changePeriod(item){
    this.periodTitle = item.name;
    this.periodSwitchItems.map((item) => {
      item.active = false;
      return item;
    })
    item.active = true;
    this.t2.close();
  }

}
