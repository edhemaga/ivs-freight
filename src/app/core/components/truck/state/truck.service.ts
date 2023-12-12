import { TruckMinimalListResponse } from './../../../../../../appcoretruckassist/model/truckMinimalListResponse';
import { Observable, of, Subject, tap, takeUntil, switchMap } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import {
    GetTruckModalResponse,
    TruckListResponse,
    TruckResponse,
    TruckService,
    RegistrationService,
    TitleService,
    InspectionService,
    OwnerDetailsResponse,
} from 'appcoretruckassist';
import { TruckInactiveStore } from './truck-inactive-state/truck-inactive.store';
import { TruckActiveStore } from './truck-active-state/truck-active.store';
import { TruckInactiveQuery } from './truck-inactive-state/truck-inactive.query';
import { TruckActiveQuery } from './truck-active-state/truck-active.query';
import { TrucksMinimalListQuery } from './truck-details-minima-list-state/truck-details-minimal.query';
import { TrucksMinimalListStore } from './truck-details-minima-list-state/truck-details-minimal.store';
import { TruckItemStore } from './truck-details-state/truck.details.store';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TrucksDetailsListStore } from './truck-details-list-state/truck-details-list.store';
import { FormDataService } from '../../../services/formData/form-data.service';
import { TruckAutocompleteModelResponse } from '../../../../../../appcoretruckassist/model/truckAutocompleteModelResponse';
@Injectable({ providedIn: 'root' })
export class TruckTService implements OnDestroy {
    public truckId: number;
    public truckList: any;
    public currentIndex: number;
    private destroy$ = new Subject<void>();

    constructor(
        private truckActiveStore: TruckActiveStore,
        private truckInactiveStore: TruckInactiveStore,
        private truckService: TruckService,
        private truckActiveQuery: TruckActiveQuery,
        private truckInactiveQuery: TruckInactiveQuery,
        private tableService: TruckassistTableService,
        private truckMinimalQuery: TrucksMinimalListQuery,
        private truckMinimalStore: TrucksMinimalListStore,
        private truckItem: TruckItemStore,
        private tdlStore: TrucksDetailsListStore,
        private RegistrationService: RegistrationService,
        private TitleService: TitleService,
        private InspectionService: InspectionService,
        private formDataService: FormDataService
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
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    public addTruck(data: TruckResponse): Observable<TruckResponse> {
        console.log(data);
        this.formDataService.extractFormDataFromFunction(data);
        return this.truckService.apiTruckPost().pipe(
            tap((res) => {
                const subTruck = this.getTruckById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (truck: any) => {
                            this.truckActiveStore.add(truck);
                            this.truckMinimalStore.add(truck);
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

                            subTruck.unsubscribe();
                        },
                    });
            })
        );
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
            })
        );
    }

    public deleteTruckList(
        trucksToDelete: TruckResponse[]
    ): Observable<TruckListResponse> {
        // let deleteOnBack = trucksToDelete.map((truck: any) => {
        //   return truck.id;
        // });

        // return this.truckService.apiTruckListDelete({ ids: deleteOnBack }).pipe(
        //   tap(() => {
        //     let storeTrucks = this.truckQuery.getAll();

        //     storeTrucks.map((truck: any) => {
        //       deleteOnBack.map((d) => {
        //         if (d === truck.id) {
        //           this.truckStore.remove(({ id }) => id === truck.id);
        //         }
        //       });
        //     });
        //   })
        // );
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
                switchMap((res: number) => {
                    return this.getTruckById(truckId).pipe(
                        takeUntil(this.destroy$)
                    );
                })
            )
            .subscribe((truck: any) => {
                console.log(truck);
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
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
