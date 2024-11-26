// Enums
import { ChartTypesStringEnum } from "ca-components/lib/components/ca-chart/enums";

export interface ChartTypeProperty {
    type: ChartTypesStringEnum;
    color?: string;
    colorEdgeValue?: number;
    color2?: string;
    color2EdgeValue?: number;
    borderWidth?: number;
    value?: string;
    minValue?: string;
    maxValue?: string;
    fill?: boolean;
    shiftValue?: number;
};