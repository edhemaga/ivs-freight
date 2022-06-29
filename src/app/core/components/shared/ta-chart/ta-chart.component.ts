import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions, scaleService } from 'chart.js';
import { BaseChartDirective, Color, Label, MultiDataSet } from 'ng2-charts';
import * as annotation from 'chartjs-plugin-annotation';
import { hexToRgbA } from 'src/assets/utils/methods-global';
import { elementMatches } from '@fullcalendar/core';

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
  saveChartProperties: any = [];
  animationDuration: number = 1000;
  allowAnimation: any;
  driversList: any;
  annotationConfig: any;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.saveValues = JSON.parse(JSON.stringify(this.legendAttributes));
    
    let namedChartAnnotation = annotation;
    namedChartAnnotation["id"]="annotation";
    Chart.pluginService.register(namedChartAnnotation);
    this.setChartOptions();
    this.setChartData();
  }

  setHoverAnnotation(value: any, config?) {
    let sameValue = false;
    this.annotationConfig = config;
    this.lineChartOptions['annotation']['annotations'].map((item, i) => {
      if ( item['id'] == 'a-line-2' && item['value'] == value ) {
        sameValue = true;
      }
    });

    if ( !sameValue ) {
      this.annotationHovered = value;
      this.setChartOptions();
    }
  }

  setChartOptions() {
    this.lineChartOptions = {
      responsive: false,
      cutoutPercentage: 90,
      animation: {
        duration: this.allowAnimation ? this.animationDuration : 0
      },
      onHover: (evt, elements) => {
        if ( elements && elements[0] ) {
          this.animationDuration = 0;
          if ( this.legendAttributes?.length ) { this.setChartLegendData(elements); }
         // this.changeChartFillProperty(evt, elements);
          this.setHoverAnnotation(elements[0]['_index']);
          if ( this.lineChartType == 'doughnut' && this.driversList?.length ) { this.hoverDoughnut(elements, 'object') }
        }
        else{
          this.animationDuration = 1000;
          this.setHoverAnnotation(null);
          if ( this.lineChartType == 'doughnut' && this.driversList?.length ) { this.hoverDoughnut(null) }
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
            mode: this.annotationConfig ? this.annotationConfig['type'] : 'vertical',
            scaleID: this.annotationConfig ? this.annotationConfig['axis'] : 'x-axis-0',
            value: this.annotationHovered,
            borderColor: this.annotationConfig ? this.annotationConfig['color'] : '#DADADA',
            borderWidth: 2,
            borderDash: this.annotationConfig ? this.annotationConfig['dash'] : 0
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
                    let ranges = [
                      { divider: 1e6, suffix: 'M' },
                      { divider: 1e3, suffix: 'K' }
                    ];
                    function formatNumber(n) {
                      for (let i = 0; i < ranges.length; i++) {
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
                let ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'K' }
                ];
                function formatNumber(n) {
                  for (let i = 0; i < ranges.length; i++) {
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
    this.chartConfig['dataProperties'].map((item, indx) => {
      const currentChartConfig = item['defaultConfig'];

      if ( item['defaultConfig']['hasGradiendBackground'] ) {
        this.setGradientBackground();
      }
      
      this.lineChartData.push(currentChartConfig);
      this.lineChartLegend = this.chartConfig['defaultType'] != 'doughnut' ?  this.chartConfig['showLegend'] : false;
      this.doughnutChartLegend = this.chartConfig['showLegend'];
      this.lineChartType = this.chartConfig['defaultType'];
      this.lineChartLabels = this.chartConfig['dataLabels'];
      
      this.chartWidth = this.chartConfig['chartWidth'];
      this.chartHeight = this.chartConfig['chartHeight'];
      this.dottedBackground = this.chartConfig['dottedBackground'];
      this.noChartImage = this.chartConfig['noChartImage'];
      this.removeChartMargin = this.chartConfig['removeChartMargin'];
      this.saveChartProperties = this.chartConfig['chartInnitProperties'];
      this.chartInnitProperties = this.chartConfig['chartInnitProperties'];
      this.allowAnimation = this.chartConfig['allowAnimation'];
      this.driversList = this.chartConfig['driversList'];
      this.chartDataCheck(this.chartConfig['chartValues']);
    });
  }

  setGradientBackground() {
    this.lineChartPlugins = [{
      afterLayout: chart => {
        const ctx = chart.chart.ctx;
        const canvas = <HTMLCanvasElement> document.getElementById('myChart');
        
        let dataset = chart.data.datasets;
        
        dataset.map((item, p) => {
          let gradientStroke = ctx.createLinearGradient(0, 0, 0, canvas.height);
          let gradientStroke2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
          if ( item.hoverColors ) {
            item.hoverColors.map((c, i) => {
              let stop = 1 / (item.hoverColors.length - 1) * i;
              gradientStroke2.addColorStop(stop, c);
            });
            item.hoverBackgroundColor = gradientStroke2;
          }
  
          if ( item.colors ) {
            item.colors.map((c, i) => {
              let stop = 1 / (item.colors.length - 1) * i;
              gradientStroke.addColorStop(stop, c);
            });
  
            item.backgroundColor = gradientStroke;
            
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
  
              item.backgroundColor = gradientStroke;
              item.borderColor = gradientFill;
              item.pointHoverBackgroundColor = gradientFill;
            }
          }
        });
      }
    }
  ];
  }

  chartDataCheck(values) {
    let hasData = false;
    values.map((item, i) => {
      if ( item > 0 ) {
        hasData = true;
      }
    });
    if ( hasData ){
      this.noChartData = false;
    }
  }

  setChartLegendData(elements: any) {
    elements.map((item, i) => {
      const chartValue = item['_chart']['config']['data']['datasets'][i]['data'][elements[i]['_index']];

      this.legendAttributes.map((item2, a) => {
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

  changeChartFillProperty(type: string, color: any) {
    let updateChart = false;
    let startcolorRGBA, endColorRGBA, lineHovered;

    if ( color ) {
      startcolorRGBA = hexToRgbA('#'+color, 0.4);
      endColorRGBA = hexToRgbA('#'+color, 0);
    }

    let averageAnnotation = 0;
    let averageLenght = 0;

    this.chart.chart.config.data.datasets.map((item, i) => {
      if ( item['id'] == type && (color && color != '') ) {
        item['fill'] = true;
        item['colors'] = [startcolorRGBA, endColorRGBA]
        updateChart = true;
        let colorProp = item['borderColor'].toString();
        item['borderColor'] = colorProp.slice(0,7);
        lineHovered = item['borderColor'];
        averageLenght = item['data'].length;
        item['data'].map((val, l) => {
          averageAnnotation = averageAnnotation + val;
        });
      }
      else if ( item['id'] == type && color == '' ) {
        item['fill'] = false;
        updateChart = true;
        let colorProp = item['borderColor'].toString();
        item['borderColor'] = colorProp.slice(0,7);
      }
      else if (item['id'] != type && (color && color != '') ) {
        item['fill'] = false;
        let colorProp = item['borderColor']+'33';
        item['borderColor'] = colorProp.slice(0,9);
        updateChart = true;
      }
      if ( color == '' ) {
        let colorProp = item['borderColor'].toString();
        item['borderColor'] = colorProp.slice(0,7);
      }
    });
    
    const annotationValue = averageAnnotation / averageLenght;
    
    if ( updateChart ) { this.animationDuration = 0; this.setChartOptions(); }
    else { this.animationDuration = 1000; }
    if ( lineHovered ) {
      let config = {
        type: 'horizontal',
        color: lineHovered,
        axis: 'y-axis-0',
        dash: [3, 4]
      }
      this.setHoverAnnotation(annotationValue, config);
    }
    else {
      this.setHoverAnnotation(null);
    }
  }

  insertNewChartData(mod, type, color){
    this.chart.chart.config.data.datasets.map((item, i) => {
      if ( item['id'] == type ) {
        if ( mod == 'add' ) {
          item['hidden'] = false;
          item['borderColor'] = '#'+color;
          item['pointHoverBorderColor'] = '#'+color;
          this.changeChartFillProperty(type, color);
        }
        if ( mod == 'remove' ) { item['hidden'] = true; this.changeChartFillProperty(type, ''); }
      }
    });

    this.animationDuration = 1000;
    this.setChartOptions();
  }

  hoverDoughnut(elements: any, type?) {
    let driverDetails, dataIndex;
    if ( type == 'object' && elements && elements[0] ) { driverDetails = this.driversList[elements[0]['_index']]; dataIndex = elements[0]['_index']; }
    else if ( type == 'number' ) { driverDetails = this.driversList[elements]; dataIndex = elements; }
    this.chart.chart.config.data.datasets[0].data.map((item, i) => {
      if ( i == dataIndex || elements == null ){
        let color = this.chart.chart.config.data.datasets[0].backgroundColor[i];
        let colorProp = color;
        this.chart.chart.config.data.datasets[0].backgroundColor[i] = colorProp.slice(0,7);
      }
      else{
        let color = this.chart.chart.config.data.datasets[0].backgroundColor[i];
        let colorProp = color+'33';
        this.chart.chart.config.data.datasets[0].backgroundColor[i] = colorProp.slice(0,9);
      }
      this.setChartOptions();
    });
    
    if ( driverDetails ) {
      this.chartInnitProperties = [
        {
          name: driverDetails.name,
          value: driverDetails.price,
          percent: driverDetails.percent
        }
      ];
    }
    else {
      this.chartInnitProperties = this.saveChartProperties;
    }
    this.ref.detectChanges();
  }
}