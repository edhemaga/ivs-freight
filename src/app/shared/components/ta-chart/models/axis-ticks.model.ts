export interface AxisTicks {
    display: boolean;
    beginAtZero: boolean;
    stepSize: number;
    max: number;
    min: number;
    fontColor: string;
    fontSize: number;
    fontFamily: string;
    padding: number;
    callback: (value: number | string) => string;
}
