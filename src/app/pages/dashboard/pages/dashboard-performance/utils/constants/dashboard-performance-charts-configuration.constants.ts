import {
    ChartImagesStringEnum,
    ChartTypesStringEnum,
} from 'ca-components/lib/components/ca-chart/enums';

export class DashboardPerformanceChartsConfiguration {
    static LINE_CHART_PERFORMANCE_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 350,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_PAY,
        chartOptions: {},
        showXAxisLabels: false,
        showTooltipBackground: true
    };

    static BAR_CHART_PERFORMANCE_CONFIG = {
        chartType: ChartTypesStringEnum.BAR,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 100,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_PAY,
        chartOptions: {},
        showXAxisLabels: true, 
        showTooltipBackground: true
    };
}
