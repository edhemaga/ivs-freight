import type { ChartAxisPositionEnum } from '../enums/chart-axis-position-string.enum';
import type { AxisGridLines } from './axis-grid-lines.model';
import type { AxisTicks } from './axis-ticks.model';

export interface Axis {
    stacked: boolean;
    display: boolean;
    position: ChartAxisPositionEnum;
    gridLines: AxisGridLines;
    ticks: AxisTicks;
}
