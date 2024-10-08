// import {
//     Component,
//     Input,
//     OnInit,
//     ViewChild,
//     ChangeDetectorRef,
//     ElementRef,
//     HostListener,
//     Output,
//     EventEmitter,
//     SimpleChanges,
//     OnChanges,
// } from '@angular/core';
// import moment from 'moment';
// import { CommonModule } from '@angular/common';
// import { AngularSvgIconModule } from 'angular-svg-icon';
// import { FormsModule } from '@angular/forms';

// //chart directives
// import {
//     Chart,
//     ChartColor,
//     ChartDataSets,
//     ChartOptions,
//     ChartPoint,
//     ChartType,
//     GridLineOptions,
// } from 'chart.js';
// // import { ChartsModule } from 'ng2-charts';
// // import { BaseChartDirective, Color, Label } from 'ng2-charts';
// import * as annotation from 'chartjs-plugin-annotation';

// // helpers
// import { NFormatterPipe } from '@shared/pipes/n-formatter.pipe';
// import { ChartHelper } from '@shared/components/ta-chart/utils/helpers/chart.helper';

// // models
// import { AnnotationConfig } from '@shared/components/ta-chart/models/annotation-config.model';
// import { Axis } from '@shared/components/ta-chart/models/axis.model';
// import { BasicChartConfig } from '@shared/components/ta-chart/models/basic-chart-config.model';
// import { ChartDataProperties } from '@shared/components/ta-chart/models/chart-data-properties.model';
// import { LegendAttributes } from '@shared/components/ta-chart/models/legend-attributes.model';
// import { OnHoverProperties } from '@shared/components/ta-chart/models/on-hover-properties.model';

// // enums
// import { ChartAxisPositionEnum } from '@shared/components/ta-chart/enums/chart-axis-position-string.enum';
// import { ChartAnnotationPositionStringEnum } from '@shared/components/ta-chart/enums/chart-annotation-position-string.enum';

// // Properties from dashboard
// import { BarChartAxes } from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';
// import { TopRatedListItem } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-list-item.model';
// import { ChartInitProperties } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';
// import { ByStateListItem } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-list-item.model';
// import { ChartConstants } from '@shared/components/ta-chart/utils/constants/chart.constants';

// @Component({
//     selector: 'app-ta-chart',
//     templateUrl: './ta-chart.component.html',
//     styleUrls: ['./ta-chart.component.scss'],
//     standalone: true,
//     imports: [
//         CommonModule,
//         AngularSvgIconModule,
//         FormsModule,
//        // ChartsModule,
//         NFormatterPipe,
//     ],
// })
// export class TaChartComponent implements OnInit, OnChanges {
//     @Input() public chartConfig: BasicChartConfig;
//     @Input() public axesProperties: BarChartAxes;
//     @Input() public legendAttributes: LegendAttributes[];
//     @Input() public multipleVerticalLeftAxes: number[];
//     @Input() public annotationConfig: AnnotationConfig;

//    // @ViewChild(BaseChartDirective) public chart: BaseChartDirective;
//     @ViewChild('hoverDataHolder') public hoverDataHolder: ElementRef;
//     @ViewChild('baseChart') public baseChart: Element;
//     @ViewChild('chartToolTip') public chartToolTip: Element;

//     @Output() hoverOtherChart: EventEmitter<number> = new EventEmitter();
//     @Output() chartHovered: EventEmitter<boolean> = new EventEmitter();

//     @HostListener('window:resize', ['$event'])
//     onResize() {
//         this.animationDuration = 0;
//         this.setChartOptions();
//     }

//     //chart configuration
//     public lineChartData: ChartDataSets[] = [];
//     // public lineChartLabels: Label[] = [];
//     // public lineChartOptions: ChartOptions = {};
//     // public lineChartColors: Color[] = [];
//     public lineChartLegend: boolean = false;
//     public lineChartType: ChartType = 'bar';
//     public lineChartPlugins = [];

//     //chart properties
//     public chartInnitProperties: ChartInitProperties[] = [];
//     private saveChartProperties: ChartInitProperties[] = [];

//     //legend
//     public doughnutChartLegend: boolean = false;
//     public saveValues: LegendAttributes[] = [];

//     //chart style
//     public chartWidth: string = '';
//     public chartHeight: string = '';
//     public dottedBackground: boolean = false;
//     public noChartData: boolean = true;
//     public noChartImage: string = '';
//     public removeChartMargin: boolean = false;
//     public selectedColors: string[];
//     public selectedHoverColors: string[];
//     public averageLineCover: string = '';

//     //hovers and animations
//     private annotationHovered: number;
//     private animationDuration: number = 1000;
//     public allowAnimation: boolean;
//     public focusCardHovered: boolean = false;
//     public gridHoverBackground: boolean = false;
//     private lastHoveredIndex: number = -1;
//     public hoveringStatus: boolean = false;
//     public showHoverData: boolean = false;
//     public hoverDataPosition: number = 0;
//     public hoverTimeDisplay: boolean = false;
//     public hoveredItemTip: string[];
//     public hoverChartLeft: number = 0;
//     public hoverColumnWidth: number = 0;
//     public hoverColumnHeight: number = 0;
//     public toolTipData: any = [];
//     public hoverDateTitle: string = '';
//     public tooltipLeft: number;
//     public tooltipHeight: number;

//     //basic config
//     public driversList: TopRatedListItem[];
//     public selectedDataRows: OnHoverProperties[];
//     public selectedDrivers: TopRatedListItem[];
//     public dataMaxRows: number = 6;
//     private monthList: string[] = ChartConstants.MONTH_LIST;
//     public barChartTooltipDateTitle: string;

//     constructor(private ref: ChangeDetectorRef) {}

//     ngOnInit(): void {
//         this.setLegendSaveValues();

//         this.annotationInitialize();
//         this.setChartOptions();
//         this.setChartData();
//     }

//     ngOnChanges(changes: SimpleChanges) {
//         // if (this.chart) {
//         //     this.chart.chart.config.data.datasets[0] =
//         //         changes.chartConfig.currentValue.dataProperties[0].defaultConfig;

//         //     if (changes.chartConfig.currentValue.dataProperties.length > 1) {
//         //         this.chart.chart.config.data.datasets[1] =
//         //             changes.chartConfig.currentValue.dataProperties[1]?.defaultConfig;
//         //     }

//         //     this.driversList = changes.chartConfig.currentValue.driversList;
//         //     this.saveChartProperties =
//         //         changes.chartConfig.currentValue.chartInnitProperties;

//         //     this.lineChartLabels = changes.chartConfig.currentValue.dataLabels;

//         //     this.setChartOptions();

//         //     this.ref.detectChanges();
//         // }
//     }

//     public trackByIdentity = (index: number): number => index;

//     private setChartOptions(): void {
//         // this.lineChartOptions = {
//         //     responsive: this.chartConfig['dontUseResponsive'] ? false : true,
//         //     maintainAspectRatio: false,
//         //     cutoutPercentage: 90,
//         //     animation: {
//         //         duration: this.chartConfig['allowAnimation']
//         //             ? this.animationDuration
//         //             : 0,
//         //     },
//         //     onHover: (evt, elements: any) => {
//         //         if (elements?.length) {
//         //             this.hoveringStatus = true;
//         //             this.animationDuration = 0;
//         //             this.lastHoveredIndex = elements[0]['_index'];
//         //             if (this.toolTipData?.length) {
//         //                 this.setToolTipTitle(this.lastHoveredIndex);
//         //             }
//         //             if (this.legendAttributes?.length) {
//         //                 this.setChartLegendData(elements);
//         //             }

//         //             if (
//         //                 this.lineChartType == 'doughnut' &&
//         //                 this.driversList?.length
//         //             ) {
//         //                 this.hoverDoughnut(elements, 'object');
//         //             }
//         //         } else {
//         //             if (!this.chartConfig['animationOnlyOnLoad']) {
//         //                 this.animationDuration = 1000;
//         //             }

//         //             if (
//         //                 this.lineChartType == 'doughnut' &&
//         //                 this.driversList?.length
//         //             ) {
//         //                 this.hoverDoughnut(null);
//         //             }

//         //             setTimeout(() => {
//         //                 if (!this.hoveringStatus) {
//         //                     this.legendAttributes = JSON.parse(
//         //                         JSON.stringify(this.saveValues)
//         //                     );
//         //                 }
//         //                 this.ref.detectChanges();
//         //             }, 500);
//         //         }
//         //     },
//         //     annotation: {
//         //         drawTime: 'beforeDatasetsDraw',
//         //         annotations: [
//         //             {
//         //                 id: 'a-line-1',
//         //                 type: 'line',
//         //                 mode: 'horizontal',
//         //                 scaleID: 'y-axis-0',
//         //                 value: this.chartConfig['annotation']
//         //                     ? this.chartConfig['annotation']
//         //                     : null,
//         //                 borderColor: '#E57373',
//         //                 borderWidth: 1,
//         //             },
//         //             {
//         //                 id: 'a-line-2',
//         //                 type: 'line',
//         //                 mode:
//         //                     this.annotationConfig &&
//         //                     [
//         //                         ChartAnnotationPositionStringEnum.HORIZONTAL as string,
//         //                         ChartAnnotationPositionStringEnum.VERTICAL,
//         //                     ].includes(this.annotationConfig.type)
//         //                         ? (this.annotationConfig.type as
//         //                               | ChartAnnotationPositionStringEnum.HORIZONTAL
//         //                               | ChartAnnotationPositionStringEnum.VERTICAL)
//         //                         : ChartAnnotationPositionStringEnum.VERTICAL,
//         //                 scaleID: this.annotationConfig
//         //                     ? this.annotationConfig.axis
//         //                     : 'x-axis-0',
//         //                 value: this.annotationHovered,
//         //                 borderColor: this.annotationConfig
//         //                     ? this.annotationConfig.color
//         //                     : '#DADADA',
//         //                 borderWidth: 2,
//         //                 borderDash:
//         //                     this.annotationConfig &&
//         //                     Array.isArray(this.annotationConfig.dash)
//         //                         ? this.annotationConfig.dash
//         //                         : this.annotationConfig &&
//         //                           typeof this.annotationConfig.dash === 'number'
//         //                         ? [this.annotationConfig.dash]
//         //                         : [],
//         //             },
//         //         ],
//         //     },
//         //     tooltips: {
//         //         enabled: false,
//         //         mode: 'x-axis',
//         //         position: 'average',
//         //         intersect: false,
//         //         custom: (tooltipModel) => {
//         //             if (tooltipModel?.dataPoints?.[0]) {
//         //                 this.showChartTooltip(tooltipModel.dataPoints[0].index);

//         //                 if (this.chartConfig.showHoverTooltip) {
//         //                     this.calculateTooltipPosition(tooltipModel.caretX);
//         //                 }
//         //             }
//         //         },
//         //     },
//         //     plugins: {
//         //         datalabels: {
//         //             formatter: () => {
//         //                 return null;
//         //             },
//         //         },
//         //     },
//         //     elements: {
//         //         point: {
//         //             radius: 3,
//         //             borderWidth: 2,
//         //             backgroundColor: '#fff',
//         //         },
//         //         line: {
//         //             borderWidth: 3,
//         //             fill: false,
//         //         },
//         //     },
//         //     scales: {
//         //         yAxes: this.setChartAxis(),
//         //         xAxes: [
//         //             {
//         //                 type: 'category',
//         //                 time: {
//         //                     unit: 'month',
//         //                     unitStepSize: 1,
//         //                     displayFormats: {
//         //                         month: 'MMM',
//         //                     },
//         //                 },
//         //                 stacked: this.chartConfig['stacked']
//         //                     ? this.chartConfig['stacked']
//         //                     : false,
//         //                 offset: this.chartConfig['offset']
//         //                     ? this.chartConfig['offset']
//         //                     : false,
//         //                 display: this.axesProperties['horizontalAxes']
//         //                     ? this.axesProperties['horizontalAxes']['visible']
//         //                     : false,
//         //                 position:
//         //                     this.axesProperties['horizontalAxes'] &&
//         //                     this.axesProperties['horizontalAxes']['position']
//         //                         ? this.axesProperties['horizontalAxes'][
//         //                               'position'
//         //                           ]
//         //                         : 'bottom',
//         //                 gridLines: {
//         //                     display: true,
//         //                     borderDash: [2, 3],
//         //                     zeroLineColor: 'rgba(0, 0, 0, 0)',
//         //                     color:
//         //                         this.axesProperties['horizontalAxes'] &&
//         //                         this.axesProperties['horizontalAxes'][
//         //                             'showGridLines'
//         //                         ]
//         //                             ? '#DADADA'
//         //                             : 'rgba(0, 0, 0, 0)',
//         //                 },
//         //                 ticks: {
//         //                     fontColor:
//         //                         this.axesProperties['horizontalAxes'] &&
//         //                         this.axesProperties['horizontalAxes'][
//         //                             'removeColor'
//         //                         ]
//         //                             ? 'rgba(0, 0, 0, 0)'
//         //                             : '#919191',
//         //                     fontSize: 11,
//         //                     fontFamily: 'Montserrat',
//         //                     fontStyle: '500',
//         //                     autoSkip: true,
//         //                     autoSkipPadding: 12,
//         //                     maxRotation: 0,
//         //                     minRotation: 0,
//         //                 },
//         //             },
//         //         ],
//         //     },
//         // };
//     }

//     public setChartData(): void {
//         // this.chartConfig['dataProperties'].map((item) => {
//         //     const currentChartConfig = item['defaultConfig'];

//         //     if (item['defaultConfig']['hasGradiendBackground']) {
//         //         this.setGradientBackground();
//         //     }

//         //     this.lineChartData.push(currentChartConfig);
//         //     this.lineChartLegend =
//         //         this.chartConfig['defaultType'] != 'doughnut'
//         //             ? this.chartConfig['showLegend']
//         //             : false;
//         //     this.doughnutChartLegend = this.chartConfig['showLegend'];
//         //     this.lineChartType = this.chartConfig['defaultType'];
//         //     this.lineChartLabels = this.chartConfig['dataLabels'];

//         //     this.selectedDrivers = this.chartConfig.driversList;

//         //     this.chartWidth = this.chartConfig['chartWidth'];
//         //     this.chartHeight = this.chartConfig['chartHeight'];
//         //     this.dottedBackground = this.chartConfig['dottedBackground'];
//           this.noChartImage = this.chartConfig['noChartImage'];
//         //     this.removeChartMargin = this.chartConfig['removeChartMargin'];
//         //     this.saveChartProperties = this.chartConfig['chartInnitProperties'];
//         //     this.chartInnitProperties =
//         //         this.chartConfig['chartInnitProperties'];
//         //     this.allowAnimation = this.chartConfig['allowAnimation'];
//         //     this.driversList = this.chartConfig['driversList'];
//         //     this.gridHoverBackground = this.chartConfig['gridHoverBackground'];
//         //     this.hoverTimeDisplay = this.chartConfig['hoverTimeDisplay'];
//         //     if (this.chartConfig['dataMaxRows']) {
//         //         this.dataMaxRows = this.chartConfig['dataMaxRows'];
//         //     }
//         //     this.chartDataCheck(this.chartConfig['chartValues']);
//         // });
//     }

//     public updateChartData(hideAnimation: boolean): void {
//         this.chartConfig['dataProperties'].map(() => {
//             this.lineChartType = this.chartConfig['defaultType'];
//             //this.lineChartLabels = this.chartConfig['dataLabels'];
//         });

//         this.animationDuration = !hideAnimation ? 1000 : 0;
//         this.setChartOptions();
//         this.ref.detectChanges();
//     }

//     private setGradientBackground(): void {
//         this.lineChartPlugins = [
//             {
//                 afterLayout: (chart) => {
//                     const ctx = chart?.chart?.ctx;
//                     const canvas = chart.chart.canvas;

//                     let dataset = chart.data.datasets;

//                     dataset.map((item) => {
//                         let gradientStroke = ctx?.createLinearGradient(
//                             0,
//                             0,
//                             0,
//                             canvas.height
//                         );
//                         let gradientStroke2 = ctx?.createLinearGradient(
//                             0,
//                             0,
//                             0,
//                             canvas.height
//                         );
//                         if (item.hoverColors) {
//                             item.hoverColors.map(
//                                 (color: string, index: number) => {
//                                     let stop =
//                                         (1 / (item.hoverColors.length - 1)) *
//                                         index;
//                                     gradientStroke2.addColorStop(stop, color);
//                                 }
//                             );
//                             item.hoverBackgroundColor = gradientStroke2;
//                         }

//                         if (item.colors) {
//                             item.colors.map((color: string, index: number) => {
//                                 let stop =
//                                     (1 / (item.colors.length - 1)) * index;
//                                 gradientStroke.addColorStop(stop, color);
//                             });

//                             item.backgroundColor = gradientStroke;

//                             if (this.chartConfig['annotation']) {
//                                 const yScale = chart.scales['y-axis-0'];
//                                 const yPos = yScale.getPixelForValue(
//                                     this.chartConfig['annotation']
//                                 );

//                                 const gradientFill = ctx?.createLinearGradient(
//                                     0,
//                                     0,
//                                     0,
//                                     canvas.height
//                                 );
//                                 gradientFill.addColorStop(
//                                     0,
//                                     'rgb(229, 115, 115)'
//                                 );
//                                 gradientFill.addColorStop(
//                                     yPos / canvas.height,
//                                     'rgb(229, 115, 115)'
//                                 );
//                                 gradientFill.addColorStop(
//                                     yPos / canvas.height,
//                                     'rgb(109, 130, 199)'
//                                 );
//                                 gradientFill.addColorStop(
//                                     1,
//                                     'rgb(109, 130, 199)'
//                                 );

//                                 gradientStroke.addColorStop(
//                                     0,
//                                     'rgb(239, 154, 154)'
//                                 );
//                                 gradientStroke.addColorStop(
//                                     yPos / canvas.height,
//                                     'rgb(255, 255, 255)'
//                                 );
//                                 gradientStroke.addColorStop(
//                                     yPos / canvas.height,
//                                     'rgb(189, 202, 235)'
//                                 );
//                                 gradientStroke.addColorStop(
//                                     1,
//                                     'rgb(255, 255, 255)'
//                                 );

//                                 item.backgroundColor = gradientStroke;
//                                 item.borderColor = gradientFill;
//                                 item.pointHoverBackgroundColor = gradientFill;
//                             }
//                         }
//                     });
//                 },
//             },
//         ];
//     }

//     public chartDataCheck(values: number[]): void {
//         let hasData = false;
//         values.map((item) => {
//             if (item > 0) {
//                 hasData = true;
//             }
//         });

//         //this.noChartData = hasData ? false : true;
//     }

//     private setChartLegendData(elements: any): void {
//         let totalValue = 0;
//         elements.map((item, i) => {
//             const chartValue =
//                 item['_chart']['config']['data']['datasets'][i]['data'][
//                     elements[i]['_index']
//                 ];
//             totalValue = totalValue + chartValue;
//             this.legendAttributes.map((item2) => {
//                 if (this.chartConfig.hasSameDataIndex) {
//                     if (!item2.elementId) {
//                         item2.value = Math.abs(
//                             item['_chart']['config']['data']['datasets'][0][
//                                 'data'
//                             ][elements[0]['_index']]
//                         );
//                     } else if (item2.elementId === 1) {
//                         item2.value = Math.abs(
//                             Math.abs(
//                                 item['_chart']['config']['data']['datasets'][1][
//                                     'data'
//                                 ][elements[0]['_index']]
//                             )
//                         );
//                     }
//                 } else {
//                     if (item2['elementId'] == i) {
//                         item2['value'] = Math.abs(chartValue);
//                     }
//                 }

//                 if (
//                     item2['elementId'] &&
//                     (typeof item2['elementId'] === 'string' ||
//                         Array.isArray(item2['elementId'])) &&
//                     item2['elementId'].length &&
//                     (Array.isArray(item2['elementId'])
//                         ? item2['elementId'][0]
//                         : item2['elementId']) == i
//                 ) {
//                     item2['value'] =
//                         chartValue[
//                             Array.isArray(item2['elementId'])
//                                 ? item2['elementId'][1]
//                                 : item2['elementId']
//                         ];
//                 }

//                 if (item2['elementId'] == 'total') {
//                     item2['value'] = totalValue;
//                 }

//                 if (item2['titleReplace']) {
//                     item2['title'] = item2['titleReplace'];
//                 }
//                 if (item2['imageReplace']) {
//                     item2['image'] = item2['imageReplace'];
//                 }
//             });
//         });
//     }

//     public changeChartFillProperty(type: string, color: string): void {
//         // let updateChart = false;
//         // let startcolorRGBA, endColorRGBA, lineHovered;

//         // if (color) {
//         //     startcolorRGBA = ChartHelper.hexToRgbA('#' + color, 0.4);
//         //     endColorRGBA = ChartHelper.hexToRgbA('#' + color, 0);
//         // }

//         // let averageAnnotation = 0;

//         // this.chart.chart.config.data.datasets.map((item) => {
//         //     if (item['id'] == type && color && color != '') {
//         //         item['fill'] = true;
//         //         item['colors'] = [startcolorRGBA, endColorRGBA];
//         //         updateChart = true;
//         //         let colorProp = item['borderColor']?.toString();
//         //         item['borderColor'] = colorProp?.slice(0, 7);
//         //         lineHovered = item['borderColor'];
//         //         item['data'].map((val: number | number[] | ChartPoint) => {
//         //             if (typeof val === 'number') {
//         //                 averageAnnotation += val;
//         //             } else if (Array.isArray(val)) {
//         //                 averageAnnotation += val.reduce(
//         //                     (acc, curr) => acc + curr,
//         //                     0
//         //                 );
//         //             }
//         //         });
//         //     } else if (item['id'] == type && color == '') {
//         //         item['fill'] = false;
//         //         updateChart = true;
//         //         let colorProp = item['borderColor']?.toString();
//         //         item['borderColor'] = colorProp?.slice(0, 7);
//         //     } else if (item['id'] != type && color && color != '') {
//         //         item['fill'] = false;
//         //         let colorProp = item['borderColor'] + '33';
//         //         item['borderColor'] = colorProp?.slice(0, 9);
//         //         updateChart = true;
//         //     }
//         //     if (color == '') {
//         //         let colorProp = item['borderColor']?.toString();
//         //         item['borderColor'] = colorProp?.slice(0, 7);
//         //     }
//         // });

//         // if (updateChart) {
//         //     this.animationDuration = 0;
//         //     this.setChartOptions();
//         // } else {
//         //     this.animationDuration = 1000;
//         // }
//         // if (lineHovered) {
//         //     this.focusCardHovered = true;
//         //     this.averageLineCover = lineHovered;
//         // } else {
//         //     this.focusCardHovered = false;
//         // }
//     }

//     public insertNewChartData(mod: string, type: string, color: number): void {
//         // this.chart.chart.config.data.datasets.map((item) => {
//         //     if (item['id'] == type) {
//         //         if (mod == 'add') {
//         //             item['hidden'] = false;
//         //             item['borderColor'] = '#' + color;
//         //             item['pointHoverBorderColor'] = '#' + color;
//         //         }
//         //         if (mod == 'remove') {
//         //             item['hidden'] = true;
//         //         }
//         //     }
//         // });

//         this.animationDuration = 1000;

//         this.setChartOptions();

//         this.ref.detectChanges();
//     }

//     public resetLineChartData(): void {
//         // for (let i = 0; i < this.chart.chart.config.data.datasets.length; i++) {
//         //     this.chart.chart.config.data.datasets[i].hidden = true;

//         //     this.setChartOptions();

//         //     this.ref.detectChanges();
//         // }
//     }

//     public hoverDoughnut(elements: number, type?: string): void {
//         // let driverDetails, dataIndex, showOthers;
//         // this.animationDuration = 0;
//         // if (type == 'object' && elements && elements[0]) {
//         //     driverDetails = this.driversList[elements[0]['_index']];
//         //     dataIndex = elements[0]['_index'];
//         // } else if (type == 'number') {
//         //     driverDetails = this.driversList[elements];
//         //     dataIndex = elements;
//         // }

//         // let dataLength = this.chart.chart.config.data.datasets[0].data.length;

//         // if (dataIndex >= dataLength - 1) {
//         //     showOthers = true;
//         // }

//         // this.chart.chart.config.data.datasets[0].data.map(
//         //     (item: number | number[] | ChartPoint, i: number) => {
//         //         if (i === dataIndex || !elements) {
//         //             const color =
//         //                 this.chart.chart.config.data.datasets[0]
//         //                     .backgroundColor[i];

//         //             let colorProp = color;
//         //             this.chart.chart.config.data.datasets[0].backgroundColor[
//         //                 i
//         //             ] = colorProp.slice(0, 7);
//         //         } else {
//         //             const color =
//         //                 this.chart.chart.config.data.datasets[0]
//         //                     .backgroundColor[i];
//         //             let colorProp = color + '33';
//         //             this.chart.chart.config.data.datasets[0].backgroundColor[
//         //                 i
//         //             ] = colorProp.slice(0, 9);
//         //         }
//         //     }
//         // );

//         this.setChartOptions();

//         // if (driverDetails) {
//         //     this.chartInnitProperties = [
//         //         {
//         //             percent: driverDetails.percent,
//         //             value: driverDetails.value,
//         //             name: driverDetails.name,
//         //         },
//         //     ];
//         // } else {
//         //     const anySelected = this.selectedDrivers.some(
//         //         (item) => item.isSelected
//         //     );

//         //     if (!showOthers) {
//         //         if (anySelected) {
//         //             this.chartInnitProperties = [
//         //                 {
//         //                     value: this.chartConfig.chartInnitProperties[0]
//         //                         .value,
//         //                     name: this.chartConfig.chartInnitProperties[0].name,
//         //                 },
//         //             ];
//         //         } else {
//         //             this.chartInnitProperties = this.saveChartProperties;
//         //         }
//         //     } else {
//         //         let innitProp = [];
//         //         innitProp.push(this.saveChartProperties[1]);
//         //         this.chartInnitProperties = innitProp;
//         //     }
//         // }

//         this.animationDuration = 1000;

//         setTimeout(() => {
//             this.ref.detectChanges();
//         }, 100);
//     }

//     private updateHoverData(value: number): void {
//         // if (this.chartConfig.dataTooltipLabels)
//         //     this.barChartTooltipDateTitle =
//         //         this.chartConfig.dataTooltipLabels[value];

//         // let dataValues = [];
//         // this.chart.chart.config.data.datasets.map((item) => {
//         //     const color = Array.isArray(item['borderColor'])
//         //         ? item['borderColor']
//         //         : item['borderColor'];
//         //     const dataProp: OnHoverProperties = {
//         //         name: item['label'],
//         //         value:
//         //             (this.chartConfig.selectedTab === 'Revenue' ||
//         //             this.chartConfig.selectedTab === 'Cost'
//         //                 ? '$'
//         //                 : '') + item['data'][value],
//         //         percent: item['dataPercentages']?.length
//         //             ? item['dataPercentages'][value] + '%'
//         //             : null,
//         //         color: color as ChartColor | ChartColor[],
//         //     };
//         //     if (!item['hidden']) {
//         //         dataValues.push(dataProp);
//         //     }
//         // });

//         // if (this.chartConfig['multiHoverData']) {
//         //     let dataPropMulti = [
//         //         {
//         //             name: 'Price per Gallon',
//         //             value: '$' + this.chartConfig.pricePerGallonValue[value],
//         //             percent: null,
//         //             color: '#AAAAAA',
//         //         },
//         //         {
//         //             name: 'Load Rate per Mile',
//         //             value: '$' + this.chartConfig.loadRatePerMileValue[value],
//         //             percent: null,
//         //             color: '#DADADA',
//         //         },
//         //     ];

//         //     dataPropMulti.map((item) => {
//         //         dataValues.push(item);
//         //     });
//         // }

//         // this.selectedDataRows = dataValues;

//         // const allItemsWithoutValue = this.selectedDataRows.every(
//         //     (dataRow) => !+dataRow.value
//         // );

//         // this.showHoverData = !allItemsWithoutValue;
//     }

//     public chartUpdated(data: number[]): void {
//         // this.chart.chart.config.data.datasets[0].data = data;
//         // this.setChartOptions();
//     }

//     public updateMuiliBar(
//         selectedStates: ByStateListItem[],
//         data: number[],
//         dataPercentages: number[],
//         colors: string[],
//         hoverColors: string[]
//     ): void {
//         this.animationDuration = 1000;

//         let updateData = [];
//         selectedStates.map((item, i) => {
//             const dataArray: ChartDataProperties = {
//                 backgroundColor: colors[i],
//                 borderColor: colors[i],
//                 hoverBackgroundColor: hoverColors[i],
//                 data: data,
//                 dataPercentages: dataPercentages,
//                 label: item['name'] || item['state'],
//                 type: 'bar',
//                 yAxisID: 'y-axis-0',
//                 id: item['id'],
//             };

//             updateData.push(dataArray);
//         });

//         this.selectedColors = [...colors];
//         this.selectedHoverColors = [...hoverColors];

//         this.updateMultiBarDataInsert(updateData);
//     }

//     private updateMultiBarDataInsert(updateData: ChartDataProperties[]): void {
//         // updateData.map((item) => {
//         //     let sameFound = false;
//         //     this.chart.chart.config.data.datasets.map((ch) => {
//         //         if (ch['id'] == 'top10' || ch['id'] == 'allOthers') {
//         //             ch.hidden = true;
//         //         }
//         //         if (item['id'] == ch['id']) {
//         //             sameFound = true;
//         //         }
//         //     });

//         //     if (!sameFound) {
//         //         this.chart.chart.config.data.datasets.push(item);
//         //     }
//         // });
//         // this.setChartOptions();
//     }

//     public removeMultiBarData(
//         removedData: ChartDataProperties[],
//         showDefault?: boolean
//     ): void {
//         this.animationDuration = 1000;

//         // this.chart.chart.config.data.datasets.map((ch, a) => {
//         //     if (ch['id'] == removedData['id']) {
//         //         this.chart.chart.config.data.datasets.splice(a, 1);
//         //     }

//         //     if (showDefault && ch.hidden == true) {
//         //         ch.hidden = false;
//         //     }
//         // });

//         // this.setChartOptions();

//         // for (let i = 2; i < this.chart.chart.config.data.datasets.length; i++) {
//         //     this.chart.chart.config.data.datasets[i].backgroundColor =
//         //         this.selectedColors[i - 2];

//         //     this.chart.chart.config.data.datasets[i].borderColor =
//         //         this.selectedColors[i - 2];

//         //     this.chart.chart.config.data.datasets[i].hoverBackgroundColor =
//         //         this.selectedHoverColors[i - 2];
//         // }
//     }

//     public hoverBarChart(hoveredData: ByStateListItem) {
//         this.animationDuration = 0;

//         // this.chart.chart.config.data.datasets.map((item, index) => {
//         //     let color = item.backgroundColor;
//         //     let colorProp = color.toString();

//         //     if (hoveredData == null || item['id'] == hoveredData['id']) {
//         //         item.backgroundColor = colorProp.slice(0, 7);
//         //     } else {
//         //         if (index !== 0 && index !== 1) {
//         //             item.backgroundColor = colorProp + '33';
//         //         }
//         //     }
//         // });

//         this.setChartOptions();
//     }

//     public updateTime(ev: string, period?: string) {
//         this.animationDuration = 1000;
//         let range = 0,
//             type,
//             value = [],
//             indicator,
//             format,
//             removeEvery = 2,
//             removeIndex = 0,
//             rangeIndicator = 20,
//             periodFormat = 0,
//             periodIndex = 0;

//         switch (ev) {
//             case 'All Time':
//                 range = 25;
//                 type = 'M';
//                 format = 'MMM YYYY';
//                 break;
//             case 'WTD':
//                 range = moment().day();
//                 type = 'days';
//                 format = 'D ddd';
//                 indicator = moment().clone().startOf('isoWeek');

//                 if (period == '6 Hours' || period == 'Semi-Daily') {
//                     range =
//                         moment().day() == 1
//                             ? moment().hour() + 1
//                             : (moment().day() - 1) * 24 + moment().hour() + 1;
//                     type = 'hours';
//                     format = 'hh A';
//                     indicator = moment().clone().startOf('isoWeek');
//                     periodFormat = period == '6 Hours' ? 6 : 12;
//                 }
//                 break;
//             case 'MTD':
//                 range = moment().date();
//                 type = 'days';
//                 format = 'D ddd';
//                 indicator = moment().clone().startOf('month');
//                 periodFormat =
//                     period == 'Weekly' ? 7 : period == 'Semi-Weekly' ? 3 : 0;
//                 break;
//             case 'YTD':
//                 range = moment().month() + 1;
//                 type = 'M';
//                 format = 'MMM';
//                 indicator = moment().clone().startOf('year');
//                 if (period == 'Weekly' || period == 'Semi-Monthly') {
//                     range = moment().dayOfYear();
//                     type = 'days';
//                     format = 'D MMM';
//                     indicator = moment().clone().startOf('year');
//                     periodFormat = period == 'Weekly' ? 7 : 15;
//                 }
//                 break;
//             case 'Today':
//                 range = moment().hour() + 1;
//                 type = 'hours';
//                 format = 'hh A';
//                 indicator = moment().clone().startOf('day');
//                 rangeIndicator = 10;
//                 periodFormat =
//                     period == '3 Hours' ? 3 : period == '6 Hours' ? 6 : 0;
//                 break;
//             case 'Custom Set':
//                 type = 'days';
//                 format = 'D MMM';
//                 const fromDate = moment(period[0]);
//                 const toDate = moment(period[1]);
//                 const diff = toDate.diff(fromDate, type);
//                 indicator = fromDate;
//                 range = diff + 1;
//         }

//         for (let a = 0; a < range; a++) {
//             if (periodIndex == periodFormat) {
//                 periodIndex = 0;
//                 value.push(moment(indicator).add(a, type));
//             }
//             if (periodFormat != 0) {
//                 periodIndex++;
//             }
//         }

//         // this.chart.chart.config.data.labels.map((item: string, i) => {
//         //     this.chart.chart.config.data.labels.splice(
//         //         i,
//         //         this.chart.chart.config.data.labels.length
//         //     );
//         // });

//         // value.map((item) => {
//         //     let timePeriodCheck = moment(item).format('LT').split(' ')[1];
//         //     let finalFormat = format;
//         //     finalFormat =
//         //         period == 'Semi-Daily' && timePeriodCheck == 'AM'
//         //             ? 'DD MMM'
//         //             : format;

//         //     item = item.format(finalFormat).toUpperCase();
//         //     let weekDaySep = item.split(' ');
//         //     removeIndex++;
//         //     if (value.length > rangeIndicator && removeIndex == removeEvery) {
//         //         removeIndex = 0;
//         //         weekDaySep[0] = '';
//         //         weekDaySep[1] = '';
//         //     }
//         //     if (ev == 'Today') {
//         //         this.chart.chart.config.data.labels.push(
//         //             weekDaySep[0] + ' ' + weekDaySep[1]
//         //         );
//         //     } else if (
//         //         ev == 'WTD' ||
//         //         ev == 'MTD' ||
//         //         ev == 'Custom Set' ||
//         //         (ev == 'YTD' &&
//         //             (period == 'Weekly' || period == 'Semi-Monthly'))
//         //     ) {
//         //         this.chart.chart.config.data.labels.push([
//         //             weekDaySep[0],
//         //             weekDaySep[1],
//         //         ]);
//         //     } else {
//         //         let insertData =
//         //             weekDaySep?.length > 1 && weekDaySep[0] == 'JAN'
//         //                 ? weekDaySep[1]
//         //                 : weekDaySep[0];
//         //         periodIndex = 0;
//         //         this.chart.chart.config.data.labels.push(insertData);
//         //     }
//         // });

//         this.setChartOptions();
//     }

//     public showChartTooltip(value: number) {
//         // if (this.toolTipData?.length) {
//         //     this.setToolTipTitle(value);
//         //     this.setChartLegendData(this.chart.chart['tooltip']._active);
//         // }
//         // if (this.chartConfig['hoverOtherChart']) {
//         //     this.hoverOtherChart.emit(value);
//         //     return false;
//         // }
//         // this.animationDuration = 0;
//         // this.hoveringStatus = true;
//         // this.chartHovered.emit(true);
//         // const canvas = this.chart.chart.canvas;

//         // let xPoint1 = 0;
//         // let xPoint2 = 0;

//         // const xAxis = this.chart.chart['scales']['x-axis-0'];
//         // const yAxis = this.chart.chart['scales']['y-axis-0'];

//         // if (xAxis['_gridLineItems']) {
//         //     xPoint1 = xAxis['_gridLineItems'][1]['x1'];
//         //     xPoint2 = xAxis['_gridLineItems'][0]['x2'];
//         //     const elWidth = xPoint1 - xPoint2;

//         //     if (this.axesProperties?.horizontalAxes?.showGridLines) {
//         //         xAxis['_gridLineItems'].map(
//         //             (item: GridLineOptions, i: number) => {
//         //                 if (i && i != xAxis['_gridLineItems'].length - 1) {
//         //                     xAxis['_gridLineItems'][i].color = '#DADADA';
//         //                 }
//         //                 if (
//         //                     i == value ||
//         //                     i == value + 1 ||
//         //                     i == xAxis['_gridLineItems'].length - 1
//         //                 ) {
//         //                     xAxis['_gridLineItems'][i].color = 'transparent';
//         //                 }
//         //             }
//         //         );
//         //     }

//         //     if (
//         //         xAxis['_gridLineItems'][value] &&
//         //         this.chartConfig['hasHoverData']
//         //     ) {
//         //         this.updateHoverData(value);
//         //         let oversizedHover = false;
//         //         this.hoverColumnWidth = elWidth + 1;
//         //         this.hoverChartLeft =
//         //             xAxis['_gridLineItems'][value]['x2'] -
//         //             1 -
//         //             this.hoverColumnWidth / 2;

//         //         let clientWidth = this.hoverDataHolder
//         //             ? this.hoverDataHolder.nativeElement.offsetWidth + 16
//         //             : 0;

//         //         if (!clientWidth && this.chartConfig['tooltipOffset']) {
//         //             if (this.selectedDataRows.length > this.dataMaxRows) {
//         //                 clientWidth = this.chartConfig['tooltipOffset']['max'];
//         //             } else {
//         //                 clientWidth = this.chartConfig['tooltipOffset']['min'];
//         //             }
//         //         }

//         //         this.hoverColumnHeight = this.chartConfig[
//         //             'startGridBackgroundFromZero'
//         //         ]
//         //             ? yAxis.height
//         //             : this.chartConfig['multiChartHover']
//         //             ? yAxis.height + xAxis.height + 18
//         //             : yAxis.height + xAxis.height;

//         //         let xPos = this.chartConfig['offset']
//         //             ? xAxis['_gridLineItems'][value]['x2'] + elWidth
//         //             : xAxis['_gridLineItems'][value]['x2'];

//         //         if (xPos + clientWidth > canvas.width) {
//         //             oversizedHover = true;
//         //         }
//         //         if (oversizedHover) {
//         //             this.hoverDataPosition =
//         //                 xPos -
//         //                 clientWidth -
//         //                 elWidth -
//         //                 this.hoverColumnWidth / 2 +
//         //                 3;
//         //         } else {
//         //             this.hoverDataPosition =
//         //                 xPos - this.hoverColumnWidth / 2 + 4;
//         //         }

//         //         this.ref.detectChanges();
//         //     }
//         // }
//     }

//     public chartHoverOut() {
//         // this.showHoverData = false;
//         // this.hoveringStatus = false;

//         // const xAxis = this.chart?.chart['scales']['x-axis-0'];

//         // if (
//         //     xAxis &&
//         //     xAxis['_gridLineItems'] &&
//         //     this.axesProperties?.horizontalAxes?.showGridLines
//         // ) {
//         //     xAxis['_gridLineItems'].map((item: GridLineOptions, i: number) => {
//         //         if (i) {
//         //             xAxis['_gridLineItems'][i].color = '#DADADA';
//         //         }
//         //         if (i == xAxis['_gridLineItems'].length - 1) {
//         //             xAxis['_gridLineItems'][i].color = 'transparent';
//         //         }
//         //     });
//         // }
//     }

//     private setToolTipTitle(index: number) {
//         if (this.toolTipData[index].day && this.toolTipData[index].month) {
//             this.hoverDateTitle =
//                 this.toolTipData[index].day +
//                 ' ' +
//                 this.monthList[this.toolTipData[index].month - 1];
//         } else {
//             this.hoverDateTitle =
//                 this.monthList[this.toolTipData[index].month - 1] +
//                 ' ' +
//                 this.toolTipData[index].year;
//         }
//     }

//     public detailsTimePeriod(name: string): number {
//         return name == '1M'
//             ? 1
//             : name == '3M'
//             ? 2
//             : name == '6M'
//             ? 3
//             : name == '1Y'
//             ? 4
//             : name == 'YTD'
//             ? 5
//             : name == 'ALL'
//             ? 6
//             : 1;
//     }

//     private setChartAxis(): Axis[] {
//         let yAxes = [];
//         const leftAxesTemplate = {
//             stacked: this.chartConfig['stacked']
//                 ? this.chartConfig['stacked']
//                 : false,
//             display: this.axesProperties['verticalLeftAxes']
//                 ? this.axesProperties['verticalLeftAxes']['visible']
//                 : false,
//             position: ChartAxisPositionEnum.LEFT,
//             gridLines: {
//                 display: this.chartConfig.showZeroLine ?? false,
//                 drawBorder: false,
//                 borderDash: [2, 3],
//                 color: 'transparent',
//                 zeroLineColor: '#DADADA',
//                 zeroLineBorderDash: this.chartConfig.dottedZeroLine
//                     ? [2, 3]
//                     : false,
//             },
//             ticks: {
//                 display: false,
//                 beginAtZero: true,
//                 stepSize: this.axesProperties['verticalLeftAxes']
//                     ? this.axesProperties['verticalLeftAxes']['stepSize']
//                     : 1000,
//                 max:
//                     this.axesProperties['verticalLeftAxes'] &&
//                     this.axesProperties['verticalLeftAxes']['maxValue']
//                         ? this.axesProperties['verticalLeftAxes']['maxValue']
//                         : 4000,
//                 min: this.axesProperties['verticalLeftAxes']
//                     ? this.axesProperties['verticalLeftAxes']['minValue']
//                     : 0,
//                 fontColor: '#919191',
//                 fontSize: 11,
//                 fontFamily: 'Montserrat',
//                 padding: 10,
//                 callback: (value: number | string) => {
//                     if (
//                         this.axesProperties['verticalLeftAxes'] &&
//                         this.axesProperties['verticalLeftAxes']['decimal']
//                     ) {
//                         if (typeof value == 'number' && value % 1 === 0) {
//                             value = value + '.0';
//                         }
//                         return value;
//                     } else {
//                         let ranges = [
//                             { divider: 1e6, suffix: 'M' },
//                             { divider: 1e3, suffix: 'K' },
//                         ];
//                         function formatNumber(n) {
//                             for (let i = 0; i < ranges.length; i++) {
//                                 if (n >= ranges[i].divider) {
//                                     return (
//                                         (n / ranges[i].divider).toString() +
//                                         ranges[i].suffix
//                                     );
//                                 }
//                             }
//                             return n;
//                         }
//                         return formatNumber(value);
//                     }
//                 },
//             },
//         };

//         const rightAxesTemplate = {
//             stacked: this.chartConfig['stacked']
//                 ? this.chartConfig['stacked']
//                 : false,
//             display: this.axesProperties['verticalRightAxes']
//                 ? this.axesProperties['verticalRightAxes']['visible']
//                 : false,
//             gridLines: {
//                 display: this.axesProperties['verticalRightAxes']
//                     ? this.axesProperties['verticalRightAxes']['showGridLines']
//                     : false,
//             },
//             position: ChartAxisPositionEnum.RIGHT,
//             ticks: {
//                 display: false,
//                 beginAtZero: true,
//                 stepSize: this.axesProperties['verticalRightAxes']
//                     ? this.axesProperties['verticalRightAxes']['stepSize']
//                     : 700,
//                 max: this.axesProperties['verticalRightAxes']
//                     ? this.axesProperties['verticalRightAxes']['maxValue']
//                     : 2800,
//                 min: this.axesProperties['verticalRightAxes']
//                     ? this.axesProperties['verticalRightAxes']['minValue']
//                     : 0,
//                 fontColor: '#919191',
//                 fontFamily: 'Montserrat',
//                 fontSize: 11,
//                 padding: -4,
//                 callback: function (value: string) {
//                     let ranges = [
//                         { divider: 1e6, suffix: 'M' },
//                         { divider: 1e3, suffix: 'K' },
//                     ];
//                     function formatNumber(n) {
//                         for (let i = 0; i < ranges.length; i++) {
//                             if (n >= ranges[i].divider) {
//                                 return (
//                                     (n / ranges[i].divider).toString() +
//                                     ranges[i].suffix
//                                 );
//                             }
//                         }
//                         return n;
//                     }
//                     return formatNumber(value);
//                 },
//             },
//         };
//         if (
//             !this.multipleVerticalLeftAxes ||
//             !this.multipleVerticalLeftAxes?.length
//         ) {
//             yAxes.push(leftAxesTemplate);
//             yAxes.push(rightAxesTemplate);
//         } else {
//             yAxes = this.multipleVerticalLeftAxes?.map((value) => {
//                 const updatedAxe = JSON.parse(JSON.stringify(leftAxesTemplate));
//                 updatedAxe.ticks.max = value + 0.1 * value;

//                 return updatedAxe;
//             });

//             yAxes.push(rightAxesTemplate);
//         }

//         return yAxes;
//     }

//     private setLegendSaveValues(): void {
//         this.saveValues = JSON.parse(JSON.stringify(this.legendAttributes));
//     }

//     private annotationInitialize(): void {
//         let namedChartAnnotation = annotation;
//         namedChartAnnotation['id'] = 'annotation';
//         Chart.pluginService.register(namedChartAnnotation);
//     }

//     private calculateTooltipPosition(xPos: number): void {
//         // const x = xPos;
//         // const chartEl = this.chart.chart;
//         // const chartRect = chartEl.canvas.getBoundingClientRect();
//         // const topY = chartRect.top;
//         // const bottomY = chartRect.bottom;

//         // this.tooltipHeight = bottomY - topY - 35;
//         // this.tooltipLeft = x - 1;
//     }
// }
