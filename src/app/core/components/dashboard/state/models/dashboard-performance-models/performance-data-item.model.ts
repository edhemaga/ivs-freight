export interface PerformanceDataItem {
    title: string;
    isHovered: boolean;
    isSelected: boolean;
    selectedColor: string;
    selectedHoverColor: string;
    lastIntervalValue?: number;
    lastIntervalTrend?: number;
    intervalAverageValue?: number;
}
