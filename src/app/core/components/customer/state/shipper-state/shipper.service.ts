import { ShipperService } from './../../../../../../../appcoretruckassist/api/shipper.service';
import { Injectable } from '@angular/core';
import { ShipperListResponse } from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
  providedIn: 'root',
})
export class ShipperTService {
  constructor(
    private shipperService: ShipperService,
    private tableService: TruckassistTableService,
  ) {}

  // Get Shipper List
  public getShippersList(
    active?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<ShipperListResponse> {
    return this.shipperService.apiShipperListGet(active, pageIndex, pageSize);
  }
}
