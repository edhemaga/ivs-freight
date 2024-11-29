import { ChartImagesStringEnum, ChartTypesStringEnum } from "ca-components";

export class BrokerChartsConfiguration {

    static INVOICE_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 130,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_YELLOW,
        chartOptions: {},
        isMultiYAxis: true,
        showTooltipBackground: false,
        showXAxisLabels: true
    };

    static MILEAGE_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 130,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_MIXED,
        chartOptions: {},
        showTooltipBackground: false,
        showXAxisLabels: true
    };

    static PAYMENT_CHART_CONFIG = {
        chartType: ChartTypesStringEnum.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 130,
        width: 100,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_PAY,
        chartOptions: {},
        isMultiYAxis: false,
        showTooltipBackground: false,
        showXAxisLabels: true
    };
}