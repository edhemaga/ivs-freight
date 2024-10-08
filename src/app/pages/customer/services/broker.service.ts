import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, forkJoin, takeUntil, tap } from 'rxjs';

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
    BrokerInvoiceAgeingResponse,
    BrokerLoadsResponse,
} from 'appcoretruckassist';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

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

                        // use case for new company when user don't have broker and trys to create new load
                        if (brokerShipperCount) {
                            brokerShipperCount.broker++;

                            localStorage.setItem(
                                'brokerShipperTableCount',
                                JSON.stringify({
                                    broker: brokerShipperCount.broker,
                                    shipper: brokerShipperCount.shipper,
                                })
                            );
                        }

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
                forkJoin([
                    this.getBrokerById(data.id),
                    this.getBrokerInvoiceAging(data.id, true),
                    this.getBrokerInvoiceAging(data.id, false),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: ([
                            broker,
                            paidInvoiceAging,
                            unpaidInvoiceAging,
                        ]) => {
                            this.brokerStore.remove(({ id }) => id === data.id);
                            this.brokerMinimalStore.remove(
                                ({ id }) => id === data.id
                            );

                            const brokerData = {
                                ...broker,
                                brokerPaidInvoiceAgeing: paidInvoiceAging,
                                brokerUnpaidInvoiceAgeing: unpaidInvoiceAging,
                            };

                            this.brokerStore.add(brokerData);
                            this.brokerMinimalStore.add(brokerData);
                            this.bls.replace(broker.id, brokerData);
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                tab: 'broker',
                                data: brokerData,
                                id: broker.id,
                            });
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
        status?: number,
        invoiceAgeingFrom?: number,
        invoiceAgeingTo?: number,
        availableCreditFrom?: number,
        availableCreditTo?: number,
        revenueFrom?: number,
        revenueTo?: number,
        _long?: number,
        lat?: number,
        distance?: number,
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
            status,
            invoiceAgeingFrom,
            invoiceAgeingTo,
            availableCreditFrom,
            availableCreditTo,
            revenueFrom,
            revenueTo,
            _long,
            lat,
            distance,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
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

    public getBrokerInvoiceAging(
        id: number,
        paid: boolean
    ): Observable<BrokerInvoiceAgeingResponse> {
        return this.brokerService.apiBrokerInvoiceageingGet(id, paid);
    }

    // Delete Broker List
    public deleteBrokerList(brokerIds: number[]): Observable<any> {
        return this.brokerService.apiBrokerListDelete(brokerIds).pipe(
            tap((res) => {
                if (res?.deletedIds) {
                    const brokerShipperCount = JSON.parse(
                        localStorage.getItem('brokerShipperTableCount')
                    );

                    res.deletedIds.forEach((brokerId) => {
                        this.brokerStore.remove(({ id }) => id === brokerId);
                        this.brokerMinimalStore.remove(
                            ({ id }) => id === brokerId
                        );
                        this.bls.remove(({ id }) => id === brokerId);

                        brokerShipperCount.broker--;
                    });

                    localStorage.setItem(
                        'brokerShipperTableCount',
                        JSON.stringify({
                            broker: brokerShipperCount.broker,
                            shipper: brokerShipperCount.shipper,
                        })
                    );
                }
            })
        );
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

                if (brokerShipperCount) {
                    brokerShipperCount.broker--;

                    localStorage.setItem(
                        'brokerShipperTableCount',
                        JSON.stringify({
                            broker: brokerShipperCount.broker,
                            shipper: brokerShipperCount.shipper,
                        })
                    );
                }
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
            tap(() => {
                forkJoin([
                    this.getBrokerById(brokerId),
                    this.getBrokerInvoiceAging(brokerId, true),
                    this.getBrokerInvoiceAging(brokerId, false),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: ([
                            broker,
                            paidInvoiceAging,
                            unpaidInvoiceAging,
                        ]) => {
                            this.brokerStore.remove(
                                ({ id }) => id === brokerId
                            );
                            this.brokerMinimalStore.remove(
                                ({ id }) => id === brokerId
                            );

                            const brokerData = {
                                ...broker,
                                brokerPaidInvoiceAgeing: paidInvoiceAging,
                                brokerUnpaidInvoiceAgeing: unpaidInvoiceAging,
                            };

                            this.brokerStore.add(brokerData);
                            this.brokerMinimalStore.add(brokerData);
                            this.bls.update(broker.id, { ban: broker.ban });
                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE,
                                tab: TableStringEnum.BROKER,
                                data: brokerData,
                                id: broker.id,
                            });
                        },
                    });
            })
        );
    }

    // Change Ban Status List
    public changeBanListStatus(brokerIds: number[]): Observable<any> {
        return this.brokerService.apiBrokerBanListPut({ ids: brokerIds }).pipe(
            tap(() => {
                this.getBrokerList().subscribe({
                    next: (brokersList) => {
                        brokersList.pagination.data.map((broker) => {
                            this.brokerStore.remove(
                                ({ id }) => id === broker.id
                            );
                            this.brokerMinimalStore.remove(
                                ({ id }) => id === broker.id
                            );
                            this.brokerStore.add(broker);
                            this.brokerMinimalStore.add(broker);
                            this.bls.update(broker.id, { ban: broker.ban });
                        });

                        this.tableService.sendActionAnimation({
                            animation: TableStringEnum.UPDATE_MULTIPLE,
                            tab: TableStringEnum.BROKER,
                            data: brokersList?.pagination?.data?.[0],
                            id: brokersList?.pagination?.data?.[0]?.id,
                        });
                    },
                });
            })
        );
    }

    // Change Dnu Status
    public changeDnuStatus(brokerId: number): Observable<BrokerResponse> {
        return this.brokerService.apiBrokerDnuIdPut(brokerId, 'response').pipe(
            tap(() => {
                forkJoin([
                    this.getBrokerById(brokerId),
                    this.getBrokerInvoiceAging(brokerId, true),
                    this.getBrokerInvoiceAging(brokerId, false),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: ([
                            broker,
                            paidInvoiceAging,
                            unpaidInvoiceAging,
                        ]) => {
                            this.brokerStore.remove(
                                ({ id }) => id === brokerId
                            );
                            this.brokerMinimalStore.remove(
                                ({ id }) => id === brokerId
                            );

                            const brokerData = {
                                ...broker,
                                brokerPaidInvoiceAgeing: paidInvoiceAging,
                                brokerUnpaidInvoiceAgeing: unpaidInvoiceAging,
                            };

                            this.brokerStore.add(brokerData);
                            this.brokerMinimalStore.add(brokerData);
                            this.bls.update(broker.id, { dnu: broker.dnu });
                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE,
                                tab: TableStringEnum.BROKER,
                                data: brokerData,
                                id: broker.id,
                            });
                        },
                    });
            })
        );
    }

    // Change Dnu List Status
    public changeDnuListStatus(brokerIds: number[]): Observable<any> {
        return this.brokerService.apiBrokerDnuListPut({ ids: brokerIds }).pipe(
            tap(() => {
                this.getBrokerList().subscribe({
                    next: (brokersList) => {
                        brokersList.pagination.data.map((broker) => {
                            this.brokerStore.remove(
                                ({ id }) => id === broker.id
                            );
                            this.brokerMinimalStore.remove(
                                ({ id }) => id === broker.id
                            );
                            this.brokerStore.add(broker);
                            this.brokerMinimalStore.add(broker);
                            this.bls.update(broker.id, { ban: broker.ban });
                        });

                        this.tableService.sendActionAnimation({
                            animation: TableStringEnum.UPDATE_MULTIPLE,
                            tab: TableStringEnum.BROKER,
                            data: brokersList?.pagination?.data?.[0],
                            id: brokersList?.pagination?.data?.[0]?.id,
                        });
                    },
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

        brokerData?.ratingReviews.map((item) => {
            if (item.reviewId == data.id) {
                item.comment = data.comment;
            }
        });

        this.brokerItemStore.update(brokerData.id, {
            ratingReviews: brokerData.ratingReviews,
        });
        this.brokerStore.update(brokerData.id, {
            ratingReviews: brokerData.ratingReviews,
        });

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.UPDATE,
            tab: TableStringEnum.BROKER,
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

        brokerData?.ratingReviews.push(data);

        this.brokerItemStore.update(brokerData.id, {
            ratingReviews: brokerData.ratingReviews,
        });

        this.brokerStore.update(brokerData.id, {
            ratingReviews: brokerData.ratingReviews,
        });

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.UPDATE,
            tab: TableStringEnum.BROKER,
            data: brokerData,
            id: brokerData.id,
        });
    }

    public deleteReview(reviewId, brokerId) {
        let brokerData = JSON.parse(
            JSON.stringify(this.brokerItemStore?.getValue()?.entities[brokerId])
        );

        brokerData?.ratingReviews.map((item, index) => {
            if (item.reviewId) {
                if (item.reviewId == reviewId) {
                    brokerData?.ratingReviews.splice(index, 1);
                }
            } else {
                if (item.ratingId == reviewId) {
                    brokerData?.ratingReviews.splice(index, 1);
                }
            }
        });

        this.brokerItemStore.update(brokerData.id, {
            ratingReviews: brokerData.ratingReviews,
        });
        this.brokerStore.update(brokerData.id, {
            ratingReviews: brokerData.ratingReviews,
        });

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.UPDATE,
            tab: TableStringEnum.BROKER,
            data: brokerData,
            id: brokerData.id,
        });
    }

    public getBrokerLoads(
        loadType?: number,
        statusType?: number,
        status?: Array<number>,
        dispatcherIds?: Array<number>,
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        loadId?: number,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
        rateFrom?: number,
        rateTo?: number,
        paidFrom?: number,
        paidTo?: number,
        dueFrom?: number,
        dueTo?: number,
        pickup?: boolean,
        delivery?: boolean,
        longitude?: number,
        latitude?: number,
        distance?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<BrokerLoadsResponse> {
        return this.brokerService.apiBrokerLoadsGet(
            loadType,
            statusType,
            status,
            dispatcherIds,
            dispatcherId,
            dispatchId,
            brokerId,
            shipperId,
            loadId,
            dateFrom,
            dateTo,
            revenueFrom,
            revenueTo,
            truckId,
            rateFrom,
            rateTo,
            paidFrom,
            paidTo,
            dueFrom,
            dueTo,
            pickup,
            delivery,
            longitude,
            latitude,
            distance,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    public changeBrokerStatus(brokerId: number): Observable<BrokerResponse> {
        return this.brokerService.apiBrokerStatusIdPut(brokerId).pipe(
            tap(() => {
                forkJoin([
                    this.getBrokerById(brokerId),
                    this.getBrokerInvoiceAging(brokerId, true),
                    this.getBrokerInvoiceAging(brokerId, false),
                ])
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: ([
                            broker,
                            paidInvoiceAging,
                            unpaidInvoiceAging,
                        ]) => {
                            this.brokerStore.remove(
                                ({ id }) => id === brokerId
                            );
                            this.brokerMinimalStore.remove(
                                ({ id }) => id === brokerId
                            );

                            const brokerData = {
                                ...broker,
                                brokerPaidInvoiceAgeing: paidInvoiceAging,
                                brokerUnpaidInvoiceAgeing: unpaidInvoiceAging,
                            };

                            this.brokerStore.add(brokerData);
                            this.brokerMinimalStore.add(brokerData);
                            this.bls.update(broker.id, {
                                status: broker.status,
                            });
                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE,
                                tab: TableStringEnum.BROKER,
                                data: brokerData,
                                id: broker.id,
                            });
                        },
                    });
            })
        );
    }

    public changeBrokerListStatus(brokerIds: number[]): Observable<any> {
        return this.brokerService
            .apiBrokerStatusListPut({ ids: brokerIds })
            .pipe(
                tap(() => {
                    this.getBrokerList().subscribe({
                        next: (brokersList) => {
                            brokersList.pagination.data.map((broker) => {
                                this.brokerStore.remove(
                                    ({ id }) => id === broker.id
                                );
                                this.brokerMinimalStore.remove(
                                    ({ id }) => id === broker.id
                                );
                                this.brokerStore.add(broker);
                                this.brokerMinimalStore.add(broker);
                                this.bls.update(broker.id, { ban: broker.ban });
                            });

                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE_MULTIPLE,
                                tab: TableStringEnum.BROKER,
                                data: brokersList?.pagination?.data?.[0],
                                id: brokersList?.pagination?.data?.[0]?.id,
                            });
                        },
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
