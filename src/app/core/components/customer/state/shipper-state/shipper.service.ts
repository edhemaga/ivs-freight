import { ShipperService } from './../../../../../../../appcoretruckassist/api/shipper.service';
import { Injectable } from '@angular/core';
import {
  CreateRatingCommand,
  CreateResponse,
  CreateShipperCommand,
  RatingReviewService,
  ShipperListResponse,
  ShipperMinimalListResponse,
  ShipperModalResponse,
  ShipperResponse,
  UpdateReviewCommand,
  UpdateShipperCommand,
} from 'appcoretruckassist';
import { Observable, of, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ShipperStore } from './shipper.store';
import { ShipperQuery } from './shipper.query';

@Injectable({
  providedIn: 'root',
})
export class ShipperTService {
  constructor(
    private shipperService: ShipperService,
    private tableService: TruckassistTableService,
    private ratingReviewService: RatingReviewService,
    private shipperStore: ShipperStore,
    private shipperQuery: ShipperQuery
  ) {}

  // Create Shipper
  public addShipper(data: CreateShipperCommand): Observable<CreateResponse> {
    return this.shipperService.apiShipperPost(data).pipe(
      tap((res: any) => {
        const subShipper = this.getShipperById(res.id).subscribe({
          next: (shipper: ShipperResponse | any) => {
            this.shipperStore.add(shipper);

            this.tableService.sendActionAnimation({
              animation: 'add',
              tab: 'shipper',
              data: shipper,
              id: shipper.id,
            });

            subShipper.unsubscribe();
          },
        });
      })
    );
  }

  // Update Shipper
  public updateShipper(data: UpdateShipperCommand): Observable<any> {
    return this.shipperService.apiShipperPut(data).pipe(
      tap(() => {
        const subShipper = this.getShipperById(data.id).subscribe({
          next: (shipper: ShipperResponse | any) => {
            this.shipperStore.remove(({ id }) => id === data.id);

            this.shipperStore.add(shipper);

            this.tableService.sendActionAnimation({
              animation: 'update',
              tab: 'shipper',
              data: shipper,
              id: shipper.id,
            });

            subShipper.unsubscribe();
          },
        });
      })
    );
  }

  //Get Shipper Minimal List
  public getShipperMinimalList(
    pageIndex?: number,
    pageSize?: number,
    count?: number
  ): Observable<ShipperMinimalListResponse> {
    return this.shipperService.apiShipperListMinimalGet(
      pageIndex,
      pageSize,
      count
    );
  }

  // Get Shipper List
  public getShippersList(
    ban?: number,
    dnu?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<ShipperListResponse> {
    return this.shipperService.apiShipperListGet(ban, dnu, pageIndex, pageSize);
  }

  // Get Shipper By Id
  public getShipperById(id: number): Observable<ShipperResponse> {
    return this.shipperService.apiShipperIdGet(id);
  }

  // Delete Shipper List
  public deleteShipperList(shippersToDelete: any[]): Observable<any> {
    let deleteOnBack = shippersToDelete.map((shipper: any) => {
      return shipper.id;
    });

    // return this.shipperService.apiShipperListDelete({ ids: deleteOnBack }).pipe(
    //   tap(() => {
    //     let storeShippers = this.shipperQuery.getAll();

    //     storeShippers.map((shipper: any) => {
    //       deleteOnBack.map((d) => {
    //         if (d === shipper.id) {
    //           this.shipperStore.remove(({ id }) => id === shipper.id);
    //         }
    //       });
    //     });
    //   })
    // );
    return of(null);
  }

  // Delete Shipper By Id
  public deleteShipperById(shipperId: number): Observable<any> {
    return this.shipperService.apiShipperIdDelete(shipperId).pipe(
      tap(() => {
        this.shipperStore.remove(({ id }) => id === shipperId);
      })
    );
  }

  // Change Ban Status
  public changeBanStatus(id: number): Observable<any> {
    return this.shipperService.apiShipperBanIdPut(id, 'response');
  }

  // Change Dnu Status
  public changeDnuStatus(id: number): Observable<any> {
    return this.shipperService.apiShipperDnuIdPut(id, 'response');
  }

  public getShipperDropdowns(): Observable<ShipperModalResponse> {
    return this.shipperService.apiShipperModalGet();
  }

  //  <--------------------------------- Review ---------------------------------->

  public createReview(review: CreateRatingCommand): Observable<CreateResponse> {
    return this.ratingReviewService.apiRatingReviewReviewPost(review);
  }

  public deleteReviewById(id: number): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewIdDelete(id);
  }

  public updateReview(review: UpdateReviewCommand): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewPut(review);
  }
}
