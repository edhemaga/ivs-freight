// enums
import { ActivityLogSortType, RightSidePanelCurrentTab } from '../enums';

export interface ActivityLogFilterParams {
    companyUserIds: number[];
    actionLogIds: number[];
    entityTypeActivityIds: number[];
    sort: ActivityLogSortType;
    userFilterType: RightSidePanelCurrentTab;
    dateFrom: Date | null;
    dateTo: Date | null;
    search: string | null;
    reloadFilters?: boolean;
}
