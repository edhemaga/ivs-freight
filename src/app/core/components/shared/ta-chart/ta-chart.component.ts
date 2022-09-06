import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Chart, ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import * as annotation from 'chartjs-plugin-annotation';
import moment from 'moment';
import { hexToRgbA } from '../../../../../assets/utils/methods-global';

@Component({
  selector: 'app-ta-chart',
  templateUrl: './ta-chart.component.html',
  styleUrls: ['./ta-chart.component.scss'],
})
export class TaChartComponent implements OnInit {
  @Input() chartConfig: any;
  @Input() axesProperties: any;
  @Input() legendAttributes: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  lineChartData: ChartDataSets[] = [];
  @ViewChild('hoverDataHolder') hoverDataHolder: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.animationDuration = 0;
    this.setChartOptions();
  }

  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {};
  lineChartColors: Color[] = [];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'bar';
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
  focusCardHovered: boolean = false;
  averageLineCover: string = '';
  gridHoverBackground: boolean = false;
  lastHoveredIndex: number = -1;
  hoveringStatus: boolean = false;
  showHoverData: boolean = false;
  hoverDataPosition: number = 0;
  selectedDataRows: any = [];
  selectedDrivers: any = [];
  dataMaxRows: number = 6;
  hoverTimeDisplay: boolean = false;
  hoveredItemTip: string[];
  hoveredItemTipSave: any;
  hoverChartLeft: number = 0;
  hoverColumnWidth: number = 0;
  hoverColumnHeight: number = 0;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.saveValues = JSON.parse(JSON.stringify(this.legendAttributes));

    let namedChartAnnotation = annotation;
    namedChartAnnotation['id'] = 'annotation';
    Chart.pluginService.register(namedChartAnnotation);
    this.setChartOptions();
    this.setChartData();
  }

  setHoverAnnotation(value: any, config?: any) {
    if (this.lineChartType == 'doughnut') {
      return false;
    }
    let sameValue = false;
    this.annotationConfig = config;
    this.lineChartOptions['annotation']['annotations'].map((item, i) => {
      if (item['id'] == 'a-line-2' && item['value'] == value) {
        sameValue = true;
      }
    });

    if (!sameValue) {
      this.annotationHovered = value;
      this.setChartOptions();
    }
  }

  setChartOptions() {
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutoutPercentage: 90,
      animation: {
        duration: this.chartConfig['allowAnimation']
          ? this.animationDuration
          : 0,
      },
      onHover: (evt, elements) => {
        if (elements?.length) {
          this.hoveringStatus = true;
          this.animationDuration = 0;
          if (
            elements[0]['_index'] != this.lastHoveredIndex ||
            this.lineChartType == 'doughnut'
          ) {
            this.lastHoveredIndex = elements[0]['_index'];
            if (this.legendAttributes?.length) {
              this.setChartLegendData(elements);
            }
            if (this.chartConfig['onHoverAnnotation']) {
              this.setHoverAnnotation(elements[0]['_index']);
            }
            if (this.lineChartType == 'doughnut' && this.driversList?.length) {
              this.hoverDoughnut(elements, 'object');
            }
          }
        } else {
          this.ref.detectChanges();
          if (!this.chartConfig['animationOnlyOnLoad']) {
            this.animationDuration = 1000;
          }
          if (this.chartConfig['onHoverAnnotation']) {
            this.setHoverAnnotation(null);
          }
          if (this.lineChartType == 'doughnut' && this.driversList?.length) {
            this.hoverDoughnut(null);
          }
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
            value: this.chartConfig['annotation']
              ? this.chartConfig['annotation']
              : null,
            borderColor: '#E57373',
            borderWidth: 1,
          },
          {
            id: 'a-line-2',
            type: 'line',
            mode: this.annotationConfig
              ? this.annotationConfig['type']
              : 'vertical',
            scaleID: this.annotationConfig
              ? this.annotationConfig['axis']
              : 'x-axis-0',
            value: this.annotationHovered,
            borderColor: this.annotationConfig
              ? this.annotationConfig['color']
              : '#DADADA',
            borderWidth: 2,
            borderDash: this.annotationConfig
              ? this.annotationConfig['dash']
              : 0,
          },
        ],
      },
      tooltips: {
        enabled: false,
        mode: 'x-axis',
        position: 'average',
        intersect: false,
        custom: (tooltipModel) => {
          if (this.gridHoverBackground && tooltipModel?.dataPoints?.[0]) {
            this.showChartTooltip(tooltipModel.dataPoints[0].index);
          }
        },
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
          backgroundColor: '#fff',
        },
        line: {
          borderWidth: 3,
          fill: false,
        },
      },
      scales: {
        yAxes: [
          {
            stacked: this.chartConfig['stacked']
              ? this.chartConfig['stacked']
              : false,
            display: this.axesProperties['verticalLeftAxes']
              ? this.axesProperties['verticalLeftAxes']['visible']
              : false,
            position: 'left',
            gridLines: {
              display: this.axesProperties['verticalLeftAxes']
                ? this.axesProperties['verticalLeftAxes']['showGridLines']
                : true,
              drawBorder: false,
              borderDash: [2, 3],
              color: '#DADADA',
              zeroLineBorderDash: [2, 3],
              zeroLineColor: '#DADADA',
            },
            ticks: {
              display: false,
              beginAtZero: true,
              stepSize:
                this.axesProperties['verticalLeftAxes'] &&
                this.axesProperties['verticalLeftAxes']['stepSize']
                  ? this.axesProperties['verticalLeftAxes']['stepSize']
                  : 1000,
              max:
                this.axesProperties['verticalLeftAxes'] &&
                this.axesProperties['verticalLeftAxes']['maxValue']
                  ? this.axesProperties['verticalLeftAxes']['maxValue']
                  : 4000,
              min:
                this.axesProperties['verticalLeftAxes'] &&
                this.axesProperties['verticalLeftAxes']['minValue']
                  ? this.axesProperties['verticalLeftAxes']['minValue']
                  : 0,
              fontColor: '#AAAAAA',
              fontSize: 11,
              fontFamily: 'Montserrat',
              padding: 10,
              callback: (value: any) => {
                if (
                  this.axesProperties['verticalLeftAxes'] &&
                  this.axesProperties['verticalLeftAxes']['decimal']
                ) {
                  if (value % 1 === 0) {
                    value = value + '.0';
                  }
                  return value;
                } else {
                  let ranges = [
                    { divider: 1e6, suffix: 'M' },
                    { divider: 1e3, suffix: 'K' },
                  ];
                  function formatNumber(n) {
                    for (let i = 0; i < ranges.length; i++) {
                      if (n >= ranges[i].divider) {
                        return (
                          (n / ranges[i].divider).toString() + ranges[i].suffix
                        );
                      }
                    }
                    return n;
                  }
                  return formatNumber(value);
                }
              },
            },
          },
          {
            stacked: this.chartConfig['stacked']
              ? this.chartConfig['stacked']
              : false,
            display: this.axesProperties['verticalRightAxes']
              ? this.axesProperties['verticalRightAxes']['visible']
              : false,
            gridLines: {
              display: this.axesProperties['verticalRightAxes']
                ? this.axesProperties['verticalRightAxes']['showGridLines']
                : false,
            },
            position: 'right',
            ticks: {
              display: false,
              beginAtZero: true,
              stepSize:
                this.axesProperties['verticalRightAxes'] &&
                this.axesProperties['verticalRightAxes']['stepSize']
                  ? this.axesProperties['verticalRightAxes']['stepSize']
                  : 700,
              max:
                this.axesProperties['verticalRightAxes'] &&
                this.axesProperties['verticalRightAxes']['maxValue']
                  ? this.axesProperties['verticalRightAxes']['maxValue']
                  : 2800,
              min:
                this.axesProperties['verticalRightAxes'] &&
                this.axesProperties['verticalRightAxes']['minValue']
                  ? this.axesProperties['verticalRightAxes']['minValue']
                  : 0,
              fontColor: '#AAAAAA',
              fontFamily: 'Montserrat',
              fontSize: 11,
              padding: -4,
              callback: function (value: any) {
                let ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'K' },
                ];
                function formatNumber(n) {
                  for (let i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (
                        (n / ranges[i].divider).toString() + ranges[i].suffix
                      );
                    }
                  }
                  return n;
                }
                return formatNumber(value);
              },
            },
          },
        ],
        xAxes: [
          {
            type: 'category',
            time: {
              unit: 'month',
              unitStepSize: 1,
              displayFormats: {
                month: 'MMM',
              },
            },
            stacked: this.chartConfig['stacked']
              ? this.chartConfig['stacked']
              : false,
            offset: this.chartConfig['offset']
              ? this.chartConfig['offset']
              : false,
            display: this.axesProperties['horizontalAxes']
              ? this.axesProperties['horizontalAxes']['visible']
              : false,
            position:
              this.axesProperties['horizontalAxes'] &&
              this.axesProperties['horizontalAxes']['position']
                ? this.axesProperties['horizontalAxes']['position']
                : 'bottom',
            gridLines: {
              display: true,
              borderDash: [2, 3],
              zeroLineColor: 'rgba(0, 0, 0, 0)',
              color:
                this.axesProperties['horizontalAxes'] &&
                this.axesProperties['horizontalAxes']['showGridLines']
                  ? '#DADADA'
                  : 'rgba(0, 0, 0, 0)',
            },
            ticks: {
              fontColor:
                this.axesProperties['horizontalAxes'] &&
                this.axesProperties['horizontalAxes']['removeColor']
                  ? 'rgba(0, 0, 0, 0)'
                  : '#AAAAAA',
              fontSize: 11,
              fontFamily: 'Montserrat',
              fontStyle: 'bold',
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        ],
      },
    };
  }

  setChartData() {
    this.chartConfig['dataProperties'].map((item, indx) => {
      const currentChartConfig = item['defaultConfig'];

      if (item['defaultConfig']['hasGradiendBackground']) {
        this.setGradientBackground();
      }

      this.lineChartData.push(currentChartConfig);
      this.lineChartLegend =
        this.chartConfig['defaultType'] != 'doughnut'
          ? this.chartConfig['showLegend']
          : false;
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
      this.gridHoverBackground = this.chartConfig['gridHoverBackground'];
      this.hoverTimeDisplay = this.chartConfig['hoverTimeDisplay'];
      if (this.chartConfig['dataMaxRows']) {
        this.dataMaxRows = this.chartConfig['dataMaxRows'];
      }
      this.chartDataCheck(this.chartConfig['chartValues']);
    });
  }

  setGradientBackground() {
    this.lineChartPlugins = [
      {
        afterLayout: (chart) => {
          const ctx = chart.chart.ctx;
          const canvas = chart.chart.canvas;

          let dataset = chart.data.datasets;

          dataset.map((item, p) => {
            let gradientStroke = ctx.createLinearGradient(
              0,
              0,
              0,
              canvas.height
            );
            let gradientStroke2 = ctx.createLinearGradient(
              0,
              0,
              0,
              canvas.height
            );
            if (item.hoverColors) {
              item.hoverColors.map((c, i) => {
                let stop = (1 / (item.hoverColors.length - 1)) * i;
                gradientStroke2.addColorStop(stop, c);
              });
              item.hoverBackgroundColor = gradientStroke2;
            }

            if (item.colors) {
              item.colors.map((c, i) => {
                let stop = (1 / (item.colors.length - 1)) * i;
                gradientStroke.addColorStop(stop, c);
              });

              item.backgroundColor = gradientStroke;

              if (this.chartConfig['annotation']) {
                const yScale = chart.scales['y-axis-0'];
                const yPos = yScale.getPixelForValue(
                  this.chartConfig['annotation']
                );

                const gradientFill = ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  canvas.height
                );
                gradientFill.addColorStop(0, 'rgb(229, 115, 115)');
                gradientFill.addColorStop(
                  yPos / canvas.height,
                  'rgb(229, 115, 115)'
                );
                gradientFill.addColorStop(
                  yPos / canvas.height,
                  'rgb(109, 130, 199)'
                );
                gradientFill.addColorStop(1, 'rgb(109, 130, 199)');

                gradientStroke.addColorStop(0, 'rgb(239, 154, 154)');
                gradientStroke.addColorStop(
                  yPos / canvas.height,
                  'rgb(255, 255, 255)'
                );
                gradientStroke.addColorStop(
                  yPos / canvas.height,
                  'rgb(189, 202, 235)'
                );
                gradientStroke.addColorStop(1, 'rgb(255, 255, 255)');

                item.backgroundColor = gradientStroke;
                item.borderColor = gradientFill;
                item.pointHoverBackgroundColor = gradientFill;
              }
            }
          });
        },
      },
    ];
  }

  chartDataCheck(values: any[]) {
    let hasData = false;
    values.map((item, i) => {
      if (item > 0) {
        hasData = true;
      }
    });
    if (hasData) {
      this.noChartData = false;
    }
  }

  setChartLegendData(elements: any) {
    let totalValue = 0;
    elements.map((item, i) => {
      const chartValue =
        item['_chart']['config']['data']['datasets'][i]['data'][
          elements[i]['_index']
        ];
      totalValue = totalValue + chartValue;
      this.legendAttributes.map((item2, a) => {
        if (item2['elementId'] == i) {
          item2['value'] = chartValue;
        }

        if (
          item2['elementId'] &&
          item2['elementId'].length &&
          item2['elementId'].length > 0 &&
          item2['elementId'][0] == i
        ) {
          item2['value'] = chartValue[item2['elementId'][1]];
        }

        if (item2['elementId'] == 'total') {
          item2['value'] = totalValue;
        }

        if (item2['titleReplace']) {
          item2['title'] = item2['titleReplace'];
        }
        if (item2['imageReplace']) {
          item2['image'] = item2['imageReplace'];
        }
      });
    });
  }

  changeChartFillProperty(type: string, color: any) {
    let updateChart = false;
    let startcolorRGBA, endColorRGBA, lineHovered;

    if (color) {
      startcolorRGBA = hexToRgbA('#' + color, 0.4);
      endColorRGBA = hexToRgbA('#' + color, 0);
    }

    let averageAnnotation = 0;
    let averageLenght = 0;

    this.chart.chart.config.data.datasets.map((item, i) => {
      if (item['id'] == type && color && color != '') {
        item['fill'] = true;
        item['colors'] = [startcolorRGBA, endColorRGBA];
        updateChart = true;
        let colorProp = item['borderColor'].toString();
        item['borderColor'] = colorProp.slice(0, 7);
        lineHovered = item['borderColor'];
        averageLenght = item['data'].length;
        item['data'].map((val, l) => {
          averageAnnotation = averageAnnotation + val;
        });
      } else if (item['id'] == type && color == '') {
        item['fill'] = false;
        updateChart = true;
        let colorProp = item['borderColor'].toString();
        item['borderColor'] = colorProp.slice(0, 7);
      } else if (item['id'] != type && color && color != '') {
        item['fill'] = false;
        let colorProp = item['borderColor'] + '33';
        item['borderColor'] = colorProp.slice(0, 9);
        updateChart = true;
      }
      if (color == '') {
        let colorProp = item['borderColor'].toString();
        item['borderColor'] = colorProp.slice(0, 7);
      }
    });

    const annotationValue = averageAnnotation / averageLenght;

    if (updateChart) {
      this.animationDuration = 0;
      this.setChartOptions();
    } else {
      this.animationDuration = 1000;
    }
    if (lineHovered) {
      this.focusCardHovered = true;
      this.averageLineCover = lineHovered;
      let config = {
        type: 'horizontal',
        color: lineHovered,
        axis: 'y-axis-0',
        dash: [3, 4],
      };
      this.setHoverAnnotation(annotationValue, config);
    } else {
      this.focusCardHovered = false;
      this.setHoverAnnotation(null);
    }
  }

  insertNewChartData(mod: string, type: string, color: any) {
    this.chart.chart.config.data.datasets.map((item, i) => {
      if (item['id'] == type) {
        if (mod == 'add') {
          item['hidden'] = false;
          item['borderColor'] = '#' + color;
          item['pointHoverBorderColor'] = '#' + color;
          this.changeChartFillProperty(type, color);
        }
        if (mod == 'remove') {
          item['hidden'] = true;
          this.changeChartFillProperty(type, '');
        }
      }
    });

    this.animationDuration = 1000;
    this.setChartOptions();
  }

  hoverDoughnut(elements: any, type?) {
    let driverDetails, dataIndex, showOthers;
    this.animationDuration = 0;
    if (type == 'object' && elements && elements[0]) {
      driverDetails = this.driversList[elements[0]['_index']];
      dataIndex = elements[0]['_index'];
    } else if (type == 'number') {
      driverDetails = this.driversList[elements];
      dataIndex = elements;
    }

    let dataLength = this.chart.chart.config.data.datasets[0].data.length;

    if (dataIndex == dataLength - 1) {
      showOthers = true;
    }
    this.chart.chart.config.data.datasets[0].data.map((item, i) => {
      if (i == dataIndex || elements == null) {
        let color = this.chart.chart.config.data.datasets[0].backgroundColor[i];
        let colorProp = color;
        this.chart.chart.config.data.datasets[0].backgroundColor[i] =
          colorProp.slice(0, 7);
      } else {
        let color = this.chart.chart.config.data.datasets[0].backgroundColor[i];
        let colorProp = color + '33';
        this.chart.chart.config.data.datasets[0].backgroundColor[i] =
          colorProp.slice(0, 9);
      }
    });

    this.setChartOptions();

    if (driverDetails) {
      this.chartInnitProperties = [
        {
          name: driverDetails.name,
          value: driverDetails.price,
          percent: driverDetails.percent,
        },
      ];
    } else {
      if (!showOthers) {
        this.chartInnitProperties = this.saveChartProperties;
      } else {
        let innitProp = [];
        innitProp.push(this.saveChartProperties[1]);
        this.chartInnitProperties = innitProp;
      }
    }

    if (elements == null && this.selectedDrivers?.length) {
      this.chartInnitProperties = [
        {
          name: this.selectedDrivers.length + ' SELECTED',
          percent: '$773.08K',
          value: '',
        },
      ];
    }
    this.ref.detectChanges();
  }

  updateHoverData(value: number) {
    let dataValues = [];
    this.chart.chart.config.data.datasets.map((item, i) => {
      let dataProp = {
        name: item['label'],
        value: item['data'][value],
        percent: this.chartConfig['hasPercentage'] ? '35.45%' : null,
        color: item['borderColor'],
      };
      if (!item['hidden']) {
        dataValues.push(dataProp);
      }
    });

    if (this.chartConfig['multiHoverData']) {
      let dataPropMulti = [
        {
          name: 'Price per Gallon',
          value: 23,
          percent: null,
          color: '#919191',
        },
        {
          name: 'Load Rate per Mile',
          value: 23,
          percent: null,
          color: '#CCCCCC',
        },
      ];

      dataPropMulti.map((item, i) => {
        dataValues.push(item);
      });
    }

    this.selectedDataRows = dataValues;
  }

  chartUpdated(data: any[]) {
    this.chart.chart.config.data.datasets[0].data = data;
    this.setChartOptions();
  }

  updateMuiliBar(
    selectedStates: any[],
    data: any[],
    colors: any[],
    hoverColors: any[]
  ) {
    let updateData = [];
    selectedStates.map((item, i) => {
      let dataArray = {
        backgroundColor: '#' + colors[item['id']],
        borderColor: '#' + colors[item['id']],
        hoverBackgroundColor: '#' + hoverColors[item['id']],
        data: data,
        label: item['name'],
        type: 'bar',
        yAxisID: 'y-axis-0',
        id: item['id'],
      };

      updateData.push(dataArray);
    });

    this.updateMultiBarDataInsert(updateData);
  }

  updateMultiBarDataInsert(updateData: any[]) {
    updateData.map((item, i) => {
      let sameFound = false;
      this.chart.chart.config.data.datasets.map((ch, a) => {
        if (ch['id'] == 'top10' || ch['id'] == 'allOthers') {
          ch.hidden = true;
        }
        if (item['id'] == ch['id']) {
          sameFound = true;
        }
      });

      if (!sameFound) {
        this.chart.chart.config.data.datasets.push(item);
      }
    });
    this.setChartOptions();
  }

  removeMultiBarData(removedData: any[], showDefault?: boolean) {
    this.chart.chart.config.data.datasets.map((ch, a) => {
      if (ch['id'] == removedData['id']) {
        this.chart.chart.config.data.datasets.splice(a, 1);
      }

      if (showDefault && ch.hidden == true) {
        ch.hidden = false;
      }
    });
    this.setChartOptions();
  }

  hoverBarChart(hoveredData: any) {
    this.animationDuration = 0;
    this.chart.chart.config.data.datasets.map((item, i) => {
      if (hoveredData == null || item['id'] == hoveredData['id']) {
        let color = item.backgroundColor;
        let colorProp = color.toString();
        item.backgroundColor = colorProp.slice(0, 7);
      } else {
        let color = item.backgroundColor;
        let colorProp = color + '33';
        item.backgroundColor = colorProp.slice(0, 9);
      }
    });
    this.setChartOptions();
  }

  updateTime(ev: any, period?: string) {
    this.animationDuration = 1000;
    let range = 0,
      type,
      value = [],
      indicator,
      format,
      removeEvery = 2,
      removeIndex = 0,
      rangeIndicator = 20,
      periodFormat = 0,
      periodIndex = 0;

    switch (ev) {
      case 'All Time':
        range = 25;
        type = 'M';
        format = 'MMM YYYY';
        break;
      case 'WTD':
        range = moment().day();
        type = 'days';
        format = 'D ddd';
        indicator = moment().clone().startOf('isoWeek');

        if (period == '6 Hours' || period == 'Semi-Daily') {
          range =
            moment().day() == 1
              ? moment().hour() + 1
              : (moment().day() - 1) * 24 + moment().hour() + 1;
          type = 'hours';
          format = 'hh A';
          indicator = moment().clone().startOf('isoWeek');
          periodFormat = period == '6 Hours' ? 6 : 12;
        }
        break;
      case 'MTD':
        range = moment().date();
        type = 'days';
        format = 'D ddd';
        indicator = moment().clone().startOf('month');
        periodFormat = period == 'Weekly' ? 7 : period == 'Semi-Weekly' ? 3 : 0;
        break;
      case 'YTD':
        range = moment().month() + 1;
        type = 'M';
        format = 'MMM';
        indicator = moment().clone().startOf('year');
        if (period == 'Weekly' || period == 'Semi-Monthly') {
          range = moment().dayOfYear();
          type = 'days';
          format = 'D MMM';
          indicator = moment().clone().startOf('year');
          periodFormat = period == 'Weekly' ? 7 : 15;
        }
        break;
      case 'Today':
        range = moment().hour() + 1;
        type = 'hours';
        format = 'hh A';
        indicator = moment().clone().startOf('day');
        rangeIndicator = 10;
        periodFormat = period == '3 Hours' ? 3 : period == '6 Hours' ? 6 : 0;
        break;
      case 'Custom Set':
        type = 'days';
        format = 'D MMM';
        const fromDate = moment(period[0]);
        const toDate = moment(period[1]);
        const diff = toDate.diff(fromDate, type);
        indicator = fromDate;
        range = diff + 1;
    }

    for (let a = 0; a < range; a++) {
      if (periodIndex == periodFormat) {
        periodIndex = 0;
        value.push(moment(indicator).add(a, type));
      }
      if (periodFormat != 0) {
        periodIndex++;
      }
    }

    this.chart.chart.config.data.labels.map((item, i) => {
      this.chart.chart.config.data.labels.splice(
        i,
        this.chart.chart.config.data.labels.length
      );
    });

    value.map((item, i) => {
      let timePeriodCheck = moment(item).format('LT').split(' ')[1];
      let finalFormat = format;
      finalFormat =
        period == 'Semi-Daily' && timePeriodCheck == 'AM' ? 'DD MMM' : format;

      item = item.format(finalFormat).toUpperCase();
      let weekDaySep = item.split(' ');
      removeIndex++;
      if (value.length > rangeIndicator && removeIndex == removeEvery) {
        removeIndex = 0;
        weekDaySep[0] = '';
        weekDaySep[1] = '';
      }
      if (ev == 'Today') {
        this.chart.chart.config.data.labels.push(
          weekDaySep[0] + ' ' + weekDaySep[1]
        );
      } else if (
        ev == 'WTD' ||
        ev == 'MTD' ||
        ev == 'Custom Set' ||
        (ev == 'YTD' && (period == 'Weekly' || period == 'Semi-Monthly'))
      ) {
        this.chart.chart.config.data.labels.push([
          weekDaySep[0],
          weekDaySep[1],
        ]);
      } else {
        let insertData =
          weekDaySep?.length > 1 && weekDaySep[0] == 'JAN'
            ? weekDaySep[1]
            : weekDaySep[0];
        periodIndex = 0;
        this.chart.chart.config.data.labels.push(insertData);
      }
    });

    this.setChartOptions();
  }

  showChartTooltip(value) {
    this.animationDuration = 0;
    this.hoveringStatus = true;
    const canvas = this.chart.chart.canvas;
    const ctx = this.chart.chart.ctx;

    let xPoint1 = 0;
    let xPoint2 = 0;

    setTimeout(() => {
      const xAxis = this.chart.chart['scales']['x-axis-0'];
      const yAxis = this.chart.chart['scales']['y-axis-0'];

      if (xAxis['_gridLineItems']) {
        xPoint1 = xAxis['_gridLineItems'][1]['x1'];
        xPoint2 = xAxis['_gridLineItems'][0]['x2'];
        const elWidth = xPoint1 - xPoint2;
        if (this.axesProperties?.horizontalAxes?.showGridLines) {
          xAxis['_gridLineItems'].map((item, i) => {
            if (i) {
              xAxis['_gridLineItems'][i].color = '#DADADA';
            }
            if (i == value || i == value + 1) {
              xAxis['_gridLineItems'][i].color = 'transparent';
            }
          });
        }

        if (
          xAxis['_gridLineItems'][value] &&
          this.chartConfig['hasHoverData']
        ) {
          this.updateHoverData(value);
          let oversizedHover = false;
          this.hoverColumnWidth = elWidth + 1;
          this.hoverChartLeft = xAxis['_gridLineItems'][value]['x2'] - 1;

          let clientWidth = this.hoverDataHolder
            ? this.hoverDataHolder.nativeElement.offsetWidth + 16
            : 0;

          this.hoverColumnHeight = this.chartConfig[
            'startGridBackgroundFromZero'
          ]
            ? yAxis.height
            : this.chartConfig['multiChartHover']
            ? yAxis.height + xAxis.height + 40
            : yAxis.height + xAxis.height;

          let xPos = this.chartConfig['offset']
            ? xAxis['_gridLineItems'][value]['x2'] + elWidth
            : xAxis['_gridLineItems'][value]['x2'];

          if (
            this.hoverDataHolder &&
            this.hoverDataHolder.nativeElement &&
            xPos + clientWidth > canvas.width
          ) {
            oversizedHover = true;
          }
          if (oversizedHover) {
            this.hoverDataPosition = xPos - clientWidth - elWidth - 4;
          } else {
            this.hoverDataPosition = xPos + 4;
          }
        }
      }
    });

    this.showHoverData = true;
    this.ref.detectChanges();
  }

  chartHoverOut() {
    this.showHoverData = false;
    this.hoveringStatus = false;

    const xAxis = this.chart.chart['scales']['x-axis-0'];

    if (
      xAxis['_gridLineItems'] &&
      this.axesProperties?.horizontalAxes?.showGridLines
    ) {
      xAxis['_gridLineItems'].map((item, i) => {
        if (i) {
          xAxis['_gridLineItems'][i].color = '#DADADA';
        }
      });
    }
  }
}
