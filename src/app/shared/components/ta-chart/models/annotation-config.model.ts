import type { ChartAnnotationPositionStringEnum } from '../enums/chart-annotation-position-string.enum';

export interface AnnotationConfig {
    type: ChartAnnotationPositionStringEnum;
    axis: string;
    color: string;
    dash: number | number[];
}
