import {
    ChartImagesStringEnum,
    ChartTypesStringEnum
} from "ca-components";

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
        showXAxisLabels: true,
        hasVerticalDashedAnnotation: true
        // On some graphs we are gonna need y Axes that are independent of each other
        // By default, and if the parameter is not specified the configuration is going to treat is a single Y axis chat
        // Otherwise, specify parameter
        // See Broker Detail invoice chart
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
        showXAxisLabels: true,
        hasVerticalDashedAnnotation: true
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
        showTooltipBackground: false,
        showXAxisLabels: true,
    };
}