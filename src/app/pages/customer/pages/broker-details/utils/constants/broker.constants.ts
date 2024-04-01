//Models
import { DoughnutChartConfig } from 'src/app/pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';

//Enums
import {
    AxisPositionEnum,
    ChartColorsEnum,
    ChartDefaultsEnum,
    ChartImagesEnum,
    ChartLegendDataEnum,
    ChartTypesEnum,
} from 'src/app/core/components/standalone-components/ta-chart/enums/chart-enums';

export class BrokerConstants {
    static MILEAGE_CHART_CONFIG: DoughnutChartConfig = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesEnum.LINE,
                    data: [],
                    label: ChartLegendDataEnum.SALARY,
                    yAxisID: 'y-axis-0', //leave this as a string
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
                    hasGradiendBackground: true,
                    colors: [ChartColorsEnum.CYAN, ChartColorsEnum.APRICOT],
                    hoverColors: [ChartColorsEnum.TEAL, ChartColorsEnum.AMBER],
                    maxBarThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: ChartTypesEnum.BAR,
        chartWidth: ChartDefaultsEnum.WIDTH_417,
        chartHeight: ChartDefaultsEnum.HEIGHT_130,
        onHoverAnnotation: true,
        offset: true,
        hoverTimeDisplay: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesEnum.MIXED_NO_DATA,
        showHoverTooltip: true,
        showZeroLine: true,
        dottedZeroLine: true,
    };

    static MILEAGE_BAR_AXES = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 100,
            stepSize: 1,
            showGridLines: true,
            decimal: true,
        },
        horizontalAxes: {
            visible: true,
            position: AxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    static MILEAGE_CHART_LEGEND = [
        {
            title: ChartLegendDataEnum.AVG_RATE,
            value: 2.37,
            image: ChartImagesEnum.BLUE_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: 0,
        },
        {
            title: ChartLegendDataEnum.HIGHEST_RATE,
            value: 2.86,
            image: ChartImagesEnum.GREEN_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: [1, 0],
        },
        {
            title: ChartLegendDataEnum.LOWEST_RATE,
            value: 1.29,
            image: ChartImagesEnum.YELLOW_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: [1, 1],
        },
    ];

    static PAYMENT_CHART_CONFIG: DoughnutChartConfig = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesEnum.LINE,
                    data: [],
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsEnum.SKY_BLUE,
                    pointBackgroundColor: ChartColorsEnum.WHITE,
                    pointHoverBackgroundColor: ChartColorsEnum.SKY_BLUE,
                    pointHoverBorderColor: ChartColorsEnum.WHITE,
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: true,
                    hasGradiendBackground: true,
                    colors: [
                        ChartColorsEnum.PASTEL_BLUE,
                        ChartColorsEnum.RGB_WHITE,
                    ],
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: ChartTypesEnum.BAR,
        chartWidth: ChartDefaultsEnum.WIDTH_417,
        chartHeight: ChartDefaultsEnum.HEIGHT_130,
        annotation: 0,
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesEnum.NO_DATA_PAY,
        showHoverTooltip: true,
        showZeroLine: true,
        dottedZeroLine: true,
    };

    static PAYMENT_CHART_LEGEND = [
        {
            title: ChartLegendDataEnum.AVG_PAY_PERIODD,
            value: 27,
            image: ChartImagesEnum.BLUE_RED_CIRCLE,
            sufix: ChartLegendDataEnum.DAYS,
            elementId: 0,
            titleReplace: ChartLegendDataEnum.PAY_PERIOD,
            imageReplace: ChartImagesEnum.BLUE_CIRCLE,
        },
        {
            title: ChartLegendDataEnum.PAY_TERM,
            value: 32,
            image: ChartImagesEnum.DASH_LINE,
            sufix: ChartLegendDataEnum.DAYS,
        },
    ];

    static PAYMENT_CHART_AXES = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 52,
            stepSize: 13,
            showGridLines: true,
        },
        horizontalAxes: {
            visible: true,
            position: AxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    static INVOICE_CHART_CONFIG: DoughnutChartConfig = {
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
        defaultType: ChartTypesEnum.BAR,
        chartWidth: ChartDefaultsEnum.WIDTH_417,
        chartHeight: ChartDefaultsEnum.HEIGHT_130,
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        hoverTimeDisplay: true,
        noChartImage: ChartImagesEnum.YELLOW_NO_DATA,
        showHoverTooltip: true,
        showZeroLine: true,
    };

    static INVOICE_CHART_AXES = {
        verticalLeftAxes: {
            visible: true,
            minValue: 0,
            maxValue: 60,
            stepSize: 15,
            showGridLines: false,
        },
        verticalRightAxes: {
            visible: true,
            minValue: 0,
            maxValue: 24000,
            stepSize: 6000,
            showGridLines: false,
        },
        horizontalAxes: {
            visible: true,
            position: AxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    static INVOICE_CHART_LEGEND = [
        {
            title: ChartLegendDataEnum.REVENUE,
            value: 0,
            image: ChartImagesEnum.YELLOW_CIRCLE,
            prefix: ChartLegendDataEnum.DOLLAR,
            elementId: 1,
        },
        {
            title: ChartLegendDataEnum.LOAD,
            value: 0,
            image: ChartImagesEnum.BLUE_CIRCLE,
            elementId: 0,
        },
    ];
}
