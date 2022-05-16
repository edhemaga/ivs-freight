import { DriverService } from './../../../../../../appcoretruckassist/api/driver.service';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { DriverListResponse, DriverResponse } from 'appcoretruckassist';
import { DriversState, DriversStore } from './driver.store';

@Injectable({
  providedIn: 'root',
})
export class DriverTService {
  constructor(private driverService: DriverService, private driverStore:DriversStore) {}

  // Create Driver
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
    return this.driverService.apiDriverListGet(active, pageIndex, pageSize);
  }

  // Delete Driver
  public deleteDriverById(id: number): Observable<any> {
    return this.driverService.apiDriverIdDelete(id);
  }
  public getDriverById(id:number): Observable<DriverResponse>{
       return this.driverService.apiDriverIdGet(id);
  }
}
