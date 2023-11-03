import { ChartConfiguration } from 'chart.js';

import { TopRatedListItem } from '../dashboard-top-rated-models/top-rated-list-item.model';

interface ChartDefaultConfig {
    type: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string;
    hoverBackgroundColor: string | string[];
    hoverBorderColor: string;
    yAxisID?: string;
    label?: string;
    id?: string;
}

export interface ChartInitProperties {
    name: string;
    value?: string;
    percent?: string;
}

export interface DoughnutChartPercentage {
    filterdDataValues: number[];
    topTenPercentage: number;
    topTenValue: number;
    otherPercentage: number;
    otherValue: number;
}

export interface DoughnutChartSigns {
    filteredTopTenPercentage?: string;
    filteredTopTenValue: string;
    filteredOtherPercentage?: string;
    filteredOtherValue?: string;
}

export interface DoughnutChartConfig extends ChartConfiguration {
    dataProperties: { defaultConfig: ChartDefaultConfig }[];
    chartInnitProperties?: ChartInitProperties[];
    showLegend: boolean;
    chartValues: number[];
    defaultType: string;
    chartWidth: string;
    chartHeight: string;
    removeChartMargin: boolean;
    dataLabels: string[];
    driversList?: TopRatedListItem[];
    allowAnimation: boolean;
    noChartImage: string;
    dontUseResponsive?: boolean;
}

export interface DoughnutChart extends Chart {
    chartInnitProperties: ChartInitProperties[];
    selectedDrivers: TopRatedListItem[];

    chartUpdated: (data: number[]) => void;
    hoverDoughnut: (elements: number, type?: string) => void;
}
