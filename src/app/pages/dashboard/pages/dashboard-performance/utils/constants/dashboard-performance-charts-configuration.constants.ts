import {
    ChartImagesStringEnum,
    ChartTypesStringEnum,
} from 'ca-components/lib/components/ca-chart/enums';

export class DashboardPerformanceChartsConfiguration {
    static PERFORMANCE_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 400,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_PAY,
        chartOptions: {},
        //TODO - show for bar chart, not for line chart
        showXAxisLabels: true
    };
}
