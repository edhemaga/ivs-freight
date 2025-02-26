// Enums
import { eChartValueLabel } from '@shared/enums';
import { eChartTypesString } from 'ca-components';

// Models
import { ChartTypeProperty } from '@shared/models';
import { IBrokerPaymentHistory } from '@pages/customer/pages/broker-details/models';

export class ChartConfiguration {
    public static mileageRateConfiguration: ChartTypeProperty[] = [
        {
            type: eChartTypesString.LINE,
            color: '#6692F1',
            value: eChartValueLabel.AVERAGE_RATE,
        },
        {
            type: eChartTypesString.BAR,
            color: '#86C9C3',
            color2: '#FAB15C',
            value: eChartValueLabel.AVERAGE_RATE,
            maxValue: eChartValueLabel.HIGHEST_RATE,
            minValue: eChartValueLabel.LOWEST_RARE,
        },
    ];
    public static paymentHistoryConfiguration = (
        data: IBrokerPaymentHistory
    ): ChartTypeProperty[] => [
        {
            value: eChartValueLabel.AVERAGE_PAY_PERIOD_DAYS,
            type: eChartTypesString.LINE,
            color2: '#3074D3',
            colorEdgeValue: data.payTerm,
            color: '#DF3C3C',
            fill: true,
            shiftValue: data.payTerm,
        },
    ];
    public static driverConfiguration: ChartTypeProperty[] = [
        {
            value: eChartValueLabel.MILES,
            type: eChartTypesString.LINE,
            color: '#6692F1',
        },
        {
            maxValue: eChartValueLabel.EARNINGS,
            type: eChartTypesString.BAR,
            color: '#FBC88B',
        },
    ];
    public static brokerPaidInvoiceConfiguration: ChartTypeProperty[] = [
        {
            value: eChartValueLabel.COUNT,
            type: eChartTypesString.LINE,
            color: '#6692F1',
        },
        {
            maxValue: eChartValueLabel.REVENUE,
            value: eChartValueLabel.REVENUE,
            type: eChartTypesString.BAR,
            color: '#FBC88B',
        },
    ];

    public static truckFuelConsumptionConfiguration: ChartTypeProperty[] = [
        {
            value: eChartValueLabel.MILES_PER_GALLON,
            type: eChartTypesString.LINE,
            color: '#6692F1',
        },
        {
            maxValue: eChartValueLabel.COST_PER_GALLON,
            value: eChartValueLabel.COST_PER_GALLON,
            type: eChartTypesString.BAR,
            color: '#FAB15C',
        },
    ];

    public static truckRevenueConfiguration: ChartTypeProperty[] = [
        {
            value: eChartValueLabel.REVENUE,
            type: eChartTypesString.LINE,
            color: '#6692F1',
        },
        {
            maxValue: eChartValueLabel.MILES,
            value: eChartValueLabel.MILES,
            type: eChartTypesString.BAR,
            color: '#86C9C3',
        },
    ];

    public static truckExpensesConfiguration: ChartTypeProperty[] = [
        {
            maxValue: eChartValueLabel.FUEL_COST,
            value: eChartValueLabel.FUEL_COST,
            type: eChartTypesString.BAR,
            color: '#FAB15C',
        },
        {
            maxValue: eChartValueLabel.REPAIR_COST,
            value: eChartValueLabel.REPAIR_COST,
            type: eChartTypesString.BAR,
            color: '#6692F1',
        },
    ];

    public static fuelExpensesConfiguration: ChartTypeProperty[] = [
        {
            maxValue: eChartValueLabel.GALLON,
            value: eChartValueLabel.GALLON,
            type: eChartTypesString.BAR,
            color: '#FAB15C',
        },
        {
            value: eChartValueLabel.COST,
            type: eChartTypesString.LINE,
            color: '#6692F1',
        },
    ];

    public static trailerFuelExpensesConfiguration: ChartTypeProperty[] = [
        {
            maxValue: eChartValueLabel.MILES_PER_GALLON,
            value: eChartValueLabel.MILES_PER_GALLON,
            type: eChartTypesString.BAR,
            color: '#FAB15C',
        },
        {
            value: eChartValueLabel.COST_PER_GALLON,
            type: eChartTypesString.LINE,
            color: '#6692F1',
        },
    ];

    public static topMileageConfiguration: ChartTypeProperty[] = [
        {
            type: eChartTypesString.DOUGHNUT,
            value: eChartValueLabel.MILEAGE_PERCENTAGE,
        },
    ];

    public static topRevenueConfiguration: ChartTypeProperty[] = [
        {
            type: eChartTypesString.DOUGHNUT,
            value: eChartValueLabel.REVENUE_PERCENTAGE,
        },
    ];

    public static topCostConfiguration: ChartTypeProperty[] = [
        {
            type: eChartTypesString.DOUGHNUT,
            value: eChartValueLabel.COST_PERCENTAGE,
        },
    ];

    public static topVisitConfiguration: ChartTypeProperty[] = [
        {
            type: eChartTypesString.DOUGHNUT,
            value: eChartValueLabel.VISIT_PERCENTAGE,
        },
    ];

    public static topLoadConfiguration: ChartTypeProperty[] = [
        {
            type: eChartTypesString.DOUGHNUT,
            value: eChartValueLabel.LOAD_PERCENTAGE,
        },
    ];

    public static shipperAverageWaitingTimeConfiguration: ChartTypeProperty[] =
        [
            {
                type: eChartTypesString.BAR,
                value: eChartValueLabel.AVERAGE_PICKUP_TIME,
            },
            {
                type: eChartTypesString.BAR,
                value: eChartValueLabel.AVERAGE_DELIVERY_TIME,
            },
        ];

    public static repairShopExpensesConfiguration: ChartTypeProperty[] = [
        {
            type: eChartTypesString.BAR,
            value: eChartValueLabel.REPAIR,
        },
        {
            type: eChartTypesString.LINE,
            color: '#6692F1',
            value: eChartValueLabel.REPAIR_COST,
        },
    ];
}
