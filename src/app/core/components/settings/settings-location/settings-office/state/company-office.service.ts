import { Injectable } from '@angular/core';
import {
    CompanyOfficeListResponse,
    CompanyOfficeService,
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

    public getOfficeClusters(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        // return this.companyOfficeService.apiCompanyofficeClustersGet(
        //     northEastLatitude,
        //     northEastLongitude,
        //     southWestLatitude,
        //     southWestLongitude,
        //     pageIndex,
        //     pageSize,
        //     companyId,
        //     sort,
        //     search,
        //     search1,
        //     search2
        // );
    }
}
