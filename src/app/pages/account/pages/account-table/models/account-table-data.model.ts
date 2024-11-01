import { TableDropdownContent } from '@shared/models/card-models/card-table-data.model';
import { AccountPassword } from '@pages/account/pages/account-table/models/account-password.model';
import { AccountLabelData } from '@pages/account/pages/account-table/models/account-label-data.model';

export class AccountTableData {
    id: number;
    name: string;
    isSelected: boolean;
    url: string;
    username: string;
    password: string;
    note: string;
    lable?: AccountLabelData;
    accountPassword?: AccountPassword;
    tableDropdownContent?: TableDropdownContent;
}
