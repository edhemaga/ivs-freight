import { Injectable } from '@angular/core';

import { Observable, of, switchMap, tap } from 'rxjs';

// models
import {
    ClusterResponse,
    CreateRatingCommand,
    CreateResponse,
    RatingReviewResponse,
    RatingReviewService,
    ReviewResponse,
    ShipperListResponse,
    ShipperMinimalListResponse,
    ShipperModalResponse,
    ShipperResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist';

// store
import { ShipperStore } from '@pages/customer/state/shipper-state/shipper.store';
import { ShipperMinimalListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.store';
import { ShipperDetailsListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';
import { ShipperDetailsStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details.store';
import { ShipperMinimalListQuery } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.query';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';
import { ShipperService as ShipperMainService } from 'appcoretruckassist';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { eGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class ShipperService {
    public shipperId: number;
    public shipperList: any;
    public currentIndex: number;

    constructor(
        // services
        private shipperService: ShipperMainService,
        private tableService: TruckassistTableService,
        private ratingReviewService: RatingReviewService,
        private formDataService: FormDataService,

        // store
        private shipperStore: ShipperStore,
        private shipperMinimalStore: ShipperMinimalListStore,
        private sListStore: ShipperDetailsListStore,
        private shipperDetailsStore: ShipperDetailsStore,
        private shipperMinimalQuery: ShipperMinimalListQuery
    ) {}

    // Create Shipper
    public addShipper(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.shipperService.apiShipperPost().pipe(
            tap((res: any) => {
                const subShipper = this.getShipperById(res.id).subscribe({
                    next: (shipper: any) => {
                        this.shipperStore.add(shipper);
                        this.shipperMinimalStore.add(shipper);
                        const brokerShipperCount = JSON.parse(
                            localStorage.getItem(
                                TableStringEnum.BROKER_SHIPPER_TABLE_COUNT
                            )
                        );

                        if (brokerShipperCount) {
                            brokerShipperCount.shipper++;

                            localStorage.setItem(
                                TableStringEnum.BROKER_SHIPPER_TABLE_COUNT,
                                JSON.stringify({
                                    broker: brokerShipperCount.broker,
                                    shipper: brokerShipperCount.shipper,
                                })
                            );
                        }

                        this.tableService.sendActionAnimation({
                            animation: eGeneralActions.ADD,
                            tab: 'shipper',
                            data: shipper,
                            id: shipper.id,
                        });

                        subShipper.unsubscribe();
                    },
                });
            })
        );
    }

    // Update Shipper
    public updateShipper(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.shipperService.apiShipperPut().pipe(
            tap(() => {
                let shipperData = {
                    ...this.shipperDetailsStore?.getValue()?.entities[data.id],
                };
                const subShipper = this.getShipperById(data.id).subscribe({
                    next: (shipper: any) => {
                        this.shipperStore.remove(({ id }) => id === data.id);
                        this.shipperMinimalStore.remove(
                            ({ id }) => id === data.id
                        );

                        shipper.loadStops = shipperData.loadStops;

                        this.shipperStore.add(shipper);
                        this.shipperMinimalStore.add(shipper);
                        this.sListStore.update(shipper.id, shipper);
                        this.tableService.sendActionAnimation({
                            animation: eGeneralActions.UPDATE,
                            tab: 'shipper',
                            data: shipper,
                            id: shipper.id,
                        });

                        subShipper.unsubscribe();
                    },
                });
            })
        );
    }

    //Get Shipper Minimal List
    public getShipperMinimalList(
        pageIndex?: number,
        pageSize?: number,
        count?: number
    ): Observable<ShipperMinimalListResponse> {
        return this.shipperService.apiShipperListMinimalGet(
            pageIndex,
            pageSize,
            count
        );
    }

    // Get Shipper List
    public getShippersList(
        stateIds?: Array<number>,
        long?: number,
        lat?: number,
        distance?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<ShipperListResponse> {
        return this.shipperService.apiShipperListGet(
            stateIds,
            long,
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

    // Get Shipper By Id
    public getShipperById(
        shipperId: number,
        getIndex?: boolean
    ): Observable<any> {
        this.shipperMinimalQuery
            .selectAll()
            .subscribe((item) => (this.shipperList = item));
        if (getIndex) {
            this.currentIndex = this.shipperList.findIndex(
                (shipper) => shipper.id === shipperId
            );
            let last = this.shipperList.at(-1);
            if (last.id === shipperId) {
                this.currentIndex = --this.currentIndex;
            } else {
                this.currentIndex = ++this.currentIndex;
            }
            if (this.currentIndex == -1) {
                this.currentIndex = 0;
            }
            this.shipperId = this.shipperList[this.currentIndex].id;
        }
        return this.shipperService.apiShipperIdGet(shipperId);
    }

    // Delete Shipper List
    public deleteShipperList(ids: number[]): Observable<void> {
        return this.shipperService.apiShipperListDelete(ids).pipe(
            tap(() => {
                const storeShippers = this.shipperMinimalQuery.getAll();

                storeShippers.map((shipper: any) => {
                    ids.map((d) => {
                        if (d === shipper.id) {
                            this.shipperStore.remove(
                                ({ id }) => id === shipper.id
                            );
                        }
                    });
                });

                const brokerShipperCount = JSON.parse(
                    localStorage.getItem(
                        TableStringEnum.BROKER_SHIPPER_TABLE_COUNT
                    )
                );

                localStorage.setItem(
                    TableStringEnum.BROKER_SHIPPER_TABLE_COUNT,
                    JSON.stringify({
                        broker: brokerShipperCount.broker,
                        shipper: brokerShipperCount.shipper - ids.length,
                    })
                );
            })
        );
    }

    // Delete Shipper By Id
    public deleteShipperByIdDetails(shipperId: number): Observable<any> {
        return this.shipperService.apiShipperIdDelete(shipperId).pipe(
            tap(() => {
                this.shipperStore.remove(({ id }) => id === shipperId);
                this.shipperMinimalStore.remove(({ id }) => id === shipperId);
                this.sListStore.remove(({ id }) => id === shipperId);
                const brokerShipperCount = JSON.parse(
                    localStorage.getItem(
                        TableStringEnum.BROKER_SHIPPER_TABLE_COUNT
                    )
                );

                brokerShipperCount.shipper--;

                localStorage.setItem(
                    TableStringEnum.BROKER_SHIPPER_TABLE_COUNT,
                    JSON.stringify({
                        broker: brokerShipperCount.broker,
                        shipper: brokerShipperCount.shipper,
                    })
                );
                const subShipper = this.getShipperById(
                    this.shipperId,
                    true
                ).subscribe({
                    next: (shipper: any) => {
                        this.tableService.sendActionAnimation({
                            animation: eGeneralActions.DELETE_LOWERCASE,
                            tab: 'shipper',
                            data: shipper,
                            id: shipper.id,
                        });

                        subShipper.unsubscribe();
                    },
                });
            })
        );
    }

    // Delete Shipper By Id
    public deleteShipperById(shipperId: number): Observable<any> {
        return this.shipperService.apiShipperIdDelete(shipperId).pipe(
            tap(() => {
                this.shipperStore.remove(({ id }) => id === shipperId);
                this.shipperMinimalStore.remove(({ id }) => id === shipperId);
                this.sListStore.remove(({ id }) => id === shipperId);
                const brokerShipperCount = JSON.parse(
                    localStorage.getItem(
                        TableStringEnum.BROKER_SHIPPER_TABLE_COUNT
                    )
                );

                brokerShipperCount.shipper--;

                localStorage.setItem(
                    TableStringEnum.BROKER_SHIPPER_TABLE_COUNT,
                    JSON.stringify({
                        broker: brokerShipperCount.broker,
                        shipper: brokerShipperCount.shipper,
                    })
                );
            })
        );
    }

    // Delete Shipper Contact By Id
    public deleteShipperContactById(
        shipperId: number,
        contactId: number
    ): Observable<any> {
        return this.shipperService.apiShipperContactIdDelete(contactId).pipe(
            tap(() => {
                const shipperData = {
                    ...this.shipperDetailsStore?.getValue()?.entities[
                        shipperId
                    ],
                };
                const subShipper = this.getShipperById(shipperId).subscribe({
                    next: (shipper) => {
                        this.shipperStore.remove(({ id }) => id === shipperId);
                        this.shipperMinimalStore.remove(
                            ({ id }) => id === shipperId
                        );

                        shipper.loadStops = shipperData.loadStops;

                        this.shipperStore.add(shipper);
                        this.shipperMinimalStore.add(shipper);
                        this.sListStore.update(shipper.id, shipper);
                        this.tableService.sendActionAnimation({
                            animation: TableStringEnum.UPDATE,
                            tab: TableStringEnum.SHIPPER,
                            data: shipper,
                            id: shipper.id,
                        });

                        subShipper.unsubscribe();
                    },
                });
            })
        );
    }

    public getShipperDropdowns(): Observable<ShipperModalResponse> {
        return this.shipperService.apiShipperModalGet();
    }

    public getShipperMap(): Observable<any> {
        return this.shipperService.apiShipperMapGet();
    }

    public getShipperClusters(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        zoomLevel?: number,
        addedNew?: boolean,
        shipperLong?: number,
        shipperLat?: number,
        shipperDistance?: number,
        shipperStates?: Array<string>,
        categoryIds?: Array<number>,
        _long?: number,
        lat?: number,
        distance?: number,
        costFrom?: number,
        costTo?: number,
        lastFrom?: number,
        lastTo?: number,
        ppgFrom?: number,
        ppgTo?: number,
        selectedId?: number,
        active?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<Array<ClusterResponse>> {
        return this.shipperService.apiShipperClustersGet(
            northEastLatitude,
            northEastLongitude,
            southWestLatitude,
            southWestLongitude,
            zoomLevel,
            addedNew,
            shipperLong,
            shipperLat,
            shipperDistance,
            shipperStates,
            categoryIds,
            _long,
            lat,
            distance,
            costFrom,
            costTo,
            lastFrom,
            lastTo,
            ppgFrom,
            ppgTo,
            selectedId,
            active,
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

    public getShipperMapList(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        shipperLong?: number,
        shipperLat?: number,
        shipperDistance?: number,
        shipperStates?: Array<string>,
        selectedId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        return this.shipperService.apiShipperListmapGet(
            northEastLatitude,
            northEastLongitude,
            southWestLatitude,
            southWestLongitude,
            shipperLong,
            shipperLat,
            shipperDistance,
            shipperStates,
            selectedId,
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

    //  <--------------------------------- Review ---------------------------------->

    public createReview(
        review: CreateRatingCommand
    ): Observable<CreateResponse> {
        return this.ratingReviewService.apiRatingreviewReviewPost(review);
    }

    public deleteReviewById(id: number): Observable<any> {
        return this.ratingReviewService.apiRatingreviewReviewIdDelete(id);
    }

    public updateReview(review: UpdateReviewCommand): Observable<any> {
        return this.ratingReviewService.apiRatingreviewReviewPut(review);
    }

    public getShipperLoads(
        loadType?: number,
        statusType?: number,
        status?: Array<number>,
        dispatcherIds?: Array<number>,
        dispatcherId?: number,
        dispatchId?: number,
        brokerId?: number,
        shipperId?: number,
        loadId?: number,
        loadIds?: Array<number>,
        dateFrom?: string,
        dateTo?: string,
        revenueFrom?: number,
        revenueTo?: number,
        truckId?: number,
        driverId?: number,
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
    ) {
        return this.shipperService.apiShipperLoadsGet(
            loadType,
            statusType,
            status,
            dispatcherIds,
            dispatcherId,
            dispatchId,
            brokerId,
            shipperId,
            loadId,
            loadIds,
            dateFrom,
            dateTo,
            revenueFrom,
            revenueTo,
            truckId,
            driverId,
            rateFrom,
            rateTo,
            paidFrom,
            paidTo,
            dueFrom,
            dueTo
            // pickup,
            // delivery,
            // longitude,
            // latitude,
            // distance,
            // pageIndex,
            // pageSize,
            // companyId,
            // sort,
            // null,
            // null,
            // search,
            // search1,
            // search2
        );
    }

    public deleteReview(reviewId: number, shipperId: number): void {
        const shipperData = {
            ...this.shipperDetailsStore?.getValue()?.entities[shipperId],
        };

        const filteredRatingReviews = shipperData.ratingReviews?.filter(
            (review: RatingReviewResponse) =>
                !(review.reviewId === reviewId || review.ratingId === reviewId)
        );

        shipperData.ratingReviews = filteredRatingReviews;

        this.shipperStore.update(shipperId, {
            ratingReviews: shipperData.ratingReviews,
        });

        this.shipperDetailsStore.update(shipperId, {
            ratingReviews: shipperData.ratingReviews,
        });

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.UPDATE,
            tab: TableStringEnum.SHIPPER,
            data: shipperData,
            id: shipperId,
        });
    }

    public updatedReviewNew(data, currentId) {
        let shipperData = JSON.parse(
            JSON.stringify(
                this.shipperDetailsStore?.getValue()?.entities[currentId]
            )
        );

        shipperData?.reviews.map((item: any) => {
            if (item.id == data.id) {
                item.comment = data.comment;
            }
        });

        this.shipperStore.update(shipperData.id, {
            reviews: shipperData.reviews,
        });
        this.shipperDetailsStore.update(shipperData.id, {
            reviews: shipperData.reviews,
        });

        this.tableService.sendActionAnimation({
            animation: eGeneralActions.UPDATE,
            tab: 'shipper',
            data: shipperData,
            id: shipperData.id,
        });
    }

    public addNewReview(review: ReviewResponse, shipperId: number): void {
        this.getShipperById(shipperId).subscribe((shipper) => {
            const reviewedShipper = {
                ...shipper,
                ratingReviews: [...(shipper.ratingReviews || []), review],
            };

            this.shipperStore.update(shipperId, {
                ratingReviews: reviewedShipper.ratingReviews,
            });

            this.shipperDetailsStore.update(shipperId, {
                ratingReviews: reviewedShipper.ratingReviews,
            });

            this.tableService.sendActionAnimation({
                animation: TableStringEnum.UPDATE,
                tab: TableStringEnum.BROKER,
                data: reviewedShipper,
                id: shipperId,
            });
        });
    }

    public getShipperChart(id: number, chartType: number) {
        return this.shipperService.apiShipperAveragewaitingtimeGet(
            id,
            chartType
        );
    }

    public changeShipperStatus(id: number): Observable<ShipperResponse> {
        return this.shipperService.apiShipperStatusIdPut(id).pipe(
            switchMap(() => this.getShipperById(id)),
            tap((shipper) => {
                const shipperId = id;
                const shipperData = {
                    ...this.shipperDetailsStore?.getValue()?.entities[
                        shipperId
                    ],
                };

                this.shipperStore.remove(({ id }) => id === shipperId);
                this.shipperMinimalStore.remove(({ id }) => id === shipperId);

                shipper.loadStops = shipperData.loadStops;

                this.shipperStore.add(shipper);
                this.shipperMinimalStore.add(shipper);
                this.sListStore.update(shipper.id, shipper);
                this.tableService.sendActionAnimation({
                    animation: eGeneralActions.UPDATE,
                    tab: 'shipper',
                    data: shipper,
                    id: shipper.id,
                });
            })
        );
    }

    public changeShipperListStatus(shipperIds: number[]): Observable<any> {
        return this.shipperService
            .apiShipperStatusListPut({ ids: shipperIds })
            .pipe(
                tap(() => {
                    this.getShippersList().subscribe({
                        next: (shippersList) => {
                            shippersList.pagination.data.map((shipper) => {
                                const shipperId = shipper.id;
                                const shipperData = {
                                    ...this.shipperDetailsStore?.getValue()
                                        ?.entities[shipperId],
                                };
                                const newShipperData = {
                                    ...shipper,
                                    loadStops: shipperData.loadStops,
                                };

                                this.shipperStore.remove(
                                    ({ id }) => id === shipperId
                                );
                                this.shipperMinimalStore.remove(
                                    ({ id }) => id === shipperId
                                );

                                this.shipperStore.add(newShipperData);
                                this.shipperMinimalStore.add(newShipperData);
                                this.sListStore.update(
                                    newShipperData.id,
                                    newShipperData
                                );
                            });

                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.UPDATE_MULTIPLE,
                                tab: TableStringEnum.SHIPPER,
                                data: shippersList?.pagination?.data?.[0],
                                id: shippersList?.pagination?.data?.[0]?.id,
                            });
                        },
                    });
                })
            );
    }
}
