import { ChartConfiguration, ChartType } from 'chart.js';

import { TopRatedListItem } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-list-item.model';

interface ChartDefaultConfig {
    type: string;
    data: number[];
    dataPercentages?: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string;
    hoverBackgroundColor?: string | string[];
    hoverBorderColor?: string;
    yAxisID?: string;
    label?: string;
    id?: string;
    pointBackgroundColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    pointHoverRadius?: number;
    pointBorderWidth?: number;
    fill?: boolean;
    hasGradiendBackground?: boolean;
    colors?: string[];
    hoverColors?: string[];
    barThickness?: number;
    maxBarThickness?: number;
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
    defaultType: ChartType;
    chartWidth: string;
    chartHeight: string;
    removeChartMargin?: boolean;
    dataLabels: string[] | string[][];
    driversList?: TopRatedListItem[];
    allowAnimation: boolean;
    noChartImage: string;
    dontUseResponsive?: boolean;
    annotation?: number;
    onHoverAnnotation?: boolean;
    hoverTimeDisplay?: boolean;
    animationOnlyOnLoad?: boolean;
    offset?: boolean;
    hasValue?: boolean;
    showHoverTooltip?: boolean;
    showZeroLine?: boolean;
    dottedZeroLine?: boolean;
}

// export interface DoughnutChart extends Chart {
//     chartInnitProperties: ChartInitProperties[];
//     selectedDrivers: TopRatedListItem[];

//     chartUpdated: (data: number[]) => void;
//     hoverDoughnut: (elements: number, type?: string) => void;
// }
