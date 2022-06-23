import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-performance',
  templateUrl: './dashboard-performance.component.html',
  styleUrls: ['./dashboard-performance.component.scss']
})
export class DashboardPerformanceComponent implements OnInit {

  dashboardSwitchTabs: any[] = [];

  backgroundCards: any[] = ['#8A9AEF', '#FDB46B', '#F27B8E', '#6DC089', '#A574C3', '#73D0F1', '#FFD54F', '#BDE08E', '#F69FF3', '#A1887F'];

  constructor() { }

  ngOnInit(): void {
    
    this.dashboardSwitchTabs = [
      {
        id: 1,
        name: 'Today'
      },
      {
        id: 2,
        name: 'WTD'
      },
      {
        id: 1,
        name: 'MTD'
      },
      {
        id: 1,
        name: 'YTD'
      },
      {
        id: 1,
        name: 'All Time'
      },
      {
        id: 1,
        name: 'Custom'
      }
    ]
  }

  changeDashboardTabs(ev){

  }

}
