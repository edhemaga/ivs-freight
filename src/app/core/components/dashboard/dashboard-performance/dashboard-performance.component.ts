import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard-performance',
  templateUrl: './dashboard-performance.component.html',
  styleUrls: ['./dashboard-performance.component.scss']
})
export class DashboardPerformanceComponent implements OnInit {
  @ViewChild('topChart', {static: false}) public topChart: any;

  periodTitle: string = "Daily";

  dashboardSwitchTabs: any[] = [];

  backgroundCards: any[] = ['73D0F1', 'FFD54F', 'BDE08E', 'F69FF3', 'A1887F'];
  selectedColors: any = {
    income: '8A9AEF',
    miles: 'FDB46B',
    roadside: 'F27B8E',
    driver: '6DC089',
    accident: 'A574C3'
  }

  public lineChartConfig: object = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'line',
          data: [12, 21, 27, 37, 28, 25, 21, 10, 15, 45, 27, 46, 41, 28, 24, 12, 21, 27, 37, 28, 25, 21, 10, 20],
          borderColor: '#8A9AEF',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#8A9AEF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          fill: false,
          hasGradiendBackground: true,
          colors: ['rgba(189, 202, 235, 0.4)', 'rgba(189, 202, 235, 0)'],
          id: 'income',
          hidden: false,
          label: 'Net Gross'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 46, 10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 10],
          borderColor: '#FDB46B',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#FDB46B',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          fill: false,
          hasGradiendBackground: true,
          colors: ['rgba(165, 116, 195, 0.4)', 'rgba(165, 116, 195, 0)'],
          id: 'miles',
          hidden: false,
          label: 'Miles'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [10, 12, 46, 10, 14, 30, 7, 28, 11, 20, 10, 12, 46, 10, 14, 30, 29, 11, 19, 20, 39, 46, 10, 15],
          borderColor: '#F27B8E',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#F27B8E',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          fill: false,
          hasGradiendBackground: true,
          colors: ['rgba(165, 116, 195, 0.4)', 'rgba(165, 116, 195, 0)'],
          id: 'roadside',
          hidden: false,
          label: 'Roadside Insp.'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#A574C3',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#A574C3',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          fill: false,
          hasGradiendBackground: true,
          colors: ['rgba(165, 116, 195, 0.4)', 'rgba(165, 116, 195, 0)'],
          id: 'accident',
          hidden: false,
          label: 'Accident'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0],
          borderColor: '#6DC089',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#6DC089',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          fill: false,
          hasGradiendBackground: true,
          colors: ['rgba(165, 116, 195, 0.4)', 'rgba(165, 116, 195, 0)'],
          id: 'driver',
          hidden: false,
          label: 'Driver'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [20, 50, 40, 10, 0, 20, 35, 40, 20, 50, 40, 10, 0, 20, 35, 40, 20, 50, 40, 10, 0, 20, 35, 40],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'revenue',
          hidden: true,
          label: 'Revenue'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [30, 20, 11, 15, 22, 0, 35, 50, 30, 20, 11, 15, 22, 0, 35, 50, 30, 20, 11, 15, 22, 0, 35, 50],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'load',
          hidden: true,
          label: 'Load'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [0, 11, 0, 30, 40, 50, 16, 30, 0, 11, 0, 30, 40, 50, 16, 30, 30, 11, 0, 30, 40, 50, 16, 30],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'fuel',
          hidden: true,
          label: 'Fuel Gallon'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [10, 32, 10, 0, 52, 11, 15, 30, 10, 32, 10, 0, 50, 11, 15, 30, 10, 32, 10, 0, 50, 11, 15, 30],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'fuel-cost',
          hidden: true,
          label: 'Fuel Cost'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [50, 30, 45, 20, 22, 25, 16, 40, 50, 30, 45, 20, 22, 25, 16, 40, 50, 30, 45, 20, 22, 25, 16, 40],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'repair',
          hidden: true,
          label: 'Repair'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [8, 15, 30, 12, 22, 16, 18, 50, 8, 15, 30, 12, 22, 16, 18, 50, 8, 15, 30, 12, 22, 16, 18, 50],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'violation',
          hidden: true,
          label: 'Violation'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [18, 22, 40, 45, 30, 12, 42, 12, 18, 22, 40, 45, 30, 12, 42, 12, 18, 22, 40, 45, 30, 12, 42, 12],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'expences',
          hidden: true,
          label: 'Expences'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [15, 20, 25, 30, 45, 40, 50, 12, 15, 20, 25, 30, 45, 40, 50, 12, 15, 20, 25, 30, 45, 40, 50, 12],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'truck',
          hidden: true,
          label: 'Truck'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [0, 5, 10, 15, 20, 25, 30, 35, 0, 5, 10, 15, 20, 25, 30, 35, 0, 5, 10, 15, 20, 25, 30, 35],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'trailer',
          hidden: true,
          label: 'Trailer'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [40, 35, 35, 35, 30, 21, 20, 35, 40, 35, 35, 35, 30, 21, 20, 35, 40, 35, 35, 35, 30, 21, 20, 35],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'owner',
          hidden: true,
          label: 'Owner'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [12, 50, 20, 5, 30, 18, 40, 50, 12, 50, 20, 5, 30, 18, 40, 50, 12, 50, 20, 5, 30, 18, 40, 50],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'user',
          hidden: true,
          label: 'User'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [10, 5, 10, 15, 20, 25, 30, 50, 0, 5, 10, 15, 20, 11, 30, 35, 0, 5, 10, 15, 20, 25, 30, 35],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'repair-shop',
          hidden: true,
          label: 'Repair Shop'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [18, 15, 10, 12, 22, 19, 18, 2, 8, 15, 30, 12, 22, 16, 18, 50, 40, 15, 30, 12, 22, 16, 18, 30],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'broker',
          hidden: true,
          label: 'Broker'
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [20, 30, 40, 10, 10, 20, 35, 40, 20, 50, 40, 10, 10, 20, 35, 40, 20, 50, 40, 10, 20, 20, 35, 40],
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          id: 'shipper',
          hidden: true,
          label: 'Shipper'
        }
      }
    ],
    showLegend: false,
    chartValues: [2, 2],
    defaultType: 'bar',
    chartWidth: '1800',
    chartHeight: '222',
    removeChartMargin: true,
    gridHoverBackground: true,
    allowAnimation: true,
    hasHoverData: true,
    multiHoverData: true,
    dataLabels: [['01', 'WED'], ['02', 'THU'], ['03', 'FRI'], ['04', 'SAT'], ['05', 'SUN'], ['06', 'MON'], ['07', 'TUE'], ['08', 'WED'], ['09', 'THU'],
      ['10', 'FRI'], ['11', 'SAT'], ['12', 'SUN'], ['13', 'MON'], ['14', 'TUE'], ['15', 'WED'], ['16', 'THU'], ['17', 'FRI'], ['18', 'SAT'],
      ['19', 'SUN'], ['20', 'MON'], ['21', 'TUE'], ['22', 'WED'], ['23', 'THU'], ['24', 'FRI']
    ],
    noChartImage: 'assets/svg/common/no_data_pay.svg'
  };

  public barChartConfig: object = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'bar',
          data: [12, 21, 27, 37, 28, 25, 21, 10, 15, 45, 27, 46, 41, 28, 24, 12, 21, 27, 37, 28, 25, 21, 10, 20],
          yAxisID: 'y-axis-0',
          backgroundColor: '#919191',
          borderColor: '#707070',
          hoverBackgroundColor: '#6C6C6C',
          hoverBorderColor: '#707070'
        }
      },
      {
        defaultConfig: {
          type: 'bar',
          data: [10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 46, 10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 10],
          yAxisID: 'y-axis-0',
          backgroundColor: '#CCCCCC',
          borderColor: '#707070',
          hoverBackgroundColor: '#AAAAAA',
          hoverBorderColor: '#707070'
        }
      }
    ],
    showLegend: false,
    chartValues: [2, 2],
    defaultType: 'bar',
    chartWidth: '1800',
    chartHeight: '40',
    removeChartMargin: true,
    dataLabels: [['01', 'WED'], ['02', 'THU'], ['03', 'FRI'], ['04', 'SAT'], ['05', 'SUN'], ['06', 'MON'], ['07', 'TUE'], ['08', 'WED'], ['09', 'THU'],
      ['10', 'FRI'], ['11', 'SAT'], ['12', 'SUN'], ['13', 'MON'], ['14', 'TUE'], ['15', 'WED'], ['16', 'THU'], ['17', 'FRI'], ['18', 'SAT'],
      ['19', 'SUN'], ['20', 'MON'], ['21', 'TUE'], ['22', 'WED'], ['23', 'THU'], ['24', 'FRI']
    ],
    noChartImage: 'assets/svg/common/no_data_pay.svg'
  };

  public lineAxes: object = {
    verticalLeftAxes: {
      visible: false,
      minValue: 0,
      maxValue: 52,
      stepSize: 13,
      showGridLines: true
    },
    horizontalAxes: {
      visible: true,
      position: 'bottom',
      showGridLines: true
    }
  };

  public barAxes: object = {
    verticalLeftAxes: {
      visible: false,
      minValue: 0,
      maxValue: 52,
      stepSize: 13,
      showGridLines: true
    },
    horizontalAxes: {
      visible: false,
      position: 'bottom',
      showGridLines: true
    }
  };

  periodSwitchItems: any[] = [];

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
    ]
  }

  changeDashboardTabs(ev){

  }

  setColor(type: string){
    // Provera da li se u objektu nalazi vec ovaj tip sa vrednoscu boje
    if( type in this.selectedColors ){
      // Iz glavnog niza boja vratiti zauzetu boju na pocetak niza
      this.backgroundCards.unshift(this.selectedColors[type]);
      // Obrisati iz objekta tu vrednost
      delete this.selectedColors[type];
      this.topChart.insertNewChartData('remove', type);
    }else{
      // Proveriti da li se u nizu nalazi bar jedna boja da bi mogli da dajemo novoj kocki sledecu boju
      if( this.backgroundCards.length > 0 ){
        // Uzeti prvu vrednost iz niza i ujedno iz glavnog niza boja sklonuti prvu boju
        const firstInArray = this.backgroundCards.shift();
        // Dodati novu vrednost u objekat sa bojom koju smo pokupili iz niza
        this.selectedColors[type] = firstInArray;
        this.topChart.insertNewChartData('add', type, firstInArray);
      }
    }
  }

  hoverFocusCard(type: string, color: any){
    this.topChart.changeChartFillProperty(type, color);
  }

  changePeriod(item){
    this.periodTitle = item.name;
    this.periodSwitchItems.map((item) => {
      item.active = false;
      return item;
    })
    item.active = true;
  }

}
