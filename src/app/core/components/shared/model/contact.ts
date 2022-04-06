export class Contacts {
  status: string;
  data: ContactsData[];
}

export class ContactsData {
  id: number;
  clientType: string;
  clientTypeCode: number;
  name: string;
  phone: number;
  email: string;
  address: string;
  note: string;
  labelId: number;
  labelName: string;
  labelColor: string;
  checked: boolean;
  doc: ManageContactDoc;
  // tslint:disable-next-line:variable-name
  address_unit: string;
}

export interface ManageContact {
  contactType?: string;
  name: string;
  labelId?: number;
  doc: ManageContactDoc;
}

export interface ManageContactDoc {
  phone: number | string;
  email: string;
  address: string;
  address_unit?: string;
  note: string;
  labelId?: number;
}

export interface ContactColumn {
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
