import {
    FuelStopListResponse,
    FuelTransactionListResponse,
} from 'appcoretruckassist';

export interface FuelState {
    fuelTransactions: FuelTransactionListResponse;
    fuelStops: FuelStopListResponse;
}
