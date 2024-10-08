import { DoughnutChartConfig } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';
import { TopRatedListItem } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-list-item.model';
import { ByStateListItem } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-list-item.model';

export interface BarChartConfig extends DoughnutChartConfig {
    gridHoverBackground: boolean;
    startGridBackgroundFromZero?: boolean;
    dataMaxRows?: number;
    hasHoverData: boolean;
    hassecondTabValueage?: boolean;
    offset: boolean;
    tooltipOffset: { min: number; max: number };
    hoverOtherChart?: boolean;
    selectedTab?: string;
    dataTooltipLabels?: string[];
}

export interface BarChartAxes {
    verticalLeftAxes: {
        visible: boolean;
        minValue: number;
        maxValue: number;
        stepSize: number;
        showGridLines: boolean;
        decimal?: boolean;
    };
    verticalRightAxes?: {
        visible: boolean;
        minValue: number;
        maxValue: number;
        stepSize: number;
        showGridLines: boolean;
        decimal?: boolean;
    };
    horizontalAxes: {
        visible: boolean;
        position: string;
        showGridLines: boolean;
    };
}

export interface BarChartValues {
    defaultBarValues: {
        topRatedBarValues: number[];
        otherBarValues: number[];
    };
    defaultBarPercentages: {
        topRatedBarPercentage: number[];
        otherBarPercentage: number[];
    };
    selectedBarValues: number[][];
    selectedBarPercentages: number[][];
}

export interface BarChartPerformanceValues {
    pricePerGallonValues: number[];
    loadRatePerMileValues: number[];
}

export interface BarChartLabels {
    filteredLabels: string[] | string[][];
    filteredTooltipLabels: string[];
}

// export interface BarChart extends Chart {
//     updateTime: (currentTab: string, period?: string) => void;
//     updateMuiliBar: (
//         selectedStates: TopRatedListItem[] | ByStateListItem[],
//         data: number[],
//         dataPercentages: number[],
//         colors: string[],
//         hoverColors: string[]
//     ) => void;
//     removeMultiBarData: (
//         removedData: TopRatedListItem | ByStateListItem,
//         showDefault?: boolean
//     ) => void;
//     hoverBarChart: (hoveredData: TopRatedListItem | ByStateListItem) => void;
//     displayBarChartDefaultValues(): () => void;

//     selectedDrivers: TopRatedListItem[];
// }
