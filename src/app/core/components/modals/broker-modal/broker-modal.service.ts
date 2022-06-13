import { BrokerResponse } from './../../../../../../appcoretruckassist/model/brokerResponse';
import { Injectable } from '@angular/core';
import {
  BrokerModalResponse,
  BrokerService,
  CreateBrokerCommand,
  CreateRatingCommand,
  CreateResponse,
  RatingReviewService,
  UpdateBrokerCommand,
  UpdateReviewCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrokerModalService {
  constructor(
    private brokerService: BrokerService,
    private ratingReviewService: RatingReviewService
  ) {}

  public addBroker(data: CreateBrokerCommand): Observable<CreateResponse> {
    return this.brokerService.apiBrokerPost(data);
  }

  public updateBroker(data: UpdateBrokerCommand): Observable<any> {
    return this.brokerService.apiBrokerPut(data);
  }

  public deleteBrokerById(id: number): Observable<any> {
    return this.brokerService.apiBrokerIdDelete(id);
  }

  public changeBanStatus(id: number): Observable<any> {
    return this.brokerService.apiBrokerBanIdPut(id, 'response');
  }

  public changeDnuStatus(id: number): Observable<any> {
    return this.brokerService.apiBrokerDnuIdPut(id, 'response');
  }

  public getBrokerById(id: number): Observable<BrokerResponse> {
    return this.brokerService.apiBrokerIdGet(id);
  }

  public getBrokerDropdowns(): Observable<BrokerModalResponse> {
    return this.brokerService.apiBrokerModalGet();
  }

  public deleteReviewById(id: number): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewIdDelete(id);
  }

  public createReview(review: CreateRatingCommand): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewPost(review);
  }

  public updateReview(review: UpdateReviewCommand): Observable<any> {
    return this.ratingReviewService.apiRatingReviewReviewPut(review);
  }
}
