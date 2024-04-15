import { ChartAxisPositionEnum } from '@shared/components/ta-chart/enums/chart-axis-position-string.enum';

// models
import { AxisGridLines } from '@shared/components/ta-chart/models/axis-grid-lines.model';
import { AxisTicks } from '@shared/components/ta-chart/models//axis-ticks.model';

export interface Axis {
    stacked: boolean;
    display: boolean;
    position: ChartAxisPositionEnum;
    gridLines: AxisGridLines;
    ticks: AxisTicks;
}
