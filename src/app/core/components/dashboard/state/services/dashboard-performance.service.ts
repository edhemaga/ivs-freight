import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// models
import { PerformanceApiArguments } from '../models/dashboard-performance-models/performance-api-arguments.model';
import { DashboardService, PerformanceResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DashboardPerformanceService {
    constructor(private dashboardService: DashboardService) {}

    public getPerformance(
        data: PerformanceApiArguments
    ): Observable<PerformanceResponse> {
        return this.dashboardService.apiDashboardPerformanceGet(...data);
    }
}
