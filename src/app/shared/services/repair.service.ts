import { Injectable } from '@angular/core';

import { Observable, switchMap, tap } from 'rxjs';

// models
import {
    CreateResponse,
    RepairResponse,
    RepairShopModalResponse,
    RepairListResponse,
    ClusterResponse,
    RepairShopNewListResponse,
    RepairDriverResponse,
    RepairModalResponse,
    RepairShopMinimalListResponse,
    RepairShopResponse,
    RepairShopService,
    SortOrder,
    RepairedVehicleListResponse,
    ReviewResponse,
    RepairShopExpensesResponse,
    RatingReviewResponse,
    RepairShopListResponse,
    CreateWithUploadsResponse,
} from 'appcoretruckassist';

// store
import { RepairTruckStore } from '@pages/repair/state/repair-truck-state/repair-truck.store';
import { RepairTrailerStore } from '@pages/repair/state/repair-trailer-state/repair-trailer.store';
import { RepairShopStore } from '@pages/repair/state/repair-shop-state/repair-shop.store';
import { RepairDetailsStore } from '@pages/repair/state/repair-details-state/repair-details.store';
import { RepairItemStore } from '@pages/repair/state/repair-details-item-state/repair-details-item.store';
import { RepairMinimalListStore } from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.store';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// services
import { RepairService as RepairMainService } from 'appcoretruckassist/api/repair.service';
import { FormDataService } from '@shared/services/form-data.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { CreateShopModel } from '@pages/repair/pages/repair-modals/repair-shop-modal/models';
import { AddUpdateRepairProperties } from '@pages/repair/pages/repair-modals/repair-order-modal/models';

@Injectable({
    providedIn: 'root',
})
export class RepairService {
    constructor(
        // services
        private repairService: RepairMainService,
        private repairShopService: RepairShopService,
        private tableService: TruckassistTableService,
        private formDataService: FormDataService,

        // store
        private repairTruckStore: RepairTruckStore,
        private repairTrailerStore: RepairTrailerStore,
        private repairShopStore: RepairShopStore,
        private repairDetailsStore: RepairDetailsStore,
        private repairItemStore: RepairItemStore,
        private repairMinimalListStore: RepairMinimalListStore
    ) {}

    /* Repair Actions */

    public getRepairList(
        repairShopId?: number,
        unitType?: number,
        dateFrom?: string,
        dateTo?: string,
        isPM?: number,
        categoryIds?: number[],
        pmTruckTitles?: string[],
        pmTrailerTitles?: string[],
        isOrder?: boolean,
        truckNumbers?: string[],
        trailerNumbers?: string[],
        costFrom?: number,
        costTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: any,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<RepairListResponse> {
        return this.repairService.apiRepairListGet(
            repairShopId,
            unitType,
            dateFrom,
            dateTo,
            isPM,
            categoryIds,
            pmTruckTitles,
            pmTrailerTitles,
            isOrder,
            truckNumbers,
            trailerNumbers,
            costFrom,
            costTo,
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

    public getRepairDriversList(
        truckId: number,
        trailerId: number,
        repairDate: string
    ): Observable<RepairDriverResponse[]> {
        return this.repairService.apiRepairDriversGet(
            truckId,
            trailerId,
            repairDate
        );
    }

    public getRepairModalDropdowns(
        truckId: number,
        trailerId: number
    ): Observable<RepairModalResponse> {
        return this.repairService.apiRepairModalGet(truckId, trailerId);
    }

    public getRepairById(repairId: number): Observable<RepairResponse> {
        return this.repairService.apiRepairIdGet(repairId);
    }

    public addRepair(
        repair: AddUpdateRepairProperties
    ): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(repair);

        return this.repairService.apiRepairPost().pipe(
            tap((res) => {
                this.getRepairById(res.id).subscribe({
                    next: (repair: RepairResponse) => {
                        const repairCount = JSON.parse(
                            localStorage.getItem('repairTruckTrailerTableCount')
                        );

                        if (repair.truckId) {
                            this.repairTruckStore.add(repair);

                            repairCount.repairTrucks++;
                        } else if (repair.trailerId) {
                            this.repairTrailerStore.add(repair);

                            repairCount.repairTrailers++;
                        }

                        localStorage.setItem(
                            'repairTruckTrailerTableCount',
                            JSON.stringify({
                                repairShops: repairCount.repairShops,
                                repairTrucks: repairCount.repairTrucks,
                                repairTrailers: repairCount.repairTrailers,
                            })
                        );

                        this.tableService.sendActionAnimation({
                            animation: 'add',
                            tab: repair?.truckId ? 'active' : 'inactive',
                            data: repair,
                            id: repair.id,
                        });
                    },
                });
            })
        );
    }

    public updateRepair(
        repair: AddUpdateRepairProperties
    ): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(repair);

        return this.repairService.apiRepairPut().pipe(
            tap(() => {
                this.getRepairById(repair.id).subscribe({
                    next: (repair: RepairResponse) => {
                        if (repair.truckId) {
                            this.repairTruckStore.remove(
                                ({ id }) => id === repair.id
                            );

                            this.repairTruckStore.add(repair);
                        } else if (repair.trailerId) {
                            this.repairTrailerStore.remove(
                                ({ id }) => id === repair.id
                            );

                            this.repairTrailerStore.add(repair);
                        }

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            tab: repair?.truckId ? 'active' : 'inactive',
                            id: repair.id,
                            data: repair,
                        });
                    },
                });
            })
        );
    }

    public deleteRepair(
        repairId: number,
        tabSelected?: string
    ): Observable<object> {
        return this.repairService.apiRepairIdDelete(repairId).pipe(
            tap(() => {
                const repairCount = JSON.parse(
                    localStorage.getItem('repairTruckTrailerTableCount')
                );

                if (tabSelected === 'active') {
                    this.repairTruckStore.remove(({ id }) => id === repairId);

                    repairCount.repairTrucks--;
                } else if (tabSelected === 'inactive') {
                    this.repairTrailerStore.remove(({ id }) => id === repairId);

                    repairCount.repairTrailers--;
                }

                localStorage.setItem(
                    'repairTruckTrailerTableCount',
                    JSON.stringify({
                        repairTrucks: repairCount.repairTrucks,
                        repairTrailers: repairCount.repairTrailers,
                        repairShops: repairCount.repairShops,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    tab: tabSelected,
                    id: repairId,
                });
            })
        );
    }

    public deleteRepairList(
        repairIds: number[],
        tabSelected?: string
    ): Observable<any> {
        return this.repairService.apiRepairListDelete(repairIds).pipe(
            tap(() => {
                const repairCount = JSON.parse(
                    localStorage.getItem('repairTruckTrailerTableCount')
                );

                repairIds.forEach((repairId) => {
                    if (tabSelected === 'active') {
                        this.repairTruckStore.remove(
                            ({ id }) => id === repairId
                        );

                        repairCount.repairTrucks--;
                    } else if (tabSelected === 'inactive') {
                        this.repairTrailerStore.remove(
                            ({ id }) => id === repairId
                        );

                        repairCount.repairTrailers--;
                    }

                    localStorage.setItem(
                        'repairTruckTrailerTableCount',
                        JSON.stringify({
                            repairTrucks: repairCount.repairTrucks,
                            repairTrailers: repairCount.repairTrailers,
                            repairShops: repairCount.repairShops,
                        })
                    );
                });
            })
        );
    }

    /* Repair Shop Actions */

    public getRepairShopList(
        active: number = null,
        pinned: boolean = null,
        companyOwned: boolean = null,
        isCompanyRelated: boolean = null,
        categoryIds: number[] = null,
        _long: number = null,
        lat: number = null,
        distance: number = null,
        areaLocations: string = '',
        areaDistance: number = 250,
        costFrom: number = null,
        costTo: number = null,
        visitedByMe: boolean = null,
        driverId: number = null,
        pageIndex: number = 1,
        pageSize: number = 25,
        companyId: number = null,
        sort: string = null,
        sortOrder: SortOrder = null,
        sortBy: object = null,
        search: string = null,
        search1: string = null,
        search2: string = null
    ): Observable<RepairShopNewListResponse> {
        return this.repairShopService.apiRepairshopListGet(
            active,
            pinned,
            companyOwned,
            isCompanyRelated,
            categoryIds,
            _long,
            lat,
            distance,
            areaLocations,
            areaDistance,
            costFrom,
            costTo,
            visitedByMe,
            driverId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            sortOrder,
            sortBy,
            search,
            search1,
            search2
        );
    }

    public getRepairShopMinimalList(
        pageIndex?: number,
        pageSize?: number,
        companyId?: number
    ): Observable<RepairShopMinimalListResponse> {
        return this.repairShopService.apiRepairshopListMinimalGet(
            pageIndex,
            pageSize,
            companyId
        );
    }

    public getRepairShopModalDropdowns(): Observable<RepairShopModalResponse> {
        return this.repairShopService.apiRepairshopModalGet();
    }

    public getRepairShopById(
        repairShopId: number
    ): Observable<RepairShopResponse> {
        return this.repairShopService.apiRepairshopIdGet(repairShopId);
    }

    public getRepairShopClusters(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        zoomLevel?: number,
        addedNew?: boolean,
        shipperLong?: number,
        shipperLat?: number,
        shipperDistance?: number,
        shipperStates?: string[],
        categoryIds?: number[],
        _long?: number,
        lat?: number,
        distance?: number,
        costFrom?: number,
        costTo?: number,
        lastFrom?: number,
        lastTo?: number,
        ppgFrom?: number,
        ppgTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<Array<ClusterResponse>> {
        return this.repairShopService.apiRepairshopClustersGet(
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

    public getRepairShopMapList(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        categoryIds?: number[],
        _long?: number,
        lat?: number,
        distance?: number,
        costFrom?: number,
        costTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<RepairShopListResponse> {
        return this.repairShopService.apiRepairshopListmapGet(
            northEastLatitude,
            northEastLongitude,
            southWestLatitude,
            southWestLongitude,
            categoryIds,
            _long,
            lat,
            distance,
            costFrom,
            costTo,
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

    public getRepairShopChart(
        id: number,
        chartType: number
    ): Observable<RepairShopExpensesResponse> {
        return this.repairShopService.apiRepairshopExpensesGet(id, chartType);
    }

    public getRepairShopRepairedVehicle(
        repairShopId?: number,
        pageIndex?: number,
        pageSize?: number
    ): Observable<RepairedVehicleListResponse> {
        return this.repairShopService.apiRepairshopRepairedvehicleGet(
            repairShopId,
            pageIndex,
            pageSize
        );
    }

    public addRepairShop(
        repairShop: RepairShopResponse | any
    ): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(repairShop);

        return this.repairShopService.apiRepairshopPost(repairShop).pipe(
            tap((res) => {
                this.getRepairShopById(res.id).subscribe({
                    next: (shop: RepairShopResponse) => {
                        const repairCount = JSON.parse(
                            localStorage.getItem('repairTruckTrailerTableCount')
                        );

                        this.repairShopStore.add(shop);
                        if (repairCount) {
                            repairCount.repairShops++;

                            localStorage.setItem(
                                'repairTruckTrailerTableCount',
                                JSON.stringify({
                                    repairTrucks: repairCount.repairTrucks,
                                    repairTrailers: repairCount.repairTrailers,
                                    repairShops: repairCount.repairShops,
                                })
                            );
                        }

                        this.tableService.sendActionAnimation({
                            animation: 'add',
                            tab: 'repair-shop',
                            data: shop,
                            id: shop.id,
                        });
                    },
                });
            })
        );
    }

    public updateRepairShop(
        repairShop: CreateShopModel
    ): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(repairShop);

        return this.repairShopService.apiRepairshopPut().pipe(
            tap(() => {
                this.getRepairShopById(repairShop.id).subscribe({
                    next: (shop: RepairShopResponse) => {
                        this.repairShopStore.remove(
                            ({ id }) => id === repairShop.id
                        );
                        this.repairShopStore.add(shop);

                        // this.repairDetailsStore.update((store) => {
                        //     let ind;
                        //     let minimalListIndex;
                        //     let shopStored = JSON.parse(
                        //         JSON.stringify(store)
                        //     );

                        //     shopStored?.repairShop.map(
                        //         (data: any, index: any) => {
                        //             if (data.id == shop.id) {
                        //                 ind = index;
                        //             }
                        //         }
                        //     );

                        //     shopStored?.repairShopMinimal?.pagination?.data.map(
                        //         (data: any, index: any) => {
                        //             if (data.id == shop.id) {
                        //                 minimalListIndex = index;
                        //                 store.repairShopMinimal.pagination.data[
                        //                     index
                        //                 ]['name'] = shop.name;
                        //                 store.repairShopMinimal.pagination.data[
                        //                     index
                        //                 ]['pinned'] = shop.pinned;
                        //                 store.repairShopMinimal.pagination.data[
                        //                     index
                        //                 ]['status'] = shop.status;
                        //             }
                        //         }
                        //     );

                        //     shopStored.repairShop[ind] = shop;

                        //     return {
                        //         ...store,
                        //         repairShop: [...shopStored.repairShop],
                        //     };
                        // });

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            tab: 'repair-shop',
                            data: shop,
                            id: shop.id,
                        });
                    },
                });
            })
        );
    }

    public deleteRepairShop(repairShopId: number): Observable<any> {
        return this.repairShopService.apiRepairshopIdDelete(repairShopId).pipe(
            tap(() => {
                this.handleRepairShopDeleteStores(repairShopId);

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    tab: 'repair-shop',
                    id: repairShopId,
                });
            })
        );
    }

    public deleteRepairShopList(repairShopIds: number[]): Observable<any> {
        return this.repairShopService
            .apiRepairshopListDelete(repairShopIds)
            .pipe(
                tap(() =>
                    repairShopIds.forEach((repairShopId) => {
                        this.handleRepairShopDeleteStores(repairShopId);
                    })
                )
            );
    }

    public updateRepairShopFavorite(
        repairShopId: number
    ): Observable<RepairShopResponse> {
        return this.repairShopService
            .apiRepairshopPinnedIdPut(repairShopId)
            .pipe(
                switchMap(() => this.getRepairShopById(repairShopId)),
                tap((repairShop) =>
                    this.handleRepairShopUpdateStores(repairShop)
                )
            );
    }

    public updateRepairShopStatus(
        repairShopId: number
    ): Observable<RepairShopResponse> {
        return this.repairShopService
            .apiRepairshopStatusIdPut(repairShopId)
            .pipe(
                switchMap(() => this.getRepairShopById(repairShopId)),
                tap((repairShop) =>
                    this.handleRepairShopUpdateStores(repairShop)
                )
            );
    }

    public addNewReview(review: ReviewResponse, repairShopId: number): void {
        this.getRepairShopById(repairShopId).subscribe((repairShop) => {
            const reviewedRepairShop = {
                ...repairShop,
                ratingReviews: [...(repairShop.ratingReviews || []), review],
            };

            this.handleRepairShopUpdateStores(reviewedRepairShop);

            this.tableService.sendActionAnimation({
                animation: TableStringEnum.UPDATE,
                tab: TableStringEnum.REPAIR_SHOP,
                data: reviewedRepairShop,
                id: repairShopId,
            });
        });
    }

    public deleteReview(reviewId: number, repairShopId: number): void {
        const repariShopData = {
            ...this.repairDetailsStore?.getValue()?.entities[repairShopId],
        };

        const filteredRatingReviews = repariShopData.ratingReviews?.filter(
            (review: RatingReviewResponse) =>
                !(review.reviewId === reviewId || review.ratingId === reviewId)
        );

        repariShopData.ratingReviews = filteredRatingReviews;

        this.handleRepairShopUpdateStores(repariShopData);

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.UPDATE,
            tab: TableStringEnum.REPAIR_SHOP,
            data: repariShopData,
            id: repairShopId,
        });
    }

    /* Store Actions */

    private handleRepairShopUpdateStores(repairShop: RepairShopResponse): void {
        const { id: repairShopId, pinned, status, ratingReviews } = repairShop;

        this.repairMinimalListStore.update(repairShopId, (entity) => ({
            ...entity,
            pinned,
            status,
        }));

        this.repairDetailsStore.update(repairShopId, (entity) => ({
            ...entity,
            pinned,
            status,
            ratingReviews,
        }));

        this.repairItemStore.update(repairShopId, (entity) => ({
            ...entity,
            pinned,
            status,
            ratingReviews,
        }));

        this.repairShopStore.update(({ id }) => id === repairShopId, {
            pinned,
            status,
            ratingReviews,
        });
    }

    private handleRepairShopDeleteStores(repairShopId: number): void {
        const repairCount = JSON.parse(
            localStorage.getItem('repairTruckTrailerTableCount')
        );

        this.repairDetailsStore.remove(({ id }) => id === repairShopId);
        this.repairItemStore.remove(({ id }) => id === repairShopId);
        this.repairShopStore.remove(({ id }) => id === repairShopId);
        this.repairMinimalListStore.remove(({ id }) => id === repairShopId);

        repairCount.repairShops--;

        localStorage.setItem(
            'repairTruckTrailerTableCount',
            JSON.stringify({
                repairTrucks: repairCount.repairTrucks,
                repairTrailers: repairCount.repairTrailers,
                repairShops: repairCount.repairShops,
            })
        );
    }
}
