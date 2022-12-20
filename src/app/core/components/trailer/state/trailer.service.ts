import { Observable, of, Subject, tap, takeUntil } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import {
    GetTrailerModalResponse,
    TrailerListResponse,
    TrailerMinimalListResponse,
    TrailerResponse,
    TrailerService,
    RegistrationService,
    TitleService,
    InspectionService,
} from 'appcoretruckassist';
import { TrailerActiveStore } from './trailer-active-state/trailer-active.store';
import { TrailerInactiveStore } from './trailer-inactive-state/trailer-inactive.store';
import { TrailerActiveQuery } from './trailer-active-state/trailer-active.query';
import { TrailerInactiveQuery } from './trailer-inactive-state/trailer-inactive.query';
import { TrailersMinimalListStore } from './trailer-minimal-list-state/trailer-minimal.store';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TrailerItemStore } from './trailer-details-state/trailer-details.store';
import { TrailersMinimalListQuery } from './trailer-minimal-list-state/trailer-minimal.query';
import { TrailerDetailsListStore } from './trailer-details-list-state/trailer-details-list.store';
import { FormDataService } from '../../../services/formData/form-data.service';

@Injectable({ providedIn: 'root' })
export class TrailerTService implements OnDestroy {
    public trailerList: any;
    public trailerId: number;
    public currentIndex: number;
    private destroy$ = new Subject<void>();
    constructor(
        private trailerActiveStore: TrailerActiveStore,
        private trailerInactiveStore: TrailerInactiveStore,
        private trailerService: TrailerService,
        private trailerActiveQuery: TrailerActiveQuery,
        private trailerInactiveQuery: TrailerInactiveQuery,
        private tableService: TruckassistTableService,
        private trailerItemStore: TrailerItemStore,
        private trailerMinimalQuery: TrailersMinimalListQuery,
        private trailerMinimalStore: TrailersMinimalListStore,
        private tadl: TrailerDetailsListStore,
        private RegistrationService: RegistrationService,
        private TitleService: TitleService,
        private InspectionService: InspectionService,
        private formDataService: FormDataService
    ) {}

    /* Observable<CreateTrailerResponse> */
    public addTrailer(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.trailerService.apiTrailerPost().pipe(
            tap((res: any) => {
                console.log('---called here---');
                const subTrailer = this.getTrailerById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (trailer: any) => {
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

                            subTrailer.unsubscribe();
                        },
                    });
            })
        );
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
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<TrailerListResponse> {
        return this.trailerService.apiTrailerListGet(
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

    public updateTrailer(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.trailerService.apiTrailerPut().pipe(
            tap(() => {
                let storedTrailerData = {
                    ...this.trailerItemStore?.getValue()?.entities[data.id],
                };
                console.log('---called here---');
                const subTrailer = this.getTrailerById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (trailer: any) => {
                            this.trailerActiveStore.remove(
                                ({ id }) => id === data.id
                            );

                            trailer.registrations =
                                storedTrailerData.registrations;
                            trailer.titles = storedTrailerData.titles;
                            trailer.inspections = storedTrailerData.inspections;

                            this.trailerActiveStore.add(trailer);
                            this.tadl.replace(trailer.id, trailer);
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: trailer,
                                id: trailer.id,
                            });

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
                console.log('---called here---');
                const subTrailer = this.getTrailerById(this.trailerId, true)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (trailer: any) => {
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
                                data: trailer,
                                id: trailer.id,
                            });

                            subTrailer.unsubscribe();
                        },
                    });
            })
        );
    }

    public deleteTrailerById(
        trailerId: number,
        tableSelectedTab?: string
    ): Observable<any> {
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
            })
        );
    }

    public deleteTrailerList(trailerToDelete: any[]): Observable<any> {
        // let deleteOnBack = trailerToDelete.map((trailer: any) => {
        //   return trailer.id;
        // });

        // return this.trailerService.apiTrailerListDelete({ ids: deleteOnBack }).pipe(
        //   tap(() => {
        //     let storeTrailer = this.trailerQuery.getAll();

        //     storeTrailer.map((trailer: any) => {
        //       deleteOnBack.map((d) => {
        //         if (d === trailer.id) {
        //           this.trailerStore.remove(({ id }) => id === trailer.id);
        //         }
        //       });
        //     });
        //   })
        // );
        return of(null);
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

    public changeTrailerStatus(
        trailerId: number,
        tabSelected?: string
    ): Observable<any> {
        return this.trailerService
            .apiTrailerStatusIdPut(trailerId, 'response')
            .pipe(
                tap(() => {
                    const subTrailer = this.getTrailerById(trailerId)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (trailer: any) => {
                                /* Get Table Tab Count */
                                const trailerCount = JSON.parse(
                                    localStorage.getItem('trailerTableCount')
                                );

                                /* Get Data From Store To Update */
                                let truckToUpdate =
                                    tabSelected === 'active'
                                        ? this.trailerActiveQuery.getAll({
                                              filterBy: ({ id }) =>
                                                  id === trailerId,
                                          })
                                        : this.trailerInactiveQuery.getAll({
                                              filterBy: ({ id }) =>
                                                  id === trailerId,
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
                                    ? this.trailerActiveStore.add({
                                          ...truckToUpdate[0],
                                          status: 0,
                                      })
                                    : this.trailerActiveStore.add({
                                          ...truckToUpdate[0],
                                          status: 1,
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
                                this.tadl.update(trailer.id, {
                                    status: trailer.status,
                                });
                                this.tableService.sendActionAnimation({
                                    animation: 'update-status',
                                    data: trailer,
                                    id: trailerId,
                                });

                                subTrailer.unsubscribe();
                            },
                        });
                })
            );
    }

    public getTrailerDropdowns(): Observable<GetTrailerModalResponse> {
        return this.trailerService.apiTrailerModalGet();
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
