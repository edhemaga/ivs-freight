import { ChartColor, ChartType } from 'chart.js';
import { AnnotationPositionEnum, AxisPositionEnum } from '../enums/chart-enums';
import { BarChartConfig } from 'src/app/pages/dashboard/models/dashboard-chart-models/bar-chart.model';

export interface AxisGridLines {
    display: boolean;
    drawBorder: boolean;
    borderDash: number[];
    color: string;
    zeroLineBorderDash: number[];
    zeroLineColor: string;
}

export interface AxisTicks {
    display: boolean;
    beginAtZero: boolean;
    stepSize: number;
    max: number;
    min: number;
    fontColor: string;
    fontSize: number;
    fontFamily: string;
    padding: number;
    callback: (value: number | string) => string;
}

export interface Axis {
    stacked: boolean;
    display: boolean;
    position: AxisPositionEnum;
    gridLines: AxisGridLines;
    ticks: AxisTicks;
}

export interface LegendAttributes {
    title: string;
    value: number;
    image?: string;
    elementId?: number | string | number[];
    prefix?: string;
    sufix?: string;
    titleReplace?: string;
    imageReplace?: string;
}

export interface OnHoverProperties {
    name: string;
    value: string;
    percent: string;
    color: ChartColor | ChartColor[];
}

export interface AnnotationConfig {
    type: AnnotationPositionEnum;
    axis: string;
    color: string;
    dash: number | number[];
}

export interface BasicChartConfig extends BarChartConfig {
    loadRatePerMileValue?: number;
    pricePerGallonValue?: number;
    extendFull?: boolean;
    hasSameDataIndex?: boolean;
    showHoverTooltip?: boolean;
    showZeroLine?: boolean;
    dottedZeroLine?: boolean;
}

export interface ChartDataProperties {
    backgroundColor: string;
    borderColor: string;
    hoverBackgroundColor: string;
    data: number[];
    dataPercentages: number[];
    label: string;
    type: ChartType;
    yAxisID: string;
    id: number;
}

export interface ChartApiCall {
    id: number;
    chartType: number;
}
