import { ParkingListResponse } from './../../../../../../../../appcoretruckassist/model/parkingListResponse';
import { Injectable } from '@angular/core';
import {
  CompanyOfficeListResponse,
  CompanyOfficeService,
  ParkingService,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyTOfficeService {
  constructor(private companyOfficeService: CompanyOfficeService) {}

  // Get Parking List
  public getOfficeList(
    pageIndex?: number,
    pageSize?: number,
    count?: number
  ): Observable<CompanyOfficeListResponse> {
    return this.companyOfficeService.apiCompanyofficeListGet(
      pageIndex,
      pageSize,
      count
    );
  }
}
