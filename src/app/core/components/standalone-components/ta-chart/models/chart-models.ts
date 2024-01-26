import { AxisPositionEnum } from '../enums/chart-enums';

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
