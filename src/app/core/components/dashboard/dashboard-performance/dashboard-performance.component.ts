import {
    Component,
    OnInit,
    ViewChild,
    OnChanges,
    OnDestroy,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// decorators
import { Titles } from 'src/app/core/utils/application.decorators';

// moment
import moment from 'moment';

// store
import { DashboardQuery } from '../state/store/dashboard.query';

// constants
import { DashboardPerformanceConstants } from '../state/utils/dashboard-performance.constants';
import { DashboardTopRatedConstants } from '../state/utils/dashboard-top-rated.constants';
import { DashboardSubperiodConstants } from '../state/utils/dashboard-subperiod.constants';
import { DashboardColors } from '../state/utils/dashboard-colors.constants';

// helpers
import { DashboardUtils } from '../state/utils/dashboard-utils';

// enums
import { ConstantStringEnum } from '../state/enum/constant-string.enum';

// models
import { DashboardTab } from '../state/models/dashboard-tab.model';
import { DropdownListItem } from '../state/models/dropdown-list-item.model';
import { PerformanceDataItem } from '../state/models/performance-data-item.model';
import { PerformanceColorsPallete } from '../state/models/colors-pallete.model';
import { CustomPeriodRange } from '../state/models/custom-period-range.model';

@Titles()
@Component({
    selector: 'app-dashboard-performance',
    templateUrl: './dashboard-performance.component.html',
    styleUrls: ['./dashboard-performance.component.scss'],
})
export class DashboardPerformanceComponent
    implements OnInit, OnChanges, OnDestroy
{
    private destroy$: Subject<void> = new Subject<void>();

    public performanceForm: UntypedFormGroup;
    public performanceData: PerformanceDataItem[] = [
        {
            title: 'NET INCOME',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 462.57,
            lastMonthTrend: 138.01,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'REVENUE',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 642.3,
            lastMonthTrend: 5.37,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'LOAD',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 37,
            lastMonthTrend: 3,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'MILES',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 15.35,
            lastMonthTrend: 2.06,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'FUEL GALLON',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 2.35,
            lastMonthTrend: 237.5,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'FUEL COST',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 19.3,
            lastMonthTrend: 2.37,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'REPAIR COST',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 8.34,
            lastMonthTrend: 768.3,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'ROADSIDE INSP.',
            isSelected: false,
            isHovered: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 47,
            lastMonthTrend: 5,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'VIOLATION',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 5,
            lastMonthTrend: 1,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'ACCIDENT',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 0,
            lastMonthTrend: 'SAME AS',
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'EXPENSES',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 322.25,
            lastMonthTrend: 8.37,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'DRIVER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 3,
            lastMonthTrend: 'SAME AS',
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'TRUCK',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 5,
            lastMonthTrend: 2,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'TRAILER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 2,
            lastMonthTrend: 2,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'OWNER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 1,
            lastMonthTrend: 1,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'USER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 0,
            lastMonthTrend: 6,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'REPAIR SHOP',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 12,
            lastMonthTrend: 4,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'BROKER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 7,
            lastMonthTrend: 1,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
        {
            title: 'SHIPPER',
            isHovered: false,
            isSelected: false,
            selectedColor: null,
            selectedHoverColor: null,
            lastMonthValue: 35,
            lastMonthTrend: 12,
            monthlyAverageValue: 283.32,
            monthlyAverageTrend: 37.24,
        },
    ];

    private selectedPerformanceDataCount: number = 0;

    // tabs
    public performanceTabs: DashboardTab[] = [];
    private currentActiveTab: DashboardTab;

    // dropdown
    public subPeriodDropdownList: DropdownListItem[] = [];
    public selectedSubPeriod: DropdownListItem;

    private selectedCustomPeriodRange: CustomPeriodRange;

    private overallCompanyDuration: number;

    // colors
    public performanceDataColors: PerformanceColorsPallete[] = [];

    //////////////////////////////////////////////////////////////////////////////////
    @ViewChild('topChart', { static: false }) public topChart: any;
    @ViewChild('bottomChart', { static: false }) public bottomChart: any;

    backgroundCards: any[] = ['73D0F1', 'FFD54F', 'BDE08E', 'F69FF3', 'A1887F'];
    selectedColors: any = {
        income: '8A9AEF',
        miles: 'FDB46B',
        roadside: 'F27B8E',
        driver: '6DC089',
        accident: 'A574C3',
    };

    public lineChartConfig: object = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        12, 21, 27, 37, 28, 25, 21, 10, 15, 45, 27, 46, 41, 28,
                        24, 12, 21, 27, 37, 28, 25, 21, 10, 20,
                    ],
                    borderColor: '#8A9AEF',
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverBorderColor: '#8A9AEF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: false,
                    hasGradiendBackground: true,
                    colors: [
                        'rgba(189, 202, 235, 0.4)',
                        'rgba(189, 202, 235, 0)',
                    ],
                    id: 'income',
                    hidden: false,
                    label: 'Net Gross',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 46, 10, 14,
                        30, 7, 28, 11, 20, 39, 46, 10, 12, 10,
                    ],
                    borderColor: '#FDB46B',
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverBorderColor: '#FDB46B',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: false,
                    hasGradiendBackground: true,
                    colors: [
                        'rgba(165, 116, 195, 0.4)',
                        'rgba(165, 116, 195, 0)',
                    ],
                    id: 'miles',
                    hidden: false,
                    label: 'Miles',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        10, 12, 46, 10, 14, 30, 7, 28, 11, 20, 10, 12, 46, 10,
                        14, 30, 29, 11, 19, 20, 39, 46, 10, 15,
                    ],
                    borderColor: '#F27B8E',
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverBorderColor: '#F27B8E',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: false,
                    hasGradiendBackground: true,
                    colors: [
                        'rgba(165, 116, 195, 0.4)',
                        'rgba(165, 116, 195, 0)',
                    ],
                    id: 'roadside',
                    hidden: false,
                    label: 'Roadside Insp.',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                    ],
                    borderColor: '#A574C3',
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverBorderColor: '#A574C3',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: false,
                    hasGradiendBackground: true,
                    colors: [
                        'rgba(165, 116, 195, 0.4)',
                        'rgba(165, 116, 195, 0)',
                    ],
                    id: 'accident',
                    hidden: false,
                    label: 'Accident',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 50, 0, 0, 0,
                    ],
                    borderColor: '#6DC089',
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverBorderColor: '#6DC089',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    fill: false,
                    hasGradiendBackground: true,
                    colors: [
                        'rgba(165, 116, 195, 0.4)',
                        'rgba(165, 116, 195, 0)',
                    ],
                    id: 'driver',
                    hidden: false,
                    label: 'Driver',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        20, 50, 40, 10, 0, 20, 35, 40, 20, 50, 40, 10, 0, 20,
                        35, 40, 20, 50, 40, 10, 0, 20, 35, 40,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'revenue',
                    hidden: true,
                    label: 'Revenue',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        30, 20, 11, 15, 22, 0, 35, 50, 30, 20, 11, 15, 22, 0,
                        35, 50, 30, 20, 11, 15, 22, 0, 35, 50,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'load',
                    hidden: true,
                    label: 'Load',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        0, 11, 0, 30, 40, 50, 16, 30, 0, 11, 0, 30, 40, 50, 16,
                        30, 30, 11, 0, 30, 40, 50, 16, 30,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'fuel',
                    hidden: true,
                    label: 'Fuel Gallon',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        10, 32, 10, 0, 52, 11, 15, 30, 10, 32, 10, 0, 50, 11,
                        15, 30, 10, 32, 10, 0, 50, 11, 15, 30,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'fuel-cost',
                    hidden: true,
                    label: 'Fuel Cost',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        50, 30, 45, 20, 22, 25, 16, 40, 50, 30, 45, 20, 22, 25,
                        16, 40, 50, 30, 45, 20, 22, 25, 16, 40,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'repair',
                    hidden: true,
                    label: 'Repair',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        8, 15, 30, 12, 22, 16, 18, 50, 8, 15, 30, 12, 22, 16,
                        18, 50, 8, 15, 30, 12, 22, 16, 18, 50,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'violation',
                    hidden: true,
                    label: 'Violation',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        18, 22, 40, 45, 30, 12, 42, 12, 18, 22, 40, 45, 30, 12,
                        42, 12, 18, 22, 40, 45, 30, 12, 42, 12,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'expences',
                    hidden: true,
                    label: 'Expences',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        15, 20, 25, 30, 45, 40, 50, 12, 15, 20, 25, 30, 45, 40,
                        50, 12, 15, 20, 25, 30, 45, 40, 50, 12,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'truck',
                    hidden: true,
                    label: 'Truck',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        0, 5, 10, 15, 20, 25, 30, 35, 0, 5, 10, 15, 20, 25, 30,
                        35, 0, 5, 10, 15, 20, 25, 30, 35,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'trailer',
                    hidden: true,
                    label: 'Trailer',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        40, 35, 35, 35, 30, 21, 20, 35, 40, 35, 35, 35, 30, 21,
                        20, 35, 40, 35, 35, 35, 30, 21, 20, 35,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'owner',
                    hidden: true,
                    label: 'Owner',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        12, 50, 20, 5, 30, 18, 40, 50, 12, 50, 20, 5, 30, 18,
                        40, 50, 12, 50, 20, 5, 30, 18, 40, 50,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'user',
                    hidden: true,
                    label: 'User',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        10, 5, 10, 15, 20, 25, 30, 50, 0, 5, 10, 15, 20, 11, 30,
                        35, 0, 5, 10, 15, 20, 25, 30, 35,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'repair-shop',
                    hidden: true,
                    label: 'Repair Shop',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        18, 15, 10, 12, 22, 19, 18, 2, 8, 15, 30, 12, 22, 16,
                        18, 50, 40, 15, 30, 12, 22, 16, 18, 30,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'broker',
                    hidden: true,
                    label: 'Broker',
                },
            },
            {
                defaultConfig: {
                    type: 'line',
                    data: [
                        20, 30, 40, 10, 10, 20, 35, 40, 20, 50, 40, 10, 10, 20,
                        35, 40, 20, 50, 40, 10, 20, 20, 35, 40,
                    ],
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverRadius: 3,
                    pointBorderWidth: 2,
                    id: 'shipper',
                    hidden: true,
                    label: 'Shipper',
                },
            },
        ],
        showLegend: false,
        chartValues: [2, 2],
        defaultType: 'bar',
        chartWidth: '1800',
        chartHeight: '222',
        removeChartMargin: true,
        gridHoverBackground: true,
        allowAnimation: true,
        hasHoverData: true,
        offset: true,
        multiHoverData: true,
        multiChartHover: true,
        tooltipOffset: { min: 134, max: 206 },
        dataLabels: [
            ['01', 'WED'],
            ['02', 'THU'],
            ['03', 'FRI'],
            ['04', 'SAT'],
            ['05', 'SUN'],
            ['06', 'MON'],
            ['07', 'TUE'],
            ['08', 'WED'],
            ['09', 'THU'],
            ['10', 'FRI'],
            ['11', 'SAT'],
            ['12', 'SUN'],
            ['13', 'MON'],
            ['14', 'TUE'],
            ['15', 'WED'],
            ['16', 'THU'],
            ['17', 'FRI'],
            ['18', 'SAT'],
            ['19', 'SUN'],
            ['20', 'MON'],
            ['21', 'TUE'],
            ['22', 'WED'],
            ['23', 'THU'],
            ['24', 'FRI'],
        ],
        noChartImage: 'assets/svg/common/no_data_pay.svg',
    };

    public barChartConfig: object = {
        dataProperties: [
            {
                defaultConfig: {
                    type: 'bar',
                    data: [
                        12, 21, 27, 37, 28, 25, 21, 10, 15, 45, 27, 46, 41, 28,
                        24, 12, 21, 27, 37, 28, 25, 21, 10, 20,
                    ],
                    yAxisID: 'y-axis-0',
                    backgroundColor: '#919191',
                    borderColor: '#707070',
                    hoverBackgroundColor: '#6C6C6C',
                    hoverBorderColor: '#707070',
                    label: 'Price per Gallon',
                },
            },
            {
                defaultConfig: {
                    type: 'bar',
                    data: [
                        10, 14, 30, 7, 28, 11, 20, 39, 46, 10, 12, 46, 10, 14,
                        30, 7, 28, 11, 20, 39, 46, 10, 12, 10,
                    ],
                    yAxisID: 'y-axis-0',
                    backgroundColor: '#CCCCCC',
                    borderColor: '#707070',
                    hoverBackgroundColor: '#AAAAAA',
                    hoverBorderColor: '#707070',
                    label: 'Load Rate per Mile',
                },
            },
        ],
        showLegend: false,
        chartValues: [2, 2],
        defaultType: 'bar',
        offset: true,
        chartWidth: '1800',
        chartHeight: '40',
        removeChartMargin: true,
        gridHoverBackground: true,
        hasHoverData: true,
        allowAnimation: true,
        hoverOtherChart: true,
        tooltipOffset: { min: 134, max: 206 },
        dataLabels: [
            ['01', 'WED'],
            ['02', 'THU'],
            ['03', 'FRI'],
            ['04', 'SAT'],
            ['05', 'SUN'],
            ['06', 'MON'],
            ['07', 'TUE'],
            ['08', 'WED'],
            ['09', 'THU'],
            ['10', 'FRI'],
            ['11', 'SAT'],
            ['12', 'SUN'],
            ['13', 'MON'],
            ['14', 'TUE'],
            ['15', 'WED'],
            ['16', 'THU'],
            ['17', 'FRI'],
            ['18', 'SAT'],
            ['19', 'SUN'],
            ['20', 'MON'],
            ['21', 'TUE'],
            ['22', 'WED'],
            ['23', 'THU'],
            ['24', 'FRI'],
        ],
        noChartImage: 'assets/svg/common/no_data_pay.svg',
    };

    public lineAxes: object = {
        verticalLeftAxes: {
            visible: false,
            minValue: 0,
            maxValue: 52,
            stepSize: 13,
            showGridLines: true,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: true,
        },
    };

    public barAxes: object = {
        verticalLeftAxes: {
            visible: false,
            minValue: 0,
            maxValue: 52,
            stepSize: 13,
            showGridLines: true,
        },
        horizontalAxes: {
            visible: true,
            position: 'bottom',
            showGridLines: true,
            removeColor: true,
        },
    };

    currentSwitchTab: string = 'MTD';

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dashboardQuery: DashboardQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();

        this.getOverallCompanyDuration();
    }

    private createForm(): void {
        this.performanceForm = this.formBuilder.group({
            subPeriod: [null],
        });
    }

    public trackByIdentity = (_: number, item: PerformanceDataItem): string =>
        item.title;

    private getConstantData(): void {
        this.performanceTabs = DashboardPerformanceConstants.PERFORMANCE_TABS;

        this.subPeriodDropdownList =
            DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA;

        this.selectedSubPeriod =
            DashboardTopRatedConstants.SUB_PERIOD_DROPDOWN_DATA[8];

        this.performanceDataColors = DashboardColors.PERFORMANCE_COLORS_PALLETE;
    }

    public handleSwitchTabClick(activeTab: DashboardTab): void {
        if (this.currentActiveTab?.name === activeTab.name) {
            return;
        }

        this.currentActiveTab = activeTab;

        let matchingIdList: number[] = [];

        switch (activeTab.name) {
            case ConstantStringEnum.TODAY:
                matchingIdList = DashboardSubperiodConstants.TODAY_ID_LIST;

                break;
            case ConstantStringEnum.WTD:
                matchingIdList = DashboardSubperiodConstants.WTD_ID_LIST;

                break;
            case ConstantStringEnum.MTD:
                matchingIdList = DashboardSubperiodConstants.MTD_ID_LIST;

                break;
            case ConstantStringEnum.QTD:
                matchingIdList = DashboardSubperiodConstants.QTD_ID_LIST;

                break;
            case ConstantStringEnum.YTD:
                matchingIdList = DashboardSubperiodConstants.YTD_ID_LIST;

                break;
            case ConstantStringEnum.ALL:
                this.setCustomSubPeriodList(this.overallCompanyDuration);

                break;
            default:
                break;
        }

        if (
            activeTab.name !== ConstantStringEnum.ALL &&
            activeTab.name !== ConstantStringEnum.CUSTOM
        ) {
            const { filteredSubPeriodDropdownList, selectedSubPeriod } =
                DashboardUtils.setSubPeriodList(matchingIdList);

            this.subPeriodDropdownList = filteredSubPeriodDropdownList;
            this.selectedSubPeriod = selectedSubPeriod;
        }
    }

    public handleInputSelect(dropdownListItem: DropdownListItem): void {
        this.selectedSubPeriod = dropdownListItem;
    }

    public handleSetCustomPeriodRangeClick(
        customPeriodRange: CustomPeriodRange
    ): void {
        const fromDate = moment(new Date(customPeriodRange.fromDate));
        const toDate = moment(new Date(customPeriodRange.toDate));

        const selectedDaysRange =
            toDate.diff(fromDate, ConstantStringEnum.DAYS) + 1;

        if (selectedDaysRange < 0) {
            return;
        }

        this.selectedCustomPeriodRange = customPeriodRange;

        this.setCustomSubPeriodList(selectedDaysRange);
    }

    public handlePerformanceDataHover(
        index: number,
        removeHover: boolean = false
    ): void {
        if (!removeHover) {
            this.performanceData[index].isHovered = true;
        } else {
            this.performanceData[index].isHovered = false;
        }
    }

    public handlePerformanceDataClick(
        index: number,
        selectedColor: string
    ): void {
        const performanceDataItem = this.performanceData[index];
        const maxPerformanceDataItemsSelected = 10;

        if (
            this.selectedPerformanceDataCount ===
                maxPerformanceDataItemsSelected &&
            !performanceDataItem.isSelected
        ) {
            return;
        }

        performanceDataItem.isSelected = !performanceDataItem.isSelected;

        if (performanceDataItem.isSelected) {
            const firstAvailableColor = this.performanceDataColors.find(
                (color) => !color.isSelected
            );

            firstAvailableColor.isSelected = true;

            performanceDataItem.selectedColor = firstAvailableColor.code;
            performanceDataItem.selectedHoverColor =
                firstAvailableColor.hoverCode;

            this.selectedPerformanceDataCount++;
        } else {
            performanceDataItem.selectedColor = null;
            performanceDataItem.selectedHoverColor = null;

            this.performanceDataColors.find(
                (color) => color.code === selectedColor
            ).isSelected = false;

            this.selectedPerformanceDataCount--;
        }
    }

    private getOverallCompanyDuration(): void {
        this.dashboardQuery.companyDuration$
            .pipe(takeUntil(this.destroy$))
            .subscribe((companyDuration: number) => {
                if (companyDuration) {
                    this.overallCompanyDuration = companyDuration;
                }
            });

        this.setCustomSubPeriodList(this.overallCompanyDuration);
    }

    private setCustomSubPeriodList(selectedDaysRange: number): void {
        const { filteredSubPeriodDropdownList, selectedSubPeriod } =
            DashboardUtils.setCustomSubPeriodList(selectedDaysRange);

        this.subPeriodDropdownList = filteredSubPeriodDropdownList;
        this.selectedSubPeriod = selectedSubPeriod;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ////////////////////////////////////////////
    ngOnChanges(): void {}

    setColor(type: string) {
        // Provera da li se u objektu nalazi vec ovaj tip sa vrednoscu boje
        if (type in this.selectedColors) {
            if (this.backgroundCards?.length < 9) {
                // Iz glavnog niza boja vratiti zauzetu boju na pocetak niza
                this.backgroundCards.unshift(this.selectedColors[type]);
                // Obrisati iz objekta tu vrednost
                delete this.selectedColors[type];
                this.topChart.insertNewChartData('remove', type);
            }
        } else {
            // Proveriti da li se u nizu nalazi bar jedna boja da bi mogli da dajemo novoj kocki sledecu boju
            if (this.backgroundCards.length > 0) {
                // Uzeti prvu vrednost iz niza i ujedno iz glavnog niza boja sklonuti prvu boju
                const firstInArray = this.backgroundCards.shift();
                // Dodati novu vrednost u objekat sa bojom koju smo pokupili iz niza
                this.selectedColors[type] = firstInArray;
                this.topChart.insertNewChartData('add', type, firstInArray);
            }
        }
    }

    hoverFocusCard(type: string, color: any) {
        this.topChart.changeChartFillProperty(type, color);
    }

    hoverLineChart(value) {
        this.topChart.showChartTooltip(value);
    }

    removeOtherChartHover() {
        this.topChart.chartHoverOut();
    }
}
