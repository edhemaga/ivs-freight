import { RepairShopMinimalListResponse } from './../../../../../../appcoretruckassist/model/repairShopMinimalListResponse';
import { RepairModalResponse } from './../../../../../../appcoretruckassist/model/repairModalResponse';

import { Injectable, OnDestroy } from '@angular/core';
import { RepairService } from 'appcoretruckassist/api/repair.service';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import {
  CreateRepairCommand,
  CreateResponse,
  RepairResponse,
  UpdateRepairCommand,
  CreateRepairShopCommand,
  RepairShopListResponse,
  RepairShopModalResponse,
  RepairShopService,
  UpdateRepairShopCommand,
  RepairListResponse,
} from 'appcoretruckassist';
import { RepairShopResponse } from '../../../../../../appcoretruckassist/model/repairShopResponse';
import { RepairTruckStore } from './repair-truck-state/repair-truck.store';
import { RepairTrailerStore } from './repair-trailer-state/repair-trailer.store';
import { ShopStore } from './shop-state/shop.store';
import { RepairTruckQuery } from './repair-truck-state/repair-truck.query';
import { RepairTrailerQuery } from './repair-trailer-state/repair-trailer.query';
import { ShopQuery } from './shop-state/shop.query';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ShopDetailsListStore } from './shop-details-state/shop-details-list-state/shop-details-list.store';
import { RepairShopMinimalListStore } from './shop-details-state/shop-minimal-list-state/shop-minimal.store';
import { ShopItemStore } from './shop-details-state/shop-detail.store';
import { RepairShopMinimalListQuery } from './shop-details-state/shop-minimal-list-state/shop-minimal.query';
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
    private sdls: ShopDetailsListStore,
    private shopMinimalStore: RepairShopMinimalListStore,
    private shopDetailsMinimalQuery: RepairShopMinimalListQuery,

    private sItemStore: ShopItemStore
  ) {}

  // <----------------------- Repair Truck And Trailer -------------------->
  public addRepair(data: CreateRepairCommand): Observable<CreateResponse> {
    return this.repairService.apiRepairPost(data).pipe(
      tap((res: any) => {
        const subShop = this.getRepairShopById(data.repairShopId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (shop: RepairShopResponse | any) => {
              this.shopMinimalStore.remove(
                ({ id }) => id === data.repairShopId
              );
              this.shopMinimalStore.add(shop);
              /*  this.sdls.update(shop.id, { repairs: shop.repairs });
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
        const subRepair = this.getRepairById(res.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
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

              subRepair.unsubscribe();
            },
          });
      })
    );
  }

  public updateRepair(data: UpdateRepairCommand): Observable<object> {
    return this.repairService.apiRepairPut(data).pipe(
      tap(() => {
        const subShop = this.getRepairShopById(data.repairShopId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (shop: RepairShopResponse | any) => {
              this.shopMinimalStore.remove(
                ({ id }) => id === data.repairShopId
              );
              this.shopMinimalStore.add(shop);
              /*  this.sdls.update(shop.id, { repairs: shop.repairs });
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
        const subRepair = this.getRepairById(data.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (repair: RepairResponse | any) => {
              if (repair.truckId) {
                this.repairTruckStore.remove(({ id }) => id === data.id);
                this.repairTruckStore.add(repair);
              } else if (repair.trailerId) {
                this.repairTrailerStore.remove(({ id }) => id === data.id);

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
  public addRepairShop(
    data: CreateRepairShopCommand
  ): Observable<CreateResponse> {
    return this.shopServices.apiRepairshopPost(data).pipe(
      tap((res: any) => {
        const subShop = this.getRepairShopById(res.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (shop: RepairShopResponse | any) => {
              const repairShopCount = JSON.parse(
                localStorage.getItem('repairShopTableCount')
              );

              this.shopStore.add(shop);
              this.shopMinimalStore.add(shop);
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

  public updateRepairShop(data: UpdateRepairShopCommand): Observable<object> {
    return this.shopServices.apiRepairshopPut(data).pipe(
      tap(() => {
        const subShop = this.getRepairShopById(data.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (shop: RepairShopResponse | any) => {
              this.shopStore.remove(({ id }) => id === data.id);
              this.shopMinimalStore.remove(({ id }) => id === data.id);
              this.shopMinimalStore.add(shop);
              this.shopStore.add(shop);
              this.sdls.replace(shop.id, shop);
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
    this.shopDetailsMinimalQuery
      .selectAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => (this.repairShopList = item));
    if (getIndex) {
      this.currentIndex = this.repairShopList.findIndex(
        (driver) => driver.id === repairId
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
        this.shopMinimalStore.remove(({ id }) => id === shopId);
        this.sdls.remove(({ id }) => id === shopId);

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
        this.shopMinimalStore.remove(({ id }) => id === shopId);
        this.sdls.remove(({ id }) => id === shopId);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
