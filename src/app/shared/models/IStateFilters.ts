export interface IStateFilters {
    dateFrom?: string;
    dateTo?: string;
    rateFrom?: number;
    rateTo?: number;
    paidFrom?: number;
    paidTo?: number;
    dueFrom?: number;
    dueTo?: number;
    status?: number[];
    dispatcherIds?: number[];
    revenueFrom?: number;
    revenueTo?: number;
}