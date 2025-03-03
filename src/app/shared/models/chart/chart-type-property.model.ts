// Enums
import { eChartTypesString } from 'ca-components/lib/components/ca-chart/enums';

export interface ChartTypeProperty {
    type: eChartTypesString;
    color?: string;
    // colorEdgeValue is used to distinguish where the color should transition to another
    // If no transition is required, leave empty
    colorEdgeValue?: number;
    // color2 can be mainly used for bar charts, see Truck Detail Expenses chart
    color2?: string;
    color2EdgeValue?: number;
    // Can pass but default would be 2
    borderWidth?: number;
    value?: string;
    // Y axis min and max value
    minValue?: string;
    maxValue?: string;
    // If the area below line is going to be colored
    fill?: boolean;
    // See Payment History Chart, the idea is to have a value until a certain style is applied
    // Needs to be reworked, initial idea
    shiftValue?: number;
}
