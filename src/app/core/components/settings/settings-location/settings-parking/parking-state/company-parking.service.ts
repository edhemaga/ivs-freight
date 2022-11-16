import { ParkingListResponse } from './../../../../../../../../appcoretruckassist/model/parkingListResponse';
import { Injectable } from '@angular/core';
import { ParkingService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class CompanyParkingService {
   constructor(private companyParkingService: ParkingService) {}

   // Get Parking List
   public getParkingList(
      pageIndex?: number,
      pageSize?: number,
      count?: number
   ): Observable<ParkingListResponse | any> {
      return this.companyParkingService.apiParkingListGet(
         pageIndex,
         pageSize,
         count
      );
   }
}
