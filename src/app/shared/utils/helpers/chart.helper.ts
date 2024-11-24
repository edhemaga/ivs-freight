// Models
import { ChartTabStringEnum } from '@shared/enums';
import { ChartTypeProperty, Tabs } from '@shared/models';
import { ChartTypesStringEnum } from 'ca-components';
import {
    IBaseDataset,
    IChartData,
} from 'ca-components/lib/components/ca-chart/models';

export class ChartHelper {
    public static generateDataByDateTime<T>(
        rawData: T[],
        chartTypeProperties: ChartTypeProperty[]
    ): IChartData<IBaseDataset> {
        if (!rawData?.length || !chartTypeProperties?.length) return;

        let datasets: IBaseDataset[] = [];
        let labels: string[] = [];

        chartTypeProperties?.forEach((property: ChartTypeProperty) => {
            let properties: IBaseDataset = {
                type: property?.type,
                label: property.value,
                borderColor: property?.color,
                backgroundColor: property?.color,
                borderWidth: property?.borderWidth || 2,
                data: [],
            };

            switch (property.type) {
                case ChartTypesStringEnum.LINE:
                    datasets = [
                        ...datasets,
                        {
                            ...properties,
                            data: [...rawData.map((item: T) => {
                                return item[property.value] || 0;
                            })],
                        },
                    ];
                    break;
                case ChartTypesStringEnum.BAR:
                    datasets = [
                        ...datasets,
                        {
                            ...properties,
                            data: [...rawData.map((item: T) => {
                                return [
                                    item[property.minValue] ?? 0,
                                    item[property.maxValue] ?? 0
                                ]
                            })],
                            yAxisID: 'y-axis-0'
                        },
                    ];
                    break;

                default:
                    return;

            }
        });

        labels = [...rawData.map((item: T) => {
            return `${item['day']}/${item['month']}/${item['year']}`;
        })];

        const chartData: IChartData<IBaseDataset> = {
            labels,
            datasets,
        };
        return chartData;
    }

    public static generateTimeTabs(): Tabs[] {
        return Object.keys(ChartTabStringEnum)
            ?.map((key: string, indx: number) => {
                const tab: Tabs = {
                    id: indx + 1,
                    name: ChartTabStringEnum[key],
                    checked: indx === 0
                }
                return tab;
            })
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
