import { ChartConfiguration } from 'chart.js';

import { TopRatedListItem } from './top-rated-list-item.model';

interface ChartDefaultConfig {
    type: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    hoverBackgroundColor: string[];
    hoverBorderColor: string;
}

export interface ChartInitProperties {
    name: string;
    value?: string;
    percent?: string;
}

export interface DoughnutChart extends Chart {
    chartInnitProperties: ChartInitProperties[];
    selectedDrivers: TopRatedListItem[];
    chartUpdated: (data: number[]) => void;
    hoverDoughnut: (elements: number, type?: string) => void;
}

export interface DoughnutChartConfig extends ChartConfiguration {
    dataProperties: { defaultConfig: ChartDefaultConfig }[];
    chartInnitProperties: ChartInitProperties[];
    showLegend: boolean;
    chartValues: number[];
    defaultType: string;
    chartWidth: string;
    chartHeight: string;
    removeChartMargin: boolean;
    dataLabels: string[];
    driversList: TopRatedListItem[];
    allowAnimation: boolean;
    noChartImage: string;
    dontUseResponsive: boolean;
}
