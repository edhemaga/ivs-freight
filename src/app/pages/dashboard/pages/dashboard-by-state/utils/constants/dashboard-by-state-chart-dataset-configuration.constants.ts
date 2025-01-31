import { ChartTypesStringEnum } from 'ca-components';

export class DashboardByStateChartDatasetConfiguration {
    public static get BY_STATE_CHART_DATASET_CONFIG() {
        return {
            type: ChartTypesStringEnum.BAR,
        barPercentage: 0.9,
        categoryPercentage: 0.5,
        minBarLength: 0.5,
        borderRadius: {
            topLeft: 2,
            topRight: 2,
            bottomLeft: 0,
            bottomRight: 0,
        },
        }
    };
}
