// models
import { BarChartAxes } from '@pages/dashboard/models/dashboard-chart-models/bar-chart.model';

export interface ChartDefaultConfig {
    type: string;
    data: number[];
    borderColor?: string;
    pointBorderColor: string;
    pointBackgroundColor: string;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor?: string;
    pointHoverRadius: number;
    pointBorderWidth: number;
    fill?: boolean;
    hasGradiendBackground?: boolean;
    colors?: string[];
    id: string;
    hidden: boolean;
    label: string;
    yAxisID: string;
}

export interface LineChartAxes extends BarChartAxes {}

export interface LineChartConfig {
    dataProperties: { defaultConfig: ChartDefaultConfig }[];
    showLegend: boolean;
    chartValues: number[];
    defaultType: string;
    chartWidth: string;
    chartHeight: string;
    removeChartMargin: boolean;
    gridHoverBackground: boolean;
    allowAnimation: boolean;
    hasHoverData: boolean;
    offset: boolean;
    multiHoverData: boolean;
    multiChartHover: boolean;
    tooltipOffset: { min: number; max: number };
    dataLabels: string[][];
    dataTooltipLabels: string[];
    pricePerGallonValue: number[];
    loadRatePerMileValue: number[];
    noChartImage: string;
}

// export interface LineChart extends Chart {
//     resetLineChartData: () => void;
//     insertNewChartData: (
//         action: string,
//         performanceDataTitle: string,
//         selectedColor?: string
//     ) => void;
//     changeChartFillProperty: (
//         performanceDataTitle: string,
//         selectedColor: string
//     ) => void;
//     showChartTooltip: (chartDataValue: number) => void;
//     chartHoverOut: () => void;
// }
