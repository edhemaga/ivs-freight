import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-top-driver',
  templateUrl: './dashboard-top-driver.component.html',
  styleUrls: ['./dashboard-top-driver.component.scss'],
})
export class DashboardTopDriverComponent implements OnInit, OnDestroy {
  @ViewChild('doughnutChart', { static: false }) public doughnutChart: any;
  @ViewChild('topDriverBarChart', { static: false })
  public topDriverBarChart: any;
  @ViewChild('timePeriod', { static: false }) public timePeriod: any;
  @ViewChild('tabSwitch', { static: false }) public tabSwitch: any;
  @ViewChild('t2') t2: any;
  @ViewChild('t3') t3: any;

  private destroy$ = new Subject<void>();

  topTenTitle: string = 'Driver';
  currentSwitchTab: string = 'All Time';

  selectedDrivers: any[] = [];

  public chartConfig: object = {};

  public barChartConfig: object = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'bar',
          data: [
            90000, 70000, 25000, 13000, 28000, 80000, 120000, 70000, 40000,
            50000, 25000, 13000, 28000, 80000, 120000, 70000, 40000, 50000,
            25000, 13000, 28000, 80000, 120000, 70000, 50000, 28000, 80000,
            120000, 70000, 50000, 28000, 80000, 120000, 70000, 50000, 28000,
            80000, 120000, 70000, 50000, 28000, 80000, 120000, 70000, 50000,
            28000, 80000, 120000, 70000, 50000,
          ],
          yAxisID: 'y-axis-0',
          backgroundColor: '#919191',
          borderColor: '#919191',
          hoverBackgroundColor: '#6C6C6C',
          hoverBorderColor: '#707070',
          label: 'Top 10',
          id: 'top10',
        },
      },
      {
        defaultConfig: {
          type: 'bar',
          data: [
            60000, 100000, 95000, 47000, 80000, 120000, 90000, 60000, 100000,
            95000, 47000, 80000, 120000, 90000, 60000, 100000, 95000, 47000,
            80000, 120000, 90000, 60000, 50000, 100000, 120000, 90000, 60000,
            50000, 100000, 120000, 90000, 60000, 50000, 100000, 120000, 90000,
            60000, 50000, 100000, 120000, 90000, 60000, 50000, 100000, 120000,
            90000, 60000, 50000, 100000, 120000,
          ],
          yAxisID: 'y-axis-0',
          backgroundColor: '#CCCCCC',
          borderColor: '#CCCCCC',
          hoverBackgroundColor: '#AAAAAA',
          hoverBorderColor: '#707070',
          label: 'All Others',
          id: 'allOthers',
        },
      },
    ],
    showLegend: false,
    chartValues: [2, 2],
    defaultType: 'bar',
    chartWidth: '750',
    chartHeight: '290',
    removeChartMargin: true,
    gridHoverBackground: true,
    startGridBackgroundFromZero: true,
    dataMaxRows: 4,
    hasHoverData: true,
    hasPercentage: true,
    allowAnimation: true,
    offset: true,
    tooltipOffset: { min: 105, max: 279 },
    dataLabels: [
      'MAR',
      '',
      'MAY',
      '',
      'JUL',
      '',
      'SEP',
      '',
      'NOV',
      '',
      '2024',
      '',
      'MAR',
      '',
      'MAY',
      '',
      'JUL',
      '',
      'SEP',
      '',
      'NOV',
      '',
      '2025',
      '',
      'MAR',
    ],
    noChartImage: 'assets/svg/common/no_data_pay.svg',
  };

  public barAxes: object = {
    verticalLeftAxes: {
      visible: true,
      minValue: 0,
      maxValue: 120000,
      stepSize: 30000,
      showGridLines: true,
    },
    horizontalAxes: {
      visible: true,
      position: 'bottom',
      showGridLines: false,
    },
  };

  public chartAxes: object = {};

  topTenSwitchTabstype1: any[] = [];

  topTenSwitchTabstype2: any[] = [];

  topTenSwitchTabstype3: any[] = [];

  driverTopSwitch: any[] = [];

  driverList: any[] = [
    {
      id: 1,
      name: 'Denis Rodman',
      price: '$123.45K',
      percent: '8.53%',
    },
    {
      id: 2,
      name: 'Sasa Djordjevic',
      price: '$102.34K',
      percent: '8.43%',
    },
    {
      id: 3,
      name: 'Nicolas Drozlibrew',
      price: '$95.15K',
      percent: '7.35%',
    },
    {
      id: 4,
      name: 'Samuel Lioton',
      price: '$93.52K',
      percent: '7.23%',
    },
    {
      id: 5,
      name: 'Angelo Trotter',
      price: '$89.35K',
      percent: '6.87%',
    },
    {
      id: 6,
      name: 'Stan Tolbert',
      price: '$75.23K',
      percent: '4.07%',
    },
    {
      id: 7,
      name: 'Michael Scott',
      price: '$67.52K',
      percent: '3.52%',
    },
    {
      id: 8,
      name: 'Toby Flanders',
      price: '$65.25K',
      percent: '3.43%',
    },
    {
      id: 9,
      name: 'Sasuke Uchica',
      price: '$35.04K',
      percent: '2.96%',
    },
    {
      id: 10,
      name: 'Peter Simpson',
      price: '$26.23K',
      percent: '2.12%',
    },
  ];

  circleColor: any[] = [
    '8A9AEF',
    'FDB46B',
    'F27B8E',
    '6DC089',
    'A574C3',
    '73D0F1',
    'FFD54F',
    'BDE08E',
    'F69FF3',
    'A1887F',
    'CCCCCC',
  ];
  hoverCircleColor: any[] = [
    '596FE8',
    'FD952D',
    'ED445E',
    '2FA558',
    '7F39AA',
    '38BDEB',
    'FFCA28',
    'A2D35F',
    'F276EF',
    '8D6E63',
  ];
  chartColors: any[] = [];
  compareColor: any = {};
  compareHoverColor: any = {};
  savedColors: any[] = [];
  savedHoverColors: any[] = [];
  chartHoverColors: any[] = [];

  popoverTopTen: any[] = [
    {
      name: 'Dispatcher',
      tab1: 'Load',
      tab2: 'Revenue',
    },
    {
      name: 'Driver',
      active: true,
      tab1: 'Mileage',
      tab2: 'Revenue',
    },
    {
      name: 'Truck',
      tab1: 'Mileage',
      tab2: 'Revenue',
    },
    {
      name: 'Broker',
      tab1: 'Load',
      tab2: 'Revenue',
    },
    {
      name: 'Shipper',
      tab1: 'Load',
      tab2: 'Revenue',
    },
    {
      name: 'Owner',
      tab1: 'Load',
      tab2: 'Revenue',
    },
    {
      name: 'Repair Shop',
      tab1: 'Visit',
      tab2: 'Cost',
    },
    {
      name: 'Fuel Stop',
      tab1: 'Visit',
      tab2: 'Cost',
    },
  ];

  public searchDashboardOptions = {
    gridNameTitle: 'Driver',
  };

  constructor(private tableService: TruckassistTableService) {}

  setChartData(drivers, selectedDrivers?) {
    var dataValues = [];
    var dataColors = [];
    var topTenPercentage = 0;

    drivers.map((item, i) => {
      dataValues.push(parseFloat(item.percent));
      topTenPercentage = topTenPercentage + parseFloat(item.percent);
    });

    topTenPercentage = parseFloat(topTenPercentage.toFixed(2));
    var otherPercent = 100 - topTenPercentage;
    otherPercent = parseFloat(otherPercent.toFixed(2));

    if (!selectedDrivers) {
      dataValues.push(otherPercent);
    }

    this.circleColor.map((item, i) => {
      var color = '#' + item;
      dataColors.push(color);
    });

    if (this.circleColor?.length) {
      this.chartColors = this.circleColor;
      this.chartHoverColors = this.hoverCircleColor;
    }

    let chartProp = [];

    if (selectedDrivers) {
      chartProp = [
        {
          name: drivers.length + ' SELECTED',
          percent: '$773.08K',
        },
      ];
    } else {
      chartProp = [
        {
          name: 'TOP ' + drivers.length,
          value: '$773.08K',
          percent: topTenPercentage + '%',
        },
        {
          name: 'ALL OTHERS',
          value: '$623.56K',
          percent: otherPercent + '%',
        },
      ];
    }

    this.chartConfig = {
      dataProperties: [
        {
          defaultConfig: {
            type: 'doughnut',
            data: dataValues,
            backgroundColor: dataColors,
            borderColor: '#fff',
            hoverBackgroundColor: ['#596FE8'],
            hoverBorderColor: '#fff',
          },
        },
      ],
      chartInnitProperties: chartProp,
      showLegend: true,
      chartValues: [2, 2],
      defaultType: 'doughnut',
      chartWidth: '322',
      chartHeight: '322',
      removeChartMargin: true,
      dataLabels: [],
      driversList: drivers,
      allowAnimation: true,
      noChartImage: 'assets/svg/common/no_data_pay.svg',
      dontUseResponsive: true,
    };

    if (this.doughnutChart) {
      this.doughnutChart.chartInnitProperties = chartProp;
      this.doughnutChart.chartUpdated(dataValues);
    }
  }

  ngOnInit(): void {
    this.setChartData(this.driverList);

    this.topTenSwitchTabstype1 = [
      {
        name: 'Mileage',
      },
      {
        name: 'Revenue',
      },
    ];

    this.driverTopSwitch = [
      {
        name: 'Today',
      },
      {
        name: 'WTD',
      },
      {
        name: 'MTD',
      },
      {
        name: 'YTD',
      },
      {
        name: 'All Time',
        checked: true,
      },
      {
        name: 'Custom',
        custom: true,
      },
    ];

    this.tableService.currentSearchTableData
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          // your search code here
        }
      });
  }

  ngAfterViewInit(): void {
    this.timePeriod?.changeTimePeriod('All Time');
  }

  changeDriverSwitchTabs(ev, useLast?) {
    const switchData = useLast ? this.currentSwitchTab : ev['name']; //currently no data for milage/revnue so insert last chosen
    this.timePeriod.changeTimePeriod(switchData);
    this.currentSwitchTab = switchData;
    if (switchData == 'Custom') {
      return false;
    }
    this.topDriverBarChart.updateTime(switchData);
  }

  saveCustomRange(ev) {
    this.timePeriod.changeCustomTime(ev);
    this.topDriverBarChart.updateTime('Custom Set', ev);
  }

  removeDriverFromList(e: Event, indx, item) {
    e.stopPropagation();
    item.active = false;
    this.driverList.splice(indx, 1);
    let showDefault = false;
    if (this.selectedDrivers?.length == 1) {
      showDefault = true;
    }
    this.topDriverBarChart.removeMultiBarData(
      this.selectedDrivers[indx],
      showDefault
    );
    this.selectedDrivers.splice(indx, 1);
    this.topDriverBarChart.selectedDrivers = this.selectedDrivers;
    if (this.selectedDrivers?.length) {
      this.setChartData(this.selectedDrivers, true);
    }

    this.driverList.push(item);
    let allDrivers = [...this.driverList];
    let activeDrivers = allDrivers.filter((driver) => driver.active == true);
    this.driverList = activeDrivers;
    let inactiveDrivers = allDrivers
      .filter((driver) => !driver.active)
      .sort((a, b) => {
        return a.id - b.id;
      });
    inactiveDrivers.map((driver) => {
      this.driverList.push(driver);
    });

    this.savedColors.unshift(this.compareColor[item.id]);
    this.savedHoverColors.unshift(this.compareHoverColor[item.id]);
    if (this.selectedDrivers?.length == 0) {
      this.setChartData(this.driverList);
    }
    delete this.compareColor[item.id];
    delete this.compareHoverColor[item.id];
  }

  clearSelected() {
    this.driverList.map((driver) => {
      driver.acive = false;
    });

    this.savedColors = [...this.chartColors];
    this.savedHoverColors = [...this.chartHoverColors];

    this.driverList.sort((a, b) => {
      return a.id - b.id;
    });

    this.setChartData(this.driverList, false);
    this.compareColor = [];
    this.compareHoverColor = [];

    this.selectedDrivers.map((item, indx) => {
      this.topDriverBarChart.removeMultiBarData(item, true);
    });

    this.selectedDrivers = [];
    this.topDriverBarChart.selectedDrivers = this.selectedDrivers;
    this.doughnutChart.selectedDrivers = this.selectedDrivers;
    this.removeDriverHover();
  }

  changeTopTen(item) {
    const newSwitchValue = [
      {
        name: item.tab1,
        checked: true,
      },
      {
        name: item.tab2,
      },
    ];
    this.topTenSwitchTabstype1 = newSwitchValue;

    this.topTenTitle = item.name;
    this.searchDashboardOptions.gridNameTitle = item.name;
    this.topDriverBarChart.animationDuration = 0;
    this.topDriverBarChart.setChartOptions();
    this.popoverTopTen.map((item) => {
      item.active = false;
      return item;
    });
    item.active = true;
    this.t3.close();
  }

  selectCompare(e, item, indx) {
    const itemId: any = item.id;
    if (!(itemId in this.compareColor)) {
      if (!this.savedColors.length) {
        this.savedColors = [...this.circleColor];
        this.circleColor = [];
        this.savedHoverColors = [...this.hoverCircleColor];
        this.hoverCircleColor = [];
      }

      item.active = true;

      const firstInArray = this.savedColors.shift();
      const firstInArrayHover = this.savedHoverColors.shift();

      const objectSize = Object.keys(this.compareColor).length;
      this.compareColor[item.id] = firstInArray;
      this.compareHoverColor[item.id] = firstInArrayHover;
      this.selectedDrivers.push(this.driverList[indx]);
      this.doughnutChart.selectedDrivers = this.selectedDrivers;
      this.topDriverBarChart.selectedDrivers = this.selectedDrivers;
      this.driverList.splice(indx, 1);
      this.setChartData(this.selectedDrivers, true);
      this.updateBarChart(this.selectedDrivers);
      this.driverList.splice(objectSize, 0, item);

      this.hoverDriver(indx);
    } else {
      this.removeDriverFromList(e, indx, item);
    }
  }

  hoverDriver(index: any) {
    this.doughnutChart.hoverDoughnut(index, 'number');
    this.topDriverBarChart.hoverBarChart(this.selectedDrivers[index]);
  }

  removeDriverHover() {
    this.doughnutChart.hoverDoughnut(null);
    this.topDriverBarChart.hoverBarChart(null);
  }

  updateBarChart(selectedStates: any) {
    let dataSend = [
      60000, 100000, 95000, 47000, 80000, 120000, 90000, 60000, 100000, 95000,
      47000, 80000, 120000, 90000, 60000, 100000, 95000, 47000, 80000, 120000,
      90000, 60000, 50000, 100000, 120000,
    ];
    if (this.topDriverBarChart) {
      this.topDriverBarChart.updateMuiliBar(
        selectedStates,
        dataSend,
        this.compareColor,
        this.compareHoverColor
      );
    }
  }

  selectTimePeriod(period) {
    this.topDriverBarChart.updateTime(this.currentSwitchTab, period);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
