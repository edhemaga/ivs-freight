import { ChartImagesStringEnum, eChartTypesString } from "ca-components";

export class TrailerDetailsChartsConfiguration {

  static PAYROLL_CHART_CONFIG = {
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
    hasVerticalDashedAnnotation: true
  };
}