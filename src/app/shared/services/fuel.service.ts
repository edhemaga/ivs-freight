import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// models
import {
    FuelService as FuelBackendService,
    FuelStopExpensesResponse,
    FuelStopResponse,
    SortOrder,
    FuelStopListResponse,
    GetFuelStopModalResponse,
    CreateResponse,
    GetFuelModalResponse,
    FuelDispatchHistoryResponse,
    FuelTransactionListResponse,
    FuelStopFranchiseResponse,
    FuelTransactionResponse,
    GetModalFuelStopFranchiseResponse,
    FuelledVehicleHistoryListResponse,
} from 'appcoretruckassist';

// services
import { FormDataService } from '@shared/services/form-data.service';

// store
import { FuelStore } from '@pages/fuel/state/fuel-state/fuel-state.store';
import { FuelDetailsStore } from '@pages/fuel/state/fuel-details-state/fuel-details.store';
import { FuelItemStore } from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Injectable({
    providedIn: 'root',
})
export class FuelService {
    constructor(
        // services
        private fuelService: FuelBackendService,
        private formDataService: FormDataService,

        // store
        private fuelStore: FuelStore,
        private fuelDetailsStore: FuelDetailsStore,
        private fuelItemStore: FuelItemStore
    ) {}

    set updateStoreFuelTransactionsList(data: FuelTransactionListResponse) {
        this.fuelStore.update((store) => {
            return {
                ...store,
                fuelTransactions: data,
            };
        });
    }

    set updateStoreFuelStopList(data: FuelStopListResponse) {
        this.fuelStore.update((store) => {
            return {
                ...store,
                fuelStops: data,
            };
        });
    }

    /* Fuel Transaction */

    public getFuelTransactionsList(
        fuelTransactionSpecParamsFuelStopStoreIds?: number[],
        fuelTransactionSpecParamsTruckIds?: number[],
        fuelTransactionSpecParamsCategoryIds?: number[],
        fuelTransactionSpecParamsCardIds?: number[],
        fuelTransactionSpecParamsDateFrom?: any,
        fuelTransactionSpecParamsDateTo?: string,
        fuelTransactionSpecParamsLong?: any,
        fuelTransactionSpecParamsLat?: number,
        fuelTransactionSpecParamsDistance?: number,
        fuelTransactionSpecParamsLastFrom?: number,
        fuelTransactionSpecParamsLastTo?: number,
        fuelTransactionSpecParamsCostFrom?: number,
        fuelTransactionSpecParamsCostTo?: number,
        fuelTransactionSpecParamsPpgFrom?: number,
        fuelTransactionSpecParamsPpgTo?: number,
        fuelTransactionSpecParamsTruckId?: number,
        fuelTransactionSpecParamsDriverId?: number,
        fuelTransactionSpecParams?: boolean,
        fuelTransactionSpecParamsIsIncomplete?: boolean,
        fuelTransactionSpecParamsPageIndex?: number,
        fuelTransactionSpecParamsPageSize?: any,
        fuelTransactionSpecParamsCompanyId?: number,
        fuelTransactionSpecParamsSort?: any,
        fuelTransactionSpecParamsSortOrder?: any,
        fuelTransactionSpecParamsSortBy?: any,
        fuelTransactionSpecParamsSearch?: any,
        fuelTransactionSpecParamsSearch1?: any,
        fuelTransactionSpecParamsSearch2?: string
    ): Observable<FuelTransactionListResponse> {
        return this.fuelService.apiFuelTransactionListGet(
            fuelTransactionSpecParamsFuelStopStoreIds,
            fuelTransactionSpecParamsTruckIds,
            fuelTransactionSpecParamsCategoryIds,
            fuelTransactionSpecParamsCardIds,
            fuelTransactionSpecParamsDateFrom,
            fuelTransactionSpecParamsDateTo,
            fuelTransactionSpecParamsLong,
            fuelTransactionSpecParamsLat,
            fuelTransactionSpecParamsDistance,
            fuelTransactionSpecParamsLastFrom,
            fuelTransactionSpecParamsLastTo,
            fuelTransactionSpecParamsCostFrom,
            fuelTransactionSpecParamsCostTo,
            fuelTransactionSpecParamsPpgFrom,
            fuelTransactionSpecParamsPpgTo,
            fuelTransactionSpecParamsTruckId,
            fuelTransactionSpecParamsDriverId,
            fuelTransactionSpecParams,
            fuelTransactionSpecParamsIsIncomplete,
            fuelTransactionSpecParamsPageIndex,
            fuelTransactionSpecParamsPageSize,
            fuelTransactionSpecParamsCompanyId,
            fuelTransactionSpecParamsSort,
            fuelTransactionSpecParamsSortOrder,
            fuelTransactionSpecParamsSortBy,
            fuelTransactionSpecParamsSearch,
            fuelTransactionSpecParamsSearch1,
            fuelTransactionSpecParamsSearch2
        );
    }

    public getFuelTransactionModalDropdowns(): Observable<GetFuelModalResponse> {
        return this.fuelService.apiFuelTransactionModalGet();
    }

    public getFuelTransactionFranchises(
        pageIndex: number,
        pageSize: number
    ): Observable<GetModalFuelStopFranchiseResponse> {
        return this.fuelService.apiFuelTransactionModalFuelstopfranchiseGet(
            pageIndex,
            pageSize
        );
    }

    public getFuelTransactionStoresByFranchiseId(
        id: number
    ): Observable<FuelStopFranchiseResponse> {
        return this.fuelService.apiFuelFuelstopfranchiseIdGet(id);
    }

    public getDispatchHistoryByTruckIdAndDate(
        truckId: number,
        date: string
    ): Observable<FuelDispatchHistoryResponse> {
        return this.fuelService.apiFuelDispatchhistoryGet(truckId, date);
    }

    public getFuelTransactionById(
        id: number
    ): Observable<FuelTransactionResponse> {
        return this.fuelService.apiFuelTransactionIdGet(id);
    }

    public addFuelTransaction<T>(data: T): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.fuelService.apiFuelTransactionPost();
    }

    public updateFuelTransaction<T>(data: T): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.fuelService.apiFuelTransactionPut();
    }

    public updateFuelTransactionEFS<T>(data: T): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.fuelService.apiFuelEfsTransactionPut();
    }

    public deleteFuelTransactionsList(
        ids: number[],
        fuelStopId?: number
    ): Observable<void> {
        return this.fuelService.apiFuelTransactionListDelete(ids).pipe(
            tap(() => {
                ids.forEach((id) => {
                    this.fuelStore.update((store) => ({
                        fuelTransactions: {
                            ...store.fuelTransactions,
                            pagination: {
                                ...store.fuelTransactions?.pagination,
                                data: store.fuelTransactions?.pagination?.data?.filter(
                                    (transaction) => transaction.id !== id
                                ),
                            },
                        },
                    }));

                    const updateStore = (store) =>
                        store.update(fuelStopId, (entity) => ({
                            ...entity,
                            transactionList: entity.transactionList.filter(
                                (transaction) => transaction.id !== id
                            ),
                        }));

                    updateStore(this.fuelDetailsStore);
                    updateStore(this.fuelItemStore);
                });

                const tableCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
                );

                if (tableCount) {
                    tableCount.fuelTransactions -= ids.length;

                    localStorage.setItem(
                        TableStringEnum.FUEL_TABLE_COUNT,
                        JSON.stringify(tableCount)
                    );
                }
            })
        );
    }

    /* Fuel Stop */

    public getFuelStopsList(
        truckIds?: number[],
        categoryIds?: number[],
        franchiseIds?: number[],
        dateFrom?: any,
        dateTo?: string,
        _long?: any,
        lat?: number,
        distance?: number,
        lastFrom?: number,
        lastTo?: number,
        costFrom?: number,
        costTo?: number,
        ppgFrom?: number,
        ppgTo?: number,
        closed?: boolean,
        pageIndex?: number,
        pageSize?: any,
        companyId?: number,
        sort?: any,
        sortOrder?: SortOrder,
        search?: any,
        search1?: string,
        search2?: string
    ): Observable<FuelStopListResponse> {
        return this.fuelService.apiFuelFuelstopListGet(
            truckIds,
            categoryIds,
            franchiseIds,
            dateFrom,
            dateTo,
            _long,
            lat,
            distance,
            lastFrom,
            lastTo,
            costFrom,
            costTo,
            ppgFrom,
            ppgTo,
            closed,
            pageIndex,
            pageSize,
            companyId,
            sort,
            sortOrder,
            search,
            search1,
            search2
        );
    }

    public getFuelStopModalDropdowns(
        pageIndex: number = 1,
        pageSize: number = 25
    ): Observable<GetFuelStopModalResponse> {
        return this.fuelService.apiFuelFuelstopModalGet(pageIndex, pageSize);
    }

    public getFuelExpenses(
        id: number,
        timeFilter?: number
    ): Observable<FuelStopExpensesResponse> {
        return this.fuelService.apiFuelExpensesGet(id, timeFilter);
    }

    public getFuelStopById(id: number): Observable<FuelStopResponse> {
        return this.fuelService.apiFuelFuelstopIdGet(id);
    }

    public getFuelStopFuelledcVehicle(
        fuelStopId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<FuelledVehicleHistoryListResponse> {
        return this.fuelService.apiFuelFuelstopFueledvehicleGet(
            fuelStopId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    public addFuelStop<T>(data: T): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.fuelService.apiFuelFuelstopPost();
    }

    public updateFuelStop<T>(data: T): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.fuelService.apiFuelFuelstopUpdatePut();
    }

    public updateFuelStopFavorite(
        id: number,
        isPinned: boolean
    ): Observable<object> {
        return this.fuelService.apiFuelFuelstopPut(id, isPinned).pipe(
            tap(() => {
                this.fuelStore.update((store) => ({
                    fuelStops: {
                        ...store.fuelStops,
                        pagination: {
                            ...store.fuelStops.pagination,
                            data: store.fuelStops.pagination.data.map((stop) =>
                                stop.id === id
                                    ? { ...stop, favourite: isPinned }
                                    : stop
                            ),
                        },
                    },
                }));
            })
        );
    }

    public updateFuelStopStatus(id: number): Observable<void> {
        return this.fuelService.apiFuelFuelstopStatusIdPut(id).pipe(
            tap(() => {
                this.fuelStore.update((store) => ({
                    fuelStops: {
                        ...store.fuelStops,
                        pagination: {
                            ...store.fuelStops.pagination,
                            data: store.fuelStops.pagination.data.map((stop) =>
                                stop.id === id
                                    ? { ...stop, isClosed: !stop.isClosed }
                                    : stop
                            ),
                        },
                    },
                }));
            })
        );
    }

    public deleteFuelStopList(ids: number[]): Observable<void> {
        return this.fuelService.apiFuelFuelstopListDelete(ids).pipe(
            tap(() => {
                ids.forEach((id) => {
                    this.fuelStore.update((store) => ({
                        fuelStops: {
                            ...store.fuelStops,
                            pagination: {
                                ...store.fuelStops.pagination,
                                data: store.fuelStops.pagination.data.filter(
                                    (transaction) => transaction.id !== id
                                ),
                            },
                        },
                    }));
                });

                const tableCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
                );

                tableCount.fuelStops -= ids.length;

                localStorage.setItem(
                    TableStringEnum.FUEL_TABLE_COUNT,
                    JSON.stringify(tableCount)
                );
            })
        );
    }

    public checkFuelStopAddress(
        addressEntityCity: string,
        addressEntityState: string,
        addressEntityCounty: string,
        addressEntityAddress: string,
        addressEntityStreet: string,
        addressEntityStreetNumber: string,
        addressEntityCountry: string,
        addressEntityZipCode: string,
        addressEntityStateShortName: string,
        addressEntityAddressUnit: string
    ): Observable<boolean> {
        return this.fuelService.apiFuelFuelstopCheckAddressGet(
            addressEntityCity,
            addressEntityState,
            addressEntityCounty,
            addressEntityAddress,
            addressEntityStreet,
            addressEntityStreetNumber,
            addressEntityCountry,
            addressEntityZipCode,
            addressEntityStateShortName,
            addressEntityAddressUnit
        );
    }

    public checkFuelStopPhone(phone: string): Observable<boolean> {
        return this.fuelService.apiFuelFuelstopCheckPhonePhoneGet(phone);
    }

    public checkFuelStopFranchise(
        id: number,
        store: string
    ): Observable<boolean> {
        return this.fuelService.apiFuelFuelstopCheckStoreFranchiseIdStoreGet(
            id,
            store
        );
    }
}
