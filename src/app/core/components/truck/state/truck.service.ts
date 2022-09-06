import { TruckMinimalListResponse } from './../../../../../../appcoretruckassist/model/truckMinimalListResponse';
import { Observable, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  CreateTruckCommand,
  GetTruckModalResponse,
  TruckListResponse,
  TruckResponse,
  TruckService,
  UpdateTruckCommand,
} from 'appcoretruckassist';
import { TruckInactiveStore } from './truck-inactive-state/truck-inactive.store';
import { TruckActiveStore } from './truck-active-state/truck-active.store';
import { TruckInactiveQuery } from './truck-inactive-state/truck-inactive.query';
import { TruckActiveQuery } from './truck-active-state/truck-active.query';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

@Injectable({ providedIn: 'root' })
export class TruckTService {
  constructor(
    private truckActiveStore: TruckActiveStore,
    private truckInactiveStore: TruckInactiveStore,
    private truckService: TruckService,
    private truckActiveQuery: TruckActiveQuery,
    private truckInactiveQuery: TruckInactiveQuery,
    private tableService: TruckassistTableService
  ) {}

  //Get Truck Minimal List
  public getTrucksMinimalList(
    pageIndex?: number,
    pageSize?: number,
    count?: number
  ): Observable<TruckMinimalListResponse> {
    return this.truckService.apiTruckListMinimalGet(pageIndex, pageSize, count);
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

  /* Observable<CreateTruckResponse> */

  public addTruck(data: CreateTruckCommand): Observable<any> {
    return this.truckService.apiTruckPost(data).pipe(
      tap((res: any) => {
        const subTruck = this.getTruckById(res.id).subscribe({
          next: (truck: TruckResponse | any) => {
            this.truckActiveStore.add(truck);

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

  public updateTruck(data: UpdateTruckCommand): Observable<any> {
    return this.truckService.apiTruckPut(data).pipe(
      tap(() => {
        const subTruck = this.getTruckById(data.id).subscribe({
          next: (truck: TruckResponse | any) => {
            this.truckActiveStore.remove(({ id }) => id === data.id);

            this.truckActiveStore.add(truck);

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

  public deleteTruckById(
    truckId: number,
    tableSelectedTab?: string
  ): Observable<any> {
    return this.truckService.apiTruckIdDelete(truckId).pipe(
      tap(() => {
        const truckCount = JSON.parse(localStorage.getItem('truckTableCount'));

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

  public deleteTruckList(trucksToDelete: any[]): Observable<any> {
    let deleteOnBack = trucksToDelete.map((truck: any) => {
      return truck.id;
    });

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

  public getTruckById(id: number): Observable<TruckResponse> {
    return this.truckService.apiTruckIdGet(id);
  }

  public changeTruckStatus(
    truckId: number,
    tabSelected?: string
  ): Observable<any> {
    return this.truckService.apiTruckStatusIdPut(truckId, 'response').pipe(
      tap(() => {
        /* Get Table Tab Count */
        const truckCount = JSON.parse(localStorage.getItem('truckTableCount'));

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
          : this.truckInactiveStore.remove(({ id }) => id === truckId);

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

        this.tableService.sendActionAnimation({
          animation: 'update-status',
          id: truckId,
        });
      })
    );
  }

  public getTruckDropdowns(): Observable<GetTruckModalResponse> {
    return this.truckService.apiTruckModalGet();
  }
}
