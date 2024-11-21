import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';

// store
import { BrokerStore } from '@pages/customer/state/broker-state/broker.store';
import { ShipperStore } from '@pages/customer/state/shipper-state/shipper.store';
import { RepairShopStore } from '@pages/repair/state/repair-shop-state/repair-shop.store';

// services
import { BrokerService } from '@pages/customer/services';
import { ShipperService } from '@pages/customer/services';
import { RepairService } from '@shared/services/repair.service';

// models
import {
    CreateRatingCommand,
    CreateResponse,
    CreateReviewCommand,
    GetRatingReviewModalResponse,
    RatingReviewService,
    RatingSetResponse,
    ReviewResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ReviewsRatingService {
    constructor(
        private router: Router,

        // services
        private reviewRatingService: RatingReviewService,
        private brokerService: BrokerService,
        private shipperService: ShipperService,
        private repairService: RepairService,

        // store
        private brokerStore: BrokerStore,
        private shipperStore: ShipperStore,
        private repairShopStore: RepairShopStore
    ) {}

    public getReviewRatingModal(): Observable<GetRatingReviewModalResponse> {
        return this.reviewRatingService.apiRatingreviewModalGet();
    }

    public addRating(data: CreateRatingCommand): Observable<RatingSetResponse> {
        return this.reviewRatingService.apiRatingreviewRatingPost(data).pipe(
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
                    this.repairShopStore.update(
                        ({ id }) => id === rating.entityId,
                        {
                            upCount: rating.upCount,
                            downCount: rating.downCount,
                            currentCompanyUserRating:
                                rating.currentCompanyUserRating,
                        }
                    );
                }
            })
        );
    }

    public deleteReview(id: number): Observable<any> {
        return this.reviewRatingService.apiRatingreviewReviewIdDelete(id).pipe(
            tap(() => {
                let splitUrl = this.router.url.split('/');
                let customerId = parseInt(splitUrl[3]);
                if (this.router.url.indexOf('broker') > -1) {
                    this.brokerService.deleteReview(id, customerId);
                }

                if (this.router.url.indexOf('shipper') > -1) {
                    this.shipperService.deleteReview(id, customerId);
                }

                if (this.router.url.indexOf('shop-details') > -1) {
                    this.repairService.deleteReview(id, customerId);
                }
            })
        );
    }

    public getReviewById(id: number): Observable<ReviewResponse> {
        return this.reviewRatingService.apiRatingreviewReviewIdGet(id);
    }

    public addReview(data: CreateReviewCommand): Observable<CreateResponse> {
        return this.reviewRatingService.apiRatingreviewReviewPost(data).pipe(
            tap((res) => {
                this.reviewRatingService
                    .apiRatingreviewReviewIdGet(res.id)
                    .subscribe({
                        next: (resp) => {
                            const splitUrl = this.router.url.split('/');
                            const customerId = parseInt(splitUrl[3]);

                            if (this.router.url.indexOf('broker') > -1) {
                                this.brokerService.addNewReview(
                                    resp,
                                    customerId
                                );
                            }

                            if (this.router.url.indexOf('shipper') > -1) {
                                this.shipperService.addNewReview(
                                    resp,
                                    customerId
                                );
                            }

                            if (this.router.url.indexOf('shop-details') > -1) {
                                this.repairService.addNewReview(
                                    resp,
                                    customerId
                                );
                            }
                        },
                    });
            })
        );
    }

    public updateReview(data: UpdateReviewCommand): Observable<any> {
        return this.reviewRatingService.apiRatingreviewReviewPut(data).pipe(
            tap(() => {
                let splitUrl = this.router.url.split('/');
                let customerId = parseInt(splitUrl[3]);
                if (this.router.url.indexOf('broker') > -1) {
                    this.brokerService.updatedReviewNew(data, customerId);
                }

                if (this.router.url.indexOf('shipper') > -1) {
                    this.shipperService.updatedReviewNew(data, customerId);
                }
            })
        );
    }
}
