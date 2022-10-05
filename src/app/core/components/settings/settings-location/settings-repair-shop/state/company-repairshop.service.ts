import { ParkingListResponse } from './../../../../../../../../appcoretruckassist/model/parkingListResponse';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RepairShopService } from '../../../../../../../../appcoretruckassist/api/repairShop.service';
import { RepairShopListResponse } from '../../../../../../../../appcoretruckassist/model/repairShopListResponse';

@Injectable({
  providedIn: 'root',
})
export class CompanyRepairShopService {
  constructor(private companyRepairShop: RepairShopService) {}

  // Get RepairShopList List
  public getCompanyRepairShopList(
    companyOwned?: boolean,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number
  ): Observable<RepairShopListResponse> {
    /* return this.companyRepairShop.apiRepairshopListGet(
      null,
      null,
      true,
      pageIndex,
      pageSize,
      companyId
    ); */

    return;
  }
}
