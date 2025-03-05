import { eStringPlaceholder } from '@shared/enums';
import { eChartTypesString } from 'ca-components/lib/components/ca-chart/enums';

import { IChartConfiguration } from 'ca-components/lib/components/ca-chart/models';

export class DashboardPerformanceChartsConfiguration {
    public static LINE_CHART_PERFORMANCE_CONFIG: IChartConfiguration = {
        chartType: eChartTypesString.LINE,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 350,
        width: 100,
        isMultiYAxis: true,
        noDataImage: eStringPlaceholder.EMPTY,
        chartOptions: {},
        showXAxisLabels: false,
        showTooltipBackground: true,
        showHighlightPointOnHover: true,
        isDatasetHoverEnabled: true,
        isTooltipItemInSelectedItems: true,
        showBottomLineOnLineChart: true,
        isDashboardChart: true,
    };
    public static BAR_CHART_PERFORMANCE_CONFIG: IChartConfiguration = {
        chartType: eChartTypesString.BAR,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 100,
        width: 100,
        noDataImage: eStringPlaceholder.EMPTY,
        chartOptions: {},
        showXAxisLabels: true,
        showTooltipBackground: true,
        verticalyAlignBarChartWithLineCart: true,
        isDashboardChart: true,
    };
}
