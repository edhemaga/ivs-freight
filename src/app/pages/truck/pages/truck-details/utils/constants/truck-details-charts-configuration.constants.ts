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
        showTooltipBackground: false,
        showXAxisLabels: true
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
        showTooltipBackground: false,
        showXAxisLabels: true
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
        showTooltipBackground: false,
        showXAxisLabels: true,
        isStacked: true,
    };
}
