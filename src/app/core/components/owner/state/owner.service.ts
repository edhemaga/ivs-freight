import { Injectable } from '@angular/core';
import { GetOwnerListResponse, OwnerService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerTService {
  constructor(private ownerService: OwnerService) {}

  // Get Owner List
  public getOwner(
    active?: number,
    companyOwnerId?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<GetOwnerListResponse> {
    return this.ownerService.apiOwnerListGet(
      active,
      companyOwnerId,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }
}
