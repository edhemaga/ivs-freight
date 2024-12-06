import { Observable, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';

// models
import { FuelStopExpensesResponse, FuelStopResponse, SortOrder } from 'appcoretruckassist';
import {
    FuelService as FuelBackendService,
    FuelStopListResponse,
    FuelTransactionListResponse,
} from 'appcoretruckassist';
import { GetFuelStopModalResponse } from 'appcoretruckassist';
import { CreateResponse } from 'appcoretruckassist';
import { GetFuelModalResponse } from 'appcoretruckassist';
import { FuelDispatchHistoryResponse } from 'appcoretruckassist';
import { FuelStopFranchiseResponse } from 'appcoretruckassist';
import { FuelTransactionResponse } from 'appcoretruckassist';
import { ClusterResponse } from 'appcoretruckassist';

// services
import { FormDataService } from '@shared/services/form-data.service';

// store
import { FuelStore } from '@pages/fuel/state/fuel-state/fuel-state.store';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Injectable({
    providedIn: 'root',
})
export class FuelService {
    constructor(
        private fuelService: FuelBackendService,
        private fuelStore: FuelStore,
        private formDataService: FormDataService
    ) { }

    // **************** FUEL TRANSACTION ****************

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

    public getFuelTransactionsList(
        fuelTransactionSpecParamsFuelStopStoreIds?: Array<number>,
        fuelTransactionSpecParamsTruckIds?: Array<number>,
        fuelTransactionSpecParamsCategoryIds?: Array<number>,
        fuelTransactionSpecParamsCardIds?: Array<number>,
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
    ): Observable<any> {
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

    public getDriverBySelectedTruckAndDate(
        truckId: number,
        date: string
    ): Observable<FuelDispatchHistoryResponse> {
        return this.fuelService.apiFuelDispatchhistoryGet(truckId, date);
    }

    public addFuelTransaction(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.fuelService.apiFuelTransactionPost();
    }

    public updateFuelTransaction(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.fuelService.apiFuelTransactionPut();
    }

    public updateFuelTransactionEFS(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.fuelService.apiFuelEfsTransactionPut();
    }

    // **************** FUEL STOP ****************

    public getFuelTransactionById(
        id: number
    ): Observable<FuelTransactionResponse> {
        return this.fuelService.apiFuelTransactionIdGet(id);
    }

    // Get Fuel Stops
    public getFuelStopsList(
        truckIds?: Array<number>,
        categoryIds?: Array<number>,
        franchiseIds?: Array<number>,
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

    public getFuelStopById(fuelId: number): Observable<FuelStopResponse> {
        return this.fuelService.apiFuelFuelstopIdGet(fuelId);
    }

    public deleteFuelStopById(fuelStopId: number): Observable<object> {
        return this.fuelService.apiFuelFuelstopIdDelete(fuelStopId).pipe(
            tap(() => {
                this.fuelStore.update((store) => ({
                    fuelStops: store.fuelStops.filter(
                        (stop: FuelStopResponse) => stop.id !== fuelStopId
                    ),
                }));
            })
        );
    }

    public deleteFuelStopList(fuelStopIds: number[]) {
        return this.fuelService
            .apiFuelFuelstopListDelete(fuelStopIds)
            .pipe(tap(() => { }));
    }

    public addFuelStop(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.fuelService.apiFuelFuelstopPost();
    }

    // For table method
    public updateFuelStopShortest(data: any): Observable<object> {
        return this.fuelService.apiFuelFuelstopPut(data);
    }

    // For modal method
    public updateFuelStop(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.fuelService.apiFuelFuelstopUpdatePut();
    }

    public getFuelStopModalDropdowns(
        pageIndex: number = 1,
        pageSize: number = 25
    ): Observable<GetFuelStopModalResponse> {
        return this.fuelService.apiFuelFuelstopModalGet(pageIndex, pageSize);
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

    public checkFuelStopPhone(data: string): Observable<boolean> {
        return this.fuelService.apiFuelFuelstopCheckPhonePhoneGet(data);
    }

    public checkFuelStopFranchise(
        franchiseId: number,
        store: string
    ): Observable<boolean> {
        return this.fuelService.apiFuelFuelstopCheckStoreFranchiseIdStoreGet(
            franchiseId,
            store
        );
    }

    // Map Clusters

    public getFuelStopClusters(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        zoomLevel?: number,
        addedNew?: boolean,
        shipperLong?: number,
        shipperLat?: number,
        shipperDistance?: number,
        shipperStates?: Array<string>,
        categoryIds?: Array<number>,
        _long?: number,
        lat?: number,
        distance?: number,
        costFrom?: number,
        costTo?: number,
        lastFrom?: number,
        lastTo?: number,
        ppgFrom?: number,
        ppgTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<Array<ClusterResponse>> {
        return of(null); /* this.fuelService.apiFuelClustersGet(
            northEastLatitude,
            northEastLongitude,
            southWestLatitude,
            southWestLongitude,
            zoomLevel,
            addedNew,
            shipperLong,
            shipperLat,
            shipperDistance,
            shipperStates,
            categoryIds,
            _long,
            lat,
            distance,
            costFrom,
            costTo,
            lastFrom,
            lastTo,
            ppgFrom,
            ppgTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        ); */
    }

    public getFuelStopMapList(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        _long?: number,
        lat?: number,
        distance?: number,
        lastFrom?: number,
        lastTo?: number,
        costFrom?: number,
        costTo?: number,
        ppgFrom?: number,
        ppgTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        return this.fuelService.apiFuelListmapGet(
            northEastLatitude,
            northEastLongitude,
            southWestLatitude,
            southWestLongitude,
            _long,
            lat,
            distance,
            lastFrom,
            lastTo,
            costFrom,
            costTo,
            ppgFrom,
            ppgTo,
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

    public deleteFuelTransactionsList(ids: number[]): Observable<void> {
        return this.fuelService.apiFuelTransactionListDelete(ids).pipe(
            tap(() => {
                ids.forEach((id) => {
                    this.fuelStore.update((store) => ({
                        fuelTransactions: Array.isArray(store?.fuelTransactions)
                            ? store.fuelTransactions.filter(
                                  (transaction: FuelTransactionResponse) =>
                                      transaction.id !== id
                              )
                            : [],
                        fuelStops: Array.isArray(store?.fuelStops)
                            ? store.fuelStops.filter(
                                  (stop: FuelStopResponse) => stop.id !== id
                              )
                            : [],
                    }));
                });

                let tableCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.FUEL_TABLE_COUNT)
                );
                tableCount.fuelTransactions =
                    this.fuelStore.getValue().fuelTransactions.length;

                localStorage.setItem(
                    TableStringEnum.FUEL_TABLE_COUNT,
                    JSON.stringify(tableCount)
                );
            })
        );
    }

    public getFuelExpensesGet(id: number, timeFilter?: number): Observable<FuelStopExpensesResponse> {
        return this.fuelService.apiFuelExpensesGet(id, timeFilter);
    }
}
