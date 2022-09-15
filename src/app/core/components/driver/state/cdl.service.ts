import { Injectable, OnDestroy } from '@angular/core';
import {
  CdlResponse,
  CdlService,
  CreateCdlCommand,
  CreateResponse,
  DriverResponse,
  EditCdlCommand,
  GetCdlModalResponse,
} from 'appcoretruckassist';
/* import { CreateCdlResponse } from 'appcoretruckassist/model/createCdlResponse'; */
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { DriverTService } from './driver.service';
import { RenewCdlCommand } from '../../../../../../appcoretruckassist/model/renewCdlCommand';

@Injectable({
  providedIn: 'root',
})
export class CdlTService implements OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(
    private cdlService: CdlService,
    private driverService: DriverTService,
    private driverStore: DriversActiveStore,
    private tableService: TruckassistTableService,
    private driverItemStore: DriversItemStore,
    private notificationService: NotificationService
  ) {}

  /* Observable<CreateCdlResponse> */
  public addCdl(data: CreateCdlCommand): Observable<CreateResponse> {
    return this.cdlService.apiCdlPost(data).pipe(
      tap((res: CreateResponse) => {
        const subDriver = this.driverService
          .getDriverById(data.driverId)
          .subscribe({
            next: (driver: DriverResponse | any) => {
              this.activateCdlById(res.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (res: any) => {},
                  error: () => {
                    this.notificationService.error(
                      'Cannot activate cdl, already have active.',
                      'Error:'
                    );
                  },
                });
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

  public updateCdl(data: any): Observable<object> {
    return this.cdlService.apiCdlPut(data).pipe(
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

  public deleteCdlById(id: number): Observable<any> {
    return this.cdlService.apiCdlIdDelete(id).pipe(
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

  public activateCdlById(id: number): Observable<any> {
    return this.cdlService.apiCdlActivateIdPut(id).pipe(
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

  public renewCdlUpdate(data: RenewCdlCommand): Observable<any> {
    return this.cdlService.apiCdlRenewPut(data);
  }

  public getCdlById(id: number): Observable<CdlResponse> {
    return this.cdlService.apiCdlIdGet(id);
  }

  public getCdlDropdowns(): Observable<GetCdlModalResponse> {
    return this.cdlService.apiCdlModalGet();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
