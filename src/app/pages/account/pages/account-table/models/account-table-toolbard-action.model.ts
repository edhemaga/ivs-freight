import { AccountColumn } from 'src/app/pages/account/pages/account-table/models/account-column.model';
export interface AccountTableToolbarAction {
    mode?: string;
    action?: string;
    tabData?: AccountColumn;
}
