import {
    AxisPositionEnum,
    ChartColorsEnum,
    ChartDefaultsEnum,
    ChartImagesEnum,
    ChartLegendDataEnum,
    ChartTypesEnum,
} from 'src/app/shared/components/ta-chart/enums/chart-enums';

export class DriverDetailsCard {
    static BAR_CHART_CONFIG = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesEnum.LINE,
                    data: [],
                    label: ChartLegendDataEnum.SALARY,
                    yAxisID: 'y-axis-1', //leave this as a string
                    borderColor: ChartColorsEnum.SKY_BLUE,
                    pointBackgroundColor: ChartColorsEnum.WHITE,
                    pointHoverBackgroundColor: ChartColorsEnum.SKY_BLUE,
                    pointHoverBorderColor: ChartColorsEnum.WHITE,
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                },
            },
            {
                defaultConfig: {
                    type: ChartTypesEnum.BAR,
                    data: [],
                    label: ChartLegendDataEnum.MILES,
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsEnum.PEACH,
                    backgroundColor: ChartColorsEnum.PEACH,
                    hoverBackgroundColor: ChartColorsEnum.ORANGE,
                    barThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        defaultType: ChartTypesEnum.BAR,
        chartWidth: ChartDefaultsEnum.WIDTH_417,
        chartHeight: ChartDefaultsEnum.HEIGHT_130,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesEnum.YELLOW_NO_DATA,
        showHoverTooltip: true,
        showZeroLine: true,
    };

    static BAR_CHART_LEGEND = [
        {
            title: ChartLegendDataEnum.MILES,
            value: 0,
            image: ChartImagesEnum.YELLOW_CIRCLE,
            sufix: ChartLegendDataEnum.MI,
            elementId: 1,
        },
        {
            title: ChartLegendDataEnum.SALARY,
            value: 0,
            image: ChartImagesEnum.BLUE_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
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
            position: AxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };
}
