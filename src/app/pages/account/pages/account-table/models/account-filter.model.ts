export interface AccountFilter {
    labelId: number,
    pageIndex: number,
    pageSize: number,
    companyId: number,
    sort: any, //leave this as any
    searchOne: string | undefined,
    searchTwo: string | undefined,
    searchThree: string | undefined,
}