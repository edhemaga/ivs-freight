import {
    ChartImagesStringEnum,
    eChartTypesString,
} from 'ca-components/lib/components/ca-chart/enums';

export class RepairShopChartsConfiguration {
    static REPAIR_CHART_CONFIG = {
        chartType: eChartTypesString.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 130,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_YELLOW,
        chartOptions: {},
        showTooltipBackground: false,
        showXAxisLabels: true,
        hasVerticalDashedAnnotation: true,
    };
}
