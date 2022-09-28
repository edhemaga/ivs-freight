import { Injectable } from '@angular/core';
import { AccidentListResponse, AccidentService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccidentTService {
  constructor(private accidentService: AccidentService) {}

  // Get Accident List
  public getAccidentList(
    active?: boolean,
    reported?: boolean,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<AccidentListResponse> {
    return this.accidentService.apiAccidentListGet(
      active,
      reported,
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
