import { FuelStopResponse } from './../../../../../../appcoretruckassist/model/fuelStopResponse';
import { Injectable } from '@angular/core';
import {
    FuelService,
    FuelStopListResponse,
    FuelTransactionListResponse,
} from 'appcoretruckassist';

import { Observable } from 'rxjs';
import { GetFuelStopModalResponse } from '../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { getFunctionParams } from 'src/app/core/utils/methods.globals';
import { FuelStore } from './fule-state/fuel-state.store';

@Injectable({
    providedIn: 'root',
})
export class FuelTService {
    constructor(
        private fuelService: FuelService,
        private fuelStore: FuelStore
    ) {}

    // Get Fuel Transactions
    getFuelTransactionsList(
        fuelTransactionSpecParamsFuelStopStoreId?: number,
        fuelTransactionSpecParamsPageIndex?: number,
        fuelTransactionSpecParamsPageSize?: number,
        fuelTransactionSpecParamsCompanyId?: number,
        fuelTransactionSpecParamsSort?: string,
        fuelTransactionSpecParamsSearch?: string,
        fuelTransactionSpecParamsSearch1?: string,
        fuelTransactionSpecParamsSearch2?: string
    ): Observable<FuelTransactionListResponse> {
        return this.fuelService.apiFuelTransactionListGet(
            fuelTransactionSpecParamsFuelStopStoreId,
            fuelTransactionSpecParamsPageIndex,
            fuelTransactionSpecParamsPageSize,
            fuelTransactionSpecParamsCompanyId,
            fuelTransactionSpecParamsSort,
            fuelTransactionSpecParamsSearch,
            fuelTransactionSpecParamsSearch1,
            fuelTransactionSpecParamsSearch2
        );
    }

    // Get Fule Stops
    getFuelStopsList(
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<FuelStopListResponse> {
        return this.fuelService.apiFuelFuelstopListGet(
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

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

    public getFuelStopById(fuelId: number): Observable<FuelStopResponse> {
        return this.fuelService.apiFuelFuelstopIdGet(fuelId);
    }

    public addFuelStop(data: any): Observable<CreateResponse> {
        const sortedParams = getFunctionParams(
            this.fuelService.apiFuelFuelstopPost,
            data
        );
        return this.fuelService.apiFuelFuelstopPost(...sortedParams);
    }

    public updateFuelStop(data: any): Observable<object> {
        const sortedParams = getFunctionParams(
            this.fuelService.apiFuelFuelstopPut,
            data
        );
        return this.fuelService.apiFuelFuelstopPut(...sortedParams);
    }

    public getFuelStopModalDropdowns(
        pageIndex: number = 1,
        pageSize: number = 25
    ): Observable<GetFuelStopModalResponse> {
        return this.fuelService.apiFuelFuelstopModalGet(pageIndex, pageSize);
    }
}
