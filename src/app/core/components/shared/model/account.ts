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
