import { Injectable } from '@angular/core';
import { BrokerService, GetBrokerListResponse } from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
  providedIn: 'root',
})
export class BrokerTService {
  constructor(
    private brokerService: BrokerService,
    private tableService: TruckassistTableService,
  ) {}

  // Get Broker List
  public getBrokerList(
    active?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<GetBrokerListResponse> {
    return this.brokerService.apiBrokerListGet(active, pageIndex, pageSize);
  }
}
