import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-ta-chart',
  templateUrl: './ta-chart.component.html',
  styleUrls: ['./ta-chart.component.scss']
})
export class TaChartComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [1050, 950, 2200, 1100, 1250, 1550, 2100, 2500, 2000, 1150, 1300, 1700], label: 'Salary', type: 'line', yAxisID: 'y-axis-1', },
    { data: [2200, 1700, 2800, 1100, 1500, 2200, 3300, 3700, 2500, 1400, 2200, 2800], label: 'Miles', type: 'bar', yAxisID: 'y-axis-0' },
  ];
  public lineChartLabels: Label[] = [
    '',
    'NOV',
    '',
    '2021',
    '',
    'MAR',
    '',
    'MAY',
    '',
    'JUL',
    '',
    'SEP'
  ];
  public lineChartOptions: ChartOptions = {
    responsive: false,
    elements: {
      point: {
        radius: 3,
        borderWidth: 3,
        backgroundColor: '#fff'
      },
      line: {
        borderWidth: 3
      }
    },
    scales: {
      yAxes: [{
          display: true,
          gridLines: {
            drawBorder: false,
            borderDash: [3, 3],
            color: '#DADADA',
            zeroLineBorderDash: [3, 3],
            zeroLineColor: '#DADADA'
          },
          ticks: {
              beginAtZero: true,
              stepSize: 1000,
              max: 4000,
              min: 0,
              fontColor: '#AAAAAA',
              fontSize: 11,
              padding: 10,
              callback: function(value: any) {
                  var ranges = [
                    { divider: 1e6, suffix: 'M' },
                    { divider: 1e3, suffix: 'K' }
                  ];
                  function formatNumber(n) {
                    for (var i = 0; i < ranges.length; i++) {
                        if (n >= ranges[i].divider) {
                          return (n / ranges[i].divider).toString() + ranges[i].suffix;
                        }
                    }
                    return n;
                  }
                  return formatNumber(value);
              }
            }
      },
      {
        display: true,
        gridLines: {
            display:false
        },
        position: 'right',
        ticks: {
            beginAtZero: true,
            stepSize: 700,
            max: 2800,
            min: 0,
            fontColor: '#AAAAAA',
            fontSize: 11,
            callback: function(value: any) {
              var ranges = [
                { divider: 1e6, suffix: 'M' },
                { divider: 1e3, suffix: 'K' }
              ];
              function formatNumber(n) {
                for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                }
                return n;
              }
              return formatNumber(value);
          }
        }
     }
   ],
    xAxes: [{
        gridLines: {
            display:false
        },
        ticks: {
            fontColor: '#AAAAAA',
            fontSize: 11,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
        }
    }],
  }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#6D82C7'
    },
    {
      borderColor: 'black',
      backgroundColor: '#FFCC80',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit(): void {
  }

}
