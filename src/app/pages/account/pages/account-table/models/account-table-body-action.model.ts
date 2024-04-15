import { AccountTableData } from '@pages/account/pages/account-table/models/account-table-data.model';

export interface AccountTableBodyAction {
    id?: number;
    type?: string;
    data?: AccountTableData;
}
