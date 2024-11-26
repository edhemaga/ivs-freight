import {
    ChartImagesStringEnum,
    ChartTypesStringEnum,
} from 'ca-components/lib/components/ca-chart/enums';

export class TruckDetailsChartsConfiguration {
    static FUEL_CHART_CONFIG = {
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

    static REVENUE_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 130,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_GREEN,
        chartOptions: {},
    };

    static EXPENSES_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.BAR,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 150,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_STACKED,
        chartOptions: {},
        isStacked: true
    };
}
