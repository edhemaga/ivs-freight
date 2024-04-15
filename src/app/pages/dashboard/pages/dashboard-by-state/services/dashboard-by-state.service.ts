import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// models
import {
    AccidentByStateListResponse,
    DashboardService,
    FuelByStateListResponse,
    PickupDeliveryByStateListResponse,
    RepairByStateListResponse,
    RoadsideByStateListResponse,
    ViolationByStateListResponse,
} from 'appcoretruckassist';
import { ByStateApiArguments } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-api-arguments.model';
import { ByStateWithLoadStopApiArguments } from '@pages/dashboard/pages/dashboard-by-state/models/by-state-with-load-stop-api-arguments.model';

@Injectable({
    providedIn: 'root',
})
export class DashboardByStateService {
    constructor(private dashboardService: DashboardService) {}

    public getPickupByState(
        data: ByStateWithLoadStopApiArguments
    ): Observable<PickupDeliveryByStateListResponse> {
        return this.dashboardService.apiDashboardPickupdeliverybystateGet(
            ...data
        );
    }

    public getDeliveryByState(
        data: ByStateWithLoadStopApiArguments
    ): Observable<PickupDeliveryByStateListResponse> {
        return this.dashboardService.apiDashboardPickupdeliverybystateGet(
            ...data
        );
    }

    public getRoadsideByState(
        data: ByStateApiArguments
    ): Observable<RoadsideByStateListResponse> {
        return this.dashboardService.apiDashboardRoadsidebystateGet(...data);
    }

    public getViolationByState(
        data: ByStateApiArguments
    ): Observable<ViolationByStateListResponse> {
        return this.dashboardService.apiDashboardViolationbystateGet(...data);
    }

    public getAccidentByState(
        data: ByStateApiArguments
    ): Observable<AccidentByStateListResponse> {
        return this.dashboardService.apiDashboardAccidentbystateGet(...data);
    }

    public getRepairByState(
        data: ByStateApiArguments
    ): Observable<RepairByStateListResponse> {
        return this.dashboardService.apiDashboardRepairbystateGet(...data);
    }

    public getFuelByState(
        data: ByStateApiArguments
    ): Observable<FuelByStateListResponse> {
        return this.dashboardService.apiDashboardFuelbystateGet(...data);
    }
}
