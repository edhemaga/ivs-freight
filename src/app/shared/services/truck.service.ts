import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, Subject, tap, takeUntil, switchMap } from 'rxjs';

// store
import { TruckInactiveStore } from '@pages/truck/state/truck-inactive-state/truck-inactive.store';
import { TruckActiveStore } from '@pages/truck/state/truck-active-state/truck-active.store';
import { TruckInactiveQuery } from '@pages/truck/state/truck-inactive-state/truck-inactive.query';
import { TruckActiveQuery } from '@pages/truck/state/truck-active-state/truck-active.query';
import { TrucksMinimalListQuery } from '@pages/truck/state/truck-details-minima-list-state/truck-details-minimal.query';
import { TrucksMinimalListStore } from '@pages/truck/state/truck-details-minima-list-state/truck-details-minimal.store';
import { TruckItemStore } from '@pages/truck/state/truck-details-state/truck.details.store';
import { TrucksDetailsListStore } from '@pages/truck/state/truck-details-list-state/truck-details-list.store';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// models
import {
    GetTruckModalResponse,
    TruckListResponse,
    TruckResponse,
    TruckService as TruckTService,
    RegistrationService,
    TitleService,
    InspectionService,
    TruckMinimalListResponse,
    TruckAutocompleteModelResponse,
} from 'appcoretruckassist';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { FilterStateService } from '@shared/components/ta-filter/services/filter-state.service';

@Injectable({ providedIn: 'root' })
export class TruckService implements OnDestroy {
    public truckId: number;
    public truckList: any;
    public currentIndex: number;
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,

        // store
        private truckActiveStore: TruckActiveStore,
        private truckInactiveStore: TruckInactiveStore,
        private truckMinimalStore: TrucksMinimalListStore,
        private truckItem: TruckItemStore,
        private tdlStore: TrucksDetailsListStore,
        private truckActiveQuery: TruckActiveQuery,
        private truckInactiveQuery: TruckInactiveQuery,
        private truckMinimalQuery: TrucksMinimalListQuery,

        // services
        private tableService: TruckassistTableService,
        private truckService: TruckTService,
        private RegistrationService: RegistrationService,
        private TitleService: TitleService,
        private InspectionService: InspectionService,
        private formDataService: FormDataService,
        private dispatcherService: DispatcherService,

        private filterService: FilterStateService
    ) {}

    //Get Truck Minimal List
    public getTrucksMinimalList(
        pageIndex?: number,
        pageSize?: number
    ): Observable<TruckMinimalListResponse> {
        return this.truckService.apiTruckListMinimalGet(pageIndex, pageSize);
    }

    // Get Truck List
    public getTruckList(
        active?: number,
        truckTypes?: Array<number>,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<TruckListResponse> {
        return this.truckService.apiTruckListGet(
            active,
            truckTypes,
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

    public addTruck(
        data: TruckResponse,
        isDispatchCall: boolean = false
    ): Observable<TruckResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.truckService.apiTruckPost().pipe(
            tap((res) => {
                this.getTruckById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (truck: any) => {
                            if (!isDispatchCall) {
                                this.truckActiveStore.add(truck);
                                this.truckMinimalStore.add(truck);
                                this.tdlStore.add(truck);

                                const truckCount = JSON.parse(
                                    localStorage.getItem('truckTableCount')
                                );

                                truckCount.active++;

                                localStorage.setItem(
                                    'truckTableCount',
                                    JSON.stringify({
                                        active: truckCount.active,
                                        inactive: truckCount.inactive,
                                    })
                                );

                                this.tableService.sendActionAnimation({
                                    animation: 'add',
                                    data: truck,
                                    id: truck.id,
                                });
                                this.router.navigate(['/list/truck']);
                                // update truck filters
                                this.updateTableFilters();
                            } else {
                                this.dispatcherService.updateDispatcherData =
                                    true;
                            }
                        },
                    });
            })
        );
    }

    public updateTableFilters(): void {
        this.filterService.updateTruckFilters.next(true);
        this.filterService.getTruckData();
    }

    public updateTruck(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.truckService.apiTruckPut().pipe(
            tap(() => {
                const storedTruckData = {
                    ...this.truckItem?.getValue()?.entities[data.id],
                };

                const subTruck = this.getTruckById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (truck: any) => {
                            this.truckActiveStore.remove(
                                ({ id }) => id === data.id
                            );

                            this.truckMinimalStore.remove(
                                ({ id }) => id === data.id
                            );

                            truck.registrations = storedTruckData.registrations;
                            truck.titles = storedTruckData.titles;
                            truck.inspections = storedTruckData.inspections;

                            truck = {
                                ...truck,
                                fileCount: truck?.filesCountForList
                                    ? truck.filesCountForList
                                    : 0,
                            };

                            this.truckMinimalStore.add(truck);
                            this.tdlStore.add(truck);
                            this.truckItem.set([truck]);

                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: truck,
                                id: truck.id,
                            });
                            this.updateTableFilters();
                            subTruck.unsubscribe();
                        },
                    });
            })
        );
    }

    public deleteTruckByIdDetails(
        truckId: number,
        tableSelectedTab?: string
    ): Observable<any> {
        return this.truckService.apiTruckIdDelete(truckId).pipe(
            tap(() => {
                const truckCount = JSON.parse(
                    localStorage.getItem('truckTableCount')
                );
                this.truckMinimalStore.remove(({ id }) => id === truckId);
                this.truckItem.remove(({ id }) => id === truckId);
                this.tdlStore.remove(({ id }) => id === truckId);
                if (tableSelectedTab === 'active') {
                    this.truckActiveStore.remove(({ id }) => id === truckId);

                    truckCount.active--;
                } else if (tableSelectedTab === 'inactive') {
                    this.truckInactiveStore.remove(({ id }) => id === truckId);

                    truckCount.inactive--;
                }

                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckCount.active,
                        inactive: truckCount.inactive,
                    })
                );
                const subTruck = this.getTruckById(this.truckId, true)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (truck: any) => {
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
                                data: truck,
                                id: truck.id,
                            });

                            subTruck.unsubscribe();
                            this.updateTableFilters();
                        },
                    });
            })
        );
    }

    public voidRegistration(
        voidedReg?: number,
        unVoidedReg?: number
    ): Observable<TruckResponse> {
        return this.RegistrationService.apiRegistrationVoidPost({
            registrationIdToBeVoided: voidedReg,
            registrationIdToBeUnVoided: unVoidedReg,
        }).pipe(
            tap(() => {
                const truckId = this.truckItem.getValue().ids[0];
                const truckItem = this.truckItem.getValue();
                const trucksList = JSON.parse(
                    JSON.stringify(truckItem.entities)
                );
                let truckData = trucksList[truckId];
                this.getTruckRegistrationsById(truckId).subscribe({
                    next: (res: any) => {
                        truckData.registrations = res;
                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: truckData,
                            id: truckData.id,
                        });

                        this.tdlStore.add(truckData);
                        this.truckItem.set([truckData]);
                    },
                });
            })
        );
    }
    public deleteTruckById(
        truckId: number,
        tableSelectedTab?: string
    ): Observable<TruckResponse> {
        return this.truckService.apiTruckIdDelete(truckId).pipe(
            tap(() => {
                const truckCount = JSON.parse(
                    localStorage.getItem('truckTableCount')
                );
                this.truckMinimalStore.remove(({ id }) => id === truckId);
                this.tdlStore.remove(({ id }) => id === truckId);
                if (tableSelectedTab === 'active') {
                    this.truckActiveStore.remove(({ id }) => id === truckId);

                    truckCount.active--;
                } else if (tableSelectedTab === 'inactive') {
                    this.truckInactiveStore.remove(({ id }) => id === truckId);

                    truckCount.inactive--;
                }

                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckCount.active,
                        inactive: truckCount.inactive,
                    })
                );
                this.updateTableFilters();
            })
        );
    }

    public deleteTruckList(
        trucksToDelete: number[],
        tableSelectedTab?: string
    ): Observable<TruckListResponse> {
        return this.truckService.apiTruckListDelete(trucksToDelete).pipe(
            tap(() => {
                const truckCount = JSON.parse(
                    localStorage.getItem('truckTableCount')
                );

                trucksToDelete.map((truckId) => {
                    this.tdlStore.remove(({ id }) => id === truckId);

                    if (tableSelectedTab === 'active') {
                        this.truckActiveStore.remove(
                            ({ id }) => id === truckId
                        );

                        truckCount.active--;
                    } else if (tableSelectedTab === 'inactive') {
                        this.truckInactiveStore.remove(
                            ({ id }) => id === truckId
                        );

                        truckCount.inactive--;
                    }
                });

                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckCount.active,
                        inactive: truckCount.inactive,
                    })
                );
                this.updateTableFilters();
            })
        );
        return of(null);
    }

    public getTruckById(
        truckId: number,
        getIndex?: boolean
    ): Observable<TruckResponse> {
        this.truckMinimalQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.truckList = item));
        if (getIndex) {
            this.currentIndex = this.truckList.findIndex(
                (truck) => truck?.id === truckId
            );
            let last = this.truckList?.at(-1);
            if (last?.id === truckId) {
                this.currentIndex = --this.currentIndex;
            } else {
                this.currentIndex = ++this.currentIndex;
            }
            if (this.currentIndex == -1) {
                this.currentIndex = 0;
            }
            this.truckId = this.truckList[this.currentIndex]?.id;
        }

        return this.truckService.apiTruckIdGet(truckId);
    }

    public changeTruckStatus(
        truckId: number,
        tabSelected?: string
    ): Observable<any> {
        return this.truckService.apiTruckStatusIdPut(truckId, 'response').pipe(
            tap(() => {
                /* Get Table Tab Count */
                const truckCount = JSON.parse(
                    localStorage.getItem('truckTableCount')
                );

                /* Get Data From Store To Update */
                let truckToUpdate =
                    tabSelected === 'active'
                        ? this.truckActiveQuery.getAll({
                              filterBy: ({ id }) => id === truckId,
                          })
                        : this.truckInactiveQuery.getAll({
                              filterBy: ({ id }) => id === truckId,
                          });

                /* Remove Data From Store */
                tabSelected === 'active'
                    ? this.truckActiveStore.remove(({ id }) => id === truckId)
                    : this.truckInactiveStore.remove(
                          ({ id }) => id === truckId
                      );

                /* Add Data To New Store */
                tabSelected === 'active'
                    ? this.truckInactiveStore.add({
                          ...truckToUpdate[0],
                          status: 0,
                      })
                    : this.truckActiveStore.add({
                          ...truckToUpdate[0],
                          status: 1,
                      });

                /* Update Table Tab Count */
                if (tabSelected === 'active') {
                    truckCount.active--;
                    truckCount.inactive++;
                } else if (tabSelected === 'inactive') {
                    truckCount.active++;
                    truckCount.inactive--;
                }

                /* Send Table Tab Count To Local Storage */
                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckCount.active,
                        inactive: truckCount.inactive,
                    })
                );
                const subTruck = this.getTruckById(truckId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (truck: any) => {
                            this.tdlStore.update(truck.id, {
                                status: truck.status,
                            });
                            this.tableService.sendActionAnimation({
                                animation: 'update-status',
                                data: truck,
                                id: truck.id,
                            });

                            subTruck.unsubscribe();
                        },
                    });

                this.updateTableFilters();
            })
        );
    }

    public getTruckDropdowns(): Observable<GetTruckModalResponse> {
        return this.truckService.apiTruckModalGet();
    }

    public getTruckRegistrationsById(truckId: number) {
        return this.RegistrationService.apiRegistrationListGet(truckId);
    }

    public getTruckRegistrationByRegistrationId(registrationId: number) {
        return this.RegistrationService.apiRegistrationIdGet(registrationId);
    }

    public getTruckInspectionsById(truckId: number) {
        return this.InspectionService.apiInspectionListGet(truckId);
    }

    public getTruckInspectionByInspectionId(inspectionId: number) {
        return this.InspectionService.apiInspectionIdGet(inspectionId);
    }

    public getTruckTitlesById(truckId: number) {
        return this.TitleService.apiTitleListGet(truckId);
    }

    public getTruckTitleByTitleId(titleId: number) {
        return this.TitleService.apiTitleIdGet(titleId);
    }

    public autocompleteByTruckModel(
        model: string
    ): Observable<TruckAutocompleteModelResponse> {
        return this.truckService.apiTruckAutocompleteModelModelGet(model);
    }

    public getFuelConsumption(id: number, chartType: number) {
        return this.truckService.apiTruckFuelconsumptionGet(id, chartType);
    }

    public getPerformace(id: number, chartType: number) {
        return this.truckService.apiTruckPerformanceGet(id, chartType);
    }
    public getExpenses(id: number, chartType: number) {
        return this.truckService.apiTruckExpensesGet(id, chartType);
    }

    public getRevenue(id: number, chartType: number) {
        return this.truckService.apiTruckRevenueGet(id, chartType);
    }

    public changeActiveStatus(truckId: number): void {
        this.truckService
            .apiTruckStatusIdPut(truckId)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => {
                    return this.getTruckById(truckId);
                })
            )
            .subscribe((truck: any) => {
                const storedTruckData = {
                    ...this.truckItem?.getValue()?.entities[truckId],
                };

                this.truckActiveStore.remove(({ id }) => id === truckId);
                this.truckMinimalStore.remove(({ id }) => id === truckId);

                truck.registrations = storedTruckData.registrations;
                truck.titles = storedTruckData.titles;
                truck.inspections = storedTruckData.inspections;

                truck = {
                    ...truck,
                    fileCount: truck?.filesCountForList
                        ? truck.filesCountForList
                        : 0,
                };

                this.truckMinimalStore.add(truck);
                this.tdlStore.add(truck);
                this.truckItem.set([truck]);

                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: truck,
                    id: truck.id,
                });

                this.updateTableFilters();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
