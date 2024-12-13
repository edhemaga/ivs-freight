import {
    ChartImagesStringEnum,
    ChartTypesStringEnum,
} from 'ca-components/lib/components/ca-chart/enums';

export class DriverDetailsChartsConfiguration {
    static PAYROLL_CHART_CONFIG = {
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
}
