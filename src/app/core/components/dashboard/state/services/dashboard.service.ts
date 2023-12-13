import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

// models
import {
    DashboardService as DashboardBackendService,
    CompanyDurationResponse,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private companyDurationSubject: BehaviorSubject<number> =
        new BehaviorSubject<number>(0);

    constructor(private dashboardService: DashboardBackendService) {}

    get getOverallCompanyDuration$(): Observable<number> {
        return this.companyDurationSubject.asObservable();
    }

    public setOverallCompanyDuration(companyDuration: number): void {
        this.companyDurationSubject.next(companyDuration);
    }

    public getOverallCompanyDuration(): Observable<CompanyDurationResponse> {
        return this.dashboardService.apiDashboardCompanydurationGet();
    }
}
