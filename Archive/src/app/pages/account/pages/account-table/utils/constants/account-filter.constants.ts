import { AccountFilter } from '@pages/account/pages/account-table/models/account-filter.model';

export class AccountFilterConstants {
    static accountFilterQuery: AccountFilter = {
        labelId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };
}
