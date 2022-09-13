import { Injectable } from '@angular/core';
import {
  CreateMedicalCommand,
  DriverResponse,
  EditMedicalCommand,
  MedicalResponse,
  MedicalService,
} from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

@Injectable({
  providedIn: 'root',
})
export class MedicalTService {
  constructor(
    private medicalService: MedicalService,
    private driverService: DriverTService,
    private driverStore: DriversActiveStore,
    private tableService: TruckassistTableService,
    private driverItemStore: DriversItemStore
  ) {}

  public deleteMedicalById(id: number): Observable<any> {
    return this.medicalService.apiMedicalIdDelete(id).pipe(
      tap((res: any) => {
        let driverId = this.driverItemStore.getValue().ids[0];
        const subDriver = this.driverService.getDriverById(driverId).subscribe({
          next: (driver: DriverResponse | any) => {
            this.driverStore.remove(({ id }) => id === driverId);
            this.driverItemStore.remove(({ id }) => id === driverId);
            driver = {
              ...driver,
              fullName: driver.firstName + ' ' + driver.lastName,
            };

            this.driverStore.add(driver);
            this.driverItemStore.add(driver);
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

  public getMedicalById(id: number): Observable<MedicalResponse> {
    return this.medicalService.apiMedicalIdGet(id);
  }

  /* Observable<CreateMedicalResponse> */
  public addMedical(data: CreateMedicalCommand): Observable<any> {
    return this.medicalService.apiMedicalPost(data).pipe(
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

  public updateMedical(data: EditMedicalCommand): Observable<object> {
    return this.medicalService.apiMedicalPut(data).pipe(
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
