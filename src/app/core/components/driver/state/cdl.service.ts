import { Injectable } from '@angular/core';
import {
  CdlResponse,
  CdlService,
  CreateCdlCommand,
  DriverResponse,
  EditCdlCommand,
  GetCdlModalResponse,
} from 'appcoretruckassist';
/* import { CreateCdlResponse } from 'appcoretruckassist/model/createCdlResponse'; */
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';

@Injectable({
  providedIn: 'root',
})
export class CdlTService {
  constructor(
    private cdlService: CdlService,
    private driverService: DriverTService,
    private driverStore: DriversActiveStore,
    private tableService: TruckassistTableService
  ) {}

  /* Observable<CreateCdlResponse> */
  public addCdl(data: CreateCdlCommand): Observable<any> {
    return this.cdlService.apiCdlPost(data).pipe(
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

  public updateCdl(data: EditCdlCommand): Observable<object> {
    return this.cdlService.apiCdlPut(data).pipe(
      tap((res: any) => {
        const subDriver = this.driverService.getDriverById(data.id).subscribe({
          next: (driver: DriverResponse | any) => {
            this.driverStore.remove(({ id }) => id === data.id);

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

  public deleteCdlById(id: number): Observable<any> {
    return this.cdlService.apiCdlIdDelete(id);
  }

  public getCdlById(id: number): Observable<CdlResponse> {
    return this.cdlService.apiCdlIdGet(id);
  }

  public getCdlDropdowns(): Observable<GetCdlModalResponse> {
    return this.cdlService.apiCdlModalGet();
  }
}
