import { Observable, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';

import { TrailerStore } from './trailer.store';
import {
  CreateTrailerCommand,
  GetTrailerModalResponse,
  TrailerListResponse,
  TrailerResponse,
  TrailerService,
  UpdateTrailerCommand,
} from 'appcoretruckassist';
import { CreateTrailerResponse } from 'appcoretruckassist/model/createTrailerResponse';
import { TrailerQuery } from './trailer.query';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({ providedIn: 'root' })
export class TrailerTService {
  constructor(
    private trailerStore: TrailerStore,
    private trailerService: TrailerService,
    private trailerQuery: TrailerQuery,
    private tableService: TruckassistTableService
  ) {}

  public addTrailer(
    data: CreateTrailerCommand
  ): Observable<CreateTrailerResponse> {
    return this.trailerService.apiTrailerPost(data).pipe(
      tap((res: any) => {
        const subTrailer = this.getTrailerById(res.id).subscribe({
          next: (trailer: TrailerResponse | any) => {
            this.trailerStore.add(trailer);

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
    return this.trailerService.apiTrailerListGet(active, pageIndex, pageSize);
  }

  public updateTrailer(data: UpdateTrailerCommand): Observable<any> {
    return this.trailerService.apiTrailerPut(data).pipe(
      tap(() => {
        const subTrailer = this.getTrailerById(data.id).subscribe({
          next: (trailer: TrailerResponse | any) => {
            this.trailerStore.remove(({ id }) => id === trailer.id);

            this.trailerStore.add(trailer);

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

  public deleteTrailerById(id: number): Observable<any> {
    return this.trailerService.apiTrailerIdDelete(id).pipe(
      tap(() => {
        this.trailerStore.remove(({ id }) => id === id);
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

  public getTrailerById(id: number): Observable<TrailerResponse> {
    return this.trailerService.apiTrailerIdGet(id);
  }

  public changeTrailerStatus(trailerId: number): Observable<any> {
    return this.trailerService
      .apiTrailerStatusIdPut(trailerId, 'response')
      .pipe(
        tap(() => {
          const subTrailer = this.getTrailerById(trailerId).subscribe({
            next: () => {
              const trailerToUpdate = this.trailerQuery.getAll({
                filterBy: ({ id }) => id === trailerId,
              });

              this.trailerStore.update(({ id }) => id === trailerId, {
                status: trailerToUpdate[0].status === 0 ? 1 : 0,
              });

              this.tableService.sendActionAnimation({
                animation: 'update-status',
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
