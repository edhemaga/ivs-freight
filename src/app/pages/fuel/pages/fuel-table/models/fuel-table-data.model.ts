import { FuelStopResponse, FuelTransactionResponse } from "appcoretruckassist";

export interface IFuelTableData {
    data: FuelTransactionResponse[] | FuelStopResponse[];
    integratedFuelTransactionsCount: number;
    integratedFuelTransactionsFilterActive: boolean;
    incompleteFuelTransactionsCount: number;
    incompleteFuelTransactionsFilterActive: boolean;
    fuelStopClosedCount: number;
    fuelStopClosedFilterActive: boolean;
    pageIndex: number;
}