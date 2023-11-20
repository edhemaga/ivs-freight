import { DoughnutChartConfig } from './doughnut-chart.model';
import { TopRatedListItem } from '../dashboard-top-rated-models/top-rated-list-item.model';

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

export interface BarChartInterval {
    startTime?: string;
    endTime?: string;
}

export interface BarChartLabels {
    filteredLabels: string[] | string[][];
    filteredTooltipLabels: string[];
}

export interface BarChart extends Chart {
    updateTime: (currentTab: string, period?: string) => void;
    updateMuiliBar: (
        selectedStates: TopRatedListItem[],
        data: number[],
        dataPercentages: number[],
        colors: string[],
        hoverColors: string[]
    ) => void;
    removeMultiBarData: (
        removedData: TopRatedListItem,
        showDefault?: boolean
    ) => void;
    hoverBarChart: (hoveredData: TopRatedListItem) => void;
    displayBarChartDefaultValues(): () => void;

    selectedDrivers: TopRatedListItem[];
}
