import { FuelStopListResponse, FuelTransactionListResponse } from "appcoretruckassist";

export interface FuelStateModal {
    fuelTransactions: FuelTransactionListResponse;
    fuelStops: FuelStopListResponse;
}