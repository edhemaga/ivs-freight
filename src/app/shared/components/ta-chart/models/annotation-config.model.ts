import type { ChartAnnotationPositionStringEnum } from '@shared/components/ta-chart/enums/chart-annotation-position-string.enum';

export interface AnnotationConfig {
    type: ChartAnnotationPositionStringEnum;
    axis: string;
    color: string;
    dash: number | number[];
}
