import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuelTService {
  constructor() {}

  public getFuelById(fuelId: number): Observable<any> {
    return;
  }
}
