// Models
import { LoadsSortDropdownModel } from '@pages/customer/models/loads-sort-dropdown.model';
import { DoughnutChartConfig } from '@pages/dashboard/models/dashboard-chart-models/doughnut-chart.model';
import { MultipleSelectDetailsDropdownItem } from '@pages/load/pages/load-details/components/load-details-item/models/multiple-select-details-dropdown-item.model';

// Enums
import { ChartAxisPositionEnum } from '@shared/components/ta-chart/enums/chart-axis-position-string.enum';
import { ChartColorsStringEnum } from '@shared/components/ta-chart/enums/chart-colors-string.enum';
import { ChartDefaultStringEnum } from '@shared/components/ta-chart/enums/chart-default-string.enum';
import { ChartImagesStringEnum } from '@shared/components/ta-chart/enums/chart-images-string.enum';
import { ChartLegendDataStringEnum } from '@shared/components/ta-chart/enums/chart-legend-data-string.enum';
import { ChartTypesStringEnum } from '@shared/components/ta-chart/enums/chart-types-string.enum';

export class BrokerConstants {
    static MILEAGE_CHART_CONFIG: DoughnutChartConfig = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesStringEnum.LINE,
                    data: [],
                    label: ChartLegendDataStringEnum.SALARY,
                    yAxisID: 'y-axis-0', //leave this as a string
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
                    hasGradiendBackground: true,
                    colors: [
                        ChartColorsStringEnum.CYAN,
                        ChartColorsStringEnum.APRICOT,
                    ],
                    hoverColors: [
                        ChartColorsStringEnum.TEAL,
                        ChartColorsStringEnum.AMBER,
                    ],
                    maxBarThickness: 18,
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: ChartTypesStringEnum.BAR,
        chartWidth: ChartDefaultStringEnum.WIDTH_417,
        chartHeight: ChartDefaultStringEnum.HEIGHT_130,
        onHoverAnnotation: true,
        offset: true,
        hoverTimeDisplay: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesStringEnum.MIXED_NO_DATA,
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
            position: ChartAxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    static MILEAGE_CHART_LEGEND = [
        {
            title: ChartLegendDataStringEnum.AVG_RATE,
            value: 2.37,
            image: ChartImagesStringEnum.BLUE_CIRCLE,
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 0,
        },
        {
            title: ChartLegendDataStringEnum.HIGHEST_RATE,
            value: 2.86,
            image: ChartImagesStringEnum.GREEN_CIRCLE,
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: [1, 0],
        },
        {
            title: ChartLegendDataStringEnum.LOWEST_RATE,
            value: 1.29,
            image: ChartImagesStringEnum.YELLOW_CIRCLE,
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: [1, 1],
        },
    ];

    static PAYMENT_CHART_CONFIG: DoughnutChartConfig = {
        dataProperties: [
            {
                defaultConfig: {
                    type: ChartTypesStringEnum.LINE,
                    data: [],
                    yAxisID: 'y-axis-0', //leave this as a string
                    borderColor: ChartColorsStringEnum.SKY_BLUE,
                    pointBackgroundColor: ChartColorsStringEnum.WHITE,
                    pointHoverBackgroundColor: ChartColorsStringEnum.SKY_BLUE,
                    pointHoverBorderColor: ChartColorsStringEnum.WHITE,
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: true,
                    hasGradiendBackground: true,
                    colors: [
                        ChartColorsStringEnum.PASTEL_BLUE,
                        ChartColorsStringEnum.RGB_WHITE,
                    ],
                },
            },
        ],
        showLegend: false,
        chartValues: [],
        defaultType: ChartTypesStringEnum.BAR,
        chartWidth: ChartDefaultStringEnum.WIDTH_417,
        chartHeight: ChartDefaultStringEnum.HEIGHT_130,
        annotation: 0,
        onHoverAnnotation: true,
        hoverTimeDisplay: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        dataLabels: [],
        noChartImage: ChartImagesStringEnum.NO_DATA_PAY,
        showHoverTooltip: true,
        showZeroLine: true,
        dottedZeroLine: true,
    };

    static PAYMENT_CHART_LEGEND = [
        {
            title: ChartLegendDataStringEnum.AVG_PAY_PERIODD,
            value: 27,
            image: ChartImagesStringEnum.BLUE_RED_CIRCLE,
            sufix: ChartLegendDataStringEnum.DAYS,
            elementId: 0,
            titleReplace: ChartLegendDataStringEnum.PAY_PERIOD,
            imageReplace: ChartImagesStringEnum.BLUE_CIRCLE,
        },
        {
            title: ChartLegendDataStringEnum.PAY_TERM,
            value: 32,
            image: ChartImagesStringEnum.DASH_LINE,
            sufix: ChartLegendDataStringEnum.DAYS,
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
            position: ChartAxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    static INVOICE_CHART_CONFIG: DoughnutChartConfig = {
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
        defaultType: ChartTypesStringEnum.BAR,
        chartWidth: ChartDefaultStringEnum.WIDTH_417,
        chartHeight: ChartDefaultStringEnum.HEIGHT_130,
        hasValue: false,
        dataLabels: [],
        onHoverAnnotation: true,
        offset: true,
        allowAnimation: true,
        animationOnlyOnLoad: true,
        hoverTimeDisplay: true,
        noChartImage: ChartImagesStringEnum.YELLOW_NO_DATA,
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
            position: ChartAxisPositionEnum.BOTTOM,
            showGridLines: false,
        },
    };

    static INVOICE_CHART_LEGEND = [
        {
            title: ChartLegendDataStringEnum.REVENUE,
            value: 0,
            image: ChartImagesStringEnum.YELLOW_CIRCLE,
            prefix: ChartLegendDataStringEnum.DOLLAR,
            elementId: 1,
        },
        {
            title: ChartLegendDataStringEnum.LOAD,
            value: 0,
            image: ChartImagesStringEnum.BLUE_CIRCLE,
            elementId: 0,
        },
    ];

    static MULTIPLE_SELECT_DETAILS_DROPDOWN: MultipleSelectDetailsDropdownItem[] =
        [
            {
                id: 4,
                title: 'All Load',
                length: null,
                isActive: true,
            },
            {
                id: 1,
                title: 'Pending',
                length: null,
                isActive: false,
                hideCount: true,
            },
            {
                id: 2,
                title: 'Active',
                length: null,
                isActive: false,
                hideCount: true,
            },
            {
                id: 3,
                title: 'Closed',
                length: null,
                isActive: false,
                hideCount: true,
            },
        ];

    static BROKER_LOADS_SORT_DROPDOWN: LoadsSortDropdownModel[] = [
        {
            id: 1,
            name: 'Load No.',
            sortName: 'loadNumber',
            active: true,
        },
        {
            id: 2,
            name: 'Ref #',
            sortName: 'referenceNumber',
        },
        {
            id: 3,
            name: 'Truck',
            sortName: 'truck',
        },
        {
            id: 4,
            name: 'Trailer',
            sortName: 'trailer',
        },
        {
            id: 5,
            name: 'Driver',
            sortName: 'driver',
        },
        {
            id: 6,
            name: 'Dispatcher',
            sortName: 'dispatcher',
        },
        {
            id: 7,
            name: 'Total Rate',
            sortName: 'totalRate',
        },
        {
            id: 8,
            name: 'Total Miles',
            sortName: 'totalMiles',
        },
    ];
}
