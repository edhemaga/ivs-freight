import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions, scaleService } from 'chart.js';
import { BaseChartDirective, Color, Label, MultiDataSet } from 'ng2-charts';
import * as annotation from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-ta-chart',
  templateUrl: './ta-chart.component.html',
  styleUrls: ['./ta-chart.component.scss']
})
export class TaChartComponent implements OnInit {
  @Input() chartConfig: any;
  @Input() axesProperties: any;
  @Input() legendAttributes: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  lineChartData: ChartDataSets[] = [];
  
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {};
  lineChartColors: Color[] = [];
  public lineChartLegend: boolean = false;
  public lineChartType: string  = 'bar';
  public lineChartPlugins = [];
  doughnutChartLegend: boolean = false;
  chartWidth: string = '';
  chartHeight: string = '';
  dottedBackground: boolean = false;
  noChartData: boolean = true;
  noChartImage: string = '';
  annotationHovered: any;
  saveValues: any = [];
  removeChartMargin: boolean = false;
  chartInnitProperties: any = [];
  animationDuration: number = 1000;
  allowAnimation: any;

  constructor() { }

  ngOnInit(): void {
    this.saveValues = JSON.parse(JSON.stringify(this.legendAttributes));
    
    let namedChartAnnotation = annotation;
    namedChartAnnotation["id"]="annotation";
    Chart.pluginService.register(namedChartAnnotation);
    this.seChartOptions();
    this.setChartData();
  }

  setHoverAnnotation(value: any) {
    var sameValue = false;
    this.lineChartOptions['annotation']['annotations'].forEach((item, i) => {
      if ( item['id'] == 'a-line-2' && item['value'] == value ) {
        sameValue = true;
      }
    });

    if ( !sameValue ) {
      this.annotationHovered = value;
      this.seChartOptions();
    }
  }

  seChartOptions() {
    this.lineChartOptions = {
      responsive: false,
      cutoutPercentage: 90,
      animation: {
        duration: this.allowAnimation ? this.animationDuration : 0
      },
      onHover: (evt, elements) => {
        if ( elements && elements[0] ) {
          this.animationDuration = 0;
          if ( this.legendAttributes && this.legendAttributes.length && this.legendAttributes.length > 0) { this.setChartLegendData(elements); }
          this.changeChartFillProperty(evt, elements);
          this.setHoverAnnotation(elements[0]['_index']);
        }
        else{
          this.animationDuration = 1000;
          this.setHoverAnnotation(null);
          this.legendAttributes = JSON.parse(JSON.stringify(this.saveValues));
        }
      },
      annotation: {
        drawTime: 'beforeDatasetsDraw',
        annotations: [
          {
            id: 'a-line-1',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.chartConfig['annotation'] ? this.chartConfig['annotation'] : null,
            borderColor: '#E57373',
            borderWidth: 1
          },
          {
            id: 'a-line-2',
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: this.annotationHovered,
            borderColor: '#DADADA',
            borderWidth: 2
          }
        ]
      },
      tooltips: {
        enabled: this.chartConfig['tooltip']
      },
      plugins: {
        datalabels: {
          formatter: () => {
            return null;
          },
        }
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
                callback: (value: any) => {
                  if ( this.axesProperties['verticalLeftAxes'] && this.axesProperties['verticalLeftAxes']['decimal'] ) {
                    if (value % 1 === 0) {
                      value = value+'.0';
                    }
                    return value;
                  }
                  else {
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
        offset: false,
          display: this.axesProperties['horizontalAxes'] ? this.axesProperties['horizontalAxes']['visible'] : false,
          position: this.axesProperties['horizontalAxes'] && this.axesProperties['horizontalAxes']['position'] ? this.axesProperties['horizontalAxes']['position'] : 'bottom',
          gridLines: {
              display: this.axesProperties['horizontalAxes'] ? this.axesProperties['horizontalAxes']['showGridLines'] : false,
              borderDash: [3, 3]
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
    var allData;
    var allBackgrounds = [];
    this.chartConfig['dataProperties'].map((item, indx) => {
      var currentChartConfig = item['defaultConfig'];
      var chartDataArray = currentChartConfig;

      if ( item['defaultConfig']['hasGradiendBackground'] ) {
        this.setGradientBackground('gradient');
      }
      
      // if ( item['defaultConfig']['type'] == 'doughnut' ) {
      //   allData = item['defaultConfig']['data'];
      //   allBackgrounds = ['#24C1A1B3', '#F78585B3'];
      //   item['colorProperties']['backgroundColor'].map((item1, indx1) => {
      //     //allBackgrounds.push(item1+'B3');
      //   });
      // }
      
      this.lineChartData.push(chartDataArray);
      this.lineChartLegend = this.chartConfig['defaultType'] != 'doughnut' ?  this.chartConfig['showLegend'] : false;
      this.doughnutChartLegend = this.chartConfig['showLegend'];
      this.lineChartType = this.chartConfig['defaultType'];
      this.lineChartLabels = this.chartConfig['dataLabels'];
      
      this.chartWidth = this.chartConfig['chartWidth'];
      this.chartHeight = this.chartConfig['chartHeight'];
      this.dottedBackground = this.chartConfig['dottedBackground'];
      this.noChartImage = this.chartConfig['noChartImage'];
      this.removeChartMargin = this.chartConfig['removeChartMargin'];
      this.chartInnitProperties = this.chartConfig['chartInnitProperties'];
      this.allowAnimation = this.chartConfig['allowAnimation'];
      this.chartDataCheck(this.chartConfig['chartValues']);
    });
  }

  setGradientBackground(type) {
    this.lineChartPlugins = [{
      afterLayout: chart => {
        var ctx = chart.chart.ctx;
        var canvas = <HTMLCanvasElement> document.getElementById('myChart');
        var gradientStroke = ctx.createLinearGradient(0, 0, 0, canvas.height);
        var gradientStroke2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
        var dataset = chart.data.datasets[0]['colors'] ? chart.data.datasets[0] : chart.data.datasets[1];
        
        if ( dataset.hoverColors ) {
          dataset.hoverColors.forEach((c, i) => {
            var stop = 1 / (dataset.hoverColors.length - 1) * i;
            gradientStroke2.addColorStop(stop, c);
          });
          dataset.hoverBackgroundColor = gradientStroke2;
        }

        if ( dataset.colors ) {
           dataset.colors.forEach((c, i) => {
            var stop = 1 / (dataset.colors.length - 1) * i;
            gradientStroke.addColorStop(stop, c);
          });

          dataset.backgroundColor = gradientStroke;
          
          if ( this.chartConfig['annotation'] ) {
            const yScale = chart.scales['y-axis-0'];
            const yPos = yScale.getPixelForValue(this.chartConfig['annotation']);
        
            const gradientFill = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradientFill.addColorStop(0, 'rgb(229, 115, 115)');
            gradientFill.addColorStop(yPos / canvas.height, 'rgb(229, 115, 115)');
            gradientFill.addColorStop(yPos / canvas.height, 'rgb(109, 130, 199)');
            gradientFill.addColorStop(1, 'rgb(109, 130, 199)');

            gradientStroke.addColorStop(0, 'rgb(239, 154, 154)');
            gradientStroke.addColorStop(yPos / canvas.height, 'rgb(255, 255, 255)');
            gradientStroke.addColorStop(yPos / canvas.height, 'rgb(189, 202, 235)');
            gradientStroke.addColorStop(1, 'rgb(255, 255, 255)');

            dataset.backgroundColor = gradientStroke;
            dataset.borderColor = gradientFill;
            dataset.pointHoverBackgroundColor = gradientFill;
          }
        }
      }
    }
  ];
  }

  chartDataCheck(values) {
    var hasData = false;
    values.forEach((item, i) => {
      if ( item > 0 ) {
        hasData = true;
      }
    });
    if ( hasData ){
      this.noChartData = false;
    }
  }

  setChartLegendData(elements: any) {
    elements.forEach((item, i) => {
      var chartValue = item['_chart']['config']['data']['datasets'][i]['data'][elements[i]['_index']];

      this.legendAttributes.forEach((item2, a) => {
          if ( item2['elementId'] == i ) {
            item2['value'] = chartValue;
          }

          if ( item2['elementId'] && item2['elementId'].length  && item2['elementId'].length > 0 && item2['elementId'][0] == i ) {
            item2['value'] = chartValue[item2['elementId'][1]];
          }

          if ( item2['titleReplace'] ) { item2['title'] = item2['titleReplace']; }
          if ( item2['imageReplace'] ) { item2['image'] = item2['imageReplace']; }
      });
    });
  }

  changeChartFillProperty(evt: any, elements: any) {
    //elements[0]['_chart']['config']['data']['datasets'][0]['fill'] = true;
    elements.forEach((item, i) => {
      //console.log(chartValue, 'ELEEEEMENTSSSS');
      
    });
    //this.seChartOptions();
  }

  insertNewChartData(mod, type, color){
    console.log(color, 'colorcolorcolor')
    console.log(this.chart, 'this.chart');
    console.log(mod, type, 'insertNewChartDatainsertNewChartDatainsertNewChartData');

    this.chart.chart.config.data.datasets.forEach((item, i) => {
      console.log(item['id'], 'itemitemitem');
      console.log('testingvalue 111');
      if ( item['id'] == type ) {
        console.log('testingvalue 222');
        if ( mod == 'add' ) { 
          console.log('testingvalue 333');
          item['hidden'] = false;
          item['borderColor'] = '#'+color;
          item['pointHoverBorderColor'] = '#'+color;
        }
        if ( mod == 'remove' ) { console.log('testingvalue 444'); item['hidden'] = true; }
      }
    });
    this.seChartOptions();
  }
}