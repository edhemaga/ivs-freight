import { DriverService } from './../../../../../../appcoretruckassist/api/driver.service';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { CheckOwnerSsnEinResponse, CreateDriverCommand,  DriverListResponse, DriverResponse, GetDriverModalResponse, OwnerService, UpdateDriverCommand } from 'appcoretruckassist';
import { DriversStore } from './driver.store';
import { CreateDriverResponse } from 'appcoretruckassist/model/createDriverResponse';

@Injectable({
  providedIn: 'root',
})
export class DriverTService {
  constructor(private driverService: DriverService, private driverStore:DriversStore, private ownerService: OwnerService) {}

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

  public addDriver(
    data: CreateDriverCommand
  ): Observable<CreateDriverResponse> {
    return this.driverService.apiDriverPost(data);
  }

  public deleteDriverById(id: number): Observable<any> {
    return this.driverService.apiDriverIdDelete(id);
  }

  public updateDriver(data: UpdateDriverCommand): Observable<object> {
    return this.driverService.apiDriverPut(data);
  }

  public getDriverById(id: number): Observable<DriverResponse> {
    return this.driverService.apiDriverIdGet(id);
  }

  public getDriverDropdowns(): Observable<GetDriverModalResponse> {
    return this.driverService.apiDriverModalGet();
  }

  public checkOwnerEinNumber(number: string): Observable<CheckOwnerSsnEinResponse> {
    return this.ownerService.apiOwnerCheckSsnEinGet(number)
  }

  public changeDriverStatus(id: number): Observable<any> {
    return this.driverService.apiDriverStatusIdPut(id, 'response');
  }
}
 