import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// models
import {
    DashboardService,
    TopBrokersListResponse,
    TopDispatchersListResponse,
    TopOwnerListResponse,
    TopRepairShopListResponse,
    TopShipperListResponse,
    TopFuelStopListResponse,
    TopTruckListResponse,
    TopDriverListResponse,
} from 'appcoretruckassist';
import { TopRatedApiArguments } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-api-arguments.model';
import { TopRatedWithoutTabApiArguments } from '@pages/dashboard/pages/dashboard-top-rated/models/top-rated-without-tab-api-arguments.model';

@Injectable({
    providedIn: 'root',
})
export class DashboardTopRatedService {
    constructor(private dashboardService: DashboardService) {}

    public getTopRatedDispatcher(
        data: TopRatedApiArguments
    ): Observable<TopDispatchersListResponse> {
        return this.dashboardService.apiDashboardTopdispatchersGet(...data);
    }

    public getTopRatedDriver(
        data: TopRatedApiArguments
    ): Observable<TopDriverListResponse> {
        return this.dashboardService.apiDashboardTopdriversGet(...data);
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
