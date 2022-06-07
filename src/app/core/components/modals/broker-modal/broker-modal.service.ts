import { BrokerResponse } from './../../../../../../appcoretruckassist/model/brokerResponse';
import { Injectable } from '@angular/core';
import {
  BrokerModalResponse,
  BrokerReviewCreateResponse,
  BrokerService,
  CreateBrokerCommand,
  CreateBrokerReviewCommand,
  CreateResponse,
  UpdateBrokerCommand,
  UpdateBrokerReviewCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrokerModalService {
  constructor(private brokerService: BrokerService) {}

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
    return this.brokerService.apiBrokerReviewIdDelete(id);
  }

  public createReview(review: CreateBrokerReviewCommand): Observable<BrokerReviewCreateResponse> {
    return this.brokerService.apiBrokerReviewPost(review)
  }

  public updateReview(review: UpdateBrokerReviewCommand): Observable<any> {
    return this.brokerService.apiBrokerReviewPut(review);
  }
}
