import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

// Services
import { FormDataService } from '@shared/services/form-data.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// Store
import { BrokerStore } from '@pages/customer/state/broker-state/broker.store';
import { BrokerMinimalListStore } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.store';
import { BrokerDetailsListStore } from '@pages/customer/state/broker-details-state/broker-details-list-state/broker-details-list.store';
import { BrokerDetailsStore } from '@pages/customer/state/broker-details-state/broker-details.store';
import { BrokerMinimalListQuery } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.query';

// Models
import {
    BrokerService as BrokerMainService,
    RatingReviewService,
    BrokerMinimalListResponse,
    BrokerModalResponse,
    BrokerResponse,
    CreateRatingCommand,
    CreateResponse,
    GetBrokerListResponse,
    UpdateReviewCommand,
    BrokerAvailableCreditCommand,
    BrokerAvailableCreditResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class BrokerService implements OnDestroy {
    public brokerId: number;
    public brokerList: any;
    public currentIndex: number;
    private destroy$ = new Subject<void>();

    constructor(
        private brokerService: BrokerMainService,
        private ratingReviewService: RatingReviewService,
        private tableService: TruckassistTableService,
        private formDataService: FormDataService,
        private brokerStore: BrokerStore,
        private brokerMinimalStore: BrokerMinimalListStore,
        private bls: BrokerDetailsListStore,
        private brokerItemStore: BrokerDetailsStore,
        private brokerMinimalQuery: BrokerMinimalListQuery
    ) {}

    // Add Broker
    public addBroker(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.brokerService.apiBrokerPost().pipe(
            tap((res: any) => {
                const subBroker = this.getBrokerById(res.id).subscribe({
                    next: (broker: BrokerResponse | any) => {
                        this.brokerStore.add(broker);
                        this.brokerMinimalStore.add(broker);
                        const brokerShipperCount = JSON.parse(
                            localStorage.getItem('brokerShipperTableCount')
                        );

                        brokerShipperCount.broker++;

                        localStorage.setItem(
                            'brokerShipperTableCount',
                            JSON.stringify({
                                broker: brokerShipperCount.broker,
                                shipper: brokerShipperCount.shipper,
                            })
                        );

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
    public updateBroker(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.brokerService.apiBrokerPut().pipe(
            tap(() => {
                const subBroker = this.getBrokerById(data.id).subscribe({
                    next: (broker: BrokerResponse | any) => {
                        this.brokerStore.remove(({ id }) => id === data.id);
                        this.brokerMinimalStore.remove(
                            ({ id }) => id === data.id
                        );
                        this.brokerStore.add(broker);
                        this.brokerMinimalStore.add(broker);
                        this.bls.replace(broker.id, broker);
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

    public getBrokerMinimalList(
        pageIndex?: number,
        pageSize?: number,
        count?: number
    ): Observable<BrokerMinimalListResponse> {
        return this.brokerService.apiBrokerListMinimalGet(
            pageIndex,
            pageSize,
            count
        );
    }

    // Get Broker List
    public getBrokerList(
        ban?: number,
        dnu?: number,
        invoiceAgeingFrom?: number,
        invoiceAgeingTo?: number,
        availableCreditFrom?: number,
        availableCreditTo?: number,
        revenueFrom?: number,
        revenueTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<GetBrokerListResponse> {
        return this.brokerService.apiBrokerListGet(
            ban,
            dnu,
            invoiceAgeingFrom,
            invoiceAgeingTo,
            availableCreditFrom,
            availableCreditTo,
            revenueFrom,
            revenueTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // Get Broker By ID
    public getBrokerById(
        brokerId: number,
        getIndex?: boolean
    ): Observable<BrokerResponse> {
        this.brokerMinimalQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => (this.brokerList = item));
        if (getIndex) {
            this.currentIndex = this.brokerList.findIndex(
                (broker) => broker.id === brokerId
            );
            let last = this.brokerList.at(-1);
            if (last.id === brokerId) {
                this.currentIndex = --this.currentIndex;
            } else {
                this.currentIndex = ++this.currentIndex;
            }
            if (this.currentIndex == -1) {
                this.currentIndex = 0;
            }
            this.brokerId = this.brokerList[this.currentIndex].id;
        }
        return this.brokerService.apiBrokerIdGet(brokerId);
    }

    // Delete Broker List
    public deleteBrokerList(): Observable<any> {
        return of(null);
    }

    // Delete Broker By Id Details
    public deleteBrokerByIdDetails(brokerId: number): Observable<any> {
        return this.brokerService.apiBrokerIdDelete(brokerId).pipe(
            tap(() => {
                this.brokerStore.remove(({ id }) => id === brokerId);
                this.brokerMinimalStore.remove(({ id }) => id === brokerId);
                this.bls.remove(({ id }) => id === brokerId);
                const brokerShipperCount = JSON.parse(
                    localStorage.getItem('brokerShipperTableCount')
                );

                brokerShipperCount.broker--;

                localStorage.setItem(
                    'brokerShipperTableCount',
                    JSON.stringify({
                        broker: brokerShipperCount.broker,
                        shipper: brokerShipperCount.shipper,
                    })
                );
                const subBroker = this.getBrokerById(this.brokerId, true)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (broker: BrokerResponse | any) => {
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
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

    // Delete Broker By Id
    public deleteBrokerById(brokerId: number): Observable<any> {
        return this.brokerService.apiBrokerIdDelete(brokerId).pipe(
            tap(() => {
                this.brokerStore.remove(({ id }) => id === brokerId);
                this.brokerMinimalStore.remove(({ id }) => id === brokerId);
                this.bls.remove(({ id }) => id === brokerId);
                const brokerShipperCount = JSON.parse(
                    localStorage.getItem('brokerShipperTableCount')
                );

                brokerShipperCount.broker--;

                localStorage.setItem(
                    'brokerShipperTableCount',
                    JSON.stringify({
                        broker: brokerShipperCount.broker,
                        shipper: brokerShipperCount.shipper,
                    })
                );
            })
        );
    }

    // Available Credit Broker
    public availableCreditBroker(
        data: BrokerAvailableCreditCommand
    ): Observable<BrokerAvailableCreditResponse> {
        return this.brokerService.apiBrokerAvailablecreditPut(data);
    }

    // Change Ban Status
    public changeBanStatus(brokerId: number): Observable<BrokerResponse> {
        return this.brokerService.apiBrokerBanIdPut(brokerId, 'response').pipe(
            switchMap(() => this.getBrokerById(brokerId)),
            tap((broker: BrokerResponse) => {
                this.brokerStore.remove(({ id }) => id === brokerId);
                this.brokerMinimalStore.remove(({ id }) => id === brokerId);
                this.brokerStore.add(broker);
                this.brokerMinimalStore.add(broker);
                this.bls.update(broker.id, { ban: broker.ban });
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    tab: 'broker',
                    data: broker,
                    id: broker.id,
                });
            })
        );
    }

    // Change Dnu Status
    public changeDnuStatus(brokerId: number): Observable<BrokerResponse> {
        return this.brokerService.apiBrokerDnuIdPut(brokerId, 'response').pipe(
            switchMap(() => this.getBrokerById(brokerId)),
            tap((broker: BrokerResponse) => {
                this.brokerStore.remove(({ id }) => id === brokerId);
                this.brokerMinimalStore.remove(({ id }) => id === brokerId);
                this.brokerStore.add(broker);
                this.brokerMinimalStore.add(broker);
                this.bls.update(broker.id, { dnu: broker.dnu });
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    tab: 'broker',
                    data: broker,
                    id: broker.id,
                });
            })
        );
    }

    public getBrokerDropdowns(): Observable<BrokerModalResponse> {
        return this.brokerService.apiBrokerModalGet();
    }

    //  <--------------------------------- Review ---------------------------------->

    public createReview(review: CreateRatingCommand): Observable<any> {
        return this.ratingReviewService.apiRatingreviewRatingPost(review);
    }

    public deleteReviewById(id: number): Observable<any> {
        return this.ratingReviewService.apiRatingreviewReviewIdDelete(id);
    }

    public updateReview(review: UpdateReviewCommand): Observable<any> {
        return this.ratingReviewService.apiRatingreviewReviewPut(review);
    }

    public updatedReviewNew(data, currentId) {
        let brokerData = JSON.parse(
            JSON.stringify(
                this.brokerItemStore?.getValue()?.entities[currentId]
            )
        );

        brokerData?.reviews.map((item: any) => {
            if (item.id == data.id) {
                item.comment = data.comment;
            }
        });

        // this.brokerItemStore.update(brokerData.id, {
        //     reviews: brokerData.reviews,
        // });
        // this.brokerStore.update(brokerData.id, { reviews: brokerData.reviews }); - reviews doesn't exist in brokerData response

        this.tableService.sendActionAnimation({
            animation: 'update',
            tab: 'broker',
            data: brokerData,
            id: brokerData.id,
        });
    }

    public addNewReview(data, currentId) {
        let brokerData = JSON.parse(
            JSON.stringify(
                this.brokerItemStore?.getValue()?.entities[currentId]
            )
        );

        brokerData?.reviews.push(data);

        // this.brokerItemStore.update(brokerData.id, {
        //     reviews: brokerData.reviews,
        // });

        // this.brokerStore.update(brokerData.id, { reviews: brokerData.reviews }); - reviews doesn't exist in brokerData response

        this.tableService.sendActionAnimation({
            animation: 'update',
            tab: 'broker',
            data: brokerData,
            id: brokerData.id,
        });
    }

    public deleteReview(reviewId, brokerId) {
        let brokerData = JSON.parse(
            JSON.stringify(this.brokerItemStore?.getValue()?.entities[brokerId])
        );

        brokerData?.reviews.map((item: any, index: any) => {
            if (item.id == reviewId) {
                brokerData?.reviews.splice(index, 1);
            }
        });

        // this.brokerItemStore.update(brokerData.id, {
        //     reviews: brokerData.reviews,
        // });
        // this.brokerStore.update(brokerData.id, { reviews: brokerData.reviews }); - reviews doesn't exist in brokerData response

        this.tableService.sendActionAnimation({
            animation: 'update',
            tab: 'broker',
            data: brokerData,
            id: brokerData.id,
        });
    }

    public getBrokerLoads(brokerId: number) {
        return this.brokerService.apiBrokerLoadsGet(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            brokerId
        );
    }

    public changeBrokerStatus(brokerId: number): Observable<BrokerResponse> {
        return this.brokerService.apiBrokerStatusIdPut(brokerId).pipe(
            switchMap(() => this.getBrokerById(brokerId)),
            tap((broker: BrokerResponse) => {
                this.brokerStore.remove(({ id }) => id === brokerId);
                this.brokerMinimalStore.remove(({ id }) => id === brokerId);
                this.brokerStore.add(broker);
                this.brokerMinimalStore.add(broker);
                this.bls.update(broker.id, { dnu: broker.dnu });
                this.tableService.sendActionAnimation({
                    animation: 'update',
                    tab: 'broker',
                    data: broker,
                    id: broker.id,
                });
            })
        );
    }

    public getMileageChartData(id: number, chartType: number) {
        return this.brokerService.apiBrokerMileageratehistoryGet(id, chartType);
    }

    public getPaymentChartData(id: number, chartType: number) {
        return this.brokerService.apiBrokerPaymenthistoryGet(id, chartType);
    }

    public getInvoiceChartData(id: number, chartType: number) {
        return this.brokerService.apiBrokerPaidinvoiceGet(id, chartType);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
