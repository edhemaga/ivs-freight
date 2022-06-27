import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-top-driver',
  templateUrl: './dashboard-top-driver.component.html',
  styleUrls: ['./dashboard-top-driver.component.scss']
})
export class DashboardTopDriverComponent implements OnInit {

  public chartConfig: object = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'doughnut',
          data: [10, 9, 8, 7, 6, 5, 4, 3, 3, 2, 45.49],
          backgroundColor: ['#8A9AEF', '#FDB46B', '#F27B8E', '#6DC089', '#A574C3', '#38BDEB', '#FFD54F', '#BDE08E', '#F69FF3', '#A1887F', '#CCCCCC'],
          borderColor: '#fff',
          hoverBackgroundColor: '#6C6C6C',
          hoverBorderColor: '#fff'
        }
      }
    ],
    chartInnitProperties: [
      {
        name: '54.51%',
        value: '$773.08K',
        percent: 'TOP 10'
      },
      {
        name: 45,
        value: 773.08
      }
    ],
    showLegend: true,
    chartValues: [2, 2],
    defaultType: 'doughnut',
    chartWidth: '322',
    chartHeight: '322',
    removeChartMargin: true,
    dataLabels: [],
    noChartImage: 'assets/svg/common/no_data_pay.svg'
  };

  public chartAxes: object = {};

  driverTopSwitchTabs: any[] = [];

  driverTopSwitch: any[] = [];

  driverList: any[] = [
    {
      id: 1,
      name: 'Denis Rodman',
      price: '$123.45K',
      percent: '8.53%'
    },
    {
      id: 2,
      name: 'Sasa Djordjevic',
      price: '$102.34K',
      percent: '8.43%'
    },
    {
      id: 3,
      name: 'Nicolas Drozlibrew',
      price: '$95.15K',
      percent: '7.35%'
    },
    {
      id: 4,
      name: 'Samuel Lioton',
      price: '$93.52K',
      percent: '7.23%'
    },
    {
      id: 5,
      name: 'Angelo Trotter',
      price: '$89.35K',
      percent: '6.87%'
    },
    {
      id: 6,
      name: 'Stan Tolbert',
      price: '$75.23K',
      percent: '4.07%'
    },
    {
      id: 7,
      name: 'Michael Scott',
      price: '$67.52K',
      percent: '3.52%'
    },
    {
      id: 8,
      name: 'Toby Flanders',
      price: '$65.25K',
      percent: '3.43%'
    },
    {
      id: 9,
      name: 'Sasuke Uchica',
      price: '$35.04K',
      percent: '2.96%'
    },
    {
      id: 10,
      name: 'Peter Simpson',
      price: '$26.23K',
      percent: '2.12%'
    }
  ];

  circleColor: any[] = ['8A9AEF', 'FDB46B', 'F27B8E', '6DC089', 'A574C3', '73D0F1', 'FFD54F', 'BDE08E', 'F69FF3', 'A1887F']

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
