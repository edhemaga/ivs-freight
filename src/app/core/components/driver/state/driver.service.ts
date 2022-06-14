import { DriverShortResponse } from './../../../../../../appcoretruckassist/model/driverShortResponse';
import { DriverService } from './../../../../../../appcoretruckassist/api/driver.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  CheckOwnerSsnEinResponse,
  CreateDriverCommand,
  DeleteMultipleDriverCommand,
  DriverListResponse,
  DriverResponse,
  GetDriverModalResponse,
  OwnerService,
  UpdateDriverCommand,
} from 'appcoretruckassist';
import { DriversStore } from './driver.store';
import { CreateDriverResponse } from 'appcoretruckassist/model/createDriverResponse';
import { DriversQuery } from './driver.query';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
  providedIn: 'root',
})
export class DriverTService {
  constructor(
    private driverService: DriverService,
    private driversQuery: DriversQuery,
    private driverStore: DriversStore,
    private ownerService: OwnerService,
    private tableService: TruckassistTableService
  ) {}

  private driverDetailChangeSubject: Subject<number> = new Subject<number>();

  get driverDetailChangeId$() {
    return this.driverDetailChangeSubject.asObservable();
  }

  public getDriverDetailId(id: number) {
    this.driverDetailChangeSubject.next(id);
  }

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
    return this.driverService.apiDriverPost(data).pipe(
      tap((res: any) => {
        const subDriver = this.getDriverById(res.id).subscribe({
          next: (driver: DriverShortResponse | any) => {
            driver = {
              ...driver,
              fullName: driver.firstName + ' ' + driver.lastName,
            };

            this.driverStore.add(driver);

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
      })
    );
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

  public checkOwnerEinNumber(
    number: string
  ): Observable<CheckOwnerSsnEinResponse> {
    return this.ownerService.apiOwnerCheckSsnEinGet(number);
  }

  public changeDriverStatus(id: number): Observable<any> {
    return this.driverService.apiDriverStatusIdPut(id, 'response');
  }
}
