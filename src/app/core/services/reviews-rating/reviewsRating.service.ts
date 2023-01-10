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
import { Observable, tap, Subject, takeUntil } from 'rxjs';
import { BrokerStore } from '../../components/customer/state/broker-state/broker.store';
import { ShipperStore } from '../../components/customer/state/shipper-state/shipper.store';
import { ShopStore } from '../../components/repair/state/shop-state/shop.store';
import { Router } from '@angular/router';
import { BrokerTService } from '../../components/customer/state/broker-state/broker.service';
import { ShipperTService } from '../../components/customer/state/shipper-state/shipper.service';
import { RepairTService } from '../../components/repair/state/repair.service';

@Injectable({
    providedIn: 'root',
})
export class ReviewsRatingService {
    private destroy$ = new Subject<void>();
    constructor(
        private reviewRatingService: RatingReviewService,
        private brokerStore: BrokerStore,
        private shipperStore: ShipperStore,
        private shopStore: ShopStore,
        private router: Router,
        private BrokerTService: BrokerTService,
        private ShipperTService: ShipperTService,
        private RepairTService: RepairTService,
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
        return this.reviewRatingService.apiRatingReviewReviewIdDelete(id).pipe(
            tap(() => {
                let splitUrl = this.router.url.split('/');
                let customerId = parseInt(splitUrl[2]);
                if ( this.router.url.indexOf('broker') > -1 ){
                    this.BrokerTService.deleteReview(id, customerId);
                } 

                if ( this.router.url.indexOf('shipper') > -1 ){
                    this.ShipperTService.deleteReview(id, customerId);
                }

                if ( this.router.url.indexOf('shop-details') > -1 ){
                    this.RepairTService.deleteReview(id, customerId);
                }

            }));
    }

    public getReviewById(id: number): Observable<ReviewResponse> {
        return this.reviewRatingService.apiRatingReviewReviewIdGet(id);
    }

    public addReview(data: CreateReviewCommand): Observable<CreateResponse> {
        return this.reviewRatingService.apiRatingReviewReviewPost(data).pipe(
            tap((res: any) => {

                const reviewDataNew = this.reviewRatingService.apiRatingReviewReviewIdGet(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (resp: any) => {
                            let splitUrl = this.router.url.split('/');
                            let customerId = parseInt(splitUrl[2]);

                            if ( this.router.url.indexOf('broker') > -1 ){
                                this.BrokerTService.addNewReview(resp, customerId);
                            }
                            if ( this.router.url.indexOf('shipper') > -1 ){
                                this.ShipperTService.addNewReview(resp, customerId);
                            }
                            if ( this.router.url.indexOf('shop-details') > -1 ){
                                this.RepairTService.addNewReview(resp, customerId);
                            }
                            reviewDataNew.unsubscribe();
                        },
                    });
            
            }));
    }

    public updateReview(data: UpdateReviewCommand): Observable<any> {
        return this.reviewRatingService.apiRatingReviewReviewPut(data).pipe(
            tap(() => {
                let splitUrl = this.router.url.split('/');
                let customerId = parseInt(splitUrl[2]);
                if ( this.router.url.indexOf('broker') > -1 ){
                    this.BrokerTService.updatedReviewNew(data, customerId);
                }

                if ( this.router.url.indexOf('shipper') > -1 ){
                    this.ShipperTService.updatedReviewNew(data, customerId); 
                }
            }));
    }
}
