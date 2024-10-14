import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, tap, takeUntil } from 'rxjs';

// models
import {
    GetTrailerModalResponse,
    TrailerListResponse,
    TrailerMinimalListResponse,
    TrailerResponse,
    TrailerService as TrailerTService,
    RegistrationService,
    TitleService,
    InspectionService,
    TrailerAutocompleteModelResponse,
} from 'appcoretruckassist';

// store
import { TrailerActiveStore } from '@pages/trailer/state/trailer-active-state/trailer-active.store';
import { TrailerInactiveStore } from '@pages/trailer/state/trailer-inactive-state/trailer-inactive.store';
import { TrailersMinimalListStore } from '@pages/trailer/state/trailer-minimal-list-state/trailer-minimal.store';
import { TrailerItemStore } from '@pages/trailer/state/trailer-details-state/trailer-details.store';
import { TrailerDetailsListStore } from '@pages/trailer/state/trailer-details-list-state/trailer-details-list.store';
import { TrailerActiveQuery } from '@pages/trailer/state/trailer-active-state/trailer-active.query';
import { TrailerInactiveQuery } from '@pages/trailer/state/trailer-inactive-state/trailer-inactive.query';
import { TrailersMinimalListQuery } from '@pages/trailer/state/trailer-minimal-list-state/trailer-minimal.query';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { FilterStateService } from '@shared/components/ta-filter/services/filter-state.service';

@Injectable({ providedIn: 'root' })
export class TrailerService implements OnDestroy {
    public trailerList: any;
    public trailerId: number;
    public currentIndex: number;
    private destroy$ = new Subject<void>();
    constructor(
        // store
        private trailerActiveStore: TrailerActiveStore,
        private trailerInactiveStore: TrailerInactiveStore,
        private trailerMinimalStore: TrailersMinimalListStore,
        private tadl: TrailerDetailsListStore,
        private trailerItemStore: TrailerItemStore,
        private trailerActiveQuery: TrailerActiveQuery,
        private trailerInactiveQuery: TrailerInactiveQuery,
        private trailerMinimalQuery: TrailersMinimalListQuery,

        // services
        private RegistrationService: RegistrationService,
        private TitleService: TitleService,
        private InspectionService: InspectionService,
        private formDataService: FormDataService,
        private dispatcherService: DispatcherService,
        private trailerService: TrailerTService,
        private tableService: TruckassistTableService,
        private filterService: FilterStateService
    ) {}

    /* Observable<CreateTrailerResponse> */
    public addTrailer(
        data: any,
        isDispatchCall: boolean = false
    ): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.trailerService.apiTrailerPost().pipe(
            tap((res: any) => {
                this.getTrailerById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (trailer: any) => {
                            if (!isDispatchCall) {
                                this.trailerActiveStore.add(trailer);
                                this.trailerMinimalStore.add(trailer);
                                const trailerCount = JSON.parse(
                                    localStorage.getItem('trailerTableCount')
                                );

                                trailerCount.active++;

                                localStorage.setItem(
                                    'trailerTableCount',
                                    JSON.stringify({
                                        active: trailerCount.active,
                                        inactive: trailerCount.inactive,
                                    })
                                );

                                this.tableService.sendActionAnimation({
                                    animation: 'add',
                                    data: trailer,
                                    id: trailer.id,
                                });
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
        this.filterService.updateTrailerFilter.next(true);
        this.filterService.getTrailerData();
    }

    //Get Trailers Minimal list
    public getTrailersMinimalList(
        pageIndex?: number,
        pageSize?: number,
        count?: number
    ): Observable<TrailerMinimalListResponse> {
        return this.trailerService.apiTrailerListMinimalGet(
            pageIndex,
            pageSize,
            count
        );
    }

    public getTrailers(
        active?: number,
        trailerTypeIds?: number[],
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<TrailerListResponse> {
        // backend parameters changed

        return this.trailerService.apiTrailerListGet(
            active,
            trailerTypeIds,
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

    public updateTrailer(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.trailerService.apiTrailerPut().pipe(
            tap(() => {
                let storedTrailerData = {
                    ...this.trailerItemStore?.getValue()?.entities[data.id],
                };
                const subTrailer = this.getTrailerById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (trailer: any) => {
                            this.trailerActiveStore.remove(
                                ({ id }) => id === data.id
                            );

                            this.trailerMinimalStore.remove(
                                ({ id }) => id === data.id
                            );

                            trailer.registrations =
                                storedTrailerData.registrations;
                            trailer.titles = storedTrailerData.titles;
                            trailer.inspections = storedTrailerData.inspections;

                            trailer = {
                                ...trailer,
                                fileCount: trailer?.filesCountForList
                                    ? trailer.filesCountForList
                                    : 0,
                            };

                            this.trailerActiveStore.add(trailer);
                            this.trailerMinimalStore.add(trailer);
                            this.tadl.replace(trailer.id, trailer);
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: trailer,
                                id: trailer.id,
                            });

                            this.updateTableFilters();
                            subTrailer.unsubscribe();
                        },
                    });
            })
        );
    }

    public deleteTrailerByIdDetails(
        trailerId: number,
        tableSelectedTab?: string
    ): Observable<any> {
        return this.trailerService.apiTrailerIdDelete(trailerId).pipe(
            tap(() => {
                this.trailerMinimalStore.remove(({ id }) => id === trailerId);
                this.trailerItemStore.remove(({ id }) => id === trailerId);
                this.tadl.remove(({ id }) => id === trailerId);
                const trailerCount = JSON.parse(
                    localStorage.getItem('trailerTableCount')
                );

                if (tableSelectedTab === 'active') {
                    this.trailerActiveStore.remove(
                        ({ id }) => id === trailerId
                    );

                    trailerCount.active--;
                } else if (tableSelectedTab === 'inactive') {
                    this.trailerInactiveStore.remove(
                        ({ id }) => id === trailerId
                    );

                    trailerCount.inactive--;
                }

                localStorage.setItem(
                    'trailerTableCount',
                    JSON.stringify({
                        active: trailerCount.active,
                        inactive: trailerCount.inactive,
                    })
                );
                const subTrailer = this.getTrailerById(this.trailerId, true)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (trailer: any) => {
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
                                data: trailer,
                                id: trailer.id,
                            });

                            this.updateTableFilters();
                            subTrailer.unsubscribe();
                        },
                    });
            })
        );
    }

    public deleteTrailerById(
        trailerId: number,
        tableSelectedTab?: string
    ): Observable<TrailerResponse> {
        return this.trailerService.apiTrailerIdDelete(trailerId).pipe(
            tap(() => {
                this.tadl.remove(({ id }) => id === trailerId);
                const trailerCount = JSON.parse(
                    localStorage.getItem('trailerTableCount')
                );

                if (tableSelectedTab === 'active') {
                    this.trailerActiveStore.remove(
                        ({ id }) => id === trailerId
                    );

                    trailerCount.active--;
                } else if (tableSelectedTab === 'inactive') {
                    this.trailerInactiveStore.remove(
                        ({ id }) => id === trailerId
                    );

                    trailerCount.inactive--;
                }

                localStorage.setItem(
                    'trailerTableCount',
                    JSON.stringify({
                        active: trailerCount.active,
                        inactive: trailerCount.inactive,
                    })
                );
                this.updateTableFilters();
            })
        );
    }

    public deleteTrailerList(
        trailersToDelete: number[],
        tableSelectedTab?: string
    ): Observable<any> {
        return this.trailerService.apiTrailerListDelete(trailersToDelete).pipe(
            tap(() => {
                const trailerCount = JSON.parse(
                    localStorage.getItem('trailerTableCount')
                );

                trailersToDelete.map((trailerId) => {
                    this.tadl.remove(({ id }) => id === trailerId);

                    if (tableSelectedTab === 'active') {
                        this.trailerActiveStore.remove(
                            ({ id }) => id === trailerId
                        );

                        trailerCount.active--;
                    } else if (tableSelectedTab === 'inactive') {
                        this.trailerInactiveStore.remove(
                            ({ id }) => id === trailerId
                        );

                        trailerCount.inactive--;
                    }
                });

                localStorage.setItem(
                    'trailerTableCount',
                    JSON.stringify({
                        active: trailerCount.active,
                        inactive: trailerCount.inactive,
                    })
                );

                this.updateTableFilters();
            })
        );
    }

    public getTrailerById(
        trailerId: number,
        getIndex?: boolean
    ): Observable<TrailerResponse> {
        this.trailerMinimalQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.trailerList = item));
        if (getIndex) {
            this.currentIndex = this.trailerList.findIndex(
                (trailer) => trailer.id === trailerId
            );
            let last = this.trailerList.at(-1);
            if (last.id == trailerId) {
                this.currentIndex = --this.currentIndex;
            } else {
                this.currentIndex = ++this.currentIndex;
            }
            if (this.currentIndex == -1) {
                this.currentIndex = 0;
            }
            this.trailerId = this.trailerList[this.currentIndex].id;
        }
        return this.trailerService.apiTrailerIdGet(trailerId);
    }

    public autocompleteByTrailerModel(
        model: string
    ): Observable<TrailerAutocompleteModelResponse> {
        return this.trailerService.apiTrailerAutocompleteModelModelGet(model);
    }

    public getTrailerRegistrationsById(trailerId: number) {
        return this.RegistrationService.apiRegistrationListGet(
            undefined,
            trailerId
        );
    }

    public getTrailerRegistrationByRegistrationId(registrationId: number) {
        return this.RegistrationService.apiRegistrationIdGet(registrationId);
    }

    public getTrailerInspectionsById(trailerId: number) {
        return this.InspectionService.apiInspectionListGet(
            undefined,
            trailerId
        );
    }

    public getTrailerInspectionByInspectionId(inspectionId: number) {
        return this.InspectionService.apiInspectionIdGet(inspectionId);
    }

    public getTrailerTitlesById(trailerId: number) {
        return this.TitleService.apiTitleListGet(undefined, trailerId);
    }

    public getTrailerTitleByTitleId(titleId: number) {
        return this.TitleService.apiTitleIdGet(titleId);
    }

    public voidRegistration(
        voidedReg?: number,
        unVoidedReg?: number
    ): Observable<TrailerResponse> {
        return this.RegistrationService.apiRegistrationVoidPost({
            registrationIdToBeVoided: voidedReg,
            registrationIdToBeUnVoided: unVoidedReg,
        }).pipe(
            tap(() => {
                const trailerId = this.trailerItemStore.getValue().ids[0];
                const trailerItem = this.trailerItemStore.getValue();
                const trailerList = JSON.parse(
                    JSON.stringify(trailerItem.entities)
                );
                let trailerData = trailerList[trailerId];
                console.log(trailerData);
                this.getTrailerRegistrationsById(trailerId).subscribe({
                    next: (res: any) => {
                        trailerData.registrations = res;
                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: trailerData,
                            id: trailerData.id,
                        });

                        this.tadl.add(trailerData);
                        this.trailerItemStore.set([trailerData]);
                    },
                });
            })
        );
    }

    public changeTrailerStatus(
        trailerId: number,
        tabSelected?: string
    ): Observable<any> {
        return this.trailerService
            .apiTrailerStatusIdPut(trailerId, 'response')
            .pipe(
                tap(() => {
                    /* Get Table Tab Count */
                    const trailerCount = JSON.parse(
                        localStorage.getItem('trailerTableCount')
                    );

                    /* Get Data From Store To Update */
                    let trailerUpdate =
                        tabSelected === 'active'
                            ? this.trailerActiveQuery.getAll({
                                  filterBy: ({ id }) => id === trailerId,
                              })
                            : this.trailerInactiveQuery.getAll({
                                  filterBy: ({ id }) => id === trailerId,
                              });

                    /* Remove Data From Store */
                    tabSelected === 'active'
                        ? this.trailerActiveStore.remove(
                              ({ id }) => id === trailerId
                          )
                        : this.trailerInactiveStore.remove(
                              ({ id }) => id === trailerId
                          );

                    /* Add Data To New Store */
                    tabSelected === 'active'
                        ? this.trailerInactiveStore.add({
                              ...trailerUpdate[0],
                              status: 1,
                          })
                        : this.trailerActiveStore.add({
                              ...trailerUpdate[0],
                              status: 0,
                          });

                    /* Update Table Tab Count */
                    if (tabSelected === 'active') {
                        trailerCount.active--;
                        trailerCount.inactive++;
                    } else if (tabSelected === 'inactive') {
                        trailerCount.active++;
                        trailerCount.inactive--;
                    }

                    /* Send Table Tab Count To Local Storage */
                    localStorage.setItem(
                        'trailerTableCount',
                        JSON.stringify({
                            active: trailerCount.active,
                            inactive: trailerCount.inactive,
                        })
                    );
                    const subTrailer = this.getTrailerById(trailerId)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (trailer: any) => {
                                this.tadl.update(trailer.id, {
                                    status: !trailer.status,
                                });
                                this.tableService.sendActionAnimation({
                                    animation: 'update-status',
                                    data: trailer,
                                    id: trailerId,
                                });

                                this.updateTableFilters();
                                subTrailer.unsubscribe();
                            },
                        });
                })
            );
    }

    public getTrailerDropdowns(): Observable<GetTrailerModalResponse> {
        return this.trailerService.apiTrailerModalGet();
    }

    public changeActiveStatus(trailerId: number) {
        return this.trailerService
            .apiTrailerStatusIdPut(trailerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const storedTrailerData = {
                        ...this.trailerItemStore?.getValue()?.entities[
                            trailerId
                        ],
                    };
                    const subTrailer = this.getTrailerById(trailerId)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (trailer: any) => {
                                this.trailerActiveStore.remove(
                                    ({ id }) => id === trailerId
                                );

                                this.trailerMinimalStore.remove(
                                    ({ id }) => id === trailerId
                                );

                                trailer.registrations =
                                    storedTrailerData.registrations;
                                trailer.titles = storedTrailerData.titles;
                                trailer.inspections =
                                    storedTrailerData.inspections;

                                trailer = {
                                    ...trailer,
                                    fileCount: trailer?.filesCountForList
                                        ? trailer.filesCountForList
                                        : 0,
                                };

                                this.trailerActiveStore.add(trailer);
                                this.trailerMinimalStore.add(trailer);
                                this.tadl.replace(trailer.id, trailer);
                                this.tableService.sendActionAnimation({
                                    animation: 'update',
                                    data: trailer,
                                    id: trailer.id,
                                });

                                this.updateTableFilters();
                                subTrailer.unsubscribe();
                            },
                        });
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
