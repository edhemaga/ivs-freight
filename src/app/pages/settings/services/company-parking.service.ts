import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// core
import { ParkingListResponse } from 'appcoretruckassist';
import { ParkingService } from 'appcoretruckassist';

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
