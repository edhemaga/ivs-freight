import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { SharedService } from '../../../services/shared/shared.service';
import { DashboardStats } from '../state/dashboard.model';
import { DashboardStoreService } from '../state/dashboard.service';
import { DashboardQuery } from '../state/dashboard.query';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss',],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  public inputDate: FormControl = new FormControl();
  dashboardStats: Observable<DashboardStats[]>;

  color: string = "#eee";
  dispatchStatuses: any = [
    {
      id: 40,
      name: 'OFF',
      status: 58,
      statusPercentage: 10.0,
      color: '#202020'
    },
    {
      id: 40,
      status: 58,
      name: 'ACTIVE',
      statusPercentage: 15.0,
      color: '#5AE99D'
    },
    {
      id: 40,
      status: 58,
      name: 'DISPATCHED',
      color: '#497BDC',
      statusPercentage: 25.0,
    },
    {
      id: 40,
      status: 58,
      name: 'CHECKED IN',
      color: '#24C1A1',
      statusPercentage: 98.0
    },
    {
      id: 40,
      status: 58,
      name: 'LOADED',
      color: '#207E4C',
      statusPercentage: 35.0
    },
    {
      id: 40,
      status: 58,
      name: 'REPAIR',
      color: '#AE3232',
      statusPercentage: 80.0
    },
    {
      id: 40,
      status: 58,
      name: 'EMPTY',
      color: '#F99E00',
      statusPercentage: 76.0
    }
  ];
  pendingStatuses: any = [
    {
      id: 40,
      name: 'BOOKED',
      status: 58,
      statusPercentage: 25.0,
      color: '#959595'
    },
    {
      id: 40,
      status: 58,
      name: 'ASSIGNED',
      statusPercentage: 10.0,
      color: '#202020'
    },
    {
      id: 40,
      status: 58,
      name: 'DISPATCHED',
      color: '#497BDC',
      statusPercentage: 14.0,
    },
    {
      id: 40,
      status: 58,
      name: 'LOADED',
      color: '#207E4C',
      statusPercentage: 90.0
    }
  ];
  closedStatuses: any = [
    {
      id: 40,
      name: 'CANCELED',
      status: 58,
      statusPercentage: 20.0,
      color: '#AE3232'
    },
    {
      id: 40,
      status: 58,
      name: 'TONU',
      statusPercentage: 55.0,
      color: '#FF5D5D'
    },
    {
      id: 40,
      status: 58,
      name: 'INVOICED',
      color: '#BFB580',
      statusPercentage: 30.0,
    },
    {
      id: 40,
      status: 58,
      name: 'In HOLD / REVISED',
      color: '#B7B7B7',
      statusPercentage: 100.0
    },
    {
      id: 40,
      name: 'PAID',
      status: 58,
      statusPercentage: 40.0,
      color: '#9F9A7B'
    },
    {
      id: 40,
      status: 58,
      name: 'SHORT-PAID',
      statusPercentage: 70.0,
      color: '#807B65'
    },
    {
      id: 40,
      status: 58,
      name: 'UNPAID',
      color: '#65614D',
      statusPercentage: 10.0,
    },
    {
      id: 40,
      status: 58,
      name: 'CLAIM',
      color: '#514E40',
      statusPercentage: 90.0
    }
  ];

  public lineChartConfig: object = {
    dataProperties: [
      {
        defaultConfig: {
          type: 'line',
          data: [12, 21, 27, 37, 28, 25, 21, 10, 15, 45, 27, 46, 41, 28, 24, 12, 21, 27, 37, 28, 25, 21, 10, 20],
          yAxisID: 'y-axis-0',
          borderColor: '#8A9AEF',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#8A9AEF',
          pointHoverRadius: 3,
          pointBorderWidth: 2,
          fill: false,
          hasGradiendBackground: true,
          colors: ['rgba(189, 202, 235, 1)', 'rgba(255, 255, 255, 1)']
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 46, 10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 10],
          yAxisID: 'y-axis-0',
          borderColor: '#FDB46B',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#FDB46B',
          pointHoverRadius: 3,
          pointBorderWidth: 2
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [10, 12, 46, 10, 14, 30, 7, 28, 11, 20, 10, 12, 46, 10, 14, 30, 29, 11, 19, 20, 39, 46, 10, 15],
          yAxisID: 'y-axis-0',
          borderColor: '#F27B8E',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#F27B8E',
          pointHoverRadius: 3,
          pointBorderWidth: 2
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          yAxisID: 'y-axis-0',
          borderColor: '#A574C3',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#A574C3',
          pointHoverRadius: 3,
          pointBorderWidth: 2
        }
      },
      {
        defaultConfig: {
          type: 'line',
          data: [0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0],
          yAxisID: 'y-axis-0',
          borderColor: '#6DC089',
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#6DC089',
          pointHoverRadius: 3,
          pointBorderWidth: 2
        }
      }
    ],
    showLegend: false,
    chartValues: [2, 2],
    defaultType: 'bar',
    chartWidth: '1450',
    chartHeight: '222',
    removeChartMargin: true,
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
    chartWidth: '1450',
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

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
      private dashboardStoreService: DashboardStoreService, 
      private dashboardQuery: DashboardQuery, 
      private dashboardService: DashboardService, 
      private sharedService: SharedService,
      private route: ActivatedRoute,
      private http: HttpClient
  ) {}

  ngOnInit() {
    //this.dashboardStoreService.addStats();
    this.dashboardStats = this.route.snapshot.data['dashboard'];
    console.log(this.route.snapshot.data);
    // this.dashboardQuery.selectDashboardStatistic$
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(result => {
    //   this.dashboardStats = result;
    // });
    
    //this.getStats();
  }

  getStats() {
    this.dashboardService.getDasboardMainTotals()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.dashboardStats = response;
          console.log('dashboardStats:', response);
        },
        (error: any) => {
          this.sharedService.handleServerError();
        }
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parseNum(x) {
    return parseFloat(x);
  }


  dataTest = {
    disabledMutedStyle: null,
    toolbarActions: {
      hideViewMode: false,
    },
    config: {
      showSort: true,
      sortBy: '',
      sortDirection: '',
      disabledColumns: [0],
      minWidth: 60,
    },
    actions: [
      {
        title: 'Edit',
        name: 'edit',
        class: 'regular-text',
        contentType: 'edit',
      },

      {
        title: 'Delete',
        name: 'delete-item',
        type: 'driver',
        text: 'Are you sure you want to delete driver(s)?',
        class: 'delete-text',
        contentType: 'delete',
      },
    ],
    export: true,
  };
}
