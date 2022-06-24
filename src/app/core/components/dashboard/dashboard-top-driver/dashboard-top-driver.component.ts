import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-top-driver',
  templateUrl: './dashboard-top-driver.component.html',
  styleUrls: ['./dashboard-top-driver.component.scss']
})
export class DashboardTopDriverComponent implements OnInit {

  driverTopSwitchTabs: any[] = [];
  driverTopSwitch: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.driverTopSwitchTabs = [
      {
        name: 'Mileage',
      },
      {
        name: 'Revenue'
      }
    ];

    this.driverTopSwitch = [
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
    ]
  }

  changeDriverSwitchTabs(ev){

  }

}
