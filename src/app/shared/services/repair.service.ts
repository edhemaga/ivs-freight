import { Injectable } from '@angular/core';

import { Observable, switchMap, tap } from 'rxjs';

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

// types
import { RepairStoresType } from '@pages/repair/pages/repair-table/types';

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
import { AddUpdateRepairProperties } from '@pages/repair/pages/repair-modals/repair-order-modal/models';
import { CreateShopModel } from '@pages/repair/pages/repair-modals/repair-shop-modal/models';

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
                            localStorage.getItem(
                                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
                            )
                        );

                        if (repair.truckId) {
                            this.repairTruckStore.add(repair);

                            repairCount.repairTrucks++;
                        } else if (repair.trailerId) {
                            this.repairTrailerStore.add(repair);

                            repairCount.repairTrailers++;
                        }

                        localStorage.setItem(
                            TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT,
                            JSON.stringify({
                                repairShops: repairCount.repairShops,
                                repairTrucks: repairCount.repairTrucks,
                                repairTrailers: repairCount.repairTrailers,
                            })
                        );

                        this.tableService.sendActionAnimation({
                            animation: 'add',
                            tab: repair?.truckId
                                ? TableStringEnum.ACTIVE
                                : TableStringEnum.INACTIVE,
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
                    next: (repair: RepairResponse) =>
                        this.handleRepairUpdateStores(repair),
                });
            })
        );
    }

    public deleteRepair(
        repairId: number,
        repairShopId: number,
        tabSelected: string
    ): Observable<object> {
        return this.repairService
            .apiRepairIdDelete(repairId)
            .pipe(
                tap(() =>
                    this.handleRepairDeleteStores(
                        repairId,
                        repairShopId,
                        tabSelected
                    )
                )
            );
    }

    public deleteRepairList(
        repairIds: number[],
        tabSelected?: string
    ): Observable<any> {
        return this.repairService.apiRepairListDelete(repairIds).pipe(
            tap(() => {
                const repairCount = JSON.parse(
                    localStorage.getItem(
                        TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
                    )
                );

                repairIds.forEach((repairId) => {
                    if (tabSelected === TableStringEnum.ACTIVE) {
                        this.repairTruckStore.remove(
                            ({ id }) => id === repairId
                        );

                        repairCount.repairTrucks--;
                    } else if (tabSelected === TableStringEnum.INACTIVE) {
                        this.repairTrailerStore.remove(
                            ({ id }) => id === repairId
                        );

                        repairCount.repairTrailers--;
                    }

                    localStorage.setItem(
                        TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT,
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

    public getRepairShopMapList(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        categoryIds?: Array<number>,
        _long?: number,
        lat?: number,
        distance?: number,
        costFrom?: number,
        costTo?: number,
        active?: number,
        states?: Array<string>,
        selectedId?: number,
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
            active,
            states,
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

        return this.repairShopService.apiRepairshopPost().pipe(
            tap((res) => {
                this.getRepairShopById(res.id).subscribe({
                    next: (shop: RepairShopResponse) => {
                        const repairCount = JSON.parse(
                            localStorage.getItem(
                                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
                            )
                        );

                        const addToStore = (store: RepairStoresType) =>
                            store.add(shop);

                        [
                            this.repairDetailsStore,
                            this.repairItemStore,
                            this.repairShopStore,
                            this.repairMinimalListStore,
                        ].forEach(addToStore);

                        if (repairCount) {
                            repairCount.repairShops++;

                            localStorage.setItem(
                                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT,
                                JSON.stringify({
                                    repairTrucks: repairCount.repairTrucks,
                                    repairTrailers: repairCount.repairTrailers,
                                    repairShops: repairCount.repairShops,
                                })
                            );

                            this.tableService.sendActionAnimation({
                                animation: TableStringEnum.ADD,
                                tab: TableStringEnum.REPAIR_SHOP,
                                data: shop,
                                id: shop.id,
                            });
                        }
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
                    next: (shop: RepairShopResponse) =>
                        this.handleRepairShopUpdateStores(shop),
                });
            })
        );
    }

    public deleteRepairShop(repairShopId: number): Observable<any> {
        return this.repairShopService
            .apiRepairshopIdDelete(repairShopId)
            .pipe(tap(() => this.handleRepairShopDeleteStores(repairShopId)));
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
        });
    }

    public deleteReview(reviewId: number, repairShopId: number): void {
        const repairShopData = {
            ...this.repairDetailsStore?.getValue()?.entities[repairShopId],
        };

        const filteredRatingReviews = repairShopData.ratingReviews?.filter(
            (review: RatingReviewResponse) =>
                !(review.reviewId === reviewId || review.ratingId === reviewId)
        );

        repairShopData.ratingReviews = filteredRatingReviews;

        this.handleRepairShopUpdateStores(repairShopData);
    }

    /* Store Actions */

    private handleRepairUpdateStores(repair: RepairResponse): void {
        if (repair.truckId) {
            this.repairTruckStore.update(repair.id, (entity) => ({
                ...entity,
                ...repair,
            }));
        } else if (repair.trailerId) {
            this.repairTrailerStore.update(repair.id, (entity) => ({
                ...entity,
                ...repair,
            }));
        }

        const updateStore = (store: RepairStoresType) =>
            store.update(repair?.repairShop?.id, (entity) => ({
                ...entity,
                repairList: entity.repairList.map((repairItem) => {
                    if (repairItem.id === repair.id) return repair;

                    return repairItem;
                }),
            }));

        updateStore(this.repairDetailsStore);
        updateStore(this.repairItemStore);

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.UPDATE,
            tab: repair?.truckId
                ? TableStringEnum.ACTIVE
                : TableStringEnum.INACTIVE,
            id: repair.id,
            data: repair,
        });
    }

    private handleRepairDeleteStores(
        repairId: number,
        repairShopId: number,
        tabSelected: string
    ): void {
        const repairCount = JSON.parse(
            localStorage.getItem(
                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
            )
        );

        if (tabSelected === TableStringEnum.ACTIVE) {
            this.repairTruckStore.remove(({ id }) => id === repairId);

            repairCount.repairTrucks--;
        } else if (tabSelected === TableStringEnum.INACTIVE) {
            this.repairTrailerStore.remove(({ id }) => id === repairId);

            repairCount.repairTrailers--;
        }

        const updateStore = (store: RepairStoresType) =>
            store.update(repairShopId, (entity) => ({
                ...entity,
                repairList: entity.repairList.filter(
                    (repair) => repair.id !== repairId
                ),
            }));

        updateStore(this.repairDetailsStore);
        updateStore(this.repairItemStore);

        localStorage.setItem(
            TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT,
            JSON.stringify({
                repairTrucks: repairCount.repairTrucks,
                repairTrailers: repairCount.repairTrailers,
                repairShops: repairCount.repairShops,
            })
        );

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.DELETE,
            id: repairId,
        });
    }

    private handleRepairShopUpdateStores(repairShop: RepairShopResponse): void {
        const { id: repairShopId, pinned, status } = repairShop;

        const updateStore = (
            store: RepairStoresType,
            updateData: RepairShopResponse
        ) =>
            store.update(repairShopId, (entity) => ({
                ...entity,
                ...updateData,
            }));

        updateStore(this.repairMinimalListStore, { pinned, status });
        updateStore(this.repairDetailsStore, repairShop);
        updateStore(this.repairItemStore, repairShop);

        this.repairShopStore.update(({ id }) => id === repairShopId, {
            ...repairShop,
        });

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.UPDATE,
            tab: TableStringEnum.REPAIR_SHOP,
            data: repairShop,
            id: repairShop.id,
        });
    }

    private handleRepairShopDeleteStores(repairShopId: number): void {
        const repairCount = JSON.parse(
            localStorage.getItem(
                TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT
            )
        );

        const removeFromStore = (store: RepairStoresType) =>
            store.remove(({ id }) => id === repairShopId);

        [
            this.repairDetailsStore,
            this.repairItemStore,
            this.repairShopStore,
            this.repairMinimalListStore,
        ].forEach(removeFromStore);

        repairCount.repairShops--;

        localStorage.setItem(
            TableStringEnum.REPAIR_TRUCK_TRAILER_TABLE_COUNT,
            JSON.stringify({
                repairTrucks: repairCount.repairTrucks,
                repairTrailers: repairCount.repairTrailers,
                repairShops: repairCount.repairShops,
            })
        );

        this.tableService.sendActionAnimation({
            animation: TableStringEnum.DELETE,
            id: repairShopId,
        });
    }
}
