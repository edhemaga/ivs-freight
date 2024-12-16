export interface ShopBackFilter {
    active?: number;
    pinned?: boolean | undefined;
    companyOwned?: boolean | undefined;
    isCompanyRelated?: boolean;
    categoryIds?: Array<number> | undefined;
    long?: number | undefined;
    lat?: number | undefined;
    visitedByMe?: boolean;
    driverId?: number;
    distance?: number | undefined;
    costFrom?: number | undefined;
    costTo?: number | undefined;
    pageIndex?: number;
    pageSize?: number;
    companyId?: number | undefined;
    sort?: string | undefined;
    searchOne?: string | undefined;
    searchTwo?: string | undefined;
    searchThree?: string | undefined;
}
