import { DriverService } from './../../../../../../appcoretruckassist/api/driver.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  CheckOwnerSsnEinResponse,
  CreateDriverCommand,
  DriverListResponse,
  DriverResponse,
  GetDriverModalResponse,
  OwnerService,
  UpdateDriverCommand,
} from 'appcoretruckassist';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { CreateDriverResponse } from 'appcoretruckassist/model/createDriverResponse';
import { DriversQuery } from './driver-active-state/driver-active.query';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
  providedIn: 'root',
})
export class DriverTService {
  constructor(
    private driverService: DriverService,
    private driversQuery: DriversQuery,
    private driverStore: DriversActiveStore,
    private ownerService: OwnerService,
    private tableService: TruckassistTableService
  ) {}

  // Get Driver List
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

  // Create Driver
  public addDriver(
    data: CreateDriverCommand
  ): Observable<CreateDriverResponse> {
    return this.driverService.apiDriverPost(data).pipe(
      tap((res: any) => {
        const subDriver = this.getDriverById(res.id).subscribe({
          next: (driver: DriverResponse | any) => {
            driver = {
              ...driver,
              fullName: driver.firstName + ' ' + driver.lastName,
            };

            this.driverStore.add(driver);

            const driverCount = JSON.parse(
              localStorage.getItem('driverTableCount')
            );

            driverCount.active++;

            localStorage.setItem(
              'driverTableCount',
              JSON.stringify({
                active:  driverCount.active,
                inactive: driverCount.inactive,
              })
            );

            this.tableService.sendActionAnimation({
              animation: 'add',
              data: driver,
              id: driver.id,
            });

            subDriver.unsubscribe();
          },
        });
      })
    );
  }

  public deleteDriverById(id: number): Observable<any> {
    return this.driverService.apiDriverIdDelete(id).pipe(
      tap(() => {
        this.driverStore.remove(({ id }) => id === id);

        const driverCount = JSON.parse(
          localStorage.getItem('driverTableCount')
        );

        driverCount.active--;

        localStorage.setItem(
          'driverTableCount',
          JSON.stringify({
            active: driverCount.active,
            inactive: driverCount.inactive,
          })
        );
      })
    );
  }

  public deleteDriverList(driversToDelete: any[]): Observable<any> {
    let deleteOnBack = driversToDelete.map((driver: any) => {
      return driver.id;
    });

    return this.driverService.apiDriverListDelete({ ids: deleteOnBack }).pipe(
      tap(() => {
        let storeDrivers = this.driversQuery.getAll();

        storeDrivers.map((driver: any) => {
          deleteOnBack.map((d) => {
            if (d === driver.id) {
              this.driverStore.remove(({ id }) => id === driver.id);
            }
          });
        });

        alert('Proveri jel sljaka driver count update');

        const driverCount = JSON.parse(
          localStorage.getItem('driverTableCount')
        );

        localStorage.setItem(
          'driverTableCount',
          JSON.stringify({
            active: storeDrivers.length,
            inactive: driverCount.inactive,
          })
        );
      })
    );
  }

  public updateDriver(data: UpdateDriverCommand): Observable<object> {
    return this.driverService.apiDriverPut(data).pipe(
      tap((res: any) => {
        const subDriver = this.getDriverById(data.id).subscribe({
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

  public getDriverById(id: number): Observable<DriverResponse> {
    return this.driverService.apiDriverIdGet(id);
  }

  public getDriverDropdowns(): Observable<GetDriverModalResponse> {
    return this.driverService.apiDriverModalGet();
  }

  public checkOwnerEinNumber(
    number: string
  ): Observable<CheckOwnerSsnEinResponse> {
    return this.ownerService.apiOwnerCheckSsnEinGet(number);
  }

  public changeDriverStatus(driverId: number): Observable<any> {
    return this.driverService.apiDriverStatusIdPut(driverId, 'response').pipe(
      tap(() => {
        const driverToUpdate = this.driversQuery.getAll({
          filterBy: ({ id }) => id === driverId,
        });

        this.driverStore.update(({ id }) => id === driverId, {
          status: driverToUpdate[0].status === 0 ? 1 : 0,
        });

        this.tableService.sendActionAnimation({
          animation: 'update-status',
          id: driverId,
        });
      })
    );
  }
}
