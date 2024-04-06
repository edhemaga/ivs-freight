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
import { tableDropdownContent } from '../../shared/models/card-table-data.model';

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

export interface contractLableData {
    name: string;
    color: string;
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
