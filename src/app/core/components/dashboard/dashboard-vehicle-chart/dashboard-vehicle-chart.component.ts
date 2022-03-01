import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as Chart from 'chart.js';
import {ChartType} from 'chart.js';
import './chartjs-rounded-corners';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard-vehicle-chart',
  templateUrl: './dashboard-vehicle-chart.component.html',
  styleUrls: ['./dashboard-vehicle-chart.component.scss']
})
export class DashboardVehicleChartComponent implements OnInit {
  @ViewChild('mainChart') mainChart: ElementRef;
  type: ChartType = 'roundedBar' as ChartType;
  data: any = {
    hover: {
      intersect: false
    },
    labels: ['Moving', 'Short Stop', 'Extend. Stop', 'Parking'],
    datasets: [
      {
        type: 'roundedBar',
        label: 'Bar Dataset',
        data: [20, 10, 15, 12],
        borderColor: 'rgb(255, 99, 132)',
        borderSkipped: false,
        backgroundColor: ['rgba(36, 193, 161, 1)', 'rgba(86, 115, 170, 1)', 'rgba(255, 162, 78, 1)', 'rgba(108, 108, 108, 1)'],
        order: 2,
        datalabels: {
          color: 'white',
          align: 'end',
          anchor: 'start',
          display(context) {
            return true;
          },
          formatter(value, context) {
            return context.chart.data.labels[context.dataIndex];
          }
        }
      }
      , {
        type: 'line',
        label: 'Line Dataset',
        data: [{y: 15, value: '+37%'}, {y: 8, value: '-17%'}, {y: 10, value: '+0%'}, {y: 10, value: '-20%'}],
        fill: false,
        borderColor: '#eee',
        backgroundColor: ['rgba(36, 193, 161, 1)', 'rgba(86, 115, 170, 1)', 'rgba(255, 162, 78, 1)', 'rgba(108, 108, 108, 1)'],
        order: 1,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderHoverWidth: 2,
        datalabels: {
          align: 'center',
          anchor: 'center',
          font: {
            weight: 'bold',
            size: 10
          },
          formatter(value, context) {
            return context.dataset.data[context.dataIndex].value;
          },
          color(context) {
            const index = context.dataIndex;
            const data = context.dataset.data[index].y;
            const fist_chart_indx = context.chart.controller.data.datasets[0].data[index];
            const color = context.chart.controller.data.datasets[0].backgroundColor[index];
            return data >= fist_chart_indx ? color : '#fff';
          }
        }
      }
    ]
  };
  options: any = {
    maintainAspectRatio: false,
    responsive: true,
    barRoundness: 0.1,
    elements: {
      line: {
        fill: false
      },
      point: {
        hoverRadius: 17,
        radius: 15
      }
    },
    scales: {
      yAxes: [{
        display: false,
        stacked: false,
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        stacked: true,
        display: false,
        ticks: {
          mirror: true,
          fontSize: 22,
          fontColor: '#919191',
          lineHeight: 1.4,
          callback(value, index, values) {
            return value;
          },
        },
        gridLines: {
          display: false,
          offsetGridLines: true
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
      }
    }
  };

  constructor() {
  }

  ngOnInit(): void {
    // Chart.defaults.scale.gridLines.display = false;
    Chart.plugins.register(ChartDataLabels);
  }
}
