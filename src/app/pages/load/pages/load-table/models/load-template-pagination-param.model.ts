import { SortOrder } from 'appcoretruckassist';

export interface IGetLoadTemplateParam {
    loadType?: number;
    revenueFrom?: number;
    revenueTo?: number;
    loadId?: number;
    pageIndex?: number;
    pageSize?: number;
    companyId?: number;
    sort?: string;
    sortOrder?: SortOrder;
    sortBy?: string;
    search?: string;
    search1?: string;
    search2?: string;
}