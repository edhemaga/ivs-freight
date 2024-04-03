import { tableDropdownContent } from '../../shared/models/card-table-data.model';

export class Account {
    status: string;
    data: AccountData[];
}

export class AccountData {
    id: number;
    name: string;
    url: string;
    username: string;
    password: string;
    note: string;
    labelId: number;
    labelName: string;
    labelColor: string;
    checked: boolean;
    doc: ManageAccountDoc;
}

export interface ManageAccount {
    id?: string;
    companyId?: number;
    name: string;
    url: string;
    username: string;
    password: string;
    labelId?: number;
    doc: ManageAccountDoc;
}

export interface ManageAccountDoc {
    note: string;
    labelId?: number;
}

export interface TableHeadActionAccount {
    action?: string;
    direction?: number;
}

export interface TableBodyActionsAccount {
    id?: number;
    type?: string;
    data?: AccountTableData;
}

export interface TableToolBarActionActionsAccount {
    mode?: string;
    action?: string;
    tabData?: AccountColumn;
}

export class AccountTableData {
    id: number;
    name: string;
    isSelected: boolean;
    url: string;
    username: string;
    password: string;
    note: string;
    lable?: accountLableData;
    accountPassword?: accountPassword;
    tableDropdownContent?: tableDropdownContent;
}

export interface ToolBarActionAccount {
    action?: string;
    mode?: string;
}

export interface accountLableData {
    name: string;
    color: string;
}

export interface accountPassword {
    apiCallStarted?: boolean;
    hidemCharacters?: string;
    hiden?: boolean;
    password?: string;
}

export interface AccountColumn {
    name: string;
    title: string;
    resizable: boolean;
    hidden: boolean;
    disabled: boolean;
    field: string;
    width: any;
    minWidth: any;
    orderIndex: number;
    sortable: boolean;
    alignCenter: boolean;
    number: boolean;
    disableExport: boolean;
    filterable: boolean;
}
