import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-top-driver',
  templateUrl: './dashboard-top-driver.component.html',
  styleUrls: ['./dashboard-top-driver.component.scss']
})
export class DashboardTopDriverComponent implements OnInit {

  driverTopSwitchTabs: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.driverTopSwitchTabs = [
      {
        name: 'Mileage',
      },
      {
        name: 'Revenue'
      }
    ]
  }

  changeDriverSwitchTabs(ev){

  }

}
