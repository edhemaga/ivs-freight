// Models
import { ChartTypeProperty } from '@shared/models';
import {
    IBaseDataset,
    IChartData,
} from 'ca-components/lib/components/ca-chart/models';

export class ChartHelper {
    static generateDataByDateTime<T1>(
        rawData: T1[],
        chartTypeProperties: ChartTypeProperty[]
    ): IChartData<IBaseDataset> {
        if (!rawData?.length) return;

        let datasets: IBaseDataset[] = [];
        let labels: string[] = [];

        rawData?.forEach((rawItem: T1, indx: number) => {
            let label: string = ``;
            Object.keys(rawItem)?.forEach((key: string) => {
                if (this.isNotDateTimeKey(key))
                    if (indx) return;
                    else {
                        const item: ChartTypeProperty
                            = chartTypeProperties?.find(
                                (arg) => arg.value === key
                            )
                        datasets = [
                            ...datasets,
                            {
                                type: item?.type,
                                label: key,
                                data: [],
                                borderColor: item?.color,
                                backgroundColor: item?.color,
                                borderWidth: item?.borderWidth || 2
                            },
                        ];
                    }
                else label += `${rawItem[key]}/`;
            });
            labels = [...labels, label.substring(0, label.length - 1)];

            datasets?.forEach((item: IBaseDataset) => {
                item.data = [...item.data, rawItem[item.label]];
            });
        });

        const chartData: IChartData<IBaseDataset> = {
            labels,
            datasets,
        };
        return chartData;
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

}
