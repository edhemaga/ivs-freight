// Models
import { ChartTypeProperty, Tabs } from '@shared/models';
import {
    IBaseDataset,
    IChartData,
} from 'ca-components/lib/components/ca-chart/models';

// Constants
import { ChartConstants } from '../constants/charts/chart.constants';

// Enums
import { ChartTypesStringEnum } from 'ca-components';
import { ChartTabStringEnum } from '@shared/enums';

export class ChartHelper {
    public static generateDataByDateTime<T>(
        rawData: T[],
        chartTypeProperties: ChartTypeProperty[],
        timeFilter?: number
    ): IChartData<IBaseDataset> {
        if (!rawData?.length || !chartTypeProperties?.length) return;

        let datasets: IBaseDataset[] = [];
        let labels: string[] = [];

        chartTypeProperties?.forEach((property: ChartTypeProperty) => {
            let properties: IBaseDataset = {
                type: property?.type,
                label: property.value,
                borderWidth: property?.borderWidth || 2,
                data: [],
                color1: property?.color,
                color2: property?.color2 || property.color,
            };

            switch (property.type) {
                case ChartTypesStringEnum.LINE:
                    datasets = [
                        ...datasets,
                        {
                            ...properties,
                            borderColor: property.color,
                            fill: property.fill,
                            colorEdgeValue: property.colorEdgeValue,
                            data: [
                                ...rawData.map((item: T) => {
                                    return item[property.value] || 0;
                                }),
                            ],
                        },
                    ];
                    break;
                case ChartTypesStringEnum.BAR:
                    datasets = [
                        ...datasets,
                        {
                            ...properties,
                            borderWidth: 0,
                            data: [
                                ...rawData.map((item: T): [number, number] => {
                                    return [
                                        item[property.minValue] ?? 0,
                                        item[property.maxValue] ?? 0,
                                    ];
                                }),
                            ],
                        },
                    ];
                    break;

                default:
                    return;
            }
        });

        labels = this.getXAxisFormatedLabels(rawData, timeFilter);

        const chartData: IChartData<IBaseDataset> = {
            labels,
            datasets,
        };
        return chartData;
    }

    public static generateTimeTabs(): Tabs[] {
        return Object.keys(ChartTabStringEnum)?.map(
            (key: string, indx: number) => {
                const tab: Tabs = {
                    id: indx + 1,
                    name: ChartTabStringEnum[key],
                    checked: indx === 0,
                };
                return tab;
            }
        );
    }

    private static getXAxisFormatedLabels<T>(
        rawData: T[],
        timeFilter: number
    ): string[] {
       
        return rawData.map((item: T) => {
            const day = item['day'] as number;
            const month = item['month'] as number;
            const year = item['year'] as number;

            if (
                timeFilter === 1 ||
                timeFilter === 2 ||
                timeFilter === 3 ||
                timeFilter === 6 ||
                !timeFilter
            )
                return `${day} ${ChartConstants.MONTH_NAMES_SHORT[month - 1]}`;
            else if (timeFilter === 4 || timeFilter === 5)
                return month === 1 ? `${year}` : ChartConstants.MONTH_NAMES_SHORT[month - 1];
            return '';
        });
    }

    private static capitalizeFirstLetter(val: string): string {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    private static lowerCaseFirstLetter(val: string): string {
        return String(val).charAt(0).toLowerCase() + String(val).slice(1);
    }
}
