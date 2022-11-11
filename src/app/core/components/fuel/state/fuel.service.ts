import { FuelStopResponse } from './../../../../../../appcoretruckassist/model/fuelStopResponse';
import { Injectable } from '@angular/core';
import { FuelService } from 'appcoretruckassist';

import { Observable } from 'rxjs';
import { GetFuelStopModalResponse } from '../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';
import { getFunctionParams } from 'src/app/core/utils/methods.globals';

@Injectable({
  providedIn: 'root',
})
export class FuelTService {
  constructor(private fuelService: FuelService) {}

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
