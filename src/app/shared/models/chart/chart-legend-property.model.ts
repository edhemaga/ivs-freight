export interface ChartLegendProperty {
    name: string;
    value: number;
    // Can specify color or use linear gradient if needed, see Broker Payment History
    color: string;
    // Specify unit if needed to be shown next to the value
    unit?: string;
    // Some charts contain multiple types of indicators, see Broker Payment History
    isLineIndicator?: boolean;
}