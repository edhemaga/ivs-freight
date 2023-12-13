import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

// services
import { DashboardService } from '../services/dashboard.service';

// models
import { CompanyDurationResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DashboardResolver
    implements
        Resolve<{
            companyDurationData: CompanyDurationResponse;
        }>
{
    constructor(private dashboardService: DashboardService) {}

    resolve() {
        const companyDurationData$ =
            this.dashboardService.getOverallCompanyDuration();

        return forkJoin({
            companyDurationData: companyDurationData$,
        }).pipe(
            tap((res) => {
                if (res) {
                    this.dashboardService.setOverallCompanyDuration(
                        res.companyDurationData.companyDurationInDays
                    );
                }
            })
        );
    }
}
