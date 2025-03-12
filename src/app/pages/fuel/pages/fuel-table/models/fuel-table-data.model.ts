import {
    FuelStopResponse,
    FuelTransactionResponse,
    FuelStopSortBy,
    FuelTransactionSortBy,
    SortOrder,
} from 'appcoretruckassist';

export interface IFuelTableData {
    data: FuelTransactionResponse[] | FuelStopResponse[];
    integratedFuelTransactionsCount: number;
    integratedFuelTransactionsFilterActive: boolean;
    incompleteFuelTransactionsCount: number;
    incompleteFuelTransactionsFilterActive: boolean;
    fuelStopClosedCount: number;
    fuelStopClosedFilterActive: boolean;
    sortOrder?: SortOrder;
    sortBy?: FuelTransactionSortBy | FuelStopSortBy;
    pageIndex: number;
}
