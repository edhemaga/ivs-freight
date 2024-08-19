import { Injectable } from '@angular/core';


import { tap } from 'rxjs/operators';

// services
import { DashboardService } from '@pages/dashboard/services/dashboard.service';

// models
import { CompanyDurationResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DashboardResolver  {
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
