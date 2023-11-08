import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// store
import { DashboardStore } from '../store/dashboard.store';

// models
import {
    DashboardService as DashboardBackendService,
    TopBrokersListResponse,
    TopDispatchersListResponse,
    TopOwnerListResponse,
    TopRepairShopListResponse,
    TopShipperListResponse,
    CompanyDurationResponse,
    TopFuelStopListResponse,
    TopTruckListResponse,
} from 'appcoretruckassist';
import {
    TopRatedApiArguments,
    TopRatedWithoutTabApiArguments,
} from '../models/dashboard-top-rated-models/top-rated-api-arguments.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor(
        private dashboardService: DashboardBackendService,
        private dashboardStore: DashboardStore
    ) {}

    // Dashboard
    public getOverallCompanyDuration(): Observable<CompanyDurationResponse> {
        return this.dashboardService.apiDashboardCompanydurationGet().pipe(
            tap((companyDuration) => {
                this.dashboardStore.update((store) => {
                    return {
                        ...store,
                        companyDuration: companyDuration.companyDurationInDays,
                    };
                });
            })
        );
    }

    // Dashboard - Top Rated
    public getTopRatedDispatcher(
        data: TopRatedApiArguments
    ): Observable<TopDispatchersListResponse> {
        return this.dashboardService.apiDashboardTopdispatchersGet(...data);
    }

    public getTopRatedTruck(
        data: TopRatedApiArguments
    ): Observable<TopTruckListResponse> {
        return this.dashboardService.apiDashboardToptrucksGet(...data);
    }

    public getTopRatedBroker(
        data: TopRatedApiArguments
    ): Observable<TopBrokersListResponse> {
        return this.dashboardService.apiDashboardTopbrokersGet(...data);
    }

    public getTopRatedShipper(
        data: TopRatedWithoutTabApiArguments
    ): Observable<TopShipperListResponse> {
        return this.dashboardService.apiDashboardTopshippersGet(...data);
    }

    public getTopRatedOwner(
        data: TopRatedApiArguments
    ): Observable<TopOwnerListResponse> {
        return this.dashboardService.apiDashboardTopownersGet(...data);
    }

    public getTopRatedRepairShop(
        data: TopRatedApiArguments
    ): Observable<TopRepairShopListResponse> {
        return this.dashboardService.apiDashboardToprepairshopGet(...data);
    }

    public getTopRatedFuelStop(
        data: TopRatedApiArguments
    ): Observable<TopFuelStopListResponse> {
        return this.dashboardService.apiDashboardTopfuelstopsGet(...data);
    }
}
