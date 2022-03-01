import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';

interface ChartInvoiceResponse {
  invoicePaying: any;
  totalDays: number;
  totalLoads: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-dashboard-inv-chart',
  templateUrl: './dashboard-inv-chart.component.html',
  styleUrls: ['./dashboard-inv-chart.component.scss']
})
export class DashboardInvChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart: any;
  mainData: any = [
    {
      title: 'Amount',
      value: 0,
      count: 0,
      color: '#919191'
    },
    {
      title: '0-30',
      value: 0,
      count: 0,
      color: '#24C1A1'
    },
    {
      title: '31-60',
      value: 0,
      count: 0,
      color: '#5673AA'
    },
    {
      title: '61-90',
      value: 0,
      count: 0,
      color: '#FA9952'
    },
    {
      title: '90+',
      value: 0,
      count: 0,
      color: '#A043D1'
    }
  ];
  insideChart: any;
  hoveredIndex = -1;
  chartCollors: any = [
    {
      normal: 'rgba(36, 193, 161, 0.7)',
      hovered: 'rgba(36, 193, 161, 1)'
    },
    {
      normal: 'rgba(86, 115, 170, 0.7)',
      hovered: 'rgba(86, 115, 170, 1)'
    },
    {
      normal: 'rgba(250, 153, 82, 0.7)',
      hovered: 'rgba(250, 153, 82, 1)'
    },
    {
      normal: 'rgba(160, 67, 209, 0.7)',
      hovered: 'rgba(160, 67, 209, 1)'
    }
  ];
  type = 'doughnut';
  data: any = {
    labels: ['10/23/21', '10/24/21', '10/25/21', '10/26/21'],
    datasets: [
      {
        data: [5320, 3240, 0, 0],
        backgroundColor: [
          'rgba(36, 193, 161, 0.4)',
          'rgba(86, 115, 170, 0.4)',
          'rgba(250, 153, 82, 0.4)',
          'rgba(160, 67, 209, 0.4)'
        ],
        borderWidth: 1
      }
    ]
  };
  options: any = {
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    legend: false,
    events: ['mousemove', 'mouseout'],
    onHover: (e, activeElements) => {
      if (activeElements.length == 1) {
        this.hoveredIndex = activeElements[0]._index;
        const findItem = this.mainData[activeElements[0]._index + 1];
        activeElements[0]._options.backgroundColor = this.chartCollors[this.hoveredIndex].hovered;
        this.insideChart = findItem;
      } else {
        this.hoveredIndex = -1;
        this.insideChart = this.mainData[0];
      }
    },
    tooltips: {
      enabled: false
    },
    plugins: {
      datalabels: {
        display(context) {
          return false;
        }
      }
    }
  };
  bottomData: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.insideChart = this.mainData[0];
    this.getChartData();
  }

  findItemInVoice(ndays: number): number {
    switch (true) {
      case ndays < 30 :
        return 1;
      case ndays > 30 && ndays <= 60:
        return 2;
      case ndays > 60 && ndays <= 90:
        return 3;
      default:
        return 4;
    }
  }

  getChartData(): void {
    this.dashboardService.getInvoiceChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ChartInvoiceResponse) => {
        this.mainData = res.invoicePaying.reduce((prev, item) => {
          const fIndex = this.findItemInVoice(item.numOfDays);
          prev[fIndex].value += parseInt(item.sum);
          prev[fIndex].count += parseInt(item.count);
          return prev;
        }, JSON.parse(JSON.stringify(this.mainData)));

        this.mainData[0].value = res.totalRevenue;
        this.mainData[0].count = res.totalLoads;

        this.chart.data.datasets[0].data = [this.mainData[1].value, this.mainData[2].value, this.mainData[3].value, this.mainData[4].value];
        this.insideChart = this.mainData[0];

        this.chart.chart.update();

        this.bottomData = this.mainData.filter(item => item.title != 'Amount');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
