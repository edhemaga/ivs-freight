import { eStringPlaceholder } from '@shared/enums';
import {
    eChartTypesString,
} from 'ca-components/lib/components/ca-chart/enums';

export class DashboardTopRatedChartsConfiguration {
    static DOUGHNUT_CHART_CONFIG = {
        chartType: eChartTypesString.DOUGHNUT,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 330,
        width: 100,
        noDataImage: eStringPlaceholder.EMPTY,
        chartOptions: {},
        showXAxisLabels: false,
    };

    static BAR_CHART_CONFIG = {
        chartType: eChartTypesString.BAR,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 260,
        width: 100,
        isMultiYAxis: false,
        noDataImage: eStringPlaceholder.EMPTY,
        chartOptions: {},
        showXAxisLabels: true,
        isTooltipItemInSelectedItems: true,
        showTooltipBackground: true,
        isDashboardChart: true,
    };
}
