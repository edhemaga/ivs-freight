import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss']
})
export class DashboardMapComponent implements OnInit {

  dashboardMapSwitchTabs: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.dashboardMapSwitchTabs = [
      {
        name: 'GPS Device'
      },
      {
        name: 'Mobile App'
      }
    ];
  }

  changeMapSwitchTabs(ev){

  }

}
