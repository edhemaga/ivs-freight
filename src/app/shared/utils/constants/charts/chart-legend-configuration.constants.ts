// Models
import { ChartLegendProperty } from "@shared/models";
import {
    BrokerMileageRateResponse,
    BrokerPaidInvoiceChartResponse,
    BrokerPaymentHistoryResponse,
    DriverPayrollResponse,
    FuelStopExpensesResponse,
    TrailerFuelConsumptionChartResponse,
    TruckExpensesChartResponse,
    TruckFuelConsumptionChartResponse,
    TruckRevenueChartResponse
} from "appcoretruckassist";

export class ChartLegendConfiguration {
    public static driverLegendConfiguration =
        (data: DriverPayrollResponse): ChartLegendProperty[] => [
            {
                name: 'Miles',
                value: data.miles,
                color: '#6692F1',
            },
            {
                name: 'Earnings',
                value: data.earnings,
                color: '#FBC88B',
                unit: '$',
            }
        ];
    public static mileageLegendConfiguration =
        (data: BrokerMileageRateResponse): ChartLegendProperty[] => [
            {
                name: 'Avg. Rate',
                value: Number(data.averageRate.toFixed(2)),
                color: '#6692F1',
                unit: '$',
            },
            {
                name: 'Highest Rate',
                value: data.highestRate,
                color: '#86C9C3',
                unit: '$',
            },
            {
                name: 'Lowest Rate',
                value: data.lowestRate,
                color: '#FAB15C',
                unit: '$',
            }
        ];

    public static invoiceChartLegendConfiguration = (data: BrokerPaidInvoiceChartResponse): ChartLegendProperty[] =>
        [
            {
                name: 'Revenue',
                value: data.revenue,
                color: '#FAB15C',
                unit: '$',
            },
            {
                name: 'Load',
                value: data.count,
                color: '#6692F1',
            }
        ];

    public static fuelExpensesLegend = (data: FuelStopExpensesResponse): ChartLegendProperty[] => [
        {
            name: 'Gallon',
            value: data.gallon,
            color: '#FAB15C',
            unit: 'gal.',
        },
        {
            name: 'Cost per Gallon',
            value: data.cost,
            color: '#6692F1',
            unit: '$'
        }
    ];

    public static trailerFuelConsumptionConfiguration = (data: TrailerFuelConsumptionChartResponse): ChartLegendProperty[] => [
        {
            name: 'Gallon',
            value: data.milesPerGallon,
            color: '#FAB15C',
            unit: 'mi',
        },
        {
            name: 'Cost Per Gallon',
            value: data.costPerGallon,
            color: '#6692F1',
            unit: '$'
        }
    ];

    public static truckFuelConsumptionConfiguration = (data: TruckFuelConsumptionChartResponse): ChartLegendProperty[] => [
        {
            name: 'Miles per Gallon',
            value: data.milesPerGallon,
            color: '#FAB15C',
            unit: 'mi',
        },
        {
            name: 'Cost Per Gallon',
            value: data.costPerGallon,
            color: '#6692F1',
            unit: '$'
        }
    ];

    public static truckRevenueConfiguration = (data: TruckRevenueChartResponse): ChartLegendProperty[] => [
        {
            name: 'Miles',
            value: data.miles,
            color: '#56B4AC',
            unit: 'mi',
        },
        {
            name: 'Revenue',
            value: data.revenue,
            color: '#6692F1',
            unit: '$'
        }
    ];

    public static truckExpensesConfiguration = (data: TruckExpensesChartResponse): ChartLegendProperty[] => [
        {
            name: 'Fuel Cost',
            value: data.fuelCost,
            color: '#FAB15C',
            unit: '$',
        },
        {
            name: 'Repair Cost',
            value: data.repairCost,
            color: '#6692F1',
            unit: '$'
        },
        {
            name: 'Total Cost',
            value: data.fuelCost + data.repairCost,
            color: '#ffffff',
            unit: '$',
        },
    ];

    public static brokerPaymentHistory = (data: BrokerPaymentHistoryResponse): ChartLegendProperty[] => [
        {
            name: 'Avg. Pay Period',
            value: Number(data.averagePayPeriod.totalDays) ?? 0,
            color: 'linear-gradient(135deg, #F77D3B 50%, #6692F1 50%)',
            unit: 'days',
        },
        {
            name: 'Pay Term',
            value: data.payTerm,
            color: '#DF3C3C',
            isLineIndicator: true,
            unit: 'days',
        },
    ];

}