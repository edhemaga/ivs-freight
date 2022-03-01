import {Component, OnInit} from '@angular/core';
import '../dashboard-vehicle-chart/chartjs-rounded-corners';
import {ChartType} from 'chart.js';

@Component({
  selector: 'app-dashboard-loading-chart',
  templateUrl: './dashboard-loading-chart.component.html',
  styleUrls: ['./dashboard-loading-chart.component.scss']
})
export class DashboardLoadingChartComponent implements OnInit {

  selectedPeriod: any = 'all';
  timeList: any = [
    {
      id: 1,
      name: 'All time',
      period: 'all'
    },
    {
      id: 2,
      name: 'Today',
      period: 'today'
    },
    {
      id: 3,
      name: 'WTD',
      period: 'wtd'
    },
    {
      id: 4,
      name: 'MTD',
      period: 'mtd'
    },
    {
      id: 5,
      name: 'YTD',
      period: 'ytd'
    },
    // {
    //   id: 6,
    //   name: "Custom"
    // }
  ];


  type: ChartType = 'roundedBar' as ChartType;
  data: any = {
    hover: {
      intersect: false
    },
    labels: ['04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20', '04/07/20'],
    datasets: [{
      type: 'roundedBar',
      label: 'Bar Dataset',
      data: [38, 30, 25, 28, 30, 25, 35, 32, 25, 38, 25, 29],
      borderSkipped: false,
      backgroundColor: 'rgba(255, 93, 93, 0.7)',
      order: 2,
      yAxisID: 'A'
    },
      {
        type: 'roundedBar',
        label: 'Bar Dataset',
        data: [180, 200, 150, 200, 195, 150, 120, 190, 150, 220, 200, 210],
        borderColor: 'rgb(255, 99, 132)',
        borderSkipped: false,
        backgroundColor: 'rgba(36, 193, 161, 0.7)',
        order: 3,
        yAxisID: 'B'
      }
      , {
        type: 'line',
        label: 'Line Dataset',
        data: [35, 28, 20, 25, 25, 20, 30, 30, 30, 35, 30, 30],
        fill: false,
        borderColor: 'rgba(86, 115, 170, 0.5)',
        backgroundColor: '#5673AA',
        order: 1,
        pointBorderColor: '#fff',
      }
    ]
  };
  options: any = {
    responsive: true,
    maintainAspectRatio: false,
    barRoundness: 0.5,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false
          },
          id: 'A',
          type: 'linear',
          position: 'left',
          display: false, // SLANJANJE LEVE STRANE
          ticks: {
            min: 5,
            max: 40,
            fontSize: 10,
            stepSize: 5,
            fontColor: '#DADADA',
            callback(value: number, index, values) {
              return value;
            }
          }
        },
        {
          gridLines: {
            display: false
          },
          id: 'B',
          type: 'linear',
          position: 'right',
          display: false, // SLANJANJE DESNE STRANE STRANE
          ticks: {
            min: 30,
            max: 240,
            stepSize: 30,
            fontSize: 10,
            fontColor: '#DADADA',
            callback(value: number, index, values) {
              return value;
            }
          }
        }
      ],
      xAxes: [{
        ticks: {
          fontSize: 12,
          fontColor: '#DADADA',
          stepSize: 40,
          steps: 5,
          autoSkip: false,
          maxRotation: 0,
          callback(value, index, values) {
            if (index == 0 || index == (values.length - 1)) {
              return value;
            }
          },
        },
        gridLines: {
          display: false,
          offsetGridLines: true,
          lineWidth: 0
        }
      }]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display(context) {
          return false;
        }
      }
    }
  };

  constructor() {
  }

  ngOnInit(): void {
  }


}
