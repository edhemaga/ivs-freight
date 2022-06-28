import { RepairShopResponse } from '../../../../../../appcoretruckassist/model/repairShopResponse';

import { Injectable } from '@angular/core';
import {
  CreateRepairShopCommand,
  CreateResponse,
  RepairShopListResponse,
  RepairShopModalResponse,
  RepairShopService,
  UpdateRepairShopCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { ShopStore } from './shop-state/shop.store';

@Injectable({
  providedIn: 'root',
})
export class RepairTService {
  constructor(
    private shopServices: RepairShopService /* private shopStore: ShopStore */
  ) {}

  public addRepairShop(
    data: CreateRepairShopCommand
  ): Observable<CreateResponse> {
    return this.shopServices.apiRepairshopPost(data);
  }

  public updateRepairShop(data: UpdateRepairShopCommand): Observable<object> {
    return this.shopServices.apiRepairshopPut(data);
  }

  // Get Repair List
  public getRepairsList(
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
      pageSize
    );
  }

  public getRepairShopById(id: number): Observable<RepairShopResponse> {
    return this.shopServices.apiRepairshopIdGet(id);
  }

  public deleteRepairById(id: number): Observable<any> {
    return this.shopServices.apiRepairshopIdDelete(id);
  }

  public getRepairShopModalDropdowns(): Observable<RepairShopModalResponse> {
    return this.shopServices.apiRepairshopModalGet();
  }
}
