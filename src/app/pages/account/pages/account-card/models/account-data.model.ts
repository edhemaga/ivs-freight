import { AccountTableData } from '@pages/account/pages/account-table/models/account-table-data.model';

export interface AccountData {
    id: number;
    type: string;
    data: AccountTableData;
}
