import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// models
import {
    CreateResponse,
    RepairResponse,
    RepairShopModalResponse,
    RepairListResponse,
    ClusterResponse,
    RepairShopMinimalResponse,
    RepairShopNewListResponse,
    RepairDriverResponse,
    RepairAutocompleteDescriptionResponse,
    RepairModalResponse,
    RepairShopMinimalListResponse,
    RepairShopResponse,
    RepairShopService,
} from 'appcoretruckassist';

// store
import { RepairTruckStore } from '@pages/repair/state/repair-truck-state/repair-truck.store';
import { RepairTrailerStore } from '@pages/repair/state/repair-trailer-state/repair-trailer.store';
import { RepairShopStore } from '@pages/repair/state/repair-shop-state/repair-shop.store';
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';
import { RepairDetailsStore } from '@pages/repair/state/repair-details-state/repair-details.store';

// services
import { RepairService as RepairMainService } from 'appcoretruckassist/api/repair.service';
import { FormDataService } from '@shared/services/form-data.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class RepairService {
    public currentIndex: number;
    public repairShopList: any;
    public repairShopId: number;

    constructor(
        // services
        private repairService: RepairMainService,
        private shopServices: RepairShopService,
        private tableService: TruckassistTableService,
        private formDataService: FormDataService,

        // store
        private repairTruckStore: RepairTruckStore,
        private repairTrailerStore: RepairTrailerStore,
        private repairShopStore: RepairShopStore,
        private repairDetailsStore: RepairDetailsStore,
        private repairDetailsQuery: RepairDetailsQuery
    ) {}

    // <----------------------- Repair Truck And Trailer -------------------->
    public addRepair(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.repairService.apiRepairPost().pipe(
            tap((res: any) => {
                this.getRepairById(res.id).subscribe({
                    next: (repair: RepairResponse | any) => {
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

    public getDriver(
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

    public updateRepair(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.repairService.apiRepairPut().pipe(
            tap(() => {
                this.getRepairById(data.id).subscribe({
                    next: (repair: RepairResponse | any) => {
                        if (repair.truckId) {
                            this.repairTruckStore.remove(
                                ({ id }) => id === data.id
                            );
                            this.repairTruckStore.add(repair);
                        } else if (repair.trailerId) {
                            this.repairTrailerStore.remove(
                                ({ id }) => id === data.id
                            );

                            this.repairTrailerStore.add(repair);
                        }
                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            tab: repair?.truckId ? 'active' : 'inactive',
                            data: repair,
                            id: repair.id,
                        });
                    },
                });
            })
        );
    }

    // Get Repair List
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
    public getRepairById(id: number): Observable<RepairResponse> {
        return this.repairService.apiRepairIdGet(id);
    }

    public getRepairModalDropdowns(
        truckId: number,
        trailerId: number
    ): Observable<RepairModalResponse> {
        return this.repairService.apiRepairModalGet(truckId, trailerId);
    }

    public deleteRepairById(
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

    // Delete Repair List
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

    public autocompleteRepairByDescription(
        description: string
    ): Observable<RepairAutocompleteDescriptionResponse> {
        return this.repairService.apiRepairAutocompleteDescriptionDescriptionGet(
            description
        );
    }

    // <----------------------- Repair Shop -------------------->
    public addRepairShop(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.shopServices.apiRepairshopPost(data).pipe(
            tap((res: any) => {
                this.getRepairShopById(res.id).subscribe({
                    next: (shop: RepairShopResponse | any) => {
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

                            this.tableService.sendActionAnimation({
                                animation: 'add',
                                tab: 'repair-shop',
                                data: shop,
                                id: shop.id,
                            });
                        }
                    },
                });
            })
        );
    }

    public updateRepairShop(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.shopServices.apiRepairshopPut().pipe(
            tap(() => {
                this.getRepairShopById(data.id).subscribe({
                    next: (shop: RepairShopResponse | any) => {
                        this.repairShopStore.remove(({ id }) => id === data.id);
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

    // Get Repair List
    public getRepairShopList(
        active?: number,
        pinned?: boolean,
        companyOwned?: boolean,
        categoryIds?: Array<number>,
        _long?: number,
        lat?: number,
        distance?: number,
        costFrom?: number,
        costTo?: number,
        visitedByMe?: boolean,
        driverId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<RepairShopNewListResponse> {
        return this.shopServices.apiRepairshopListGet(
            active,
            pinned,
            companyOwned,
            categoryIds,
            _long,
            lat,
            distance,
            '',
            250,
            costFrom,
            costTo,
            visitedByMe,
            driverId,
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

    // Get Repair Minimal List
    public getRepairShopMinimalList(
        pageIndex?: number,
        pageSize?: number,
        count?: number
    ): Observable<RepairShopMinimalListResponse> {
        return this.shopServices.apiRepairshopListMinimalGet(
            pageIndex,
            pageSize,
            count
        );
    }

    public getRepairShopById(
        repairId: number,
        getIndex?: boolean
    ): Observable<RepairShopResponse> {
        this.repairDetailsQuery.repairShopMinimal$.subscribe(
            (item) => (this.repairShopList = item?.pagination?.data)
        );

        if (getIndex && this.repairShopList) {
            this.currentIndex = this.repairShopList.findIndex(
                (shop) => shop.id === repairId
            );
            let last = this.repairShopList.at(-1);
            if (last.id === repairId) {
                this.currentIndex = --this.currentIndex;
            } else {
                this.currentIndex = ++this.currentIndex;
            }
            if (this.currentIndex == -1) {
                this.currentIndex = 0;
            }

            this.repairShopId = this.repairShopList[this.currentIndex].id;
        }
        return this.shopServices.apiRepairshopIdGet(repairId);
    }

    public deleteRepairShopByIdDetails(shopId: number): Observable<any> {
        return this.shopServices.apiRepairshopIdDelete(shopId).pipe(
            tap(() => {
                const shopCount = JSON.parse(
                    localStorage.getItem('repairShopTableCount')
                );
                this.repairShopStore.remove(({ id }) => id === shopId);
                shopCount.repairShops--;

                localStorage.setItem(
                    'repairShopTableCount',
                    JSON.stringify({
                        repairShops: shopCount.repairShops,
                    })
                );

                this.getRepairShopById(this.repairShopId, true).subscribe({
                    next: (shop: RepairShopResponse) => {
                        this.tableService.sendActionAnimation({
                            animation: 'delete',
                            tab: 'repair-shop',
                            data: shop,
                            id: shop.id,
                        });
                    },
                });
            })
        );
    }

    public deleteRepairShopById(shopId: number): Observable<any> {
        return this.shopServices.apiRepairshopIdDelete(shopId).pipe(
            tap(() => {
                const repairCount = JSON.parse(
                    localStorage.getItem('repairTruckTrailerTableCount')
                );

                this.repairShopStore.remove(({ id }) => id === shopId);

                if (repairCount) {
                    repairCount.repairShops--;

                    localStorage.setItem(
                        'repairTruckTrailerTableCount',
                        JSON.stringify({
                            repairTrucks: repairCount.repairTrucks,
                            repairTrailers: repairCount.repairTrailers,
                            truckMoneyTotal: repairCount.truckMoneyTotal,
                            trailerMoneyTotal: repairCount.trailerMoneyTotal,
                            repairShops: repairCount.repairShops,
                        })
                    );
                }

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    tab: 'repair-shop',
                    id: shopId,
                });
            })
        );
    }

    public deleteRepairShopList(repairShopIds: number[]): Observable<any> {
        return this.shopServices.apiRepairshopListDelete(repairShopIds).pipe(
            tap(() => {
                const repairCount = JSON.parse(
                    localStorage.getItem('repairTruckTrailerTableCount')
                );

                repairShopIds.forEach((repairShopId) => {
                    this.repairShopStore.remove(
                        ({ id }) => id === repairShopId
                    );

                    repairCount.repairShops--;

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

    public getRepairShopModalDropdowns(): Observable<RepairShopModalResponse> {
        return this.shopServices.apiRepairshopModalGet();
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
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<Array<ClusterResponse>> {
        return this.shopServices.apiRepairshopClustersGet(
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
        categoryIds?: Array<number>,
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
    ) {
        return this.shopServices.apiRepairshopListmapGet(
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

    set updateRepairShopMinimal(data: RepairShopMinimalResponse) {
        this.repairDetailsStore.update((store) => {
            return {
                ...store,
                repairShopMinimal: data,
            };
        });
    }

    public deleteReview(reviewId, shopId) {
        let shopStored = JSON.parse(
            JSON.stringify(this.repairDetailsStore?.getValue())
        );
        let shopData = shopStored?.repairShop;
        let currentShop;
        let shopIndex;
        shopData.map((shop: any, ind: any) => {
            if (shop.id == shopId) {
                currentShop = shop;
                shopIndex = ind;
            }
        });

        currentShop?.reviews.map((item: any, index: any) => {
            if (item.id == reviewId) {
                currentShop?.reviews.splice(index, 1);
            }
        });

        shopData[shopIndex] = currentShop;

        this.repairShopStore.remove(({ id }) => id === shopId);
        this.repairShopStore.add(currentShop);

        this.repairDetailsStore.update((store) => {
            shopStored.repairShop[shopIndex] = currentShop;

            return {
                ...store,
                repairShop: [...shopStored.repairShop],
            };
        });

        this.tableService.sendActionAnimation({
            animation: 'update',
            tab: 'repair-shop',
            data: currentShop,
            id: currentShop.id,
        });
    }

    public addNewReview(data, shopId) {
        let shopStored = JSON.parse(
            JSON.stringify(this.repairDetailsStore?.getValue())
        );
        let shopData = shopStored?.repairShop;
        let currentShop;
        let shopIndex;
        shopData.map((shop: any, ind: any) => {
            if (shop.id == shopId) {
                currentShop = shop;
                shopIndex = ind;
            }
        });
        currentShop?.reviews.push(data);

        shopData[shopIndex] = currentShop;

        this.repairShopStore.remove(({ id }) => id === shopId);
        this.repairShopStore.add(currentShop);

        this.repairDetailsStore.update((store) => {
            shopStored.repairShop[shopIndex] = currentShop;

            return {
                ...store,
                repairShop: [...shopStored.repairShop],
            };
        });

        this.tableService.sendActionAnimation({
            animation: 'update',
            tab: 'repair-shop',
            data: currentShop,
            id: currentShop.id,
        });
    }

    public getRepairShopChart(id: number, chartType: number) {
        return this.shopServices.apiRepairshopExpensesGet(id, chartType);
    }

    public addShopFavorite(shopId: number) {
        return this.shopServices.apiRepairshopPinnedIdPut(shopId);
    }

    public changeShopStatus(shopId: any) {
        this.shopServices.apiRepairshopStatusIdPut(shopId).subscribe({
            next: () => {
                this.getRepairShopById(shopId).subscribe({
                    next: (shop: RepairShopResponse | any) => {
                        this.repairShopStore.remove(({ id }) => id === shopId);
                        this.repairShopStore.add(shop);
                        this.repairDetailsStore.update((store) => {
                            let ind;
                            let shopStored = JSON.parse(JSON.stringify(store));
                            shopStored.repairShop.map(
                                (data: any, index: any) => {
                                    if (data.id == shop.id) {
                                        ind = index;
                                    }
                                }
                            );

                            shopStored.repairShop[ind] = shop;

                            return {
                                ...store,
                                repairShop: [...shopStored.repairShop],
                            };
                        });

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            tab: 'repair-shop',
                            data: shop,
                            id: shop.id,
                        });
                    },
                });
            },
        });
    }

    public changePinnedStatus(shopId: any) {
        this.shopServices.apiRepairshopPinnedIdPut(shopId).subscribe({
            next: () => {
                this.getRepairShopById(shopId).subscribe({
                    next: (shop: RepairShopResponse | any) => {
                        this.repairShopStore.remove(({ id }) => id === shopId);
                        this.repairShopStore.add(shop);
                        this.repairDetailsStore.update((store) => {
                            let ind;
                            let shopStored = JSON.parse(JSON.stringify(store));
                            shopStored.repairShop.map(
                                (data: any, index: any) => {
                                    if (data.id == shop.id) {
                                        ind = index;
                                    }
                                }
                            );

                            shopStored.repairShop[ind] = shop;

                            return {
                                ...store,
                                repairShop: [...shopStored.repairShop],
                            };
                        });

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            tab: 'repair-shop',
                            data: shop,
                            id: shop.id,
                        });
                    },
                });
            },
        });
    }
}
