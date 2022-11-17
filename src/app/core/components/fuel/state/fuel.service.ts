import { Observable } from 'rxjs';
import { FuelStopResponse } from './../../../../../../appcoretruckassist/model/fuelStopResponse';
import { Injectable } from '@angular/core';
import {
  FuelService,
  FuelStopListResponse,
  FuelTransactionListResponse,
} from 'appcoretruckassist';

import { GetFuelStopModalResponse } from '../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { EditFuelStopCommand } from '../../../../../../appcoretruckassist/model/editFuelStopCommand';
import { AddFuelStopCommand } from '../../../../../../appcoretruckassist/model/addFuelStopCommand';
import { UpdateFuelStopCommand } from '../../../../../../appcoretruckassist/model/updateFuelStopCommand';
import { FuelStore } from './fule-state/fuel-state.store';
import { GetFuelModalResponse } from '../../../../../../appcoretruckassist/model/getFuelModalResponse';

@Injectable({
  providedIn: 'root',
})
export class FuelTService {
  constructor(private fuelService: FuelService, private fuelStore: FuelStore) {}

  // **************** FUEL TRANSACTION ****************

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

  // **************** FUEL STOP ****************

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

  public addFuelStop(data: AddFuelStopCommand): Observable<CreateResponse> {
    return this.fuelService.apiFuelFuelstopPost(data);
  }

  // For table method
  public updateFuelStopShortest(data: EditFuelStopCommand): Observable<object> {
    return this.fuelService.apiFuelFuelstopPut(data);
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
