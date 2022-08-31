import { Observable, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  CreateTrailerCommand,
  GetTrailerModalResponse,
  TrailerListResponse,
  TrailerMinimalListResponse,
  TrailerResponse,
  TrailerService,
  UpdateTrailerCommand,
} from 'appcoretruckassist';
/* import { CreateTrailerResponse } from 'appcoretruckassist/model/createTrailerResponse'; */
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TrailerActiveStore } from './trailer-active-state/trailer-active.store';
import { TrailerInactiveStore } from './trailer-inactive-state/trailer-inactive.store';
import { TrailerActiveQuery } from './trailer-active-state/trailer-active.query';
import { TrailerInactiveQuery } from './trailer-inactive-state/trailer-inactive.query';
import { TrailersMinimalListQuery } from './trailer-minimal-list-state/trailer-minimal.query';
import { TrailerItemStore } from './trailer-details-state/trailer-details.store';
import { TrailersMinimalListStore } from './trailer-minimal-list-state/trailer-minimal.store';

@Injectable({ providedIn: 'root' })
export class TrailerTService {
  public trailerList: any;
  public trailerId: number;
  public currentIndex: number;
  constructor(
    private trailerActiveStore: TrailerActiveStore,
    private trailerInactiveStore: TrailerInactiveStore,
    private trailerService: TrailerService,
    private trailerActiveQuery: TrailerActiveQuery,
    private trailerInactiveQuery: TrailerInactiveQuery,
    private tableService: TruckassistTableService,
    private trailerItemStore: TrailerItemStore,
    private trailerMinimalQuery: TrailersMinimalListQuery,
    private trailerMinimalStore: TrailersMinimalListStore
  ) {}

  /* Observable<CreateTrailerResponse> */
  public addTrailer(data: CreateTrailerCommand): Observable<any> {
    return this.trailerService.apiTrailerPost(data).pipe(
      tap((res: any) => {
        const subTrailer = this.getTrailerById(res.id).subscribe({
          next: (trailer: TrailerResponse | any) => {
            this.trailerActiveStore.add(trailer);

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

  public updateTrailer(data: UpdateTrailerCommand): Observable<any> {
    return this.trailerService.apiTrailerPut(data).pipe(
      tap(() => {
        const subTrailer = this.getTrailerById(data.id).subscribe({
          next: (trailer: TrailerResponse | any) => {
            this.trailerActiveStore.remove(({ id }) => id === data.id);

            this.trailerActiveStore.add(trailer);

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
        const trailerCount = JSON.parse(
          localStorage.getItem('trailerTableCount')
        );

        if (tableSelectedTab === 'active') {
          this.trailerActiveStore.remove(({ id }) => id === trailerId);

          trailerCount.active--;
        } else if (tableSelectedTab === 'inactive') {
          this.trailerInactiveStore.remove(({ id }) => id === trailerId);

          trailerCount.inactive--;
        }

        localStorage.setItem(
          'trailerTableCount',
          JSON.stringify({
            active: trailerCount.active,
            inactive: trailerCount.inactive,
          })
        );
        const subTrailer = this.getTrailerById(this.trailerId, true).subscribe({
          next: (trailer: TrailerResponse | any) => {
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
        const trailerCount = JSON.parse(
          localStorage.getItem('trailerTableCount')
        );

        if (tableSelectedTab === 'active') {
          this.trailerActiveStore.remove(({ id }) => id === trailerId);

          trailerCount.active--;
        } else if (tableSelectedTab === 'inactive') {
          this.trailerInactiveStore.remove(({ id }) => id === trailerId);

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
    let deleteOnBack = trailerToDelete.map((trailer: any) => {
      return trailer.id;
    });

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
    this.trailerList = this.trailerMinimalQuery.getAll();
    if (getIndex) {
      this.currentIndex = this.trailerList.findIndex(
        (trailer) => trailer.id === trailerId
      );
      let last = this.trailerList.at(-1);
      if (last.id == trailerId) {
        this.currentIndex = --this.currentIndex;
      }
      if (last.id != trailerId) {
        this.currentIndex = ++this.currentIndex;
      }
      if (this.currentIndex == -1) {
        this.currentIndex = 0;
      }
      this.trailerId = this.trailerList[this.currentIndex].id;
    }

    return this.trailerService.apiTrailerIdGet(trailerId);
  }

  public changeTrailerStatus(
    trailerId: number,
    tabSelected?: string
  ): Observable<any> {
    return this.trailerService
      .apiTrailerStatusIdPut(trailerId, 'response')
      .pipe(
        tap(() => {
          const subTrailer = this.getTrailerById(trailerId).subscribe({
            next: (trailer: TrailerResponse | any) => {
              /* Get Table Tab Count */
              const trailerCount = JSON.parse(
                localStorage.getItem('trailerTableCount')
              );

              /* Get Data From Store To Update */
              let truckToUpdate =
                tabSelected === 'active'
                  ? this.trailerActiveQuery.getAll({
                      filterBy: ({ id }) => id === trailerId,
                    })
                  : this.trailerInactiveQuery.getAll({
                      filterBy: ({ id }) => id === trailerId,
                    });

              /* Remove Data From Store */
              tabSelected === 'active'
                ? this.trailerActiveStore.remove(({ id }) => id === trailerId)
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
}
