import { FuelStopResponse } from './../../../../../../appcoretruckassist/model/fuelStopResponse';
import { Injectable } from '@angular/core';
import {
    FuelService,
    FuelStopListResponse,
    FuelTransactionListResponse,
} from 'appcoretruckassist';

import { Observable, of } from 'rxjs';
import { GetFuelStopModalResponse } from '../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { EditFuelStopCommand } from '../../../../../../appcoretruckassist/model/editFuelStopCommand';
import { AddFuelStopCommand } from '../../../../../../appcoretruckassist/model/addFuelStopCommand';
import { UpdateFuelStopCommand } from '../../../../../../appcoretruckassist/model/updateFuelStopCommand';
import { FuelStore } from './fule-state/fuel-state.store';
import { getFunctionParams } from 'src/app/core/utils/methods.globals';

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

    public addFuelStop(data: any /*AddFuelStopCommand*/): Observable<CreateResponse> {
        const sortedParams = getFunctionParams(
            this.fuelService.apiFuelFuelstopPost,
            data
        );
        
        return this.fuelService.apiFuelFuelstopPost(...sortedParams);
    }

    // For table method
    public updateFuelStopShortest(
        data: any /*EditFuelStopCommand*/
    ): Observable<object> {
        const sortedParams = getFunctionParams(
            this.fuelService.apiFuelFuelstopPut,
            data
        );

        return this.fuelService.apiFuelFuelstopPut(...sortedParams);
    }

    // For modal method
    public updateFuelStop(data: UpdateFuelStopCommand): Observable<object> {
        return this.fuelService.apiFuelFuelstopUpdatePut(data);
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
        // return this.fuelService.apiFuelFuelstopCheckAddressGet(
        //     addressEntityCity,
        //     addressEntityState,
        //     addressEntityCounty,
        //     addressEntityAddress,
        //     addressEntityStreet,
        //     addressEntityStreetNumber,
        //     addressEntityCountry,
        //     addressEntityZipCode,
        //     addressEntityStateShortName,
        //     addressEntityAddressUnit
        // );
        return of();
    }

    public checkFuelStopPhone(data: string): Observable<boolean> {
        //return this.fuelService.apiFuelFuelstopCheckPhonePhoneGet(data);
        return of();
    }

    public checkFuelStopFranchise(
        franchiseId: number,
        store: string
    ): Observable<boolean> {
        // return this.fuelService.apiFuelFuelstopCheckStoreFranchiseIdStoreGet(
        //     franchiseId,
        //     store
        // );
        return of();
    }
}
