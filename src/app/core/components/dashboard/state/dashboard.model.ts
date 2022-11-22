export class DashboardStats {
    allTimeObject: any[];
    mtdObject: any[];
    ytdObject: any[];
    todayObject: any[];
}

export interface IDashboard {
    statistic: DashboardStats[];
}
