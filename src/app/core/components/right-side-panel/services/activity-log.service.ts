import { Injectable } from '@angular/core';

import {
    ActivityLogActionFilterResponse,
    ActivityLogService as ActivityLogBackendService,
    ActivityLogDepartmentResponse,
    ActivityLogModuleFilterResponse,
    CompanyUserActivityLogListResponse,
    SortOrder,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ActivityLogService {
    constructor(private activityLogService: ActivityLogBackendService) {}

    public getActivityLogList(
        companyUserIds?: number[],
        actionLogs?: number[],
        entityTypeActivityIds?: number[],
        dateFrom?: string,
        dateTo?: string,
        search?: string
    ): Observable<CompanyUserActivityLogListResponse> {
        return this.activityLogService.apiActivitylogListGet(
            companyUserIds,
            actionLogs,
            entityTypeActivityIds,
            dateFrom,
            dateTo,
            1,
            25,
            null,
            'id',
            SortOrder.Ascending,
            null,
            search
        );
    }

    public getUsersFilter(): Observable<ActivityLogDepartmentResponse[]> {
        return this.activityLogService.apiActivitylogUserFilterGet();
    }

    public getModulesFilter(
        companyUserId?: number
    ): Observable<ActivityLogModuleFilterResponse[]> {
        return this.activityLogService.apiActivitylogModuleFilterGet(
            companyUserId
        );
    }

    public getActionsFilter(
        companyUserId?: number
    ): Observable<ActivityLogActionFilterResponse[]> {
        return this.activityLogService.apiActivitylogActionFilterGet(
            companyUserId
        );
    }
}
