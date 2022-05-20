import { Injectable } from '@angular/core';
import {
  CheckOwnerSsnEinResponse,
  CreateDriverCommand,
  CreateDriverResponse,
  DriverResponse,
  DriverService,
  GetDriverModalResponse,
  OwnerService,
  UpdateDriverCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverModalService {
  constructor(private driverService: DriverService, private ownerService: OwnerService) {}

  public addDriver(
    data: CreateDriverCommand
  ): Observable<CreateDriverResponse> {
    return this.driverService.apiDriverPost(data);
  }

  public deleteDriverByid(id: number): Observable<any> {
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
