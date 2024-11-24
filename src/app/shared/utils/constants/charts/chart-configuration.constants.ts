// Enums
import { ChartValueLabelEnum } from "@shared/enums";
import { ChartTypesStringEnum } from "ca-components";

// Models

export class ChartConfiguration {
    public static mileageRateConfiguration = [
        {
            type: ChartTypesStringEnum.LINE,
            color: '#6692F1',
            value: ChartValueLabelEnum.AVERAGE_RATE,
        },
        {
            type: ChartTypesStringEnum.BAR,
            color: 'linear-gradient(#e66465, #9198e5)',
            value: ChartValueLabelEnum.AVERAGE_RATE,
            maxValue: ChartValueLabelEnum.HIGHEST_RATE,
            minValue: ChartValueLabelEnum.LOWEST_RARE
        }
    ];
    public static driverConfiguration = [
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
    public static brokerPaidInvoiceConfiguration = [
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

    public static truckFuelConsumptionConfiguration = [
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

    public static truckRevenueConfiguration = [
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

    public static truckExpensesConfiguration = [
        {
            maxValue: ChartValueLabelEnum.FUEL_COST,
            value: ChartValueLabelEnum.FUEL_COST,
            type: ChartTypesStringEnum.BAR,
            color: '#FAB15C',
            stack: true
        },
        {
            maxValue: ChartValueLabelEnum.REPAIR_COST,
            value: ChartValueLabelEnum.REPAIR_COST,
            type: ChartTypesStringEnum.BAR,
            color: '#6692F1',
            stack: true
        },
    ];

    public static fuelExpensesConfiguration = [
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

    public static trailerFuelExpensesConfiguration = [
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
    ]
}