import { ShipperMinimalListStore } from './shipper-details-state/shipper-minimal-list-state/shipper-minimal.store';
import { ShipperService } from './../../../../../../../appcoretruckassist/api/shipper.service';
import { Injectable, OnDestroy } from '@angular/core';
import {
    CreateRatingCommand,
    CreateResponse,
    CreateShipperCommand,
    RatingReviewService,
    ShipperListResponse,
    ShipperMinimalListResponse,
    ShipperModalResponse,
    ShipperResponse,
    UpdateReviewCommand,
    UpdateShipperCommand,
    ClusterResponse,
} from 'appcoretruckassist';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { ShipperStore } from './shipper.store';
import { TruckassistTableService } from '../../../../services/truckassist-table/truckassist-table.service';
import { ShipperMinimalListQuery } from './shipper-details-state/shipper-minimal-list-state/shipper-minimal.query';
import { ShipperDetailsListStore } from './shipper-details-state/shipper-details-list-state/shipper-details-list.store';
import { GetRepairShopClustersQuery } from 'appcoretruckassist/model/getRepairShopClustersQuery';

@Injectable({
    providedIn: 'root',
})
export class ShipperTService implements OnDestroy {
    public shipperId: number;
    public shipperList: any;
    public currentIndex: number;
    private destroy$ = new Subject<void>();
    constructor(
        private shipperService: ShipperService,
        private tableService: TruckassistTableService,
        private ratingReviewService: RatingReviewService,
        private shipperStore: ShipperStore,
        private shipperMinimalStore: ShipperMinimalListStore,
        private shipperMinimalQuery: ShipperMinimalListQuery,
        private sListStore: ShipperDetailsListStore
    ) {}

    // Create Shipper
    public addShipper(data: CreateShipperCommand): Observable<CreateResponse> {
        return this.shipperService.apiShipperPost(data).pipe(
            tap((res: any) => {
                const subShipper = this.getShipperById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shipper: ShipperResponse | any) => {
                            this.shipperStore.add(shipper);
                            this.shipperMinimalStore.add(shipper);
                            const brokerShipperCount = JSON.parse(
                                localStorage.getItem('brokerShipperTableCount')
                            );

                            brokerShipperCount.shipper++;

                            localStorage.setItem(
                                'brokerShipperTableCount',
                                JSON.stringify({
                                    broker: brokerShipperCount.broker,
                                    shipper: brokerShipperCount.shipper,
                                })
                            );

                            this.tableService.sendActionAnimation({
                                animation: 'add',
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
    public updateShipper(data: UpdateShipperCommand): Observable<any> {
        return this.shipperService.apiShipperPut(data).pipe(
            tap(() => {
                const subShipper = this.getShipperById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shipper: ShipperResponse | any) => {
                            this.shipperStore.remove(
                                ({ id }) => id === data.id
                            );
                            this.shipperMinimalStore.remove(
                                ({ id }) => id === data.id
                            );
                            this.shipperStore.add(shipper);
                            this.shipperMinimalStore.add(shipper);
                            this.sListStore.update(shipper.id, shipper);
                            this.tableService.sendActionAnimation({
                                animation: 'update',
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
        ban?: number,
        dnu?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<ShipperListResponse> {
        return this.shipperService.apiShipperListGet(
            ban,
            dnu,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // Get Shipper By Id
    public getShipperById(
        shipperId: number,
        getIndex?: boolean
    ): Observable<ShipperResponse> {
        this.shipperMinimalQuery
            .selectAll()
            .pipe(takeUntil(this.destroy$))
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
    public deleteShipperList(shippersToDelete: any[]): Observable<any> {
        // let deleteOnBack = shippersToDelete.map((shipper: any) => {
        //   return shipper.id;
        // });

        // return this.shipperService.apiShipperListDelete({ ids: deleteOnBack }).pipe(
        //   tap(() => {
        //     let storeShippers = this.shipperQuery.getAll();

        //     storeShippers.map((shipper: any) => {
        //       deleteOnBack.map((d) => {
        //         if (d === shipper.id) {
        //           this.shipperStore.remove(({ id }) => id === shipper.id);
        //         }
        //       });
        //     });
        //   })
        // );
        return of(null);
    }

    // Delete Shipper By Id
    public deleteShipperByIdDetails(shipperId: number): Observable<any> {
        return this.shipperService.apiShipperIdDelete(shipperId).pipe(
            tap(() => {
                this.shipperStore.remove(({ id }) => id === shipperId);
                this.shipperMinimalStore.remove(({ id }) => id === shipperId);
                this.sListStore.remove(({ id }) => id === shipperId);
                const brokerShipperCount = JSON.parse(
                    localStorage.getItem('brokerShipperTableCount')
                );

                brokerShipperCount.shipper--;

                localStorage.setItem(
                    'brokerShipperTableCount',
                    JSON.stringify({
                        broker: brokerShipperCount.broker,
                        shipper: brokerShipperCount.shipper,
                    })
                );
                const subShipper = this.getShipperById(this.shipperId, true)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shipper: ShipperResponse | any) => {
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
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
                    localStorage.getItem('brokerShipperTableCount')
                );

                brokerShipperCount.shipper--;

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
    public changeBanStatus(id: number): Observable<any> {
        return this.shipperService.apiShipperBanIdPut(id, 'response');
    }

    // Change Dnu Status
    public changeDnuStatus(id: number): Observable<any> {
        return this.shipperService.apiShipperDnuIdPut(id, 'response');
    }

    public getShipperDropdowns(): Observable<ShipperModalResponse> {
        return this.shipperService.apiShipperModalGet();
    }

    public getShipperMap(): Observable<any> {
        return this.shipperService.apiShipperMapGet();
    }

    public getShipperClusters(
        clustersQuery: GetRepairShopClustersQuery
    ): Observable<Array<ClusterResponse>> {
        return this.shipperService.apiShipperClustersGet(
            clustersQuery.northEastLatitude,
            clustersQuery.northEastLongitude,
            clustersQuery.southWestLatitude,
            clustersQuery.southWestLongitude,
            clustersQuery.zoomLevel
        );
    }

    public getShipperMapList(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        ban?: number,
        dnu?: number,
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
            ban,
            dnu,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    //  <--------------------------------- Review ---------------------------------->

    public createReview(
        review: CreateRatingCommand
    ): Observable<CreateResponse> {
        return this.ratingReviewService.apiRatingReviewReviewPost(review);
    }

    public deleteReviewById(id: number): Observable<any> {
        return this.ratingReviewService.apiRatingReviewReviewIdDelete(id);
    }

    public updateReview(review: UpdateReviewCommand): Observable<any> {
        return this.ratingReviewService.apiRatingReviewReviewPut(review);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
