import { CdlService } from './../../../../../../appcoretruckassist/api/cdl.service';
import { DriverService } from './../../../../../../appcoretruckassist/api/driver.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, tap, takeUntil } from 'rxjs';
import {
  CheckOwnerSsnEinResponse,
  CreateDriverCommand,
  DriverListResponse,
  DriverMinimalListResponse,
  DriverResponse,
  GetDriverModalResponse,
  OwnerService,
  UpdateDriverCommand,
} from 'appcoretruckassist';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversActiveQuery } from './driver-active-state/driver-active.query';
import { DriversInactiveQuery } from './driver-inactive-state/driver-inactive.query';
import { DriversInactiveStore } from './driver-inactive-state/driver-inactive.store';
import { DriversMinimalListStore } from './driver-details-minimal-list-state/driver-minimal-list.store';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriversMinimalListQuery } from './driver-details-minimal-list-state/driver-minimal-list.query';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { DriversDetailsListStore } from './driver-details-list-state/driver-details-list.store';

@Injectable({
  providedIn: 'root',
})
export class DriverTService implements OnDestroy {
  public currentIndex: number;
  public driversList: any;
  public driverId: number;
  private destroy$ = new Subject<void>();

  constructor(
    private driverService: DriverService,
    private driversActiveQuery: DriversActiveQuery,
    private driverActiveStore: DriversActiveStore,
    private driversInactiveQuery: DriversInactiveQuery,
    private driverInactiveStore: DriversInactiveStore,
    private driverMinimimalListStore: DriversMinimalListStore,
    private cdlService: CdlService,
    private ownerService: OwnerService,
    private driverMinimalQuery: DriversMinimalListQuery,
    private tableService: TruckassistTableService,
    private driverItemStore: DriversItemStore,
    private dlStore: DriversDetailsListStore
  ) {}

  // Get Driver Minimal List
  public getDriversMinimalList(
    pageIndex?: number,
    pageSize?: number,
    count?: number
  ): Observable<DriverMinimalListResponse> {
    return this.driverService.apiDriverListMinimalGet(
      pageIndex,
      pageSize,
      count
    );
  }

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
    // return this.driverService.apiDriverListGet(
    //   active,
    //   pageIndex,
    //   pageSize,
    //   companyId,
    //   sort,
    //   search,
    //   search1,
    //   search2
    // );
    return of();
  }

  /* Observable<CreateDriverResponse> */
  // Create Driver
  public addDriver(data: CreateDriverCommand): Observable<any> {
    return this.driverService.apiDriverPost(data).pipe(
      tap((res: any) => {
        const subDriver = this.getDriverById(res.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (driver: DriverResponse | any) => {
              driver = {
                ...driver,
                fullName: driver.firstName + ' ' + driver.lastName,
              };

              this.driverActiveStore.add(driver);
              this.driverMinimimalListStore.add(driver);
              const driverCount = JSON.parse(
                localStorage.getItem('driverTableCount')
              );

              driverCount.active++;

              localStorage.setItem(
                'driverTableCount',
                JSON.stringify({
                  active: driverCount.active,
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

  //Delete Driver By Id Details page, treba ovo zbog tableAnimationService
  public deleteDriverByIdDetails(
    driverId: number,
    tableSelectedTab?: string
  ): Observable<any> {
    return this.driverService.apiDriverIdDelete(driverId).pipe(
      tap(() => {
        this.driverMinimimalListStore.remove(({ id }) => id === driverId);
        this.driverItemStore.remove(({ id }) => id === driverId);
        this.dlStore.remove(({ id }) => id === driverId);
        const driverCount = JSON.parse(
          localStorage.getItem('driverTableCount')
        );

        if (tableSelectedTab === 'active') {
          this.driverActiveStore.remove(({ id }) => id === driverId);

          driverCount.active--;
        } else if (tableSelectedTab === 'inactive') {
          this.driverInactiveStore.remove(({ id }) => id === driverId);

          driverCount.inactive--;
        }

        localStorage.setItem(
          'driverTableCount',
          JSON.stringify({
            active: driverCount.active,
            inactive: driverCount.inactive,
          })
        );

        const driverSub = this.getDriverById(this.driverId, true)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (driver: DriverResponse | any) => {
              this.tableService.sendActionAnimation({
                animation: 'delete',
                data: driver,
                id: driver.id,
              });
              driverSub.unsubscribe();
            },
          });
      })
    );
  }

  // Delete Driver By Id
  public deleteDriverById(
    driverId: number,
    tableSelectedTab?: string
  ): Observable<any> {
    return this.driverService.apiDriverIdDelete(driverId).pipe(
      tap(() => {
        const driverCount = JSON.parse(
          localStorage.getItem('driverTableCount')
        );

        this.driverMinimimalListStore.remove(({ id }) => id === driverId);
        this.dlStore.remove(({ id }) => id === driverId);
        if (tableSelectedTab === 'active') {
          this.driverActiveStore.remove(({ id }) => id === driverId);

          driverCount.active--;
        } else if (tableSelectedTab === 'inactive') {
          this.driverInactiveStore.remove(({ id }) => id === driverId);

          driverCount.inactive--;
        }

        localStorage.setItem(
          'driverTableCount',
          JSON.stringify({
            active: driverCount.active,
            inactive: driverCount.inactive,
          })
        );

        this.tableService.sendActionAnimation({
          animation: 'delete',
          id: driverId,
        });
      })
    );
  }

  public deleteDriverList(driversToDelete: any[]): Observable<any> {
    let deleteOnBack = driversToDelete.map((driver: any) => {
      return driver.id;
    });

    // return this.driverService.apiDriverListDelete({ ids: deleteOnBack }).pipe(
    //   tap(() => {
    //     let storeDrivers = this.driversActiveQuery.getAll();

    //     storeDrivers.map((driver: any) => {
    //       deleteOnBack.map((d) => {
    //         if (d === driver.id) {
    //           this.driverActiveStore.remove(({ id }) => id === driver.id);
    //         }
    //       });
    //     });

    //     alert('Proveri jel sljaka driver count update');

    //     const driverCount = JSON.parse(
    //       localStorage.getItem('driverTableCount')
    //     );

    //     localStorage.setItem(
    //       'driverTableCount',
    //       JSON.stringify({
    //         active: storeDrivers.length,
    //         inactive: driverCount.inactive,
    //       })
    //     );
    //   })
    // );
    return of(null);
  }

  public updateDriver(data: UpdateDriverCommand): Observable<object> {
    return this.driverService.apiDriverPut(data).pipe(
      tap((res: any) => {
        const subDriver = this.getDriverById(data.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (driver: DriverResponse | any) => {
              this.driverActiveStore.remove(({ id }) => id === data.id);
              this.driverMinimimalListStore.remove(({ id }) => id === data.id);
              driver = {
                ...driver,
                fullName: driver.firstName + ' ' + driver.lastName,
              };

              this.driverActiveStore.add(driver);
              this.driverMinimimalListStore.add(driver);
              this.dlStore.replace(driver.id, driver);
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

  public getDriverById(
    driverId: number,
    getIndex?: boolean
  ): Observable<DriverResponse> {
    this.driverMinimalQuery
      .selectAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.driversList = item));
    if (getIndex) {
      this.currentIndex = this.driversList.findIndex(
        (driver) => driver.id === driverId
      );
      let last = this.driversList.at(-1);

      if (last.id === driverId) {
        this.currentIndex = --this.currentIndex;
      } else {
        this.currentIndex = ++this.currentIndex;
      }
      if (this.currentIndex == -1) {
        this.currentIndex = 0;
      }
      this.driverId = this.driversList[this.currentIndex].id;
    }

    return this.driverService.apiDriverIdGet(driverId);
  }

  public activateDeactiveCdl(cdlId: number): Observable<DriverResponse> {
    return this.cdlService.apiCdlDeactivateIdPut(cdlId);
  }

  public getDriverDropdowns(): Observable<GetDriverModalResponse> {
    return this.driverService.apiDriverModalGet();
  }

  public checkOwnerEinNumber(
    number: string
  ): Observable<CheckOwnerSsnEinResponse> {
    return this.ownerService.apiOwnerCheckSsnEinGet(number);
  }

  public changeDriverStatus(
    driverId: number,
    tabSelected?: string
  ): Observable<any> {
    return this.driverService.apiDriverStatusIdPut(driverId, 'response').pipe(
      tap(() => {
        /* Get Table Tab Count */
        const driverCount = JSON.parse(
          localStorage.getItem('driverTableCount')
        );

        /* Get Data From Store To Update */
        let driverToUpdate =
          tabSelected === 'active'
            ? this.driversActiveQuery.getAll({
                filterBy: ({ id }) => id === driverId,
              })
            : this.driversInactiveQuery.getAll({
                filterBy: ({ id }) => id === driverId,
              });

        /* Remove Data From Store */
        tabSelected === 'active'
          ? this.driverActiveStore.remove(({ id }) => id === driverId)
          : this.driverInactiveStore.remove(({ id }) => id === driverId);

        /* Add Data To New Store */
        tabSelected === 'active'
          ? this.driverInactiveStore.add({
              ...driverToUpdate[0],
              status: 0,
            })
          : this.driverActiveStore.add({
              ...driverToUpdate[0],
              status: 1,
            });

        /* Update Table Tab Count */
        if (tabSelected === 'active') {
          driverCount.active--;
          driverCount.inactive++;
        } else if (tabSelected === 'inactive') {
          driverCount.active++;
          driverCount.inactive--;
        }

        /* Send Table Tab Count To Local Storage */
        localStorage.setItem(
          'driverTableCount',
          JSON.stringify({
            active: driverCount.active,
            inactive: driverCount.inactive,
          })
        );

        const subDriver = this.getDriverById(driverId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (driver: DriverResponse | any) => {
              driver = {
                ...driver,
                fullName: driver.firstName + ' ' + driver.lastName,
              };
              this.dlStore.update(driver.id, { status: driver.status });
              this.tableService.sendActionAnimation({
                animation: 'update-status',
                data: driver,
                id: driver.id,
              });
              subDriver.unsubscribe();
            },
          });
        /* Send Info For Table To Do Action Animation */
        // this.tableService.sendActionAnimation({
        //   animation: 'update-status',
        //   id: driverId,
        // });
      })
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
