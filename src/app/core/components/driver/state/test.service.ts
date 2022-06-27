import { Injectable } from '@angular/core';
import {
  CreateTestCommand,
  DriverResponse,
  EditTestCommand,
  GetTestModalResponse,
  TestResponse,
  TestService,
} from 'appcoretruckassist';
import { CreateTestResponse } from 'appcoretruckassist/model/createTestResponse';
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';

@Injectable({
  providedIn: 'root',
})
export class TestTService {
  constructor(
    private drugService: TestService,
    private driverService: DriverTService,
    private driverStore: DriversActiveStore,
    private tableService: TruckassistTableService
  ) {}

  public addTest(data: CreateTestCommand): Observable<CreateTestResponse> {
    return this.drugService.apiTestPost(data).pipe(
      tap((res: any) => {
        const subDriver = this.driverService
          .getDriverById(data.driverId)
          .subscribe({
            next: (driver: DriverResponse | any) => {
              /*  this.driverStore.remove(({ id }) => id === data.driverId);

              driver = {
                ...driver,
                fullName: driver.firstName + ' ' + driver.lastName,
              };

              this.driverStore.add(driver);

              this.tableService.sendActionAnimation({
                animation: 'update',
                data: driver,
                id: driver.id,
              }); */

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

  public updateTest(data: EditTestCommand): Observable<object> {
    return this.drugService.apiTestPut(data);
  }

  public deleteTestById(id: number): Observable<any> {
    return this.drugService.apiTestIdDelete(id);
  }

  public getTestById(id: number): Observable<TestResponse> {
    return this.drugService.apiTestIdGet(id);
  }

  public getTestDropdowns(): Observable<GetTestModalResponse> {
    return this.drugService.apiTestModalGet();
  }
}
