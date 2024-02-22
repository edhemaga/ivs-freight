import {
    AddressEntity,
    CompanyAccountLabelResponse,
    CompanyContactLabelResponse,
    ContactColorResponse,
    ContactEmailResponse,
    ContactPhoneResponse,
    UpdateContactEmailCommand,
    UpdateContactPhoneCommand,
} from 'appcoretruckassist';
import { tableDropdownContent } from '../components/shared/model/card-table-data.model';

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

export class ContactsTableData {
    id?: number;
    note?: string | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: AddressEntity;
    shared?: boolean;
    avatar?: string | null;
    companyContactLabel?: CompanyContactLabelResponse;
    colorRes?: ContactColorResponse;
    colorLabels?: Array<CompanyContactLabelResponse> | null;
    contactPhones?: Array<ContactPhoneResponse> | null;
    contactEmails?: Array<ContactEmailResponse> | null;
    createdAt?: string;
    updatedAt?: string;
    actionAnimation?: string;
}

export interface ManageContact {
    contactType?: string;
    name: string;
    labelId?: number;
    doc: ManageContactDoc;
}

export interface TableHeadActionContract {
    action?: string;
    direction?: number;
}

export interface TableBodyActionsContract {
    id?: number;
    type?: string;
    data?: ContractTableData;
}

export interface TableToolBarActionActionsContract {
    mode?: string;
    action?: string;
    tabData?: ContactColumn;
}

export class ContractTableData {
    id: number;
    name: string;
    isSelected: boolean;
    note: string;
    lable?: contractLableData;
    textAddress?: string;
    textShared?: string;
    textShortName?: string;
    updatedAt?: string;
    shared?: boolean;
    phone?: string;
    isShared: boolean;
    email: string;
    createdAt?: string;
    avatar?: string;
    avatarImg?: string;
    avatarColor?: { background?: string; color: string };
    address?: AddressEntity;
    contactPhones?: Array<UpdateContactPhoneCommand> | null;
    contactEmails?: Array<UpdateContactEmailCommand> | null;
    tableDropdownContent?: tableDropdownContent;
    companyContactLabelId?: CompanyAccountLabelResponse | null;
    colorLabels?: Array<CompanyAccountLabelResponse>;
    colorRes?: ContactColorResponse;
}

export interface ToolBarActionContract {
    action?: string;
    mode?: string;
}

export interface contractLableData {
    name: string;
    color: string;
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
