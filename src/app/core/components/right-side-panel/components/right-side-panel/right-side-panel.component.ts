import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { CaRightSidePanelComponent } from 'ca-components';
import { ActivityLogService } from '@core/components/right-side-panel/services/activity-log.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';

// models
import {
    ActivityLogActionFilterResponse,
    ActivityLogDepartmentResponse,
    ActivityLogModuleFilterResponse,
    CompanyUserActivityLogListResponse,
    CompanyUserActivityLogResponse,
} from 'appcoretruckassist';
import { ActivityLogFilterParams } from '@core/components/right-side-panel/models';

// enums
import { RightSidePanelCurrentTab, SelectedModule } from '@core/components/right-side-panel/enums';

// helpers
import { GetCurrentUserHelper } from '@pages/chat/utils/helpers';

@Component({
    selector: 'app-right-side-panel',
    templateUrl: './right-side-panel.component.html',
    styleUrls: ['./right-side-panel.component.scss'],
    standalone: true,
    imports: [CommonModule, CaRightSidePanelComponent],
})
export class RightSidePanelComponent implements OnDestroy {
    private getCurrentUserHelper = GetCurrentUserHelper;
    public activityLogData: CompanyUserActivityLogResponse[] = [];
    public usersFilterData: ActivityLogDepartmentResponse[] = [];
    public modulesFilterData: ActivityLogModuleFilterResponse[] = [];
    public actionsFilterData: ActivityLogActionFilterResponse[] = [];
    private destroy$ = new Subject<void>();

    constructor(private activityLogService: ActivityLogService) {}

    public selectedNavModuleEvent(selectedNavModule: SelectedModule): void {
        switch (selectedNavModule) {
            case SelectedModule.ACTIVITY_LOG:
                const companyUserIds: number[] = [
                    this.getCurrentUserHelper.currentUserId,
                ];
                this.getActivityLogFilters(
                    this.getCurrentUserHelper.currentUserId
                );
                this.getActivityLogs(companyUserIds);
                break;
            default:
                break;
        }
    }

    private getActivityLogFilters(companyUserId?: number): void {
        forkJoin({
            usersFilter: this.activityLogService
                .getUsersFilter()
                .pipe(takeUntil(this.destroy$)),
            modulesFilter: this.activityLogService
                .getModulesFilter(companyUserId)
                .pipe(takeUntil(this.destroy$)),
            actionsFilter: this.activityLogService
                .getActionsFilter(companyUserId)
                .pipe(takeUntil(this.destroy$)),
        }).subscribe({
            next: ({ usersFilter, modulesFilter, actionsFilter }) => {
                this.usersFilterData = [...usersFilter];
                this.modulesFilterData = [...modulesFilter];
                this.actionsFilterData = [...actionsFilter];
            },
        });
    }

    private getActivityLogs(
        companyUserIds?: number[],
        actionLogs?: number[],
        entityTypeActivityIds?: number[],
        dateFrom?: string,
        dateTo?: string,
        search?: string
    ): void {
        this.activityLogService
            .getActivityLogList(
                companyUserIds,
                actionLogs,
                entityTypeActivityIds,
                dateFrom,
                dateTo,
                search
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: CompanyUserActivityLogListResponse) => {
                this.activityLogData = [...res.pagination.data];
            });
    }

    private formatDate(date?: Date): string | null {
        return date ? formatDate(date, "yyyy-MM-dd'T'HH:mm:ss", 'en-US') : null;
    }

    private getCompanyUserIds(
        userFilterType: RightSidePanelCurrentTab,
        companyUserIds: number[]
    ): number[] {
        return userFilterType === RightSidePanelCurrentTab.PERSONAL
            ? [this.getCurrentUserHelper.currentUserId]
            : companyUserIds;
    }

    public activityLogFilterParamsEvent(
        activityLogFilterParams: ActivityLogFilterParams
    ): void {
        const companyUserIds = this.getCompanyUserIds(
            activityLogFilterParams.userFilterType,
            activityLogFilterParams.companyUserIds
        );

        this.getActivityLogs(
            companyUserIds,
            activityLogFilterParams.actionLogIds,
            activityLogFilterParams.entityTypeActivityIds,
            this.formatDate(activityLogFilterParams.dateFrom),
            this.formatDate(activityLogFilterParams.dateTo),
            activityLogFilterParams.search
        );

        if (activityLogFilterParams.reloadFilters)
            this.getActivityLogFilters(
                activityLogFilterParams.userFilterType ===
                    RightSidePanelCurrentTab.PERSONAL
                    ? this.getCurrentUserHelper.currentUserId
                    : null
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
