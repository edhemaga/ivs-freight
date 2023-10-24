import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../../environments/environment';

import { DashboardStore } from '../store/dashboard.store';

import { SharedService } from '../../../../services/shared/shared.service';

import {
    DashboardService as DashboardBackendService,
    DashboardTopReportType,
    SubintervalType,
    TimeInterval,
    TopRepairShopListResponse,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor(
        private dashboardStore: DashboardStore,
        private http: HttpClient,
        private sharedService: SharedService,
        private dashboardService: DashboardBackendService
    ) {}

    // Top Rated Dashboard
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

    ////////////////////////////////////////////////////////////////////

    addStats() {
        this.http.get(environment.API_ENDPOINT + 'dashboard/totals').subscribe(
            (response: any) => {
                this.dashboardStore.update((store) => ({
                    ...store,
                    statistic: response,
                }));
            },
            () => {
                this.sharedService.handleServerError();
            }
        );
    }

    getDashboardStats() {
        return this.http.get(environment.API_ENDPOINT + 'dashboard/totals');
    }

    set dashStats(response) {
        this.dashboardStore.update((store) => ({
            ...store,
            statistic: response,
        }));
    }
}
