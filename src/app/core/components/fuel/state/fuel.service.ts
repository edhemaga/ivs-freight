import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
    FuelService,
    FuelStopListResponse,
    FuelStopResponse,
    FuelTransactionListResponse,
} from 'appcoretruckassist';

import { GetFuelStopModalResponse } from '../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { UpdateFuelStopCommand } from '../../../../../../appcoretruckassist/model/updateFuelStopCommand';
import { FuelStore } from './fule-state/fuel-state.store';
import { GetFuelModalResponse } from '../../../../../../appcoretruckassist/model/getFuelModalResponse';
import { FuelDispatchHistoryResponse } from '../../../../../../appcoretruckassist/model/fuelDispatchHistoryResponse';
import { FuelStopFranchiseResponse } from '../../../../../../appcoretruckassist/model/fuelStopFranchiseResponse';
import { FuelTransactionResponse } from '../../../../../../appcoretruckassist/model/fuelTransactionResponse';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

@Injectable({
    providedIn: 'root',
})
export class FuelTService {
    constructor(
        private fuelService: FuelService,
        private fuelStore: FuelStore,
        private formDataService: FormDataService
    ) {}

    // **************** FUEL TRANSACTION ****************

    public getFuelTransactionsList(
        fuelTransactionSpecParamsFuelStopStoreIds?: Array<number>,
        fuelTransactionSpecParamsTruckIds?: Array<number>,
        fuelTransactionSpecParamsCategoryIds?: Array<number>,
        fuelTransactionSpecParamsDateFrom?: string,
        fuelTransactionSpecParamsDateTo?: string,
        fuelTransactionSpecParamsLong?: number,
        fuelTransactionSpecParamsLat?: number,
        fuelTransactionSpecParamsDistance?: number,
        fuelTransactionSpecParamsLastFrom?: number,
        fuelTransactionSpecParamsLastTo?: number,
        fuelTransactionSpecParamsCostFrom?: number,
        fuelTransactionSpecParamsCostTo?: number,
        fuelTransactionSpecParamsPpgFrom?: number,
        fuelTransactionSpecParamsPpgTo?: number,
        fuelTransactionSpecParamsPageIndex?: number,
        fuelTransactionSpecParamsPageSize?: number,
        fuelTransactionSpecParamsCompanyId?: number,
        fuelTransactionSpecParamsSort?: string,
        fuelTransactionSpecParamsSearch?: string,
        fuelTransactionSpecParamsSearch1?: string,
        fuelTransactionSpecParamsSearch2?: string
    ): Observable<FuelTransactionListResponse> {
        return this.fuelService.apiFuelTransactionListGet(
            fuelTransactionSpecParamsFuelStopStoreIds,
            fuelTransactionSpecParamsTruckIds,
            fuelTransactionSpecParamsCategoryIds,
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
            fuelTransactionSpecParamsPageIndex,
            fuelTransactionSpecParamsPageSize,
            fuelTransactionSpecParamsCompanyId,
            fuelTransactionSpecParamsSort,
            fuelTransactionSpecParamsSearch,
            fuelTransactionSpecParamsSearch1,
            fuelTransactionSpecParamsSearch2
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

    public getFuelTransactionById(
        id: number
    ): Observable<FuelTransactionResponse> {
        return this.fuelService.apiFuelTransactionIdGet(id);
    }

    // **************** FUEL STOP ****************

    // Get Fule Stops
    public getFuelStopsList(
        truckIds?: Array<number>,
        categoryIds?: Array<number>,
        dateFrom?: string,
        dateTo?: string,
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
    ): Observable<FuelStopListResponse> {
        return this.fuelService.apiFuelFuelstopListGet(
            truckIds,
            categoryIds,
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
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
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
        this.formDataService.extractFormDataFromFunction(data);
        return this.fuelService.apiFuelFuelstopPost();
    }

    // For table method
    public updateFuelStopShortest(data: any): Observable<object> {
        return this.fuelService.apiFuelFuelstopPut();
    }

    // For modal method
    public updateFuelStop(data: UpdateFuelStopCommand): Observable<object> {
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
}
