import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss', '../dashboard.global.scss']
})
export class DashboardStatisticsComponent implements OnInit {
  @Input() type: string;
  @Input() data: any = {};
  dataItems: any[] = [
    {
      name: "todayObject",
      sufix: "Today"
    },
    {
      name: "wtdObject",
      sufix: "WTD"
    },
    {
      name: "mtdObject",
      sufix: "MTD"
    },
    {
      name: "ytdObject",
      sufix: "YTD"
    },
    {
      name: "allTimeObject",
      sufix: "AllTime"
    }
  ];

  dayOfPercentage: any = {
    "wtdObject": 0,
    "mtdObject": 0,
    "ytdObject": 0
  }

  constructor() {
  }

  ngOnInit(): void {
    this.calculateDayPercentage();
  }

  calculateDayPercentage(): void {
    let d = new Date();
    const todayDay = d.getDay();
    const todayDate = d.getDate();
    const currentMonth = d.getMonth() + 1;
    const weekPercentage = todayDay == 0 ? 0 : todayDay / 7 * 100;
    this.dayOfPercentage.wtdObject = weekPercentage;

    const thisMonthDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    this.dayOfPercentage.mtdObject = todayDate / thisMonthDays * 100;

    this.dayOfPercentage.ytdObject = currentMonth / 12 * 100;
  }

}
