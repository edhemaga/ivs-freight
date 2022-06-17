import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions, scaleService } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-ta-chart',
  templateUrl: './ta-chart.component.html',
  styleUrls: ['./ta-chart.component.scss']
})
export class TaChartComponent implements OnInit {
  @Input() chartConfig: any;
  @Input() axesProperties: any;
  lineChartData: ChartDataSets[] = [];
  
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {};
  lineChartColors: Color[] = [];
  public lineChartLegend: boolean = false;
  public lineChartType: string  = 'bar';
  public lineChartPlugins = [];
  chartInnitProperties: any = [];
  legendProperties: any = [];
  doughnutChartLegend: boolean = false;
  chartWidth: string = '';
  chartHeight: string = '';
  dottedBackground: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.seChartOptions();
    this.setChartData();
  }

  seChartOptions() {
    this.lineChartOptions = {
      responsive: false,
      cutoutPercentage: 80,
      rotation: 1 * Math.PI,
      circumference: 1 * Math.PI,
      tooltips: {
        enabled: this.chartConfig['tooltip']
      },
      plugins: {
        datalabels: {
          formatter: () => {
            return null;
          },
        },
      },
      elements: {
        point: {
          radius: 3,
          borderWidth: 2,
          backgroundColor: '#fff'
        },
        line: {
          borderWidth: 3,
          fill: false
        },
      },
      scales: {
        yAxes: [{
            display: this.axesProperties['verticalLeftAxes'] ? this.axesProperties['verticalLeftAxes']['visible'] : false,
            position: 'left',
            gridLines: {
              display: this.axesProperties['verticalLeftAxes'] ? this.axesProperties['verticalLeftAxes']['showGridLines'] : true,
              drawBorder: false,
              borderDash: [3, 3],
              color: '#DADADA',
              zeroLineBorderDash: [3, 3],
              zeroLineColor: '#DADADA'
            },
            ticks: {
                beginAtZero: true,
                stepSize: this.axesProperties['verticalLeftAxes'] && this.axesProperties['verticalLeftAxes']['stepSize'] ? this.axesProperties['verticalLeftAxes']['stepSize'] : 1000,
                max: this.axesProperties['verticalLeftAxes'] && this.axesProperties['verticalLeftAxes']['maxValue'] ? this.axesProperties['verticalLeftAxes']['maxValue'] : 4000,
                min: this.axesProperties['verticalLeftAxes'] && this.axesProperties['verticalLeftAxes']['minValue'] ? this.axesProperties['verticalLeftAxes']['minValue'] : 0,
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
          display: this.axesProperties['verticalRightAxes'] ? this.axesProperties['verticalRightAxes']['visible'] : false,
          gridLines: {
              display: this.axesProperties['verticalRightAxes'] ? this.axesProperties['verticalRightAxes']['showGridLines'] : false
          },
          position: 'right',
          ticks: {
              beginAtZero: true,
              stepSize: this.axesProperties['verticalRightAxes'] && this.axesProperties['verticalRightAxes']['stepSize'] ? this.axesProperties['verticalRightAxes']['stepSize'] : 700,
              max: this.axesProperties['verticalRightAxes'] && this.axesProperties['verticalRightAxes']['maxValue'] ? this.axesProperties['verticalRightAxes']['maxValue'] : 2800,
              min: this.axesProperties['verticalRightAxes'] && this.axesProperties['verticalRightAxes']['minValue'] ? this.axesProperties['verticalRightAxes']['minValue'] : 0,
              fontColor: '#AAAAAA',
              fontSize: 11,
              padding: -4,
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
          display: this.axesProperties['horizontalAxes'] ? this.axesProperties['horizontalAxes']['visible'] : false,
          position: this.axesProperties['horizontalAxes'] && this.axesProperties['horizontalAxes']['position'] ? this.axesProperties['horizontalAxes']['position'] : 'bottom',
          gridLines: {
              display: this.axesProperties['horizontalAxes'] ? this.axesProperties['horizontalAxes']['showGridLines'] : false
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
  }

  setChartData() {
    console.log(this.chartConfig, 'chartConfigchartConfigchartConfigchartConfig');
    var allData;
    var allBackgrounds = [];
    this.chartConfig['dataProperties'].map((item, indx) => {
      var currentChartConfig = item['defaultConfig'];
      var chartDataArray = currentChartConfig;
      var colorProperties = item['colorProperties'];
      
      if ( item['defaultConfig']['type'] == 'doughnut' ) {
        allData = item['defaultConfig']['data'];
        allBackgrounds = ['#24C1A1B3', '#F78585B3'];
        item['colorProperties']['backgroundColor'].map((item1, indx1) => {
          //allBackgrounds.push(item1+'B3');
        });
      }

      
     // chartDataArray.map((item2, indx2) => {
        //
    //  });
      this.lineChartData.push(chartDataArray);
      this.lineChartColors.push(colorProperties);
      this.lineChartLegend = this.chartConfig['defaultType'] != 'doughnut' ?  this.chartConfig['showLegend'] : false;
      this.doughnutChartLegend = this.chartConfig['showLegend'];
      this.lineChartType = this.chartConfig['defaultType'];
      this.lineChartLabels = this.chartConfig['dataLabels'];
      this.legendProperties = this.chartConfig['legendAttributes'];
      
      this.chartWidth = this.chartConfig['chartWidth'];
      this.chartHeight = this.chartConfig['chartHeight'];
      this.dottedBackground = this.chartConfig['dottedBackground'];
    });

    if ( this.chartConfig['defaultType'] == 'doughnut' ){
      this.setChartInner(allData, allBackgrounds);
    }
  }

  setChartInner(allData, allBackgrounds){
    this.chartConfig['dataLabels'].map((item, indx) => {
      console.log(allData[indx], allBackgrounds[indx]);
      var doughnutParameters = {
        name: item,
        value: allData[indx],
        color: allBackgrounds[indx]
      };
      this.chartInnitProperties.push(doughnutParameters);
    });
    console.log(this.chartInnitProperties, 'this.chartInnitProperties');
  }
}