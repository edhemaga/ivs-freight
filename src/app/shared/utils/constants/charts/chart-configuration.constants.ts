// Enums
import { ChartValueLabelEnum } from "@shared/enums";
import { ChartTypesStringEnum } from "ca-components";

// Models
import { ChartTypeProperty } from "@shared/models";
import { IBrokerPaymentHistory } from "@pages/customer/pages/broker-details/models";

export class ChartConfiguration {
    public static mileageRateConfiguration: ChartTypeProperty[] = [
        {
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
            value: ChartValueLabelEnum.AVERAGE_RATE,
        },
        {
            type: ChartTypesStringEnum.BAR,
            color: '#86C9C3',
            color2: '#FAB15C',
            value: ChartValueLabelEnum.AVERAGE_RATE,
            maxValue: ChartValueLabelEnum.HIGHEST_RATE,
            minValue: ChartValueLabelEnum.LOWEST_RARE
        }
    ];
    public static paymentHistoryConfiguration = (data: IBrokerPaymentHistory): ChartTypeProperty[] => [
        {
            value: ChartValueLabelEnum.AVERAGE_PAY_PERIOD_DAYS,
            type: ChartTypesStringEnum.LINE,
            color2: '#3074D3',
            colorEdgeValue: data.payTerm,
            color: '#DF3C3C',
            fill: true,
            shiftValue: data.payTerm
        },
    ];
    public static driverConfiguration: ChartTypeProperty[] = [
        {
            value: ChartValueLabelEnum.MILES,
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
        },
        {
            value: ChartValueLabelEnum.EARNINGS,
            type: ChartTypesStringEnum.BAR,
            color: '#FBC88B',
        }
    ];
    public static brokerPaidInvoiceConfiguration: ChartTypeProperty[] = [
        {
            value: ChartValueLabelEnum.COUNT,
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
        },
        {
            maxValue: ChartValueLabelEnum.REVENUE,
            value: ChartValueLabelEnum.REVENUE,
            type: ChartTypesStringEnum.BAR,
            color: '#FBC88B',
        },
    ];

    public static truckFuelConsumptionConfiguration: ChartTypeProperty[] = [
        {
            value: ChartValueLabelEnum.MILES_PER_GALLON,
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
        },
        {
            maxValue: ChartValueLabelEnum.COST_PER_GALLON,
            value: ChartValueLabelEnum.COST_PER_GALLON,
            type: ChartTypesStringEnum.BAR,
            color: '#FAB15C',
        },
    ];

    public static truckRevenueConfiguration: ChartTypeProperty[] = [
        {
            value: ChartValueLabelEnum.REVENUE,
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
        },
        {
            maxValue: ChartValueLabelEnum.MILES,
            value: ChartValueLabelEnum.MILES,
            type: ChartTypesStringEnum.BAR,
            color: '#86C9C3',
        },
    ];

    public static truckExpensesConfiguration: ChartTypeProperty[] = [
        {
            maxValue: ChartValueLabelEnum.FUEL_COST,
            value: ChartValueLabelEnum.FUEL_COST,
            type: ChartTypesStringEnum.BAR,
            color: '#FAB15C',
        },
        {
            maxValue: ChartValueLabelEnum.REPAIR_COST,
            value: ChartValueLabelEnum.REPAIR_COST,
            type: ChartTypesStringEnum.BAR,
            color: '#6692F1',
        },
    ];

    public static fuelExpensesConfiguration: ChartTypeProperty[] = [
        {
            maxValue: ChartValueLabelEnum.GALLON,
            value: ChartValueLabelEnum.GALLON,
            type: ChartTypesStringEnum.BAR,
            color: '#FAB15C',
        },
        {
            value: ChartValueLabelEnum.COST,
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
        },
    ];

    public static trailerFuelExpensesConfiguration: ChartTypeProperty[] = [
        {
            maxValue: ChartValueLabelEnum.MILES_PER_GALLON,
            value: ChartValueLabelEnum.MILES_PER_GALLON,
            type: ChartTypesStringEnum.BAR,
            color: '#FAB15C',
        },
        {
            value: ChartValueLabelEnum.COST_PER_GALLON,
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
        },
    ];

    public static topDriverConfiguration: ChartTypeProperty[] = [
        {
            type: ChartTypesStringEnum.DOUGHNUT,
            value: 'mileagePercentage'
        }
    ]
}