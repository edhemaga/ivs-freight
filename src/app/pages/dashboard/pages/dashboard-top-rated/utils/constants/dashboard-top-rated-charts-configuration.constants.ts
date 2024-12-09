import {
    ChartImagesStringEnum,
    ChartTypesStringEnum,
} from 'ca-components/lib/components/ca-chart/enums';

export class DashboardTopRatedChartsConfiguration {
    static DOUGHNUT_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 130,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_YELLOW,
        chartOptions: {},
    };

    static BAR_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 190,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_MIXED,
        chartOptions: {},
        showXAxisLabels: true
    };
}
