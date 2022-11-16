import { Injectable } from '@angular/core';
import {
   CreateRatingCommand,
   CreateResponse,
   CreateReviewCommand,
   GetRatingReviewModalResponse,
   RatingReviewService,
   ReviewResponse,
   UpdateReviewCommand,
} from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { BrokerStore } from '../../components/customer/state/broker-state/broker.store';
import { ShipperStore } from '../../components/customer/state/shipper-state/shipper.store';
import { ShopStore } from '../../components/repair/state/shop-state/shop.store';

@Injectable({
   providedIn: 'root',
})
export class ReviewsRatingService {
   constructor(
      private reviewRatingService: RatingReviewService,
      private brokerStore: BrokerStore,
      private shipperStore: ShipperStore,
      private shopStore: ShopStore
   ) {}

   public getReviewRatingModal(): Observable<GetRatingReviewModalResponse> {
      return this.reviewRatingService.apiRatingReviewModalGet();
   }

   public addRating(data: CreateRatingCommand): Observable<any> {
      return this.reviewRatingService.apiRatingReviewRatingPost(data).pipe(
         tap((rating: any) => {
            if (rating.entityType.name === 'Broker') {
               this.brokerStore.update(({ id }) => id === rating.entityId, {
                  upCount: rating.upCount,
                  downCount: rating.downCount,
                  currentCompanyUserRating: rating.currentCompanyUserRating,
               });
            } else if (rating.entityType.name === 'Shipper') {
               this.shipperStore.update(({ id }) => id === rating.entityId, {
                  upCount: rating.upCount,
                  downCount: rating.downCount,
                  currentCompanyUserRating: rating.currentCompanyUserRating,
               });
            } else if (rating.entityType.name === 'Repair shop') {
               this.shopStore.update(({ id }) => id === rating.entityId, {
                  upCount: rating.upCount,
                  downCount: rating.downCount,
                  currentCompanyUserRating: rating.currentCompanyUserRating,
               });
            }
         })
      );
   }

   public deleteReview(id: number): Observable<any> {
      return this.reviewRatingService.apiRatingReviewReviewIdDelete(id);
   }

   public getReviewById(id: number): Observable<ReviewResponse> {
      return this.reviewRatingService.apiRatingReviewReviewIdGet(id);
   }

   public addReview(data: CreateReviewCommand): Observable<CreateResponse> {
      return this.reviewRatingService.apiRatingReviewReviewPost(data);
   }

   public updateReview(data: UpdateReviewCommand): Observable<any> {
      return this.reviewRatingService.apiRatingReviewReviewPut(data);
   }
}
