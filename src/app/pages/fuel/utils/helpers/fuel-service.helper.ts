// models
import { FuelStopResponse, FuelTransactionResponse } from 'appcoretruckassist';

// enums
import { TableStringEnum } from '@shared/enums';

// types
import { FuelStoresType } from '@pages/fuel/types';

// store
import {
    FuelState,
    FuelStore,
} from '@pages/fuel/state/fuel-state/fuel-state.store';
import { FuelDetailsStore } from '@pages/fuel/state/fuel-details-state/fuel-details.store';
import { FuelItemStore } from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';

export class FuelServiceHelper {
    public static addFuelTransactionStopToStore(
        store: FuelStore,
        apiData: FuelTransactionResponse | FuelStopResponse,
        isTransactionAdded?: boolean,
        detailsStores?: (FuelDetailsStore & FuelItemStore)[]
    ): void {
        const tableCount = JSON.parse(
            localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
        );

        isTransactionAdded
            ? tableCount.fuelTransactions++
            : tableCount.fuelStops++;

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

        this.handleUpdateTransactionDetailsStore(apiData, detailsStores);
    }

    public static updateFuelTransactionStopInStore(
        store: FuelStore,
        apiData: FuelTransactionResponse | FuelStopResponse,
        isTransactionAdded?: boolean,
        detailsStores?: (FuelDetailsStore & FuelItemStore)[]
    ): void {
        this.handleUpdateDetailsStore(apiData, detailsStores);

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

        const _fuelTransactionsData: FuelTransactionResponse[] =
            isTransactionAdded
                ? [apiData, ...transactionPagination?.data]
                : transactionPagination?.data;
        const _fuelStopsData: FuelStopResponse[] = isTransactionAdded
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

        const _fuelTransactionsData: FuelTransactionResponse[] =
            transactionPagination?.data;
        const _fuelStopsData: FuelStopResponse[] = stopPagination?.data;

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

    private static handleUpdateTransactionDetailsStore(
        transaction: FuelTransactionResponse,
        detailsStores?: (FuelDetailsStore & FuelItemStore)[]
    ): void {
        const updateStore = (store: FuelStoresType) =>
            store.update(transaction?.fuelStopStore?.id, (entity) => ({
                ...entity,
                transactionList: [...entity.transactionList, transaction],
            }));

        detailsStores?.forEach((store) => updateStore(store));
    }

    public static handleUpdateDetailsStore(
        fuelStop: FuelStopResponse,
        detailsStores?: (FuelDetailsStore & FuelItemStore)[]
    ): void {
        const { id } = fuelStop;

        const updateStore = (
            store: FuelStoresType,
            updateData: FuelStopResponse
        ) =>
            store.update(id, (entity) => ({
                ...entity,
                ...updateData,
            }));

        detailsStores?.forEach((store) => updateStore(store, fuelStop));
    }
}
