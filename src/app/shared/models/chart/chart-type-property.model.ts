// Enums
import { ChartTypesStringEnum } from "ca-components/lib/components/ca-chart/enums";

export interface ChartTypeProperty {
    type: ChartTypesStringEnum;
    color?: string;
    borderWidth?: number;
    value?: string;
    minValue?: string;
    maxValue?: string;
};