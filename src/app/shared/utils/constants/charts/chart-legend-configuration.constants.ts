// models
import { IBrokerPaymentHistoryChart } from '@pages/customer/pages/broker-details/models';
import { ChartLegendProperty } from '@shared/models';
import {
    BrokerMileageRateResponse,
    BrokerPaidInvoiceChartResponse,
    DriverPayrollResponse,
    FuelStopExpensesResponse,
    RepairShopExpensesChartResponse,
    ShipperAverageWaitingTimeResponse,
    TrailerFuelConsumptionChartResponse,
    TruckExpensesChartResponse,
    TruckFuelConsumptionChartResponse,
    TruckRevenueChartResponse,
} from 'appcoretruckassist';

// enums
import { eUnit } from 'ca-components';

export class ChartLegendConfiguration {
    // In general, functions are used in order to pass corresponding values and not to map them in other place
    // On each data update, the legend is updated as well
    // TODO move to ca-components
    public static driverLegendConfiguration = (
        data: DriverPayrollResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Miles',
            value: Number(data?.miles?.toFixed(2)) || 0,
            color: '#6692F1',
        },
        {
            name: 'Earnings',
            value: data?.earnings || 0,
            color: '#FBC88B',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];
    public static mileageLegendConfiguration = (
        data: BrokerMileageRateResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Avg. Rate',
            // For some values, BE does not return fully formatted data
            value: Number(data?.averageRate?.toFixed(2) || 0),
            color: '#6692F1',
            unit: eUnit.DOLLAR_SIGN,
        },
        {
            name: 'Highest Rate',
            value: data?.highestRate || 0,
            color: '#86C9C3',
            unit: eUnit.DOLLAR_SIGN,
        },
        {
            name: 'Lowest Rate',
            value: data?.lowestRate || 0,
            color: '#FAB15C',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];

    public static invoiceChartLegendConfiguration = (
        data: BrokerPaidInvoiceChartResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Revenue',
            value: data?.revenue || 0,
            color: '#FAB15C',
            unit: eUnit.DOLLAR_SIGN,
        },
        {
            name: 'Load',
            value: data?.count || 0,
            color: '#6692F1',
        },
    ];

    public static FUEL_EXPENSES_LEGEND = (
        data: FuelStopExpensesResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Gallon',
            value: data?.gallon || 0,
            color: '#FAB15C',
            unit: eUnit.GALLON,
        },
        {
            name: 'Cost',
            value: data?.cost || 0,
            color: '#6692F1',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];

    public static trailerFuelConsumptionConfiguration = (
        data: TrailerFuelConsumptionChartResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Gallon',
            value: data?.milesPerGallon || 0,
            color: '#FAB15C',
            unit: eUnit.MILE,
        },
        {
            name: 'Cost Per Gallon',
            value: data?.costPerGallon || 0,
            color: '#6692F1',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];

    public static TRUCK_FUEL_CONSUMPTION_CONFIGURATION = (
        data: TruckFuelConsumptionChartResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Miles per Gallon',
            value: data?.milesPerGallon || 0,
            color: '#FAB15C',
            unit: eUnit.MILE,
        },
        {
            name: 'Cost Per Gallon',
            value: data?.costPerGallon || 0,
            color: '#6692F1',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];

    public static TRUCK_REVENUE_CONFIGURATION = (
        data: TruckRevenueChartResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Miles',
            value: data?.miles || 0,
            color: '#56B4AC',
            unit: eUnit.MILE,
        },
        {
            name: 'Revenue',
            value: data?.revenue || 0,
            color: '#6692F1',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];

    public static TRUCK_EXPENSES_CONFIGURATION = (
        data: TruckExpensesChartResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Fuel Cost',
            value: data?.fuelCost || 0,
            color: '#FAB15C',
            unit: eUnit.DOLLAR_SIGN,
        },
        {
            name: 'Repair Cost',
            value: data?.repairCost || 0,
            color: '#6692F1',
            unit: eUnit.DOLLAR_SIGN,
        },
        {
            name: 'Total Cost',
            value: data?.fuelCost + data?.repairCost || 0,
            color: '#ffffff',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];

    public static brokerPaymentHistory = (
        data: IBrokerPaymentHistoryChart
    ): ChartLegendProperty[] => [
        {
            name: 'Avg. Pay Period',
            value: data?.averagePayPeriod || 0,
            // Since 'background' property is set with color, linear gradient can be used as well
            color: 'linear-gradient(135deg, #F77D3B 50%, #6692F1 50%)',
            unit: eUnit.DAYS,
        },
        {
            name: 'Pay Term',
            value: data?.payTerm || 0,
            color: '#DF3C3C',
            isLineIndicator: true,
            unit: eUnit.DAYS,
        },
    ];

    public static SHIPPER_AVERAGE_WAITING_TIME_CONFIGURATION = (
        data: ShipperAverageWaitingTimeResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Avg. Pickup Time',
            value: Number(data?.avgPickupTime) || 0,
            // Since 'background' property is set with color, linear gradient can be used as well
            color: '#86C9C3',
            unit: eUnit.DAYS,
        },
        {
            name: 'Avg. Delivery Time',
            value: Number(data?.avgDeliveryTime) || 0,
            color: '#ED9292',
            isLineIndicator: true,
            unit: eUnit.DAYS,
        },
    ];

    public static REPAIR_SHOP_EXPENSES_CONFIGURATION = (
        data: RepairShopExpensesChartResponse
    ): ChartLegendProperty[] => [
        {
            name: 'Repair',
            value: Number(data?.repair) || 0,
            color: '#FAB15C',
        },
        {
            name: 'Cost',
            value: Number(data?.repairCost) || 0,
            color: '#6692F1',
            unit: eUnit.DOLLAR_SIGN,
        },
    ];
}
