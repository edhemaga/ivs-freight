import { BrokerMinimalListQuery } from './../broker-details-state/broker-minimal-list-state/broker-minimal.query';
import { Injectable, OnDestroy } from '@angular/core';
import {
    BrokerMinimalListResponse,
    BrokerModalResponse,
    BrokerResponse,
    BrokerService,
    CreateRatingCommand,
    CreateResponse,
    GetBrokerListResponse,
    RatingReviewService,
    UpdateReviewCommand,
} from 'appcoretruckassist';
import { Observable, tap, of, Subject, takeUntil } from 'rxjs';
import { BrokerStore } from './broker.store';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { BrokerMinimalListStore } from '../broker-details-state/broker-minimal-list-state/broker-minimal.store';
import { BrokerDetailsListStore } from '../broker-details-state/broker-details-list-state/broker-details-list.store';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

@Injectable({
    providedIn: 'root',
})
export class BrokerTService implements OnDestroy {
    public brokerId: number;
    public brokerList: any;
    public currentIndex: number;
    private destroy$ = new Subject<void>();
    constructor(
        private brokerService: BrokerService,
        private brokerStore: BrokerStore,
        private ratingReviewService: RatingReviewService,
        private tableService: TruckassistTableService,
        private brokerMinimalStore: BrokerMinimalListStore,
        private brokerMinimalQuery: BrokerMinimalListQuery,
        private bls: BrokerDetailsListStore,
        private formDataService: FormDataService
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
    public deleteBrokerList(brokersToDelete: any[]): Observable<any> {
        // let deleteOnBack = brokersToDelete.map((broker: any) => {
        //   return broker.id;
        // });

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

    // Change Ban Status
    public changeBanStatus(brokerId: number): Observable<any> {
        return this.brokerService.apiBrokerBanIdPut(brokerId, 'response').pipe(
            tap(() => {
                const subBroker = this.getBrokerById(brokerId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (broker: BrokerResponse | any) => {
                            this.brokerStore.remove(
                                ({ id }) => id === brokerId
                            );
                            this.brokerMinimalStore.remove(
                                ({ id }) => id === brokerId
                            );
                            this.brokerStore.add(broker);
                            this.brokerMinimalStore.add(broker);
                            this.bls.update(broker.id, { ban: broker.ban });
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

    // Change Dnu Status
    public changeDnuStatus(brokerId: number): Observable<any> {
        return this.brokerService.apiBrokerDnuIdPut(brokerId, 'response').pipe(
            tap(() => {
                const subBroker = this.getBrokerById(brokerId).subscribe({
                    next: (broker: BrokerResponse | any) => {
                        this.brokerStore.remove(({ id }) => id === brokerId);
                        this.brokerMinimalStore.remove(
                            ({ id }) => id === brokerId
                        );
                        this.brokerStore.add(broker);
                        this.brokerMinimalStore.add(broker);
                        this.bls.update(broker.id, { dnu: broker.dnu });
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

    public getBrokerLoads(
        brokerId: number
    ){
        return this.brokerService.apiBrokerLoadsGet(undefined, undefined, undefined, undefined, undefined, brokerId);
    }public getBrokerLoa

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
