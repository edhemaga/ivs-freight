export interface PerformanceDataItem {
    title: string;
    isHover: boolean;
    isSelected: boolean;
    selectedColor: string;
    selectedHoverColor: string;
    lastMonthValue?: number;
    lastMonthTrend?: number | string;
    monthlyAverageValue?: number;
    monthlyAverageTrend: number | string;
}
