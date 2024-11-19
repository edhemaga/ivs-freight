// Models
import { ChartLegendProperty, ChartTypeProperty } from '@shared/models';
import {
    IBaseDataset,
    IChartData,
} from 'ca-components/lib/components/ca-chart/models';

export class ChartHelper {
    public static generateDataByDateTime<T>(
        rawData: T[],
        chartTypeProperties: ChartTypeProperty[]
    ): IChartData<IBaseDataset> {
        if (!rawData?.length) return;

        let datasets: IBaseDataset[] = [];
        let labels: string[] = [];

        rawData?.forEach((rawItem: T, indx: number) => {
            let label: string = ``;
            Object.keys(rawItem)?.forEach((key: string) => {
                if (this.isNotDateTimeKey(key))
                    if (indx) return;
                    else {
                        const capitalizedKey: string = this.capitalizeFirstLetter(key);
                        const item: ChartTypeProperty
                            = {
                            ...chartTypeProperties?.find(
                                (arg: ChartTypeProperty) =>
                                    this.capitalizeFirstLetter(arg.value) ===
                                    capitalizedKey,

                            ),
                            value: capitalizedKey
                        };
                        datasets = [
                            ...datasets,
                            {
                                type: item?.type,
                                label: item.value,
                                data: [],
                                borderColor: item?.color,
                                backgroundColor: item?.color,
                                borderWidth: item?.borderWidth || 2
                            },
                        ];
                    }
                else label += `${rawItem[key]}${key !== 'year' ? '/' : ''}`;
            });
            labels = [...labels, this.capitalizeFirstLetter(label)];

            datasets?.forEach((item: IBaseDataset) => {
                item.data = [...item.data, rawItem[this.lowerCaseFirstLetter(item.label)]];
                item.label = (item.label);
            });
        });

        const chartData: IChartData<IBaseDataset> = {
            labels,
            datasets,
        };
        return chartData;
    }

    public static generateLegendData(datasets: IBaseDataset[]): ChartLegendProperty[] {
        let legendData: ChartLegendProperty[] = [];
        datasets.forEach((item: IBaseDataset) => {
            const legendItem: ChartLegendProperty = {
                name: item.label,
                value: item.data.reduce(
                    (accumulator, currentValue) =>
                        accumulator + currentValue,
                    0),
                color: item.borderColor
            }
            legendData = [...legendData, legendItem];
        });
        return legendData;
    }


    private static isNotDateTimeKey(key: string): boolean {
        switch (key) {
            case 'day':
                return false;
            case 'month':
                return false;
            case 'year':
                return false;
            default:
                return true;
        }
    }

    private static capitalizeFirstLetter(val: string): string {
        return String(val).charAt(0).toUpperCase()
            + String(val).slice(1);
    }

    private static lowerCaseFirstLetter(val: string): string {
        return String(val).charAt(0).toLowerCase()
            + String(val).slice(1);
    }

}
