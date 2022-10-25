import { LoadResponse } from './../../../../../../appcoretruckassist/model/loadResponse';
import { Injectable } from '@angular/core';
import {
  CreateResponse,
  LoadListResponse,
  LoadService,
  LoadTemplateListResponse,
  LoadTemplateResponse,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { LoadMinimalListResponse } from '../../../../../../appcoretruckassist/model/loadMinimalListResponse';
import { LoadDetailsListQuery } from './load-details-state/load-details-list-state/load-d-list.query';
import { LoadDetailsListStore } from './load-details-state/load-details-list-state/load-d-list.store';
import { LoadModalResponse } from '../../../../../../appcoretruckassist/model/loadModalResponse';
import { CreateLoadCommand } from '../../../../../../appcoretruckassist/model/createLoadCommand';
import { UpdateLoadCommand } from '../../../../../../appcoretruckassist/model/updateLoadCommand';
import { CreateLoadTemplateCommand } from '../../../../../../appcoretruckassist/model/createLoadTemplateCommand';

@Injectable({
  providedIn: 'root',
})
export class LoadTService {
  constructor(
    private loadServices: LoadService,
    private ldlStore: LoadDetailsListStore,
    private ldlQuery: LoadDetailsListQuery
  ) {}

  // Get Load List
  // statusType -> 1 - pending, 2 - active, 3 - closed
  public getLoadList(
    loadType?: number,
    statusType?: number,
    status?: number,
    dispatcherId?: number,
    dispatchId?: number,
    brokerId?: number,
    dateFrom?: string,
    dateTo?: string,
    revenueFrom?: number,
    revenueTo?: number,
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
      dateFrom,
      dateTo,
      revenueFrom,
      revenueTo,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }
  //Get Load minimal list
  public getLoadMinimalList(
    pageIndex?: number,
    pageSize?: number
  ): Observable<LoadMinimalListResponse> {
    return this.loadServices.apiLoadListMinimalGet(pageIndex, pageSize);
  }
  // Get Load Template List
  public getLoadTemplateList(
    loadType?: number,
    revenueFrom?: number,
    revenueTo?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<LoadTemplateListResponse> {
    return this.loadServices.apiLoadTemplateListGet(
      loadType,
      revenueFrom,
      revenueTo,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }

  public createLoad(data: CreateLoadCommand): Observable<CreateResponse> {
    return this.loadServices.apiLoadPost(data);
  }

  public updateLoad(data: UpdateLoadCommand): Observable<any> {
    return this.loadServices.apiLoadPut(data);
  }

  public deleteLoadById(id: number): Observable<any> {
    return this.loadServices.apiLoadIdDelete(id);
  }

  public getLoadById(loadId: number): Observable<LoadResponse> {
    return this.loadServices.apiLoadIdGet(loadId);
  }

  public getLoadDropdowns(id?: number): Observable<LoadModalResponse> {
    return this.loadServices.apiLoadModalGet(id);
  }

  // Load Templates
  public createLoadTemplate(
    data: CreateLoadTemplateCommand
  ): Observable<CreateResponse> {
    return this.loadServices.apiLoadTemplatePost(data);
  }

  public getLoadTemplateById(id: number): Observable<LoadTemplateResponse> {
    return this.loadServices.apiLoadTemplateIdGet(id);
  }
}
