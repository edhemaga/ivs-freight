import { RepairShopMinimalListResponse } from './../../../../../../appcoretruckassist/model/repairShopMinimalListResponse';
import { RepairModalResponse } from './../../../../../../appcoretruckassist/model/repairModalResponse';

import { Injectable } from '@angular/core';
import { RepairService } from 'appcoretruckassist/api/repair.service';
import { Observable, tap } from 'rxjs';
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
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ShopStore } from './shop-state/shop.store';
import { RepairTruckQuery } from './repair-truck-state/repair-truck.query';
import { RepairTrailerQuery } from './repair-trailer-state/repair-trailer.query';
import { ShopQuery } from './shop-state/shop.query';

@Injectable({
  providedIn: 'root',
})
export class RepairTService {
  constructor(
    private repairService: RepairService,
    private shopServices: RepairShopService,
    private repairTruckStore: RepairTruckStore,
    private repairTrailerStore: RepairTrailerStore,
    private repairTruckQuery: RepairTruckQuery,
    private repairTrailerQuery: RepairTrailerQuery,
    private shopStore: ShopStore,
    private shopQuery: ShopQuery,
    private tableService: TruckassistTableService
  ) {}

  // <----------------------- Repair Truck And Trailer -------------------->
  public addRepair(data: CreateRepairCommand): Observable<CreateResponse> {
    return this.repairService.apiRepairPost(data).pipe(
      tap((res: any) => {
        const subRepair = this.getRepairById(res.id).subscribe({
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
        const subRepair = this.getRepairById(data.id).subscribe({
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
    repairType?: number,
    unitType?: number,
    dateFrom?: string,
    dateTo?: string,
    isPM?: number,
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
      repairType,
      unitType,
      dateFrom,
      dateTo,
      isPM,
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
    tabSelected: string
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
        const subShop = this.getRepairShopById(res.id).subscribe({
          next: (shop: RepairShopResponse | any) => {
            const repairShopCount = JSON.parse(
              localStorage.getItem('repairShopTableCount')
            );

            this.shopStore.add(shop);

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
        const subShop = this.getRepairShopById(data.id).subscribe({
          next: (shop: RepairShopResponse | any) => {
            this.shopStore.remove(({ id }) => id === data.id);

            this.shopStore.add(shop);

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

  public getRepairShopById(id: number): Observable<RepairShopResponse> {
    return this.shopServices.apiRepairshopIdGet(id);
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
}
