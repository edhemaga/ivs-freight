import { RepairModalResponse } from './../../../../../../appcoretruckassist/model/repairModalResponse';

import { Injectable } from '@angular/core';
import { RepairService } from 'appcoretruckassist/api/repair.service';
import { Observable } from 'rxjs';
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
} from 'appcoretruckassist';
import { RepairShopResponse } from '../../../../../../appcoretruckassist/model/repairShopResponse';

@Injectable({
  providedIn: 'root',
})
export class RepairTService {
  constructor(private repairService: RepairService, private shopServices: RepairShopService) {}

  public getRepairModalDropdowns(): Observable<RepairModalResponse> {
    return this.repairService.apiRepairModalGet();
  }

  public addRepair(data: CreateRepairCommand): Observable<CreateResponse> {
    return this.repairService.apiRepairPost(data);
  }

  public updateRepair(data: UpdateRepairCommand): Observable<object> {
    return this.repairService.apiRepairPut(data);
  }

  public getRepairById(id: number): Observable<RepairResponse> {
    return this.repairService.apiRepairIdGet(id);
  }

  public deleteRepairById(id: number): Observable<object> {
    return this.repairService.apiRepairIdDelete(id);
  }

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

  public deleteRepairShopById(id: number): Observable<any> {
    return this.shopServices.apiRepairshopIdDelete(id);
  }

  public getRepairShopModalDropdowns(): Observable<RepairShopModalResponse> {
    return this.shopServices.apiRepairshopModalGet();
  }
}
