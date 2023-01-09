import { RepairShopMinimalListResponse } from './../../../../../../appcoretruckassist/model/repairShopMinimalListResponse';
import { RepairModalResponse } from './../../../../../../appcoretruckassist/model/repairModalResponse';

import { Injectable, OnDestroy } from '@angular/core';
import { RepairService } from 'appcoretruckassist/api/repair.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import {
    CreateResponse,
    RepairResponse,
    RepairShopListResponse,
    RepairShopModalResponse,
    RepairShopService,
    RepairListResponse,
    ClusterResponse,
    RepairShopMinimalResponse,
} from 'appcoretruckassist';
import { RepairShopResponse } from '../../../../../../appcoretruckassist/model/repairShopResponse';
import { RepairTruckStore } from './repair-truck-state/repair-truck.store';
import { RepairTrailerStore } from './repair-trailer-state/repair-trailer.store';
import { ShopStore } from './shop-state/shop.store';
import { RepairTruckQuery } from './repair-truck-state/repair-truck.query';
import { RepairTrailerQuery } from './repair-trailer-state/repair-trailer.query';
import { ShopQuery } from './shop-state/shop.query';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { RepairDQuery } from './details-state/repair-d.query';
import { RepairDStore } from './details-state/repair-d.store';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

@Injectable({
    providedIn: 'root',
})
export class RepairTService implements OnDestroy {
    public currentIndex: number;
    public repairShopList: any;
    public repairShopId: number;
    private destroy$ = new Subject<void>();
    constructor(
        private repairService: RepairService,
        private shopServices: RepairShopService,
        private repairTruckStore: RepairTruckStore,
        private repairTrailerStore: RepairTrailerStore,
        private repairTruckQuery: RepairTruckQuery,
        private repairTrailerQuery: RepairTrailerQuery,
        private shopStore: ShopStore,
        private shopQuery: ShopQuery,
        private tableService: TruckassistTableService,
        private rDs: RepairDStore,
        private rDq: RepairDQuery,
        private formDataService: FormDataService
    ) {}

    // <----------------------- Repair Truck And Trailer -------------------->
    public addRepair(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.repairService.apiRepairPost().pipe(
            tap((res: any) => {
                // const subShop = this.getRepairShopById(data.repairShopId)
                //     .pipe(takeUntil(this.destroy$))
                //     .subscribe({
                //         next: (shop: RepairShopResponse | any) => {
                //             this.tableService.sendActionAnimation({
                //                 animation: 'update',
                //                 tab: 'repair-shop',
                //                 data: shop,
                //                 id: shop.id,
                //             });
                //             subShop.unsubscribe();
                //         },
                //     });
                // const subRepair = this.getRepairById(res.id)
                //     .pipe(takeUntil(this.destroy$))
                //     .subscribe({
                //         next: (repair: RepairResponse | any) => {
                //             const repairCount = JSON.parse(
                //                 localStorage.getItem(
                //                     'repairTruckTrailerTableCount'
                //                 )
                //             );
                //             if (repair.truckId) {
                //                 this.repairTruckStore.add(repair);
                //                 repairCount.repairTrucks++;
                //             } else if (repair.trailerId) {
                //                 this.repairTrailerStore.add(repair);
                //                 repairCount.repairTrailers++;
                //             }
                //             localStorage.setItem(
                //                 'repairTruckTrailerTableCount',
                //                 JSON.stringify({
                //                     repairTrucks: repairCount.repairTrucks,
                //                     repairTrailers: repairCount.repairTrailers,
                //                 })
                //             );
                //             this.tableService.sendActionAnimation({
                //                 animation: 'add',
                //                 tab: repair?.truckId ? 'active' : 'inactive',
                //                 data: repair,
                //                 id: repair.id,
                //             });
                //             subRepair.unsubscribe();
                //         },
                //     });
            })
        );
    }

    public updateRepair(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.repairService.apiRepairPut().pipe(
            tap(() => {
                const subShop = this.getRepairShopById(data.repairShopId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shop: RepairShopResponse | any) => {
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                tab: 'repair-shop',
                                data: shop,
                                id: shop.id,
                            });
                            subShop.unsubscribe();
                        },
                    });
                const subRepair = this.getRepairById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
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

                            subRepair.unsubscribe();
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
        categoryIds?: Array<number>,
        pmTruckTitles?: Array<string>,
        pmTrailerTitles?: Array<string>,
        isOrder?: boolean,
        truckId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
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
            truckId,
            pageIndex,
            pageSize,
            companyId,
            sort,
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
                const subShop = this.getRepairShopById(this.repairShopId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shop: RepairShopResponse | any) => {
                            /* this.sdls.update(shop.id, { repairs: shop.repairs });
              this.sdls.update(shop.id, { repairsByUnit: shop.repairsByUnit }); */
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                tab: 'repair-shop',
                                data: shop,
                                id: shop.id,
                            });
                            subShop.unsubscribe();
                        },
                    });
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
                        repairTrailers: repairCount.repairTrucks,
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
        repairsToDelete: any[],
        selectedTab: string
    ): Observable<any> {
        return;
    }

    // <----------------------- Repair Shop -------------------->
    public addRepairShop(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.shopServices.apiRepairshopPost(data).pipe(
            tap((res: any) => {
                const subShop = this.getRepairShopById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shop: RepairShopResponse | any) => {
                            const repairShopCount = JSON.parse(
                                localStorage.getItem('repairShopTableCount')
                            );
                            repairShopCount.repairShops++;

                            localStorage.setItem(
                                'repairShopTableCount',
                                JSON.stringify({
                                    repairShops: repairShopCount.repairShops,
                                })
                            );

                            this.tableService.sendActionAnimation({
                                animation: 'add',
                                tab: 'repair-shop',
                                data: shop,
                                id: shop.id,
                            });

                            subShop.unsubscribe();
                        },
                    });
            })
        );
    }

    public updateRepairShop(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.shopServices.apiRepairshopPut().pipe(
            tap(() => {
                const subShop = this.getRepairShopById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shop: RepairShopResponse | any) => {
                            this.shopStore.remove(({ id }) => id === data.id);               
                            this.shopStore.add(shop);

                            this.rDs.update((store) => {                         
                                let ind;
                                let shopStored = JSON.parse(JSON.stringify(store));
                                shopStored.repairShop.map((data: any, index: any) => {
                                    if (data.id == shop.id){
                                        ind = index;
                                    }
                                });
                                
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

                            subShop.unsubscribe();
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
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<RepairShopListResponse> {
        return this.shopServices.apiRepairshopListGet(
            active,
            pinned,
            companyOwned,
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
        this.rDq.repairShopMinimal$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
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
                this.shopStore.remove(({ id }) => id === shopId);
                shopCount.repairShops--;

                localStorage.setItem(
                    'repairShopTableCount',
                    JSON.stringify({
                        repairShops: shopCount.repairShops,
                    })
                );
                const subShop = this.getRepairShopById(this.repairShopId, true)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (shop: RepairShopResponse) => {
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
                                tab: 'repair-shop',
                                data: shop,
                                id: shop.id,
                            });

                            subShop.unsubscribe();
                        },
                    });
            })
        );
    }

    public deleteRepairShopById(shopId: number): Observable<any> {
        return this.shopServices.apiRepairshopIdDelete(shopId).pipe(
            tap(() => {
                const shopCount = JSON.parse(
                    localStorage.getItem('repairShopTableCount')
                );

                this.shopStore.remove(({ id }) => id === shopId);

                shopCount.repairShops--;

                localStorage.setItem(
                    'repairShopTableCount',
                    JSON.stringify({
                        repairShops: shopCount.repairShops,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    tab: 'repair-shop',
                    id: shopId,
                });
            })
        );
    }

    // Delete Shop List
    public deleteShopList(
        shopToDelete: any[],
        selectedTab: string
    ): Observable<any> {
        let deleteOnBack = shopToDelete.map((shop: any) => {
            return shop.id;
        });

        return;

        /* return this.shopServices.api(deleteOnBack).pipe(
      tap(() => {
        let storeShops = this.shopQuery.getAll();

        storeShops.map((shop: any) => {
          deleteOnBack.map((d) => {
            if (d === shop.id) {
              this.shopStore.remove(({ id }) => id === shop.id);
            }
          });
        });

        const shopCount = JSON.parse(
          localStorage.getItem('repairShopTableCount')
        );

        localStorage.setItem(
          'repairShopTableCount',
          JSON.stringify({
            repairShops: shopCount.repairShops,
          })
        );
      })
    ); */
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
            pageIndex,
            pageSize,
            companyId,
            sort,
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
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    set updateRepairShopMinimal(data: RepairShopMinimalResponse) {
        this.rDs.update((store) => {
            return {
                ...store,
                repairShopMinimal: data,
            };
        });
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
