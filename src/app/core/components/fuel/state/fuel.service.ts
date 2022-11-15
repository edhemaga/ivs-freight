import { FuelStopResponse } from './../../../../../../appcoretruckassist/model/fuelStopResponse';
import { Injectable } from '@angular/core';
import { FuelService } from 'appcoretruckassist';

import { Observable } from 'rxjs';
import { GetFuelStopModalResponse } from '../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { getFunctionParams } from 'src/app/core/utils/methods.globals';
import { EditFuelStopCommand } from '../../../../../../appcoretruckassist/model/editFuelStopCommand';
import { AddFuelStopCommand } from '../../../../../../appcoretruckassist/model/addFuelStopCommand';
import { UpdateFuelStopCommand } from '../../../../../../appcoretruckassist/model/updateFuelStopCommand';

@Injectable({
  providedIn: 'root',
})
export class FuelTService {
  constructor(private fuelService: FuelService) {}

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
