import { ChartImagesStringEnum, ChartTypesStringEnum } from "ca-components";

export class ShipperDetailsChartsConfiguration {
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
    };
}