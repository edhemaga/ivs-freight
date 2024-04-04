import type { ChartType } from 'chart.js';

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
