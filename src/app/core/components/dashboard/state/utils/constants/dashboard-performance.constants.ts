import { DashboardTab } from '../../models/dashboard-tab.model';

export class DashboardPerformanceConstants {
    static PERFORMANCE_TABS: DashboardTab[] = [
        {
            name: 'Today',
            checked: false,
        },
        {
            name: 'WTD',
            checked: false,
        },
        {
            name: 'MTD',
            checked: true,
        },
        {
            name: 'QTD',
            checked: false,
        },
        {
            name: 'YTD',
            checked: false,
        },
        {
            name: 'ALL',
            checked: false,
        },
        {
            name: 'Custom',
            checked: false,
            custom: true,
        },
    ];
}
