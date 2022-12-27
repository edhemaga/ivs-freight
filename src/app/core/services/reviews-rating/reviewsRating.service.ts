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
import { Router } from '@angular/router';
import { BrokerTService } from '../../components/customer/state/broker-state/broker.service';

@Injectable({
    providedIn: 'root',
})
export class ReviewsRatingService {
    constructor(
        private reviewRatingService: RatingReviewService,
        private brokerStore: BrokerStore,
        private shipperStore: ShipperStore,
        private shopStore: ShopStore,
        private router: Router,
        private BrokerTService: BrokerTService,
    ) {}

    public getReviewRatingModal(): Observable<GetRatingReviewModalResponse> {
        return this.reviewRatingService.apiRatingReviewModalGet();
    }

    public addRating(data: CreateRatingCommand): Observable<any> {
        return this.reviewRatingService.apiRatingReviewRatingPost(data).pipe(
            tap((rating: any) => {
                if (rating.entityType.name === 'Broker') {
                    this.brokerStore.update(
                        ({ id }) => id === rating.entityId,
                        {
                            upCount: rating.upCount,
                            downCount: rating.downCount,
                            currentCompanyUserRating:
                                rating.currentCompanyUserRating,
                        }
                    );
                } else if (rating.entityType.name === 'Shipper') {
                    this.shipperStore.update(
                        ({ id }) => id === rating.entityId,
                        {
                            upCount: rating.upCount,
                            downCount: rating.downCount,
                            currentCompanyUserRating:
                                rating.currentCompanyUserRating,
                        }
                    );
                } else if (rating.entityType.name === 'Repair shop') {
                    this.shopStore.update(({ id }) => id === rating.entityId, {
                        upCount: rating.upCount,
                        downCount: rating.downCount,
                        currentCompanyUserRating:
                            rating.currentCompanyUserRating,
                    });
                }
            })
        );
    }

    public deleteReview(id: number): Observable<any> {
        console.log('--deleteReview--')
        return this.reviewRatingService.apiRatingReviewReviewIdDelete(id);
    }

    public getReviewById(id: number): Observable<ReviewResponse> {
        console.log('---here---')
        return this.reviewRatingService.apiRatingReviewReviewIdGet(id);
    }

    public addReview(data: CreateReviewCommand): Observable<CreateResponse> {
        console.log('--addReview--')
        return this.reviewRatingService.apiRatingReviewReviewPost(data).pipe(
            tap(() => {

                let splitUrl = this.router.url.split('/');
                let customerId = parseInt(splitUrl[2]);

                console.log('--this.router', this.router);
                if ( this.router.url.indexOf('broker') > -1 ){
                    this.BrokerTService.addNewReview(data, customerId);
                }
            }));;
    }

    public updateReview(data: UpdateReviewCommand): Observable<any> {
       
        return this.reviewRatingService.apiRatingReviewReviewPut(data).pipe(
            tap(() => {
                console.log('--update review--')
                let splitUrl = this.router.url.split('/');
                let customerId = parseInt(splitUrl[2]);
                if ( this.router.url.indexOf('broker') > -1 ){
                    this.BrokerTService.updatedReviewNew(data, customerId);
                }
            }));
    }
}
