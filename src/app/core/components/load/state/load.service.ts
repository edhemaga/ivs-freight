import { LoadResponse } from './../../../../../../appcoretruckassist/model/loadResponse';
import { Injectable } from '@angular/core';
import { LoadListResponse, LoadService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadTService {
  constructor(private loadServices: LoadService) {}

  // Get Load List
  public getLoadList(
    loadType?: number,
    statusType?: number,
    status?: number,
    dispatcherId?: number,
    dispatchId?: number,
    brokerId?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<LoadListResponse> {
    return this.loadServices.apiLoadListGet(
      loadType,
      statusType,
      status,
      dispatcherId,
      dispatchId,
      brokerId,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }
  public getLoadById(loadId: number): Observable<LoadResponse> {
    return this.loadServices.apiLoadIdGet(loadId);
  }
}
