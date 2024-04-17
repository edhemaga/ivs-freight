import { AccountTableData } from "../../account-table/models/account-table-data.model";

export interface AccountData {
    id: number;
    type: string;
    data: AccountTableData;
}