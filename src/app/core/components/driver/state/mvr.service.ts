import { MvrService } from './../../../../../../appcoretruckassist/api/mvr.service';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  CreateMvrCommand,
  DriverResponse,
  EditMvrCommand,
  MvrResponse,
} from 'appcoretruckassist';
/* import { CreateMvrResponse } from 'appcoretruckassist/model/createMvrResponse'; */
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriversItemStore } from './driver-details-state/driver-details.store';

@Injectable({
  providedIn: 'root',
})
export class MvrTService {
  constructor(
    private mvrService: MvrService,
    private driverService: DriverTService,
    private driverStore: DriversActiveStore,
    private tableService: TruckassistTableService,
    private driverItemStore: DriversItemStore
  ) {}

  public deleteMvrById(id: number): Observable<any> {
    return this.mvrService.apiMvrIdDelete(id).pipe(
      tap((res: any) => {
        let driverId = this.driverItemStore.getValue().ids[0];
        const subDriver = this.driverService.getDriverById(driverId).subscribe({
          next: (driver: DriverResponse | any) => {
            this.driverStore.remove(({ id }) => id === driverId);

            driver = {
              ...driver,
              fullName: driver.firstName + ' ' + driver.lastName,
            };

            this.driverStore.add(driver);

            this.tableService.sendActionAnimation({
              animation: 'delete',
              data: driver,
              id: driverId,
            });

            subDriver.unsubscribe();
          },
        });
      })
    );
  }

  public getMvrById(id: number): Observable<MvrResponse> {
    return this.mvrService.apiMvrIdGet(id);
  }

  /* Observable<CreateMvrResponse> */
  public addMvr(data: CreateMvrCommand): Observable<any> {
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
    return this.mvrService.apiMvrPut(data).pipe(
      tap((res: any) => {
        let driverId = this.driverItemStore.getValue().ids[0];
        const subDriver = this.driverService.getDriverById(driverId).subscribe({
          next: (driver: DriverResponse | any) => {
            this.driverStore.remove(({ id }) => id === driverId);

            driver = {
              ...driver,
              fullName: driver.firstName + ' ' + driver.lastName,
            };

            this.driverStore.add(driver);

            this.tableService.sendActionAnimation({
              animation: 'update',
              data: driver,
              id: driverId,
            });

            subDriver.unsubscribe();
          },
        });
      })
    );
  }
}
