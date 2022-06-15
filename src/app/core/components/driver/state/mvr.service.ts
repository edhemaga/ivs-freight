import { MvrService } from './../../../../../../appcoretruckassist/api/mvr.service';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  CreateMvrCommand,
  DriverResponse,
  EditMvrCommand,
  MvrResponse,
} from 'appcoretruckassist';
import { CreateMvrResponse } from 'appcoretruckassist/model/createMvrResponse';
import { DriverTService } from './driver.service';
import { DriversStore } from './driver.store';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
  providedIn: 'root',
})
export class MvrTService {
  constructor(
    private mvrService: MvrService,
    private driverService: DriverTService,
    private driverStore: DriversStore,
    private tableService: TruckassistTableService
  ) {}

  public deleteMvrById(id: number): Observable<any> {
    return this.mvrService.apiMvrIdDelete(id);
  }

  public getMvrById(id: number): Observable<MvrResponse> {
    return this.mvrService.apiMvrIdGet(id);
  }

  public addMvr(data: CreateMvrCommand): Observable<CreateMvrResponse> {
    return this.mvrService.apiMvrPost(data).pipe(
      tap((res: any) => {
        const subDriver = this.driverService
          .getDriverById(data.driverId)
          .subscribe({
            next: (driver: DriverResponse | any) => {
              this.driverStore.remove(({ id }) => id === data.driverId);

              driver = {
                ...driver,
                fullName: driver.firstName + ' ' + driver.lastName,
              };

              this.driverStore.add(driver);

              this.tableService.sendActionAnimation({
                animation: 'update',
                data: driver,
                id: driver.id,
              });

              subDriver.unsubscribe();
            },
          });
      })
    );
  }

  public updateMvr(data: EditMvrCommand): Observable<object> {
    return this.mvrService.apiMvrPut(data);
  }
}
