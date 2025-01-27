//modals
import { IChartConfiguration } from '@ca-shared/components/ca-chart/models';

//enums
import {
    ChartImagesStringEnum,
    ChartTypesStringEnum,
} from 'ca-components/lib/components/ca-chart/enums';

export class DashboardByStateChartsConfiguration {
    public static BY_STATE_CHART_CONFIG: IChartConfiguration = {
        chartType: ChartTypesStringEnum.BAR,
        chartData: {
            labels: [],
            datasets: [],
        },
        height: 260,
        width: 100,
        isMultiYAxis: false,
        noDataImage: ChartImagesStringEnum.CHART_NO_DATA_YELLOW,
        chartOptions: {},
        showXAxisLabels: true,
        isTooltipItemInSelectedItems: true,
        showTooltipBackground: true,
        isDashboardChart: true,
    };
}
