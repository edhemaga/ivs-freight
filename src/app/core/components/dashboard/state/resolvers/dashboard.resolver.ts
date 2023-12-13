import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { tap } from 'rxjs/operators';

// services
import { DashboardService } from '../services/dashboard.service';

// models
import { CompanyDurationResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DashboardResolver implements Resolve<CompanyDurationResponse> {
    constructor(private dashboardService: DashboardService) {}

    resolve() {
        return this.dashboardService.getOverallCompanyDuration().pipe(
            tap((res) => {
                if (res) {
                    this.dashboardService.setOverallCompanyDuration(
                        res.companyDurationInDays
                    );
                }
            })
        );
    }
}
