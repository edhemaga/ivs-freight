import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// models
import {
    DashboardService as DashboardBackendService,
    DashboardTopReportType,
    SubintervalType,
    TimeInterval,
    TopBrokersListResponse,
    TopRepairShopListResponse,
    TopShipperListResponse,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor(private dashboardService: DashboardBackendService) {}

    // Dashboard - Top Rated
    public getTopRatedBroker(
        reportType: DashboardTopReportType,
        searchTerms: string[],
        pageIndex: number,
        pageSize: number,
        timeInterval: TimeInterval,
        startDate: string,
        endDate: string,
        subintervalType: SubintervalType
    ): Observable<TopBrokersListResponse> {
        return this.dashboardService.apiDashboardTopbrokersGet(
            reportType,
            searchTerms,
            pageIndex,
            pageSize,
            timeInterval,
            startDate,
            endDate,
            subintervalType
        );
    }

    public getTopRatedShipper(
        searchTerms: string[],
        pageIndex: number,
        pageSize: number,
        timeInterval: TimeInterval,
        startDate: string,
        endDate: string,
        subintervalType: SubintervalType
    ): Observable<TopShipperListResponse> {
        return this.dashboardService.apiDashboardTopshippersGet(
            searchTerms,
            pageIndex,
            pageSize,
            timeInterval,
            startDate,
            endDate,
            subintervalType
        );
    }

    public getTopRatedRepairShop(
        reportType: DashboardTopReportType,
        searchTerms: string[],
        pageIndex: number,
        pageSize: number,
        timeInterval: TimeInterval,
        startDate: string,
        endDate: string,
        subintervalType: SubintervalType
    ): Observable<TopRepairShopListResponse> {
        return this.dashboardService.apiDashboardToprepairshopGet(
            reportType,
            searchTerms,
            pageIndex,
            pageSize,
            timeInterval,
            startDate,
            endDate,
            subintervalType
        );
    }
}
