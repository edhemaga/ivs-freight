// models
import { FuelStopResponse, FuelTransactionResponse } from 'appcoretruckassist';

// enums
import { TableStringEnum } from '@shared/enums';

// store
import {
    FuelState,
    FuelStore,
} from '@pages/fuel/state/fuel-state/fuel-state.store';

export class FuelServiceHelper {
    public static addFuelTransactionStopToStore(
        store: FuelStore,
        apiData: FuelTransactionResponse | FuelStopResponse,
        isTransactionAdded?: boolean
    ): void {
        let tableCount = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
        );

        if (isTransactionAdded) tableCount.fuelTransactions++;
        else tableCount.fuelStops++;

        localStorage.setItem(
            TableStringEnum.FUEL_TABLE_COUNT,
            JSON.stringify(tableCount)
        );

        store.update((state) =>
            this.addTransactionStopStateResult(
                state,
                apiData,
                isTransactionAdded
            )
        );
    }

    public static updateFuelTransactionStopInStore(
        store: FuelStore,
        apiData: FuelTransactionResponse | FuelStopResponse,
        isTransactionAdded?: boolean
    ): void {
        store.update((state) =>
            this.updateTransactionStopStateResult(
                state,
                apiData,
                isTransactionAdded
            )
        );
    }

    private static addTransactionStopStateResult(
        state: FuelState,
        apiData: FuelTransactionResponse | FuelStopResponse,
        isTransactionAdded?: boolean
    ): FuelState {
        const { fuelTransactions, fuelStops } = state;
        const { fuelTransactionCount, pagination: transactionPagination } =
            fuelTransactions || {};
        const { fuelStopCount, pagination: stopPagination } = fuelStops || {};

        const _fuelTransactionCount: number = isTransactionAdded
            ? fuelTransactionCount + 1
            : fuelTransactionCount;
        const _fuelStopCount: number = isTransactionAdded
            ? fuelStopCount
            : fuelStopCount + 1;

        let _fuelTransactionsData: FuelTransactionResponse[] =
            isTransactionAdded
                ? [apiData, ...transactionPagination?.data]
                : transactionPagination?.data;
        let _fuelStopsData: FuelStopResponse[] = isTransactionAdded
            ? stopPagination?.data
            : [apiData, ...stopPagination?.data];

        const fuelTransactionsResult = fuelTransactions
            ? {
                  ...fuelTransactions,
                  fuelTransactionCount: _fuelTransactionCount,
                  fuelStopCount: _fuelStopCount,
                  pagination: {
                      ...fuelTransactions.pagination,
                      data: _fuelTransactionsData,
                  },
              }
            : null;
        const fuelStopsResult = fuelStops
            ? {
                  ...fuelStops,
                  fuelTransactionCount: _fuelTransactionCount,
                  fuelStopCount: _fuelStopCount,
                  pagination: {
                      ...fuelStops.pagination,
                      data: _fuelStopsData,
                  },
              }
            : null;

        const result: FuelState = {
            ...state,
            fuelTransactions: fuelTransactionsResult,
            fuelStops: fuelStopsResult,
        };

        return result;
    }

    private static updateTransactionStopStateResult(
        state: FuelState,
        apiData: FuelTransactionResponse | FuelStopResponse,
        isTransactionAdded?: boolean
    ): FuelState {
        const { fuelTransactions, fuelStops } = state;
        const { pagination: transactionPagination } = fuelTransactions || {};
        const { pagination: stopPagination } = fuelStops || {};

        let _fuelTransactionsData: FuelTransactionResponse[] =
            transactionPagination?.data;
        let _fuelStopsData: FuelStopResponse[] = stopPagination?.data;

        this.replaceUpdatedItem(
            isTransactionAdded ? _fuelTransactionsData : _fuelStopsData,
            apiData
        );

        const fuelTransactionsResult = fuelTransactions
            ? {
                  ...fuelTransactions,
                  pagination: {
                      ...fuelTransactions.pagination,
                      data: _fuelTransactionsData,
                  },
              }
            : null;
        const fuelStopsResult = fuelStops
            ? {
                  ...fuelStops,
                  pagination: {
                      ...fuelStops.pagination,
                      data: _fuelStopsData,
                  },
              }
            : null;

        const result: FuelState = {
            ...state,
            fuelTransactions: fuelTransactionsResult,
            fuelStops: fuelStopsResult,
        };

        return result;
    }

    private static replaceUpdatedItem(
        data: FuelTransactionResponse[] | FuelStopResponse[],
        apiData: FuelTransactionResponse | FuelStopResponse
    ): void {
        const updatingIndex = data.findIndex((item) => item.id === apiData.id);
        data.splice(updatingIndex, 1, apiData);
    }
}
