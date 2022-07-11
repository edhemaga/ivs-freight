import { TruckMinimalListResponse } from './../../../../../../appcoretruckassist/model/truckMinimalListResponse';
import { TruckQuery } from './truck.query';
import { Observable, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { TruckStore } from './truck.store';
import {
  CreateTruckCommand,
  GetTruckModalResponse,
  TruckListResponse,
  TruckResponse,
  TruckService,
  UpdateTruckCommand,
} from 'appcoretruckassist';
import { CreateTruckResponse } from 'appcoretruckassist/model/createTruckResponse';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({ providedIn: 'root' })
export class TruckTService {
  constructor(
    private truckStore: TruckStore,
    private truckService: TruckService,
    private truckQuery: TruckQuery,
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
    return this.truckService.apiTruckListGet(active, pageIndex, pageSize);
  }

  public addTruck(data: CreateTruckCommand): Observable<CreateTruckResponse> {
    return this.truckService.apiTruckPost(data).pipe(
      tap((res: any) => {
        const subTruck = this.getTruckById(res.id).subscribe({
          next: (truck: TruckResponse | any) => {
            this.truckStore.add(truck);

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
            this.truckStore.remove(({ id }) => id === data.id);

            this.truckStore.add(truck);

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

  public deleteTruckById(id: number): Observable<any> {
    return this.truckService.apiTruckIdDelete(id).pipe(
      tap(() => {
        this.truckStore.remove(({ id }) => id === id);
      })
    );
  }

  public deleteTruckList(trucksToDelete: any[]): Observable<any> {
    let deleteOnBack = trucksToDelete.map((driver: any) => {
      return driver.id;
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

  public changeTruckStatus(truckId: number): Observable<any> {
    return this.truckService.apiTruckStatusIdPut(truckId, 'response').pipe(
      tap(() => {
        const truckToUpdate = this.truckQuery.getAll({
          filterBy: ({ id }) => id === truckId,
        });

        this.truckStore.update(({ id }) => id === truckId, {
          status: truckToUpdate[0].status === 0 ? 1 : 0,
        });

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
