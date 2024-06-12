import { ChartAxisPositionEnum } from '@shared/components/ta-chart/enums/chart-axis-position-string.enum';
import { ChartColorsStringEnum } from '@shared/components/ta-chart/enums/chart-colors-string.enum';
import { ChartDefaultStringEnum } from '@shared/components/ta-chart/enums/chart-default-string.enum';
import { ChartImagesStringEnum } from '@shared/components/ta-chart/enums/chart-images-string.enum';
import { ChartLegendDataStringEnum } from '@shared/components/ta-chart/enums/chart-legend-data-string.enum';
import { ChartTypesStringEnum } from '@shared/components/ta-chart/enums/chart-types-string.enum';
import { ChartTabStringEnum } from '@shared/enums/chart-tab-string.enum';

// models
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { ChartApiCall } from '@shared/components/ta-chart/models/chart-api-call.model';

export class DriverDetailsCardConstants {
    static BAR_CHART_CONFIG = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesStringEnum.LINE,
                    data: [],
                    label: ChartLegendDataStringEnum.SALARY,
                    yAxisID: 'y-axis-1', //leave this as a string
                    borderColor: ChartColorsStringEnum.SKY_BLUE,
                    pointBackgroundColor: ChartColorsStringEnum.WHITE,
                    pointHoverBackgroundColor: ChartColorsStringEnum.SKY_BLUE,
                    pointHoverBorderColor: ChartColorsStringEnum.WHITE,
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: ChartTypesStringEnum.BAR,
                    data: [],
                    label: ChartLegendDataStringEnum.MILES,
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsStringEnum.PEACH,
                    backgroundColor: ChartColorsStringEnum.PEACH,
                    hoverBackgroundColor: ChartColorsStringEnum.ORANGE,
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        defaultType: ChartTypesStringEnum.BAR,
        chartWidth: ChartDefaultStringEnum.WIDTH_417,
        chartHeight: ChartDefaultStringEnum.HEIGHT_130,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesStringEnum.YELLOW_NO_DATA,
        showHoverTooltip: true,
        showZeroLine: true,
    };

    static BAR_CHART_LEGEND = [
        {
            title: ChartLegendDataStringEnum.MILES,
            value: 0,
            image: ChartImagesStringEnum.YELLOW_CIRCLE,
            sufix: ChartLegendDataStringEnum.MI,
            elementId: 1,
        },
        {
            title: ChartLegendDataStringEnum.SALARY,
            value: 0,
            image: ChartImagesStringEnum.BLUE_CIRCLE,
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 0,
        },
    ];

    static BAR_CHART_AXES = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 4000,
            stepSize: 1000,
            showGridLines: true,
        },
        verticalRightAxes: {
            visible: true,
            minValue: 0,
            maxValue: 2800,
            stepSize: 700,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: ChartAxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    static BAR_CHART_TABS: TabOptions[] = [
        {
            id: 223,
            name: ChartTabStringEnum.ONE_MONTH,
            checked: true,
        },
        {
            id: 313,
            name: ChartTabStringEnum.THREE_MONTHS,
            checked: false,
        },
        {
            id: 412,
            name: ChartTabStringEnum.SIX_MONTHS,
            checked: false,
        },
        {
            id: 515,
            name: ChartTabStringEnum.ONE_YEAR,
            checked: false,
        },
        {
            id: 1210,
            name: ChartTabStringEnum.YEAR_TO_DATE,
            checked: false,
        },
        {
            id: 1011,
            name: ChartTabStringEnum.ALL,
            checked: false,
        },
    ];

    static BAR_CHART_PAYROLL_API_CALL: ChartApiCall = {
        id: -1,
        chartType: 1,
    };
}
