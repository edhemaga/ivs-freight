import { FuelStopResponse, FuelTransactionResponse } from "appcoretruckassist";

export interface IFuelTableData {
    data: FuelTransactionResponse[] | FuelStopResponse[];
    integratedFuelTransactionsCount: number;
    integratedFuelTransactionsFilterActive: boolean;
    pageIndex: number;
}