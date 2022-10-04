import { FuelStopResponse } from './../../../../../../appcoretruckassist/model/fuelStopResponse';
import { Injectable } from '@angular/core';
import { FuelService } from 'appcoretruckassist';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuelTService {
  constructor(private fuelService: FuelService) {}

  public getFuelById(fuelId: number): Observable<FuelStopResponse> {
    return this.fuelService.apiFuelFuelstopIdGet(fuelId);
  }
}
