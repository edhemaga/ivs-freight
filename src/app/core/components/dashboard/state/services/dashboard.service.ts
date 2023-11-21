import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// store
import { DashboardStore } from '../store/dashboard.store';

// models
import {
    DashboardService as DashboardBackendService,
    CompanyDurationResponse,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor(
        private dashboardService: DashboardBackendService,
        private dashboardStore: DashboardStore
    ) {}

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
}
