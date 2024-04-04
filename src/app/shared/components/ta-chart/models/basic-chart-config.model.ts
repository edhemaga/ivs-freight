import type { BarChartConfig } from 'src/app/pages/dashboard/models/dashboard-chart-models/bar-chart.model';

export interface BasicChartConfig extends BarChartConfig {
    loadRatePerMileValue?: number;
    pricePerGallonValue?: number;
    extendFull?: boolean;
    hasSameDataIndex?: boolean;
    showHoverTooltip?: boolean;
    showZeroLine?: boolean;
    dottedZeroLine?: boolean;
}
