//modals
import { IChartConfiguration } from '@ca-shared/components/ca-chart/models';

//enums
import {
    ChartImagesStringEnum,
    eChartTypesString,
} from 'ca-components/lib/components/ca-chart/enums';

export class DashboardByStateChartsConfiguration {
    public static BY_STATE_CHART_CONFIG: IChartConfiguration = {
        chartType: eChartTypesString.BAR,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 260,
        width: 100,
        isMultiYAxis: false,
        noDataImage: '',
        chartOptions: {},
        showXAxisLabels: true,
        isTooltipItemInSelectedItems: true,
        showTooltipBackground: true,
        isDashboardChart: true,
    };
}
