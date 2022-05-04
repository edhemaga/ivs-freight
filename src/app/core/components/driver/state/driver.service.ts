import { DriverService } from './../../../../../../appcoretruckassist/api/driver.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DriverListResponse } from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class DriverTService {
  constructor(private driverService: DriverService) {}

  public getDrivers(
    active?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<DriverListResponse> {
    console.log('Poziva Api getDrivers')
    return this.driverService.apiDriverListGet(active, pageIndex, pageSize);
  }
}
