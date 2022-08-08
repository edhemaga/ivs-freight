import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ta-time-period',
  templateUrl: './ta-time-period.component.html',
  styleUrls: ['./ta-time-period.component.scss']
})
export class TaTimePeriodComponent implements OnInit {
  @ViewChild('t2') t2: any;
  periodTitle: string = "Monthly";
  periodSwitchItems: any[] = [];
  todayPeriodSwitchItems: any = [
    {
      name: 'Hourly',
      active: true
    },
    {
      name: '3 Hours',
    },
    {
      name: '6 Hours'
    }
  ];

  weekPeriodSwitchItems: any = [
    {
      name: '6 Hours'
    },
    {
      name: 'Semi-Daily',
    },
    {
      name: 'Daily',
      active: true
    }
  ];

  monthPeriodSwitchItems: any = [
    {
      name: 'Daily',
      active: true
    },
    {
      name: 'Weekly',
    },
    {
      name: 'Semi-Weekly'
    }
  ];

  yearPeriodSwitchItems: any = [
    {
      name: 'Weekly',
      active: true
    },
    {
      name: 'Semi-Monthly',
    },
    {
      name: 'Monthly'
    }
  ];

  allTimePeriodSwitchItems: any = [
    {
      name: 'Weekly'
    },
    {
      name: 'Semi-Monthly',
    },
    {
      name: 'Monthly',
      active: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.periodSwitchItems = this.todayPeriodSwitchItems;
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

  changeTimePeriod(period){
    console.log(period);
    switch (period){
      case 'All Time':
        this.periodSwitchItems = this.allTimePeriodSwitchItems;
        break;
      case 'WTD':
        this.periodSwitchItems = this.weekPeriodSwitchItems;
        break;
      case 'MTD':
        this.periodSwitchItems = this.monthPeriodSwitchItems;
        break;
      case 'YTD':
        this.periodSwitchItems = this.yearPeriodSwitchItems;
        break;
      case 'Today':
        this.periodSwitchItems = this.todayPeriodSwitchItems;
        break;
    }

    this.periodSwitchItems.map((item) => {
      if( item.active ){
        this.periodTitle = item.name;
      }
    })
  }

}
