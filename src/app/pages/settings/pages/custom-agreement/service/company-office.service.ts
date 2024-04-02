import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//Models
import {
    CompanyOfficeListResponse,
    CompanyOfficeService as CompanyTOfficeService,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class CompanyOfficeService {
    constructor(private companyOfficeService: CompanyTOfficeService) {}

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
        return this.companyOfficeService.apiCompanyofficeClustersGet(
            northEastLatitude,
            northEastLongitude,
            southWestLatitude,
            southWestLongitude,
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
