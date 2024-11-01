import { FuelStopResponse, FuelTransactionResponse } from "appcoretruckassist";

export interface IFuelTableData {
    data: FuelTransactionResponse[] | FuelStopResponse[];
    pageIndex: number;
}