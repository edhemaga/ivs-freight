import { Injectable } from '@angular/core';
import {
  CompanyUserService,
  GetCompanyUserListResponse,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserTService {
  constructor(private userService: CompanyUserService) {}

  // Get User List
  public getUsers(
    active?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<GetCompanyUserListResponse> {
    return this.userService.apiCompanyuserListGet(
      active,
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
