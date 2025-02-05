// Models
import { ChartTypeProperty, Tabs } from '@shared/models';
import {
    IBaseDataset,
    IChartCenterLabel,
    IChartData,
} from 'ca-components/lib/components/ca-chart/models';

// Constants
import { ChartConstants } from '@shared/utils/constants';

// Enums
import { ChartTypesStringEnum } from 'ca-components';
import { ChartTabStringEnum } from '@shared/enums';

export class ChartHelper {
    // Since all chart responses are of the same format, we can use generic type
    // The response is going to consisted of one or multiple summed values and the list of of object with all the corresponding values including date stamps (day, month, year)
    public static generateDataByDateTime<T>(
        rawData: T[],
        chartTypeProperties: ChartTypeProperty[],
        timeFilter?: number,
        colors?: string[]
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
                order: property?.type === ChartTypesStringEnum.BAR ? 2 : 1,
                label: property.value,
                borderWidth: property?.borderWidth || 2,
                data: [],
                color: property?.color,
                color2: property?.color2 || property.color,
                shiftValue: property.shiftValue
            };

            // Since there are unique use cases for the usage that are not applicable to other types of graphs, special checks were performed
            // For example line can accept list of numbers as values, but bar chart can accept array of numbers that contain upper and lower values
            // See data property assignment
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
                case ChartTypesStringEnum.DOUGHNUT:
                    let datasetColors: string[] = [];
                    if (colors?.length) {
                        colors.forEach((color: string) => {
                            if (color) datasetColors = [...datasetColors, this.hexToRgba(color)]
                        });
                    }
                    datasets = [
                        ...datasets,
                        {
                            ...properties,
                            data: [...rawData.map((item: T) => {
                                return item[property.value] || 0; // For mock purposes replace '|| 0' with '|| Math.random() * 10'; use bigger values for random if needed
                            })],
                            backgroundColor: [...datasetColors, this.hexToRgba('#cccccc')]
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
                                    item[property.minValue] || 0, // For mock purposes replace '|| 0' with '|| Math.random() * 10'; use bigger values for random if needed
                                    item[property.maxValue] || 0 // For mock purposes replace '|| 0' with '|| Math.random() * 10'; use bigger values for random if needed
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

    /**
     * Generates formatted labels for the X-axis of a chart based on the provided data and time filter.
     *
     * The function processes an array of objects, where each object is expected to 
     * contain `day`, `month`, and `year` properties. Depending on the `timeFilter` value, 
     * it formats the labels for individual days, months, or years using abbreviated month names.
     *
     * - If `timeFilter` corresponds to daily or weekly views (values 1, 2, 3, 6, or empty ),
     *   the label is formatted as "21 DEC" (day and abbreviated month).
     * - If `timeFilter` corresponds to monthly or yearly views (values 4 or 5):
     * - For January (`month === 1`), it shows the year ("exp. 2023").
     * - For other months, it shows the abbreviated month ("exp. DEC").
     * - For unsupported `timeFilter` values, it returns an empty string.
     * 
     * ---The logic is changed for some scenarios it has to be updated, also response from BE will heve to be reworked 
     */
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
                !timeFilter
            )
                return `${day} ${ChartConstants.MONTH_NAMES_SHORT[month - 1]}`;
            else if (timeFilter === 4 || timeFilter === 5)
                return month === 1 ? `${year}` : ChartConstants.MONTH_NAMES_SHORT[month - 1];
            else if (timeFilter === 6) {
                const label = month !== null ?
                    `${ChartConstants.MONTH_NAMES_SHORT[month - 1]} ${year}` :
                    `${year}`
                return label;
            }
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

    public static takeDoughnutData(dataLength: number): number {
        switch (true) {
            case dataLength <= 10:
                return 3;
            case dataLength > 10 && dataLength <= 30:
                return 5;
            case dataLength > 30:
                return 9;
            default:
                return 0;
        }
    }

    private static hexToRgba(colorHex: string, opacity: number = 1): string {
        colorHex = colorHex.replace(/^#/, '');

        if (colorHex.length === 3) {
            colorHex
                .split('')
                .map((char) => char + char)
                .join('');
        }

        const bigint = parseInt(colorHex, 16);
        const red = (bigint >> 16) & 255;
        const green = (bigint >> 8) & 255;
        const blue = bigint & 255;

        return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    }

    public static generateDoughnutCenterLabelData(
        totalPercentage: number,
        total: number,
        count: number,
        otherCount: number
    ): IChartCenterLabel[] {
        return [
            {
                value: `${totalPercentage.toFixed(2)}%`,
                position: {
                    top: -14
                }
            },
            {
                value: `${total.toFixed(2)}`,
                fontSize: 14,
                position: {
                    top: -14
                }
            },
            {
                value: `Top ${count}`,
                fontSize: 11,
                color: '#AAAAAA',
                position: {
                    top: -14
                }
            },
            {
                value: `${((100 - totalPercentage)).toFixed(2)}%`,
                position: {
                    top: 14
                }
            },
            {
                value: `${otherCount.toFixed(2)}`,
                fontSize: 14,
                position: {
                    top: 14
                }
            },
            {
                value: `All others`,
                fontSize: 11,
                color: '#AAAAAA',
                position: {
                    top: 14
                }
            },
        ];
    }

    public static setChartLegend(index: number, labels: string[]): {
        hasHighlightedBackground: boolean,
        title: string
    } {

        let hasHighlightedBackground: boolean = false;
        let title: string;

        if (index === null || index < 0) {
            hasHighlightedBackground = false;
            title = '';
        }
        else {
            hasHighlightedBackground = true;
            title = labels[index];
        }

        return { hasHighlightedBackground, title };
    }
}
