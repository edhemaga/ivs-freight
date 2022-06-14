import { RepairShopResponse } from './../../../../../../appcoretruckassist/model/repairShopResponse';

import { Injectable } from '@angular/core';
import {
  CreateRepairShopCommand,
  CreateResponse,
  RepairShopModalResponse,
  RepairShopService,
  UpdateRepairShopCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { ShopStore } from './shop.store';

@Injectable({
  providedIn: 'root',
})
export class ShopTService {
  constructor(
    private shopServices: RepairShopService,
    private shopStore: ShopStore
  ) {}

  public getRepairShopById(id: number): Observable<RepairShopResponse> {
    return this.shopServices.apiRepairshopIdGet(id);
  }

  public deleteRepairById(id: number): Observable<any> {
    return this.shopServices.apiRepairshopIdDelete(id);
  }

  public getRepairShopModalDropdowns(): Observable<RepairShopModalResponse> {
    return this.shopServices.apiRepairshopModalGet();
  }

  public addRepairShop(
    data: CreateRepairShopCommand
  ): Observable<CreateResponse> {
    return this.shopServices.apiRepairshopPost(data);
  }

  public updateRepairShop(data: UpdateRepairShopCommand): Observable<object> {
    return this.shopServices.apiRepairshopPut(data);
  }
}
