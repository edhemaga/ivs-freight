import { FuelStopResponse } from './../../../../../../appcoretruckassist/model/fuelStopResponse';
import { Injectable } from '@angular/core';
import { FuelService } from 'appcoretruckassist';

import { Observable } from 'rxjs';
import { GetFuelStopModalResponse } from '../../../../../../appcoretruckassist/model/getFuelStopModalResponse';
import { CreateResponse } from '../../../../../../appcoretruckassist/model/createResponse';

@Injectable({
  providedIn: 'root',
})
export class FuelTService {
  constructor(private fuelService: FuelService) {}

  public getFuelStopById(fuelId: number): Observable<FuelStopResponse> {
    return this.fuelService.apiFuelFuelstopIdGet(fuelId);
  }

  public addFuelStop(data: any): Observable<CreateResponse> {
    return this.fuelService.apiFuelFuelstopPost(data);
  }

  public updateFuelStop(data: any): Observable<object> {
    return this.fuelService.apiFuelFuelstopPut(data);
  }

  public getFuelStopModalDropdowns(): Observable<GetFuelStopModalResponse> {
    return this.fuelService.apiFuelFuelstopModalGet();
  }
}
