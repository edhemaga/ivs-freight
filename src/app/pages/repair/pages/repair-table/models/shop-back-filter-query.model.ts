export interface ShopBackFilterQuery {
    active?: number;
    pinned?: boolean;
    companyOwned?: boolean;
    categoryIds?: number[];
    long?: number;
    lat?: number;
    distance?: number;
    costFrom?: number;
    costTo?: number;
    pageIndex?: number;
    pageSize?: number;
    companyId?: number;
    sort?: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}
