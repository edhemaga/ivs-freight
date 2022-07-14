import { Injectable } from '@angular/core';
import {
  BrokerModalResponse,
  BrokerResponse,
  BrokerService,
  CreateBrokerCommand,
  CreateRatingCommand,
  CreateResponse,
  GetBrokerListResponse,
  RatingReviewService,
  UpdateBrokerCommand,
  UpdateReviewCommand,
} from 'appcoretruckassist';
import { Observable, tap, of } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { BrokerQuery } from './broker.query';
import { BrokerStore } from './broker.store';

@Injectable({
  providedIn: 'root',
})
export class BrokerTService {
  constructor(
    private brokerService: BrokerService,
    private brokerStore: BrokerStore,
    private ratingReviewService: RatingReviewService,
    private tableService: TruckassistTableService,
    private brokerQuery: BrokerQuery
  ) {}

  // Add Broker
  public addBroker(data: CreateBrokerCommand): Observable<CreateResponse> {
    return this.brokerService.apiBrokerPost(data).pipe(
      tap((res: any) => {
        const subBroker = this.getBrokerById(res.id).subscribe({
          next: (broker: BrokerResponse | any) => {
            this.brokerStore.add(broker);

            this.tableService.sendActionAnimation({
              animation: 'add',
              tab: 'broker',
              data: broker,
              id: broker.id,
            });

            subBroker.unsubscribe();
          },
        });
      })
    );
  }

  // Update Broker
  public updateBroker(data: UpdateBrokerCommand): Observable<any> {
    return this.brokerService.apiBrokerPut(data).pipe(
      tap(() => {
        const subBroker = this.getBrokerById(data.id).subscribe({
          next: (broker: BrokerResponse | any) => {
            this.brokerStore.remove(({ id }) => id === data.id);

            this.brokerStore.add(broker);

            this.tableService.sendActionAnimation({
              animation: 'update',
              tab: 'broker',
              data: broker,
              id: broker.id,
            });

            subBroker.unsubscribe();
          },
        });
      })
    );
  }

  //Get Broker Minimal List

  // public getBrokerMinimalList(
  //   pageIndex?: number,
  //   pageSize?: number,
  //   count?: number
  // ): Observable<BrokerMinimalListResponse> {}

  // Get Broker List
  public getBrokerList(
    ban?: number,
    dnu?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<GetBrokerListResponse> {
    return this.brokerService.apiBrokerListGet(ban, dnu, pageIndex, pageSize);
  }

  // Get Broker By ID
  public getBrokerById(id: number): Observable<BrokerResponse> {
    return this.brokerService.apiBrokerIdGet(id);
  }

  // Delete Broker List
  public deleteBrokerList(brokersToDelete: any[]): Observable<any> {
    let deleteOnBack = brokersToDelete.map((broker: any) => {
      return broker.id;
    });

    // return this.brokerService.apiBrokerListDelete({ ids: deleteOnBack }).pipe(
    //   tap(() => {
    //     let storeBrokers = this.brokerQuery.getAll();

    //     storeBrokers.map((broker: any) => {
    //       deleteOnBack.map((d) => {
    //         if (d === broker.id) {
    //           this.brokerStore.remove(({ id }) => id === broker.id);
    //         }
    //       });
    //     });
    //   })
    // );
    return of(null);
  }

  // Delete Broker By Id
  public deleteBrokerById(brokerId: number): Observable<any> {
    return this.brokerService.apiBrokerIdDelete(brokerId).pipe(
      tap(() => {
        this.brokerStore.remove(({ id }) => id === id);
      })
    );
  }

  // Change Ban Status
  public changeBanStatus(id: number): Observable<any> {
    return this.brokerService.apiBrokerBanIdPut(id, 'response');
  }

  // Change Dnu Status
  public changeDnuStatus(id: number): Observable<any> {
    return this.brokerService.apiBrokerDnuIdPut(id, 'response');
  }

  public getBrokerDropdowns(): Observable<BrokerModalResponse> {
    return this.brokerService.apiBrokerModalGet();
  }

  //  <--------------------------------- Review ---------------------------------->

  public createReview(review: CreateRatingCommand): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewPost(review);
  }

  public deleteReviewById(id: number): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewIdDelete(id);
  }

  public updateReview(review: UpdateReviewCommand): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewPut(review);
  }
}
