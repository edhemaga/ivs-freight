import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// models
import {
    CheckDriverBySsnResponse,
    DriverService as DriverBackendService,
} from 'appcoretruckassist';
import {
    CheckOwnerSsnEinResponse,
    DriverListResponse,
    DriverMinimalListResponse,
    DriverResponse,
    GetDriverModalResponse,
    OwnerService,
    CdlService,
    MedicalService,
    MvrService,
    TestService,
    DriverPayrollResponse,
} from 'appcoretruckassist';

// store
import { DriverStore } from '@pages/driver/state/driver-state/driver.store';
import { DriverQuery } from '@pages/driver/state/driver-state/driver.query';
import { DriversInactiveQuery } from '@pages/driver/state/driver-inactive-state/driver-inactive.query';
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';
import { DriversMinimalListStore } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.store';
import { DriversMinimalListQuery } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.query';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details-item.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';
import { DispatcherService } from '@pages/dispatch/services';

// components
import { DriverModel } from '@pages/driver/pages/driver-table/models/driver.model';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { EGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class DriverService {
    public currentIndex: number;
    public driversList: any;
    public driverId: number;

    constructor(
        // services
        private driverService: DriverBackendService,
        private cdlService: CdlService,
        private ownerService: OwnerService,
        private formDataService: FormDataService,
        private MedicalService: MedicalService,
        private MvrService: MvrService,
        private TestService: TestService,
        private tableService: TruckassistTableService,
        private dispatcherService: DispatcherService,

        // store
        private driversActiveQuery: DriverQuery,
        private driverMinimalQuery: DriversMinimalListQuery,
        private driversInactiveQuery: DriversInactiveQuery,
        private driverInactiveStore: DriversInactiveStore,
        private driverMinimimalListStore: DriversMinimalListStore,
        private driverStore: DriverStore,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore
    ) {}

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

    public getDrivers(
        active?: number,
        _long?: number,
        lat?: number,
        distance?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<DriverListResponse> {
        return this.driverService.apiDriverListGet(
            active,
            _long,
            lat,
            distance,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    public addDriver(
        data: any,
        isDispatchCall: boolean = false
    ): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.driverService.apiDriverPost().pipe(
            tap((res) => {
                this.getDriverById(res.id).subscribe({
                    next: (driver: any) => {
                        if (!isDispatchCall) {
                            driver = {
                                ...driver,
                                name: driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            this.driverMinimimalListStore.add(driver);

                            const driverCount = JSON.parse(
                                localStorage.getItem(
                                    TableStringEnum.DRIVER_TABLE_COUNT
                                )
                            );

                            if (driverCount) {
                                driverCount.active++;

                                localStorage.setItem(
                                    TableStringEnum.DRIVER_TABLE_COUNT,
                                    JSON.stringify({
                                        applicant: driverCount.applicant,
                                        active: driverCount.active,
                                        inactive: driverCount.inactive,
                                    })
                                );
                            }

                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.ADD,
                                data: driver,
                                id: driver.id,
                            });
                        } else {
                            this.dispatcherService.updateDispatcherData = true;
                        }
                    },
                });
            })
        );
    }

    public deleteDriverByIdDetails(
        driverId: number,
        tableSelectedTab?: string
    ): Observable<any> {
        return this.driverService.apiDriverIdDelete(driverId).pipe(
            tap(() => {
                this.driverMinimimalListStore.remove(
                    ({ id }) => id === driverId
                );
                this.driverItemStore.remove(({ id }) => id === driverId);
                this.dlStore.remove(({ id }) => id === driverId);
                const driverCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.DRIVER_TABLE_COUNT)
                );

                if (tableSelectedTab === TableStringEnum.ACTIVE) {
                    this.driverStore.remove(({ id }) => id === driverId);

                    driverCount.active--;
                } else if (tableSelectedTab === TableStringEnum.INACTIVE) {
                    this.driverInactiveStore.remove(
                        ({ id }) => id === driverId
                    );

                    driverCount.inactive--;
                }

                localStorage.setItem(
                    TableStringEnum.DRIVER_TABLE_COUNT,
                    JSON.stringify({
                        applicant: driverCount.applicant,
                        active: driverCount.active,
                        inactive: driverCount.inactive,
                    })
                );

                this.getDriverById(this.driverId, true).subscribe({
                    next: (driver: any) => {
                        this.tableService.sendActionAnimation({
                            animation: TableStringEnum.DELETE,
                            data: driver,
                            id: driver.id,
                        });
                    },
                });
            })
        );
    }

    // Delete Driver By Id
    public deleteDriverById(
        driverId: number,
        tableSelectedTab?: string
    ): Observable<DriverModel> {
        return this.driverService.apiDriverIdDelete(driverId).pipe(
            tap(() => {
                const driverCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.DRIVER_TABLE_COUNT)
                );

                this.driverMinimimalListStore.remove(
                    ({ id }) => id === driverId
                );
                this.dlStore.remove(({ id }) => id === driverId);
                if (tableSelectedTab === TableStringEnum.ACTIVE) {
                    this.driverStore.remove(({ id }) => id === driverId);

                    driverCount.active--;
                } else if (tableSelectedTab === TableStringEnum.INACTIVE) {
                    this.driverInactiveStore.remove(
                        ({ id }) => id === driverId
                    );

                    driverCount.inactive--;
                }

                localStorage.setItem(
                    TableStringEnum.DRIVER_TABLE_COUNT,
                    JSON.stringify({
                        applicant: driverCount.applicant,
                        active: driverCount.active,
                        inactive: driverCount.inactive,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: TableStringEnum.DELETE,
                    id: driverId,
                });
            })
        );
    }

    public deleteDriverList(ids: number[]): Observable<DriverResponse> {
        return this.driverService.apiDriverListDelete(ids).pipe(
            tap(() => {
                let storeDrivers = this.driversActiveQuery.getAll();

                storeDrivers.map((driver) => {
                    ids.map((driverId) => {
                        if (driverId === driver.id) {
                            this.driverStore.remove(
                                ({ id }) => id === driver.id
                            );
                        }
                    });
                });

                const driverCount = JSON.parse(
                    localStorage.getItem(TableStringEnum.DRIVER_TABLE_COUNT)
                );

                localStorage.setItem(
                    TableStringEnum.DRIVER_TABLE_COUNT,
                    JSON.stringify({
                        active: storeDrivers.length,
                        inactive: driverCount.inactive,
                    })
                );
            })
        );
    }

    public updateDriver(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.driverService.apiDriverPut().pipe(
            tap(() => {
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));

                let newData = driverData[data.id];

                this.getDriverById(data.id).subscribe({
                    next: (driver: any) => {
                        this.driverStore.remove(({ id }) => id === data.id);
                        this.driverMinimimalListStore.remove(
                            ({ id }) => id === data.id
                        );
                        this.driverItemStore.remove(({ id }) => id === data.id);

                        driver = {
                            ...driver,
                            name: driver.firstName + ' ' + driver.lastName,
                            cdls: newData?.cdls ? newData.cdls : null,
                            medicals: newData?.medicals
                                ? newData.medicals
                                : null,
                            mvrs: newData?.mvrs ? newData.mvrs : null,
                            tests: newData?.tests ? newData.tests : null,
                            fileCount: driver?.filesCountForList
                                ? driver.filesCountForList
                                : 0,
                        };

                        this.driverStore.add(driver);
                        this.driverItemStore.add(driver);
                        this.driverMinimimalListStore.add(driver);
                        this.dlStore.update(driver.id, driver);

                        this.tableService.sendActionAnimation({
                            animation: EGeneralActions.UPDATE,
                            data: driver,
                            id: driver.id,
                        });
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

    public changeDriverListStatus(
        driverIds: number[],
        tabSelected?: string
    ): Observable<any> {
        return this.driverService
            .apiDriverStatusListPut({ ids: driverIds })
            .pipe(
                tap(() => {
                    /* Get Table Tab Count */
                    const driverCount = JSON.parse(
                        localStorage.getItem(TableStringEnum.DRIVER_TABLE_COUNT)
                    );

                    driverIds.forEach((driverId) => {
                        /* Get Data From Store To Update */
                        let driverToUpdate =
                            tabSelected === TableStringEnum.ACTIVE
                                ? this.driversActiveQuery.getAll({
                                      filterBy: ({ id }) => id === driverId,
                                  })
                                : this.driversInactiveQuery.getAll({
                                      filterBy: ({ id }) => id === driverId,
                                  });

                        /* Remove Data From Store */
                        tabSelected === TableStringEnum.ACTIVE
                            ? this.driverStore.remove(
                                  ({ id }) => id === driverId
                              )
                            : this.driverInactiveStore.remove(
                                  ({ id }) => id === driverId
                              );

                        /* Add Data To New Store */
                        tabSelected === TableStringEnum.ACTIVE
                            ? this.driverInactiveStore.add({
                                  ...driverToUpdate[0],
                                  status: 0,
                              })
                            : this.driverStore.add({
                                  ...driverToUpdate[0],
                                  status: 1,
                              });

                        /* Update Table Tab Count */
                        if (tabSelected === TableStringEnum.ACTIVE) {
                            driverCount.active--;
                            driverCount.inactive++;
                        } else if (tabSelected === TableStringEnum.INACTIVE) {
                            driverCount.active++;
                            driverCount.inactive--;
                        }
                    });

                    /* Send Table Tab Count To Local Storage */
                    localStorage.setItem(
                        TableStringEnum.DRIVER_TABLE_COUNT,
                        JSON.stringify({
                            applicant: driverCount.applicant,
                            active: driverCount.active,
                            inactive: driverCount.inactive,
                        })
                    );

                    this.getDrivers(
                        tabSelected === TableStringEnum.ACTIVE ? 0 : 1,
                        undefined,
                        undefined,
                        undefined,
                        1,
                        25
                    ).subscribe({
                        next: (driversList) => {
                            let updatedDrivers =
                                driversList.pagination.data.filter((driver) =>
                                    driverIds.includes(driver.id)
                                );

                            updatedDrivers.map((driver: any) => {
                                driver = {
                                    ...driver,
                                    fullName:
                                        driver.firstName +
                                        ' ' +
                                        driver.lastName,
                                };
                                this.dlStore.update(driver.id, {
                                    status: driver.status,
                                });
                            });

                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE_MULTIPLE,
                                data: updatedDrivers,
                            });
                        },
                    });
                })
            );
    }

    public changeDriverStatus(
        driverId: number,
        tabSelected?: string
    ): Observable<any> {
        return this.driverService
            .apiDriverStatusIdPut(driverId, 'response')
            .pipe(
                tap(() => {
                    /* Get Table Tab Count */
                    const driverCount = JSON.parse(
                        localStorage.getItem(TableStringEnum.DRIVER_TABLE_COUNT)
                    );

                    /* Get Data From Store To Update */
                    let driverToUpdate =
                        tabSelected === TableStringEnum.ACTIVE
                            ? this.driversActiveQuery.getAll({
                                  filterBy: ({ id }) => id === driverId,
                              })
                            : this.driversInactiveQuery.getAll({
                                  filterBy: ({ id }) => id === driverId,
                              });

                    /* Remove Data From Store */
                    tabSelected === TableStringEnum.ACTIVE
                        ? this.driverStore.remove(({ id }) => id === driverId)
                        : this.driverInactiveStore.remove(
                              ({ id }) => id === driverId
                          );

                    /* Add Data To New Store */
                    tabSelected === TableStringEnum.ACTIVE
                        ? this.driverInactiveStore.add({
                              ...driverToUpdate[0],
                              status: 0,
                          })
                        : this.driverStore.add({
                              ...driverToUpdate[0],
                              status: 1,
                          });

                    /* Update Table Tab Count */
                    if (tabSelected === TableStringEnum.ACTIVE) {
                        driverCount.active--;
                        driverCount.inactive++;
                    } else if (tabSelected === TableStringEnum.INACTIVE) {
                        driverCount.active++;
                        driverCount.inactive--;
                    }

                    /* Send Table Tab Count To Local Storage */
                    localStorage.setItem(
                        TableStringEnum.DRIVER_TABLE_COUNT,
                        JSON.stringify({
                            applicant: driverCount.applicant,
                            active: driverCount.active,
                            inactive: driverCount.inactive,
                        })
                    );

                    this.getDriverById(driverId).subscribe({
                        next: (driver: any) => {
                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };
                            this.dlStore.update(driver.id, {
                                status: driver.status,
                            });
                            this.tableService.sendActionAnimation({
                                animation: 'update-status',
                                data: driver,
                                id: driver.id,
                            });
                        },
                    });
                })
            );
    }

    public getDriverCdlsById(driverId: number) {
        return this.cdlService.apiCdlListGet(driverId);
    }

    public getDriverTestById(driverId: number) {
        return this.TestService.apiTestListGet(driverId);
    }

    public getDriverMedicalsById(driverId: number) {
        return this.MedicalService.apiMedicalListGet(driverId);
    }

    public getDriverMvrsByDriverId(driverId: number) {
        return this.MvrService.apiMvrListGet(driverId);
    }

    public getDriverPayroll(
        id: number,
        chartType: number
    ): Observable<DriverPayrollResponse> {
        return this.driverService.apiDriverPayrollGet(id, chartType);
    }

    public validateDriverEmail(email: string): Observable<boolean> {
        return this.driverService.apiDriverCheckEmailEmailGet(email);
    }

    public validateDriverSsn(
        ssn: string
    ): Observable<CheckDriverBySsnResponse> {
        return this.driverService.apiDriverCheckSsnSsnGet(ssn);
    }
}
