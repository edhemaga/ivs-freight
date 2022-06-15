import { Injectable } from '@angular/core';
import {
  CreateMedicalCommand,
  DriverResponse,
  EditMedicalCommand,
  MedicalResponse,
  MedicalService,
} from 'appcoretruckassist';
import { CreateMedicalResponse } from 'appcoretruckassist/model/createMedicalResponse';
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriverTService } from './driver.service';
import { DriversStore } from './driver.store';

@Injectable({
  providedIn: 'root',
})
export class MedicalTService {
  constructor(
    private medicalService: MedicalService,
    private driverService: DriverTService,
    private driverStore: DriversStore,
    private tableService: TruckassistTableService
  ) {}

  public deleteMedicalById(id: number): Observable<any> {
    return this.medicalService.apiMedicalIdDelete(id);
  }

  public getMedicalById(id: number): Observable<MedicalResponse> {
    return this.medicalService.apiMedicalIdGet(id);
  }

  public addMedical(
    data: CreateMedicalCommand
  ): Observable<CreateMedicalResponse> {
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
    return this.medicalService.apiMedicalPut(data);
  }
}
