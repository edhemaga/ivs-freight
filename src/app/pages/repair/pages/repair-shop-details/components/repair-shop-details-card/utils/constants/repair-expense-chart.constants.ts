import { Tabs } from '@shared/models/tabs.model';

export class RepairExpenseCartConstants {
    /* TODO - set chart types */
    // static BAR_CHART_CONFIG: any = {
    //     dataProperties: [
    //         {
    //             defaultConfig: {
    //                 type: 'line',
    //                 data: [],
    //                 label: 'Salary',
    //                 yAxisID: 'y-axis-1',
    //                 borderColor: '#6D82C7',
    //                 pointBackgroundColor: '#FFFFFF',
    //                 pointHoverBackgroundColor: '#6D82C7',
    //                 pointHoverBorderColor: '#FFFFFF',
    //                 pointHoverRadius: 3,
    //                 pointBorderWidth: 2,
    //             },
    //         },
    //         {
    //             defaultConfig: {
    //                 type: 'bar',
    //                 data: [],
    //                 label: 'Miles',
    //                 yAxisID: 'y-axis-0',
    //                 borderColor: '#FFCC80',
    //                 backgroundColor: '#FFCC80',
    //                 hoverBackgroundColor: '#FFA726',
    //                 barThickness: 18,
    //             },
    //         },
    //     ],
    //     showLegend: false,
    //     chartValues: [0, 0],
    //     onHoverAnnotation: true,
    //     hoverTimeDisplay: true,
    //     defaultType: 'bar',
    //     chartWidth: '417',
    //     chartHeight: '130',
    //     hasValue: false,
    //     offset: true,
    //     allowAnimation: true,
    //     animationOnlyOnLoad: true,
    //     dataLabels: [
    //         '',
    //         'NOV',
    //         '',
    //         '2021',
    //         '',
    //         'MAR',
    //         '',
    //         'MAY',
    //         '',
    //         'JUL',
    //         '',
    //         'SEP',
    //     ],
    //     noChartImage: 'assets/svg/common/yellow_no_data.svg',
    //     showHoverTooltip: true,
    //     showZeroLine: true,
    // };

    // static BAR_CHART_LEGEND: any[] = [
    //     {
    //         title: 'Repair',
    //         value: 0,
    //         image: 'assets/svg/common/round_yellow.svg',
    //         elementId: 1,
    //     },
    //     {
    //         title: 'Cost',
    //         value: 0,
    //         image: 'assets/svg/common/round_blue.svg',
    //         prefix: '$',
    //         elementId: 0,
    //     },
    // ];

    // static BAR_CHART_AXES: any = {
    //     verticalLeftAxes: {
    //         visible: true,
    //         minValue: 0,
    //         maxValue: 4000,
    //         stepSize: 1000,
    //         showGridLines: false,
    //     },
    //     verticalRightAxes: {
    //         visible: true,
    //         minValue: 0,
    //         maxValue: 2800,
    //         stepSize: 700,
    //         showGridLines: false,
    //     },
    //     horizontalAxes: {
    //         visible: true,
    //         position: 'bottom',
    //         showGridLines: false,
    //     },
    // };

    static REPAIR_CALL: any = {
        id: -1,
        chartType: 1,
    };

    static MONTH_LIST: string[] = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
    ];

    static CHART_TABS: Tabs[] = [
        {
            id: 1,
            name: '1M',
            checked: true,
        },
        { id: 2, name: '3M', checked: false },
        {
            id: 3,
            name: '6M',
            checked: false,
        },
        {
            id: 4,
            name: '1Y',
            checked: false,
        },
        {
            id: 5,
            name: 'YTD',
            checked: false,
        },
        {
            id: 6,
            name: 'ALL',
            checked: false,
        },
    ];
}
