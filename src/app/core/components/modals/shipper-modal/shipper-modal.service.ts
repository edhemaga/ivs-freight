import { Injectable } from '@angular/core';
import { CreateResponse, CreateShipperCommand, CreateShipperReviewCommand, ShipperModalResponse, ShipperResponse, ShipperService, UpdateShipperCommand, UpdateShipperReviewCommand } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipperModalService {

  constructor(private shipperService: ShipperService) {}

  public addShipper(data: CreateShipperCommand): Observable<CreateResponse> {
    return this.shipperService.apiShipperPost(data);
  }

  public updateShipper(data: UpdateShipperCommand): Observable<any> {
    return this.shipperService.apiShipperPut(data);
  }

  public deleteShipperById(id: number): Observable<any> {
    return this.shipperService.apiShipperIdDelete(id);
  }

  public getShipperById(id: number): Observable<ShipperResponse> {
    return this.shipperService.apiShipperIdGet(id);
  }

  public changeBanStatus(id: number): Observable<any> {
    return this.shipperService.apiShipperBanIdPut(id, 'response');
  }

  public changeDnuStatus(id: number): Observable<any> {
    return this.shipperService.apiShipperDnuIdPut(id, 'response');
  }

  public getShipperDropdowns(): Observable<ShipperModalResponse> {
    return this.shipperService.apiShipperModalGet();
  }

  public deleteReviewById(id: number): Observable<any> {
    return this.shipperService.apiShipperReviewIdDelete(id);
  }

  public createReview(review: CreateShipperReviewCommand): Observable<CreateResponse> {
    return this.shipperService.apiShipperReviewPost(review)
  }

  public updateReview(review: UpdateShipperReviewCommand): Observable<any> {
    return this.shipperService.apiShipperReviewPut(review);
  }

}
