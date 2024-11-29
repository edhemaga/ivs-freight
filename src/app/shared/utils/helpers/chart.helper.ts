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
    // Since all chart responses are of the same format, we can use generic type
    // The response is going to consisted of one or multiple summed values and the list of of object with all the corresponding values including date stamps (day, month, year)
    public static generateDataByDateTime<T>(
        rawData: T[],
        chartTypeProperties: ChartTypeProperty[],
        timeFilter?: number
    ): IChartData<IBaseDataset> {
        // If data or configuration is not passed properly do not procede further
        if (!rawData?.length || !chartTypeProperties?.length) return;

        let datasets: IBaseDataset[] = [];
        let labels: string[] = [];

        // The idea is to iterate through each property in the configuration rather than in each property in the response
        // The reason behind is because the chartTypeProperties is going to contain exact properties displayed on chart
        // This means that each value for defined in this object will have a corresponding representation on the graph
        // In addition, labels such as day, month and year can be ignored and would not be treated as properties containing values rather as auxillary values
        // The initial idea was to iterate through rawData and each property, but with the introduction of property config, that is not necessary
        chartTypeProperties?.forEach((property: ChartTypeProperty) => {
            let properties: IBaseDataset = {
                type: property?.type,
                label: property.value,
                borderWidth: property?.borderWidth || 2,
                data: [],
                color1: property?.color,
                color2: property?.color2 || property.color,
                shiftValue: property.shiftValue
            };

            // Since there are unique use cases for the usage that are not applicable to other types of graphs, special checks were performed
            // For example line can accept list of numbers as values, but bar chart can accept array of numbers that contain upper and lower values
            // See data property assignement
            switch (property.type) {
                case ChartTypesStringEnum.LINE:
                    datasets = [
                        ...datasets,
                        {
                            ...properties,
                            borderColor: property.color,
                            fill: property.fill,
                            colorEdgeValue: property.colorEdgeValue,
                            data: [...rawData.map((item: T) => {
                                return item[property.value] || 0; // For mock purposes replace '|| 0' with '|| Math.random() * 10'; use bigger values for random if needed
                            })],
                        },
                    ];
                    break;
                case ChartTypesStringEnum.BAR:
                    datasets = [
                        ...datasets,
                        {
                            ...properties,
                            borderWidth: 0, // Adjust if needed, for the time being no borders were used for bar charts
                            data: [...rawData.map((item: T): [number, number] => {
                                return [
                                    item[property.minValue] ?? 0, // For mock purposes replace '|| 0' with '|| Math.random() * 10'; use bigger values for random if needed
                                    item[property.maxValue] ?? 0 // For mock purposes replace '|| 0' with '|| Math.random() * 10'; use bigger values for random if needed
                                ]
                            })],
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


    // Helper that generate tabs with corresponding values for the picker component, see implementation in any component where it is used
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

    // Two helper functions that can help with label formation
    private static capitalizeFirstLetter(val: string): string {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    private static lowerCaseFirstLetter(val: string): string {
        return String(val).charAt(0).toLowerCase() + String(val).slice(1);
    }
}
