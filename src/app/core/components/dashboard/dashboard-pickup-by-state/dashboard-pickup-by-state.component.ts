import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
  selector: 'app-dashboard-pickup-by-state',
  templateUrl: './dashboard-pickup-by-state.component.html',
  styleUrls: ['./dashboard-pickup-by-state.component.scss'],
})
export class DashboardPickupByStateComponent implements OnInit, OnDestroy {
  @ViewChild('t2') t2: any;
  @ViewChild('t3') t3: any;
  @ViewChild('statesBarChart', { static: false }) public statesBarChart: any;
  @ViewChild('timePeriod', { static: false }) public timePeriod: any;

  private destroy$ = new Subject<void>();

  public barChartConfig: object = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'bar',
          data: [
            12, 18, 13, 17, 13, 12, 18, 13, 17, 13, 12, 18, 13, 17, 13, 12, 18,
            13, 17, 13, 12, 18, 13, 17, 13, 12, 18, 13, 17, 13, 12, 18, 13, 17,
            13, 12, 18, 13, 17, 13,
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
            8, 10, 9, 16, 17, 8, 10, 9, 16, 17, 8, 10, 9, 16, 17, 8, 10, 9, 16,
            17, 8, 10, 9, 16, 17, 8, 10, 9, 16, 17, 8, 10, 9, 16, 17, 8, 10, 9,
            16, 17,
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
    dataLabels: [
      [20, 'MON'],
      [21, 'TUE'],
      [22, 'WED'],
      [23, 'THU'],
      [24, 'FRI'],
    ],
    noChartImage: 'assets/svg/common/no_data_pay.svg',
  };
  public barAxes: object = {
    verticalLeftAxes: {
      visible: true,
      minValue: 0,
      maxValue: 20,
      stepSize: 5,
      showGridLines: true,
    },
    horizontalAxes: {
      visible: true,
      position: 'bottom',
      showGridLines: false,
    },
  };

  pickupTitle: string = 'Pickup';

  stateSwitchTabsType1: any[] = [];

  stateSwitchTabsType2: any[] = [];

  stateSwitchTabsType3: any[] = [];

  stateSwitchTabsType4: any[] = [];

  pickupSwitch: any[] = [];

  currentSwitchTab: string = 'WTD';

  pickupStateList: any[] = [
    {
      id: 1,
      name: 'IL',
      price: '$123.45K',
      percent: '8.53%',
    },
    {
      id: 2,
      name: 'IN',
      price: '$102.34K',
      percent: '8.43%',
    },
    {
      id: 3,
      name: 'KY',
      price: '$95.15K',
      percent: '7.35%',
    },
    {
      id: 4,
      name: 'MO',
      price: '$93.52K',
      percent: '7.23%',
    },
    {
      id: 5,
      name: 'IA',
      price: '$89.35K',
      percent: '6.87%',
    },
    {
      id: 6,
      name: 'WI',
      price: '$75.23K',
      percent: '4.07%',
    },
    {
      id: 7,
      name: 'OH',
      price: '$67.52K',
      percent: '3.52%',
    },
    {
      id: 8,
      name: 'TN',
      price: '$65.25K',
      percent: '3.43%',
    },
    {
      id: 9,
      name: 'VA',
      price: '$35.04K',
      percent: '2.96%',
    },
    {
      id: 10,
      name: 'OK',
      price: '$26.23K',
      percent: '2.12%',
    },
  ];

  pickupCircleColor: any[] = [
    '6278C7',
    '7A8DCB',
    '7A8DCB',
    'A0AFDE',
    'A0AFDE',
    'C2CEEC',
    'C2CEEC',
    'C2CEEC',
    'D7E1F4',
    'D7E1F4',
  ];
  chartColors: any[] = [];
  compareColor: any = {};
  savedColors: any[] = [];
  selectedStates: any[] = [];

  popoverState: any[] = [
    {
      name: 'Pickup',
      active: true,
      tabSwitch1: 'Count',
      tabSwitch2: 'Revenue',
    },
    {
      name: 'Delivery',
      tabSwitch1: 'Count',
      tabSwitch2: 'Revenue',
    },
    {
      name: 'Load',
      tabSwitch1: 'Count',
      tabSwitch2: 'Revenue',
    },
    {
      name: 'Violation',
      tabSwitch1: 'Count',
      tabSwitch2: 'SW',
    },
    {
      name: 'Accident',
      tabSwitch1: 'Count',
      tabSwitch2: 'SW',
    },
    {
      name: 'Repair',
      tabSwitch1: 'Count',
      tabSwitch2: 'Cost',
    },
    {
      name: 'Fuel',
      tabSwitch1: 'Price',
      tabSwitch2: 'Cost',
    },
  ];

  public searchDashboardOptions = {
    gridNameTitle: 'State',
  };

  constructor(private tableService: TruckassistTableService) {}

  ngOnInit(): void {
    if (this.pickupCircleColor?.length) {
      this.chartColors = this.pickupCircleColor;
    }
    this.stateSwitchTabsType1 = [
      {
        name: 'Count',
      },
      {
        name: 'Revenue',
      },
    ];

    this.pickupSwitch = [
      {
        name: 'Today',
      },
      {
        name: 'WTD',
        checked: true,
      },
      {
        name: 'MTD',
      },
      {
        name: 'YTD',
      },
      {
        name: 'All Time',
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
    this.timePeriod.changeTimePeriod('WTD');
  }

  changeStateSwitchTabs(ev) {
    this.timePeriod.changeTimePeriod(ev['name']);
    this.currentSwitchTab = ev['name'];
    this.statesBarChart.updateTime(ev['name']);
  }

  selectStateCompare(e, item, indx) {
    const itemId: any = item.id;
    if (!(itemId in this.compareColor)) {
      item.active = true;
      const firstInArray = this.pickupCircleColor[indx];
      const objectSize = Object.keys(this.compareColor).length;
      this.compareColor[item.id] = firstInArray;
      this.selectedStates.push(this.pickupStateList[indx]);
      this.statesBarChart.selectedDrivers = this.selectedStates;
      this.pickupStateList.splice(indx, 1);
      this.updateBarChart(this.selectedStates);
      this.pickupStateList.splice(objectSize, 0, item);

      this.hoverState(indx);
    } else {
      this.removeFromStateList(e, indx, item);
    }
  }

  removeFromStateList(e: Event, indx, item) {
    e.stopPropagation();
    item.active = false;
    this.pickupStateList.splice(indx, 1);
    let showDefault = false;
    if (this.selectedStates?.length == 1) {
      showDefault = true;
    }
    this.statesBarChart.removeMultiBarData(
      this.selectedStates[indx],
      showDefault
    );
    this.selectedStates.splice(indx, 1);
    this.statesBarChart.selectedDrivers = this.selectedStates;
    this.pickupStateList.push(item);
    let allStates = [...this.pickupStateList];
    let activeStates = allStates.filter((state) => state.active == true);
    this.pickupStateList = activeStates;
    let inactiveStates = allStates
      .filter((state) => !state.active)
      .sort((a, b) => {
        return a.id - b.id;
      });
    inactiveStates.map((state) => {
      this.pickupStateList.push(state);
    });
    this.savedColors.unshift(this.compareColor[item.id]);
    delete this.compareColor[item.id];
  }

  clearSelected() {}

  changeState(item) {
    const newSwitchValue = [
      {
        name: item.tabSwitch1,
        checked: true,
      },
      {
        name: item.tabSwitch2,
      },
    ];
    this.stateSwitchTabsType1 = newSwitchValue;
    this.pickupTitle = item.name;
    this.popoverState.map((item) => {
      item.active = false;
      return item;
    });
    item.active = true;
    this.t3.close();
  }

  hoverState(index: any) {
    this.statesBarChart.hoverBarChart(this.selectedStates[index]);
  }

  removeStateHover() {
    this.statesBarChart.hoverBarChart(null);
  }

  updateBarChart(selectedStates: any) {
    let dataSend = [10, 12, 20, 5, 18];
    if (this.statesBarChart) {
      this.statesBarChart.updateMuiliBar(
        selectedStates,
        dataSend,
        this.compareColor,
        this.compareColor
      );
    }
  }

  selectTimePeriod(period) {
    this.statesBarChart.updateTime(this.currentSwitchTab, period);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
